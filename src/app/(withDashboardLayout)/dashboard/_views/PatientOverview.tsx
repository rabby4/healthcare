"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded"
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined"
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded"
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded"
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material"
import dayjs from "dayjs"
import Link from "next/link"
import { toast } from "sonner"

import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi"
import { useGetMetaQuery } from "@/redux/api/metaApi"
import { useGetMYProfileQuery } from "@/redux/api/myProfileApi"
import { useInitialPaymentMutation } from "@/redux/api/paymentApi"
import { useGetMyPrescriptionsQuery } from "@/redux/api/prescriptionApi"

// ── helpers ─────────────────────────────────────────────────────
const greetingFor = (hour: number) => {
	if (hour < 12) return "Good morning"
	if (hour < 17) return "Good afternoon"
	return "Good evening"
}

const isUpcomingStatus = (s?: string) => {
	const v = (s || "").toUpperCase()
	return v === "SCHEDULED" || v === "INPROGRESS"
}

const isUnpaid = (s?: string) => (s || "").toUpperCase() === "UNPAID"

const taka = (n: number) => `৳${Number(n || 0).toLocaleString()}`

// Lightweight relative-time label (no dayjs relativeTime plugin loaded).
const relativeLabel = (start: string): string => {
	const diffMin = dayjs(start).diff(dayjs(), "minute")
	if (diffMin <= 0) return "now"
	if (diffMin < 60) return `in ${diffMin} min`
	const hrs = Math.floor(diffMin / 60)
	const mins = diffMin % 60
	if (hrs < 24) return mins ? `in ${hrs}h ${mins}m` : `in ${hrs}h`
	const days = Math.round(hrs / 24)
	return `in ${days} day${days === 1 ? "" : "s"}`
}

const doctorSpecialty = (doctor: any): string => {
	const title = doctor?.doctorSpecialties?.[0]?.specialties?.title
	if (title) return title
	if (doctor?.designation) return doctor.designation
	return "General practitioner"
}

const CARD_SX = {
	bgcolor: "#fff",
	border: "1px solid",
	borderColor: "divider",
	borderRadius: "22px",
} as const

const CardHead = ({ title, more }: { title: string; more?: React.ReactNode }) => (
	<Stack
		direction="row"
		sx={{ alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 2.25 }}
	>
		<Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: "text.primary" }}>
			{title}
		</Typography>
		{more}
	</Stack>
)

const MoreLink = ({ href, label }: { href: string; label: string }) => (
	<Box
		component={Link}
		href={href}
		sx={{
			fontFamily: MONO,
			fontSize: 12,
			fontWeight: 600,
			letterSpacing: "0.04em",
			textTransform: "uppercase",
			color: "primary.main",
			textDecoration: "none",
			"&:hover": { textDecoration: "underline" },
		}}
	>
		{label}
	</Box>
)

const quickLinks = [
	{
		label: "Your appointments",
		href: "/dashboard/patient/appointments",
		icon: <CalendarMonthRoundedIcon sx={{ fontSize: 22 }} />,
		desc: "View, join calls, and track payment status.",
	},
	{
		label: "Health profile",
		href: "/dashboard/patient/profile",
		icon: <PersonOutlineRoundedIcon sx={{ fontSize: 22 }} />,
		desc: "Keep your data and reports up to date.",
	},
	{
		label: "Book a follow-up",
		href: "/doctors",
		icon: <ReplayRoundedIcon sx={{ fontSize: 22 }} />,
		desc: "Re-book with any doctor you've seen.",
	},
]

