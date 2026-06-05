"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined"
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined"
import PercentRoundedIcon from "@mui/icons-material/PercentRounded"
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded"
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined"
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded"
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded"
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material"
import dayjs from "dayjs"
import Link from "next/link"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import { GRAD, MONO, SHELL } from "@/components/dashboard/shell/tokens"
import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi"
import { useGetMetaQuery } from "@/redux/api/metaApi"
import { useGetMYProfileQuery } from "@/redux/api/myProfileApi"

// ── helpers ─────────────────────────────────────────────────────
const greetingFor = (hour: number) => {
	if (hour < 12) return "Good morning"
	if (hour < 17) return "Good afternoon"
	return "Good evening"
}

const initials = (name?: string) => {
	if (!name) return "?"
	const parts = name.trim().split(/\s+/)
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const isUpcomingStatus = (s?: string) => {
	const v = (s || "").toUpperCase()
	return v === "SCHEDULED" || v === "INPROGRESS"
}

// Lightweight relative-time label (no dayjs relativeTime plugin loaded).
const relativeLabel = (start: string): string => {
	const diffMin = dayjs(start).diff(dayjs(), "minute")
	if (diffMin <= 0) return "now"
	if (diffMin < 60) return `in ${diffMin} min`
	const hrs = Math.round(diffMin / 60)
	return `in ${hrs} hr${hrs === 1 ? "" : "s"}`
}

// Patient sub-line: assemble whatever health data is present, honestly.
const patientMeta = (patient: any): string => {
	const hd = patient || {}
	const bits: string[] = []
	const gender = hd.gender ? String(hd.gender).toLowerCase() : null
	if (gender) bits.push(gender.charAt(0).toUpperCase() + gender.slice(1))
	if (hd.age != null) bits.push(`${hd.age}y`)
	if (hd.bloodGroup) bits.push(String(hd.bloodGroup).replace("_", " "))
	return bits.join(" · ")
}

const REVIEW_DEMO = [
	{
		rating: 5,
		text: "Patient, careful, and explained every term. Walked me through the meds clearly. Will book again.",
		name: "Farzana R.",
		date: "22 May 2026",
		variant: "teal" as const,
	},
	{
		rating: 4,
		text: "Connection dropped once, but the doctor called back immediately. Diagnosis felt thorough and the prescription arrived in minutes.",
		name: "Shahriar I.",
		date: "18 May 2026",
		variant: "blue" as const,
	},
	{
		rating: 5,
		text: "Felt seen and heard. Followed up next day to check on me — really kind. Highly recommend.",
		name: "Nadia A.",
		date: "14 May 2026",
		variant: "purple" as const,
	},
]

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

const DoctorOverview = () => {
	const { data: profile, isLoading: profileLoading } = useGetMYProfileQuery(undefined)
	const { data: meta, isLoading: metaLoading } = useGetMetaQuery(undefined)
	const { data: apptData, isLoading: apptLoading } = useGetMyAppointmentsQuery({
		page: 1,
		limit: 50,
	})

	const appointments: any[] = apptData?.appointments ?? []

	// Today's appointments
	const todayAppts = appointments
		.filter((a) => a?.schedule?.startDateTime && dayjs(a.schedule.startDateTime).isSame(dayjs(), "day"))
		.sort((a, b) => dayjs(a.schedule.startDateTime).valueOf() - dayjs(b.schedule.startDateTime).valueOf())

	const todayCount = todayAppts.length
	const doneCount = todayAppts.filter((a) => (a.status || "").toUpperCase() === "COMPLETED").length
	const toGoCount = todayCount - doneCount

	// Up next: earliest upcoming (scheduled / in progress) today
	const upcomingToday = todayAppts.filter((a) => isUpcomingStatus(a.status))
	const upNext = upcomingToday[0]
	const laterToday = upcomingToday.slice(1)

	// Stats from meta — earnings come pre-split from the API (the commission
	// rate lives in the backend config, single source of truth).
	const revenue = meta?.revenue?._sum?.amount ?? 0
	const earnings = meta?.earnings ?? {}
	const grossFees = earnings.gross ?? revenue
	const commission = earnings.commission ?? 0
	const netBalance = earnings.net ?? grossFees - commission
	const commissionPct =
		earnings.commissionRate != null
			? Math.round(earnings.commissionRate * 100)
			: null
	const reviewCount = meta?.reviewCount ?? 0
	const completedCount = meta?.completedAppointmentCount ?? 0
	const uniquePatientCount = meta?.patientCount ?? 0
	const avgRating: number = profile?.averageRating ?? 0
	const ratingDisplay = avgRating > 0 ? avgRating.toFixed(1) : "—"

	// Distribution chart
	const distribution: { status: string; count: number }[] =
		meta?.formattedAppointmentDistribution ?? []
	const maxCount = distribution.reduce((m, d) => Math.max(m, Number(d.count) || 0), 0)

	const firstName = (profile?.name || "").trim().split(/\s+/)[0] || "Doctor"
	const greeting = greetingFor(dayjs().hour())

	const headLoading = profileLoading || apptLoading

	return (
		<>
			<PageHead
				title={profileLoading ? "Loading…" : `${greeting}, Dr. ${firstName}.`}
				subtitle={
					headLoading
						? "Loading your day…"
						: `${todayCount} ${todayCount === 1 ? "consultation" : "consultations"} on your plate today.`
				}
				actions={
					<>
						<Button
							component={Link}
							href="/dashboard/doctor/schedules"
							variant="outlined"
							startIcon={<ScheduleRoundedIcon sx={{ fontSize: 18 }} />}
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
							Set availability
						</Button>
						<Button
							component={Link}
							href="/dashboard/doctor/appointments"
							variant="contained"
							disableElevation
							sx={{
								borderRadius: "12px",
								textTransform: "none",
								fontWeight: 600,
								px: 2,
							}}
						>
							View today&apos;s queue →
						</Button>
					</>
				}
			/>

			{/* ── Stat cards ─────────────────────────────────────── */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						sm: "1fr 1fr",
						lg: "repeat(4, 1fr)",
					},
					gap: 2,
					mb: 3,
				}}
			>
				<Stat
					label="Today"
					value={headLoading ? "…" : todayCount}
					icon={<CalendarMonthRoundedIcon sx={{ fontSize: 16 }} />}
					delta={headLoading ? undefined : `${doneCount} done`}
					deltaTrend="neutral"
					deltaLabel={headLoading ? undefined : `${toGoCount} to go`}
				/>
				<Stat
					label="Gross fees"
					value={metaLoading ? "…" : <>৳ {Number(grossFees).toLocaleString()}</>}
					icon={<PaymentsOutlinedIcon sx={{ fontSize: 16 }} />}
					deltaLabel="total paid appointments"
					deltaTrend="neutral"
				/>
				<Stat
					label={
						commissionPct != null
							? `Commission · ${commissionPct}%`
							: "Commission"
					}
					value={metaLoading ? "…" : <>− ৳ {Number(commission).toLocaleString()}</>}
					icon={<PercentRoundedIcon sx={{ fontSize: 16 }} />}
					deltaLabel="deducted by platform"
					deltaTrend="neutral"
				/>
				<Stat
					label="Net balance"
					value={metaLoading ? "…" : <>৳ {Number(netBalance).toLocaleString()}</>}
					icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 16 }} />}
					deltaLabel="your earnings after commission"
					deltaTrend="neutral"
				/>
				<Stat
					label="Completed appointments"
					value={metaLoading ? "…" : completedCount}
					icon={<TaskAltRoundedIcon sx={{ fontSize: 16 }} />}
					deltaLabel="all-time"
					deltaTrend="neutral"
				/>
				<Stat
					label="Total patients"
					value={metaLoading ? "…" : uniquePatientCount}
					icon={<GroupOutlinedIcon sx={{ fontSize: 16 }} />}
					deltaLabel="unique patients seen"
					deltaTrend="neutral"
				/>
				<Stat
					label="Total reviews"
					value={metaLoading ? "…" : reviewCount}
					icon={<RateReviewOutlinedIcon sx={{ fontSize: 16 }} />}
					deltaLabel="all-time"
					deltaTrend="neutral"
				/>
				<Stat
					label="Avg. rating"
					value={profileLoading ? "…" : ratingDisplay}
					icon={<StarRoundedIcon sx={{ fontSize: 16 }} />}
					iconBg="rgba(242, 181, 68, 0.18)"
					iconColor={SHELL.star}
					deltaLabel={reviewCount ? `across ${reviewCount} reviews` : "no reviews yet"}
					deltaTrend="neutral"
				/>
			</Box>

			{/* ── Chart + Up next ────────────────────────────────── */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" },
					gap: 2,
				}}
			>
				{/* Appointments by status */}
				<Box sx={{ ...CARD_SX, p: 3 }}>
					<CardHead title="Appointments by status" />
					{metaLoading ? (
						<Skeleton variant="rounded" height={180} />
					) : distribution.length === 0 ? (
						<Box
							sx={{
								height: 180,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								gap: 1,
								color: "text.secondary",
							}}
						>
							<CalendarMonthRoundedIcon sx={{ fontSize: 32, opacity: 0.5 }} />
							<Typography sx={{ fontSize: 13 }}>No appointment data yet.</Typography>
						</Box>
					) : (
						<>
							<Box
								sx={{
									display: "flex",
									alignItems: "flex-end",
									gap: 1,
									height: 180,
									px: 0.5,
								}}
							>
								{distribution.map((d, i) => {
									const count = Number(d.count) || 0
									const pct = maxCount > 0 ? Math.max((count / maxCount) * 100, 4) : 4
									const lead = count === maxCount && count > 0
									return (
										<Box
											key={`${d.status}-${i}`}
											sx={{
												flex: 1,
												height: `${pct}%`,
												minHeight: 6,
												borderRadius: "6px 6px 0 0",
												bgcolor: lead ? "primary.main" : "#E6F2F1",
												position: "relative",
												transition: "background 140ms",
												"&:hover": { bgcolor: "primary.main" },
											}}
										>
											<Box
												sx={{
													position: "absolute",
													top: -22,
													left: "50%",
													transform: "translateX(-50%)",
													fontSize: 11,
													fontWeight: 600,
													color: "text.primary",
													fontVariantNumeric: "tabular-nums",
												}}
											>
												{count}
											</Box>
										</Box>
									)
								})}
							</Box>
							<Box sx={{ display: "flex", gap: 1, mt: 1.25 }}>
								{distribution.map((d, i) => (
									<Box
										key={`lbl-${d.status}-${i}`}
										sx={{
											flex: 1,
											textAlign: "center",
											fontSize: 10,
											fontFamily: MONO,
											color: "text.secondary",
											letterSpacing: "0.02em",
											textTransform: "uppercase",
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{d.status}
									</Box>
								))}
							</Box>
						</>
					)}
				</Box>

				{/* Up next */}
				<Box sx={{ ...CARD_SX, p: 0, overflow: "hidden" }}>
					<Box sx={{ p: 3, pb: 0 }}>
						<CardHead
							title="Up next"
							more={<MoreLink href="/dashboard/doctor/appointments" label="Full queue →" />}
						/>
					</Box>

					{apptLoading ? (
						<Box sx={{ px: 3, pb: 3 }}>
							<Skeleton variant="rounded" height={150} sx={{ borderRadius: "18px" }} />
						</Box>
					) : !upNext ? (
						<Box
							sx={{
								mx: 3,
								mb: 3,
								p: 4,
								borderRadius: "18px",
								bgcolor: SHELL.bgSoft,
								border: "1px dashed",
								borderColor: "divider",
								textAlign: "center",
							}}
						>
							<CalendarMonthRoundedIcon sx={{ fontSize: 30, color: "text.secondary", opacity: 0.6 }} />
							<Typography sx={{ fontSize: 14, fontWeight: 600, mt: 1, color: "text.primary" }}>
								Nothing on the calendar today
							</Typography>
							<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
								Set your availability so patients can book a slot.
							</Typography>
							<Button
								component={Link}
								href="/dashboard/doctor/schedules"
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
								Set availability
							</Button>
						</Box>
					) : (
						<>
							{/* Teal hero block */}
							<Box
								sx={{
									background: GRAD.teal,
									color: "#fff",
									p: 3,
									mx: 3,
									mb: 1.5,
									borderRadius: "18px",
								}}
							>
								<Typography
									sx={{
										fontFamily: MONO,
										fontSize: 11,
										letterSpacing: "0.1em",
										color: "rgba(255,255,255,0.7)",
										textTransform: "uppercase",
									}}
								>
									Today ·{" "}
									{dayjs(upNext.schedule.startDateTime).format("HH:mm")} —{" "}
									{dayjs(upNext.schedule.endDateTime).format("HH:mm")} ·{" "}
									{relativeLabel(upNext.schedule.startDateTime)}
								</Typography>
								<Stack direction="row" sx={{ gap: 1.75, alignItems: "center", mt: 1.75 }}>
									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: "50%",
											bgcolor: "rgba(255,255,255,0.18)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontWeight: 600,
											fontSize: 16,
											flexShrink: 0,
										}}
									>
										{initials(upNext.patient?.name)}
									</Box>
									<Box sx={{ minWidth: 0 }}>
										<Typography
											sx={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}
										>
											{upNext.patient?.name || "Patient"}
										</Typography>
										{patientMeta(upNext.patient) && (
											<Typography
												sx={{ fontSize: 12, color: "rgba(255,255,255,0.75)", mt: 0.25 }}
											>
												{patientMeta(upNext.patient)}
											</Typography>
										)}
									</Box>
								</Stack>
								<Button
									component={Link}
									href="/dashboard/doctor/appointments"
									fullWidth
									startIcon={<VideocamRoundedIcon sx={{ fontSize: 18 }} />}
									sx={{
										mt: 2.25,
										borderRadius: "12px",
										textTransform: "none",
										fontWeight: 600,
										bgcolor: "#fff",
										color: "text.primary",
										justifyContent: "center",
										"&:hover": { bgcolor: SHELL.bgSoft },
									}}
								>
									Start consultation
								</Button>
							</Box>

							{/* Later today */}
							<Box sx={{ px: 3, pt: 0.5, pb: 3 }}>
								<Typography
									sx={{
										fontFamily: MONO,
										fontSize: 11,
										color: "text.secondary",
										letterSpacing: "0.06em",
										textTransform: "uppercase",
										mb: 1.5,
									}}
								>
									Later today
								</Typography>
								{laterToday.length === 0 ? (
									<Typography sx={{ fontSize: 13, color: "text.secondary" }}>
										No more appointments after this one.
									</Typography>
								) : (
									<Stack sx={{ gap: 0 }}>
										{laterToday.map((a, idx) => {
											const paid = (a.paymentStatus || "").toUpperCase() === "PAID"
											return (
												<Stack
													key={a.id}
													direction="row"
													sx={{
														alignItems: "center",
														gap: 1.5,
														py: 1.25,
														px: 0.5,
														borderTop: idx === 0 ? "none" : "1px solid",
														borderColor: SHELL.dividerSoft,
													}}
												>
													<Box
														sx={{
															fontFamily: MONO,
															fontSize: 12,
															fontWeight: 600,
															color: "text.secondary",
															width: 56,
															flexShrink: 0,
														}}
													>
														{dayjs(a.schedule.startDateTime).format("HH:mm")}
													</Box>
													<Box sx={{ flex: 1, minWidth: 0 }}>
														<Typography
															sx={{
																fontSize: 13,
																fontWeight: 600,
																color: "text.primary",
																overflow: "hidden",
																textOverflow: "ellipsis",
																whiteSpace: "nowrap",
															}}
														>
															{a.patient?.name || "Patient"}
														</Typography>
														{patientMeta(a.patient) && (
															<Typography sx={{ fontSize: 11, color: "text.secondary" }}>
																{patientMeta(a.patient)}
															</Typography>
														)}
													</Box>
													<StatusBadge kind={paid ? "paid" : "unpaid"} />
												</Stack>
											)
										})}
									</Stack>
								)}
							</Box>
						</>
					)}
				</Box>
			</Box>

			{/* ── Recent reviews (Demo) ──────────────────────────── */}
			<Box sx={{ ...CARD_SX, p: 3, mt: 3 }}>
				<CardHead
					title="Recent reviews"
					more={
						<Box
							component="span"
							sx={{
								fontFamily: MONO,
								fontSize: 10,
								fontWeight: 600,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								color: "text.secondary",
								bgcolor: SHELL.bgSoft,
								px: 1,
								py: 0.5,
								borderRadius: 999,
							}}
						>
							Demo
						</Box>
					}
				/>
				<Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
					Illustrative — not live. Review reading is not yet available from the backend.
				</Typography>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
						gap: 2,
					}}
				>
					{REVIEW_DEMO.map((r, i) => (
						<Box key={i} sx={{ p: 2.5, bgcolor: SHELL.bgSoft, borderRadius: "16px" }}>
							<Stack direction="row" sx={{ alignItems: "center", gap: 0.25, mb: 1.25 }}>
								{Array.from({ length: 5 }).map((_, s) => (
									<StarRoundedIcon
										key={s}
										sx={{
											fontSize: 16,
											color: s < r.rating ? SHELL.star : "divider",
										}}
									/>
								))}
								<Typography sx={{ ml: 0.5, fontSize: 13, color: "text.primary" }}>
									{r.rating.toFixed(1)}
								</Typography>
							</Stack>
							<Typography sx={{ fontSize: 14, color: "text.primary", lineHeight: 1.5 }}>
								&ldquo;{r.text}&rdquo;
							</Typography>
							<Stack direction="row" sx={{ alignItems: "center", gap: 1, mt: 1.75 }}>
								<AvatarGradient initials={initials(r.name)} variant={r.variant} size={28} />
								<Box>
									<Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.primary" }}>
										{r.name}
									</Typography>
									<Typography sx={{ fontSize: 10, color: "text.secondary" }}>
										{r.date}
									</Typography>
								</Box>
							</Stack>
						</Box>
					))}
				</Box>
			</Box>
		</>
	)
}

export default DoctorOverview