const PatientOverview = () => {
	const { data: profile, isLoading: profileLoading } = useGetMYProfileQuery(undefined)
	const { data: meta, isLoading: metaLoading } = useGetMetaQuery(undefined)
	const {
		data: apptData,
		isLoading: apptLoading,
		isError: apptError,
	} = useGetMyAppointmentsQuery({ limit: 50 })
	const {
		data: rxData,
		isLoading: rxLoading,
		isError: rxError,
	} = useGetMyPrescriptionsQuery({ limit: 4 })

	const [initialPayment, { isLoading: paying }] = useInitialPaymentMutation()

	const appointments: any[] = apptData?.appointments ?? []
	const prescriptions: any[] = rxData?.prescriptions ?? []

	// ── Derived collections ────────────────────────────────────────
	// Upcoming = SCHEDULED | INPROGRESS, sorted by start time ascending.
	const upcoming = appointments
		.filter((a) => isUpcomingStatus(a?.status) && a?.schedule?.startDateTime)
		.sort(
			(a, b) =>
				dayjs(a.schedule.startDateTime).valueOf() - dayjs(b.schedule.startDateTime).valueOf(),
		)

	const upcomingCount = upcoming.length
	const completedCount = appointments.filter(
		(a) => (a.status || "").toUpperCase() === "COMPLETED",
	).length

	// Unpaid upcoming appointments — these are what can be paid.
	const unpaidUpcoming = upcoming.filter((a) => isUnpaid(a.paymentStatus))
	const pendingPaymentCount = unpaidUpcoming.length
	const pendingPaymentSum = unpaidUpcoming.reduce(
		(sum, a) => sum + (Number(a?.doctor?.appointmentFee) || 0),
		0,
	)
	// Earliest unpaid upcoming — target of the banner "Pay now" action.
	const earliestUnpaid = unpaidUpcoming[0]

	const nextAppt = upcoming[0]
	const prescriptionCount = meta?.prescriptionCount ?? 0

	const firstName = (profile?.name || "").trim().split(/\s+/)[0] || "there"
	const greeting = greetingFor(dayjs().hour())

	// ── Pay action (shared) ────────────────────────────────────────
	const handlePay = async (appointmentId?: string) => {
		if (!appointmentId) return
		try {
			const res = await initialPayment(appointmentId).unwrap()
			const url = res?.paymentUrl
			if (url) {
				window.location.href = url
			} else {
				toast.error("Could not start payment. Please try again.")
			}
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const nextFee = Number(nextAppt?.doctor?.appointmentFee) || 0
	const nextUnpaid = nextAppt ? isUnpaid(nextAppt.paymentStatus) : false

	return (
		<>
			<PageHead
				title={profileLoading ? "Loading…" : `${greeting}, ${firstName}.`}
				subtitle="Here's what's on your plate today."
				actions={
					<>
						<Button
							component={Link}
							href="/doctors"
							variant="outlined"
							startIcon={<SearchRoundedIcon sx={{ fontSize: 18 }} />}
							sx={{
								borderRadius: "12px",
								textTransform: "none",
								fontWeight: 600,
								borderColor: "divider",
								color: "text.primary",
								px: 2,
								"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
							}}
						>
							Find a doctor
						</Button>
						<Button
							component={Link}
							href="/doctors"
							variant="contained"
							disableElevation
							sx={{
								borderRadius: "12px",
								textTransform: "none",
								fontWeight: 600,
								px: 2,
							}}
						>
							Book new appointment →
						</Button>
					</>
				}
			/>

			{/* ── Urgent: unpaid upcoming banner ───────────────────── */}
			{!apptLoading && pendingPaymentCount > 0 && (
				<Stack
					direction={{ xs: "column", sm: "row" }}
					sx={{
						alignItems: { xs: "flex-start", sm: "center" },
						gap: 2,
						mb: 3,
						p: 2.25,
						borderRadius: "16px",
						bgcolor: SHELL.warningBg,
						border: "1px solid",
						borderColor: "rgba(181, 129, 28, 0.3)",
					}}
				>
					<Box
						sx={{
							width: 36,
							height: 36,
							borderRadius: "10px",
							bgcolor: "rgba(181, 129, 28, 0.18)",
							color: SHELL.warning,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<ErrorOutlineRoundedIcon sx={{ fontSize: 20 }} />
					</Box>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
							{pendingPaymentCount}{" "}
							{pendingPaymentCount === 1 ? "appointment" : "appointments"} awaiting payment.
						</Typography>
						{earliestUnpaid && (
							<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}>
								Pay {taka(Number(earliestUnpaid?.doctor?.appointmentFee) || 0)} to confirm
								your slot with Dr. {earliestUnpaid?.doctor?.name} (
								{dayjs(earliestUnpaid.schedule.startDateTime).format("D MMM, HH:mm")}).
							</Typography>
						)}
					</Box>
					<Stack direction="row" sx={{ gap: 1, flexShrink: 0 }}>
						<Button
							component={Link}
							href="/dashboard/patient/appointments"
							variant="text"
							sx={{
								borderRadius: "10px",
								textTransform: "none",
								fontWeight: 600,
								color: "text.primary",
							}}
						>
							View
						</Button>
						<Button
							onClick={() => handlePay(earliestUnpaid?.id)}
							disabled={paying}
							variant="contained"
							disableElevation
							sx={{
								borderRadius: "10px",
								textTransform: "none",
								fontWeight: 600,
								bgcolor: SHELL.warning,
								"&:hover": { bgcolor: "#9a6e16" },
							}}
						>
							{paying ? "Redirecting…" : "Pay now"}
						</Button>
					</Stack>
				</Stack>
			)}

			{/* ── Stat cards ─────────────────────────────────────── */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" },
					gap: 2,
					mb: 3,
				}}
			>
				<Stat
					label="Upcoming"
					value={apptLoading ? "…" : upcomingCount}
					icon={<CalendarMonthRoundedIcon sx={{ fontSize: 16 }} />}
					deltaLabel={
						apptLoading
							? undefined
							: nextAppt
								? `next ${relativeLabel(nextAppt.schedule.startDateTime)}`
								: "nothing scheduled"
					}
					deltaTrend="neutral"
				/>
				<Stat
					label="Completed visits"
					value={apptLoading ? "…" : completedCount}
					icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />}
					deltaLabel="all-time"
					deltaTrend="neutral"
				/>
				<Stat
					label="Pending payment"
					value={apptLoading ? "…" : pendingPaymentCount}
					icon={<PaymentsOutlinedIcon sx={{ fontSize: 16 }} />}
					iconBg={pendingPaymentCount > 0 ? SHELL.warningBg : undefined}
					iconColor={pendingPaymentCount > 0 ? SHELL.warning : undefined}
					delta={
						apptLoading || pendingPaymentCount === 0
							? undefined
							: taka(pendingPaymentSum)
					}
					deltaTrend={pendingPaymentCount > 0 ? "down" : "neutral"}
					deltaLabel={
						apptLoading
							? undefined
							: pendingPaymentCount > 0
								? "due"
								: "all paid up"
					}
				/>
				<Stat
					label="Prescriptions"
					value={metaLoading ? "…" : prescriptionCount}
					icon={<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />}
					deltaLabel="issued to you"
					deltaTrend="neutral"
				/>
			</Box>

			{/* ── Two-column: next appointment + prescriptions ────── */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" },
					gap: 2,
				}}
			>
				{/* Next appointment */}
				<Box sx={{ ...CARD_SX, p: 0, overflow: "hidden" }}>
					<Box sx={{ p: 3, pb: 0 }}>
						<CardHead
							title="Next appointment"
							more={
								<MoreLink
									href="/dashboard/patient/appointments"
									label="All appointments →"
								/>
							}
						/>
					</Box>

					{apptLoading ? (
						<Box sx={{ px: 3, pb: 3 }}>
							<Skeleton variant="rounded" height={210} sx={{ borderRadius: "18px" }} />
						</Box>
					) : apptError ? (
						<Box sx={{ px: 3, pb: 3 }}>
							<Box
								sx={{
									p: 4,
									borderRadius: "18px",
									bgcolor: SHELL.dangerBg,
									border: "1px solid",
									borderColor: "rgba(217, 98, 74, 0.25)",
									textAlign: "center",
								}}
							>
								<ErrorOutlineRoundedIcon sx={{ fontSize: 28, color: SHELL.urgent }} />
								<Typography sx={{ fontSize: 14, fontWeight: 600, mt: 1, color: "text.primary" }}>
									Couldn&apos;t load your appointments
								</Typography>
								<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
									Please refresh the page to try again.
								</Typography>
							</Box>
						</Box>
					) : !nextAppt ? (
						<Box sx={{ px: 3, pb: 3 }}>
							<Box
								sx={{
									p: 4,
									borderRadius: "18px",
									bgcolor: SHELL.bgSoft,
									border: "1px dashed",
									borderColor: "divider",
									textAlign: "center",
								}}
							>
								<CalendarMonthRoundedIcon
									sx={{ fontSize: 30, color: "text.secondary", opacity: 0.6 }}
								/>
								<Typography sx={{ fontSize: 14, fontWeight: 600, mt: 1, color: "text.primary" }}>
									No upcoming appointments
								</Typography>
								<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
									Find a specialist and book your first consultation.
								</Typography>
								<Button
									component={Link}
									href="/doctors"
									variant="outlined"
									size="small"
									sx={{
										mt: 2,
										borderRadius: "10px",
										textTransform: "none",
										fontWeight: 600,
										borderColor: "divider",
										color: "text.primary",
									}}
								>
									Find a doctor
								</Button>
							</Box>
						</Box>
					) : (
						<Box
							sx={{
								// Darker teal than the shared GRAD.teal so white text clears
								// AA contrast (the lighter #16A085 end was too low-contrast).
								background: "linear-gradient(135deg, #0A6968, #0E7C7B)",
								color: "#fff",
								p: 3.5,
								mx: 3,
								mb: 3,
								borderRadius: "18px",
							}}
						>
							<Stack
								direction="row"
								sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}
							>
								<Box sx={{ minWidth: 0 }}>
									<Typography
										sx={{
											fontFamily: MONO,
											fontSize: 11,
											letterSpacing: "0.1em",
											color: "rgba(255,255,255,0.85)",
											textTransform: "uppercase",
										}}
									>
										{dayjs(nextAppt.schedule.startDateTime).format("ddd D MMM")} ·{" "}
										{dayjs(nextAppt.schedule.startDateTime).format("HH:mm")} —{" "}
										{dayjs(nextAppt.schedule.endDateTime).format("HH:mm")} ·{" "}
										{relativeLabel(nextAppt.schedule.startDateTime)}
									</Typography>
									<Typography
										sx={{
											fontSize: 22,
											fontWeight: 600,
											letterSpacing: "-0.01em",
											mt: 1,
											color: "#fff",
										}}
									>
										Dr. {nextAppt.doctor?.name}
									</Typography>
									<Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.85)", mt: 0.5 }}>
										{doctorSpecialty(nextAppt.doctor)}
									</Typography>
								</Box>
								<StatusBadge
									kind={
										(nextAppt.status || "").toUpperCase() === "INPROGRESS"
											? "inprogress"
											: "scheduled"
									}
								/>
							</Stack>

							<Stack
								direction="row"
								sx={{
									gap: 4,
									mt: 3,
									pt: 2.5,
									borderTop: "1px solid rgba(255,255,255,0.12)",
								}}
							>
								<Box>
									<Typography
										sx={{
											fontSize: 11,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											color: "rgba(255,255,255,0.78)",
										}}
									>
										Fee
									</Typography>
									<Typography
										sx={{
											fontSize: 16,
											fontWeight: 600,
											mt: 0.5,
											fontVariantNumeric: "tabular-nums",
											color: "#fff",
										}}
									>
										{taka(nextFee)}
									</Typography>
								</Box>
								<Box>
									<Typography
										sx={{
											fontSize: 11,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											color: "rgba(255,255,255,0.78)",
										}}
									>
										Payment
									</Typography>
									<Box sx={{ mt: 0.75 }}>
										<StatusBadge kind={nextUnpaid ? "unpaid" : "paid"} />
									</Box>
								</Box>
							</Stack>

							<Stack direction="row" sx={{ gap: 1.25, mt: 3 }}>
								{nextUnpaid ? (
									<Button
										onClick={() => handlePay(nextAppt.id)}
										disabled={paying}
										startIcon={<PaymentsOutlinedIcon sx={{ fontSize: 18 }} />}
										sx={{
											borderRadius: "12px",
											textTransform: "none",
											fontWeight: 600,
											bgcolor: "#fff",
											color: "text.primary",
											px: 2.5,
											"&:hover": { bgcolor: SHELL.bgSoft },
										}}
									>
										{paying ? "Redirecting…" : `Pay ${taka(nextFee)}`}
									</Button>
								) : (
									<Button
										component={Link}
										href={`/video?videoCallingId=${nextAppt.videoCallingId}`}
										startIcon={<VideocamRoundedIcon sx={{ fontSize: 18 }} />}
										sx={{
											borderRadius: "12px",
											textTransform: "none",
											fontWeight: 600,
											bgcolor: "#fff",
											color: "text.primary",
											px: 2.5,
											"&:hover": { bgcolor: SHELL.bgSoft },
										}}
									>
										Join call
									</Button>
								)}
								<Button
									component={Link}
									href="/dashboard/patient/appointments"
									sx={{
										borderRadius: "12px",
										textTransform: "none",
										fontWeight: 600,
										color: "#fff",
										border: "1px solid rgba(255,255,255,0.25)",
										px: 2.5,
										"&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
									}}
								>
									Details
								</Button>
							</Stack>
						</Box>
					)}
				</Box>

				{/* Recent prescriptions */}
				<Box sx={{ ...CARD_SX, p: 3 }}>
					<CardHead
						title="Recent prescriptions"
						more={<MoreLink href="/dashboard/patient/appointments" label="All →" />}
					/>

					{rxLoading ? (
						<Stack sx={{ gap: 1.5 }}>
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: "12px" }} />
							))}
						</Stack>
					) : rxError ? (
						<Box
							sx={{
								p: 3,
								borderRadius: "14px",
								bgcolor: SHELL.dangerBg,
								border: "1px solid",
								borderColor: "rgba(217, 98, 74, 0.25)",
								textAlign: "center",
							}}
						>
							<Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
								Couldn&apos;t load prescriptions
							</Typography>
							<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
								Please refresh to try again.
							</Typography>
						</Box>
					) : prescriptions.length === 0 ? (
						<Box
							sx={{
								p: 4,
								borderRadius: "14px",
								bgcolor: SHELL.bgSoft,
								border: "1px dashed",
								borderColor: "divider",
								textAlign: "center",
							}}
						>
							<DescriptionOutlinedIcon
								sx={{ fontSize: 28, color: "text.secondary", opacity: 0.6 }}
							/>
							<Typography sx={{ fontSize: 13, fontWeight: 600, mt: 1, color: "text.primary" }}>
								No prescriptions yet
							</Typography>
							<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
								They&apos;ll appear here after a completed consultation.
							</Typography>
						</Box>
					) : (
						<Stack sx={{ gap: 1.5 }}>
							{prescriptions.slice(0, 4).map((rx) => {
								const date = rx?.createdAt || rx?.followUpDate
								return (
									<Box
										key={rx.id}
										component={Link}
										href="/dashboard/patient/appointments"
										sx={{
											display: "block",
											p: 1.75,
											borderRadius: "12px",
											border: "1px solid",
											borderColor: "divider",
											textDecoration: "none",
											transition: "border-color 140ms",
											"&:hover": { borderColor: "primary.main" },
										}}
									>
										<Stack
											direction="row"
											sx={{ justifyContent: "space-between", alignItems: "baseline", gap: 1 }}
										>
											<Typography
												sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}
											>
												Dr. {rx?.doctor?.name || "Doctor"}
											</Typography>
											{date && (
												<Typography
													sx={{
														fontFamily: MONO,
														fontSize: 10,
														color: "text.secondary",
														letterSpacing: "0.04em",
														textTransform: "uppercase",
														flexShrink: 0,
													}}
												>
													{dayjs(date).format("DD MMM YYYY")}
												</Typography>
											)}
										</Stack>
										<Typography
											sx={{
												fontSize: 12,
												color: "text.secondary",
												mt: 0.5,
												overflow: "hidden",
												textOverflow: "ellipsis",
												display: "-webkit-box",
												WebkitLineClamp: 2,
												WebkitBoxOrient: "vertical",
											}}
										>
											{rx?.instructions || "No instructions provided."}
										</Typography>
										{rx?.followUpDate && (
											<Stack
												direction="row"
												sx={{ alignItems: "center", gap: 0.5, mt: 0.75 }}
											>
												<AccessTimeRoundedIcon
													sx={{ fontSize: 13, color: "text.secondary" }}
												/>
												<Typography sx={{ fontSize: 11, color: "text.secondary" }}>
													Follow-up {dayjs(rx.followUpDate).format("DD MMM YYYY")}
												</Typography>
											</Stack>
										)}
									</Box>
								)
							})}
						</Stack>
					)}
				</Box>
			</Box>

			{/* ── Quick links ────────────────────────────────────── */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
					gap: 2,
					mt: 3,
				}}
			>
				{quickLinks.map((l) => (
					<Stack
						key={l.href}
						component={Link}
						href={l.href}
						direction="row"
						sx={{
							gap: 1.75,
							alignItems: "flex-start",
							p: 3,
							...CARD_SX,
							textDecoration: "none",
							transition: "all 140ms",
							"&:hover": {
								borderColor: "primary.main",
								boxShadow: "0 12px 24px -14px rgba(14,124,123,0.2)",
							},
						}}
					>
						<Box
							sx={{
								width: 40,
								height: 40,
								borderRadius: "12px",
								bgcolor: "#E6F2F1",
								color: "primary.main",
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
							}}
						>
							{l.icon}
						</Box>
						<Box sx={{ minWidth: 0 }}>
							<Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>
								{l.label}
							</Typography>
							<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5, lineHeight: 1.5 }}>
								{l.desc}
							</Typography>
						</Box>
					</Stack>
				))}
			</Box>
		</>
	)
}

export default PatientOverview
