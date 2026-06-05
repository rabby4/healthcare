/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo, useState } from "react"
import {
	Box,
	Button,
	InputBase,
	Menu,
	MenuItem,
	Pagination,
	Skeleton,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material"
import SearchRoundedIcon from "@mui/icons-material/Search"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDown"
import VideocamRoundedIcon from "@mui/icons-material/Videocam"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import StarRoundedIcon from "@mui/icons-material/Star"
import EventBusyRoundedIcon from "@mui/icons-material/EventBusy"
import AddRoundedIcon from "@mui/icons-material/Add"
import dayjs from "dayjs"
import Link from "next/link"
import { toast } from "sonner"

import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi"
import { useGetMyPrescriptionsQuery } from "@/redux/api/prescriptionApi"
import { useInitialPaymentMutation } from "@/redux/api/paymentApi"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import { MONO, SHELL, GRAD, AvatarVariant } from "@/components/dashboard/shell/tokens"
import { getTimeIn12HourFormat } from "../../doctor/schedules/components/MultipleSelectFieldChip"
import { formatDate } from "@/utils/formatDate"
import ReviewModal from "./components/ReviewModal"
import ViewRxDialog from "./components/ViewRxDialog"

// ---------- constants / helpers ----------

const STATUS_KIND: Record<string, "scheduled" | "inprogress" | "completed" | "cancelled"> = {
	SCHEDULED: "scheduled",
	INPROGRESS: "inprogress",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
}

const STATUS_LABEL: Record<string, string> = {
	SCHEDULED: "Scheduled",
	INPROGRESS: "In progress",
	COMPLETED: "Completed",
	CANCELLED: "Cancelled",
}

type StatusTab = "upcoming" | "past" | "cancelled"

const UPCOMING_STATUSES = ["SCHEDULED", "INPROGRESS"]

const initials = (name?: string) =>
	(name || "?")
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase() || "")
		.join("") || "?"

const AVATAR_VARIANTS: AvatarVariant[] = Object.keys(GRAD) as AvatarVariant[]
const variantFor = (key?: string): AvatarVariant => {
	const s = key || ""
	let h = 0
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
	return AVATAR_VARIANTS[h % AVATAR_VARIANTS.length]
}

// Patient appointment rows include `doctor: true` (flat) + `schedule: true`.
// Specialty is NOT included on patient rows, so we fall back to designation.
const doctorSpecialty = (doctor: any): string => {
	const fromSpecialties = doctor?.doctorSpecialties
		?.map((ds: any) => ds?.specialties?.title)
		.filter(Boolean)
		.join(", ")
	return fromSpecialties || doctor?.designation || "Doctor"
}

const relativeWhen = (start: dayjs.Dayjs): string => {
	if (!start.isValid()) return ""
	const now = dayjs()
	const diffMin = start.diff(now, "minute")
	if (diffMin >= 0) {
		if (diffMin < 60) return `in ${diffMin}m`
		const diffH = start.diff(now, "hour")
		if (diffH < 24) return `in ${diffH}h ${diffMin - diffH * 60}m`
		const diffD = start.diff(now, "day")
		return diffD === 1 ? "in 1 day" : `in ${diffD} days`
	}
	const agoMin = -diffMin
	if (agoMin < 60) return `${agoMin}m ago`
	const agoH = now.diff(start, "hour")
	if (agoH < 24) return `${agoH}h ago`
	const agoD = now.diff(start, "day")
	if (agoD < 30) return agoD === 1 ? "1 day ago" : `${agoD} days ago`
	const agoMo = now.diff(start, "month")
	return agoMo <= 1 ? "1 month ago" : `${agoMo} months ago`
}

// ---------- filter chip with menu ----------

type ChipFilterProps = {
	label: string
	value: string
	options: { value: string; label: string }[]
	onChange: (v: string) => void
}

const ChipFilter = ({ label, value, options, onChange }: ChipFilterProps) => {
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)
	const current = options.find((o) => o.value === value)
	return (
		<>
			<Button
				onClick={(e) => setAnchor(e.currentTarget)}
				endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />}
				sx={{
					textTransform: "none",
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "10px",
					color: "text.primary",
					fontSize: 13,
					fontWeight: 500,
					px: 1.75,
					py: 0.75,
					"&:hover": { borderColor: "text.primary", bgcolor: "#fff" },
				}}
			>
				{label}: {current?.label ?? "Any"}
			</Button>
			<Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
				{options.map((o) => (
					<MenuItem
						key={o.value}
						selected={o.value === value}
						onClick={() => {
							onChange(o.value)
							setAnchor(null)
						}}
						sx={{ fontSize: 13 }}
					>
						{o.label}
					</MenuItem>
				))}
			</Menu>
		</>
	)
}

const Card = ({ children, sx }: { children: React.ReactNode; sx?: any }) => (
	<Box
		sx={{
			bgcolor: "#fff",
			border: "1px solid",
			borderColor: "divider",
			borderRadius: "16px",
			...sx,
		}}
	>
		{children}
	</Box>
)

// ---------- main page ----------

const PatientAppointmentsPage = () => {
	const [tab, setTab] = useState<StatusTab>("upcoming")
	const [statusFilter, setStatusFilter] = useState<string>("")
	const [paymentFilter, setPaymentFilter] = useState<string>("")
	const [search, setSearch] = useState("")
	const [page, setPage] = useState(1)
	const PER_PAGE = 8

	const [reviewApptId, setReviewApptId] = useState<string | null>(null)
	const [rxAppt, setRxAppt] = useState<any | null>(null)
	const [payingId, setPayingId] = useState<string | null>(null)
	// Appointments reviewed during this session — used to hide "Leave review".
	const [reviewedIds, setReviewedIds] = useState<Record<string, true>>({})

	const { data, isLoading, isError } = useGetMyAppointmentsQuery({ limit: 100 })
	const { data: rxData } = useGetMyPrescriptionsQuery({ limit: 100 })
	const [initialPayment] = useInitialPaymentMutation()

	const appointments: any[] = data?.appointments ?? []
	const prescriptions: any[] = rxData?.prescriptions ?? []

	// appointmentId -> prescription, to resolve "View Rx" per row.
	const rxByAppointment = useMemo(() => {
		const map: Record<string, any> = {}
		prescriptions.forEach((p) => {
			const apptId = p?.appointment?.id
			if (apptId) map[apptId] = p
		})
		return map
	}, [prescriptions])

	const counts = useMemo(() => {
		let upcoming = 0
		let past = 0
		let cancelled = 0
		appointments.forEach((a) => {
			const s = (a?.status || "").toUpperCase()
			if (UPCOMING_STATUSES.includes(s)) upcoming++
			else if (s === "COMPLETED") past++
			else if (s === "CANCELLED") cancelled++
		})
		return { upcoming, past, cancelled }
	}, [appointments])

	const filtered = useMemo(() => {
		return appointments.filter((a) => {
			const s = (a?.status || "").toUpperCase()
			if (tab === "upcoming" && !UPCOMING_STATUSES.includes(s)) return false
			if (tab === "past" && s !== "COMPLETED") return false
			if (tab === "cancelled" && s !== "CANCELLED") return false
			if (statusFilter && s !== statusFilter) return false
			if (paymentFilter && (a?.paymentStatus || "").toUpperCase() !== paymentFilter)
				return false
			if (search.trim()) {
				const q = search.trim().toLowerCase()
				const name = (a?.doctor?.name || "").toLowerCase()
				if (!name.includes(q)) return false
			}
			return true
		})
	}, [appointments, tab, statusFilter, paymentFilter, search])

	const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
	const paged = useMemo(
		() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
		[filtered, page],
	)
	useEffect(() => {
		setPage(1)
	}, [tab, statusFilter, paymentFilter, search])

	const total = data?.meta?.total ?? appointments.length

	const handlePay = async (appt: any) => {
		setPayingId(appt.id)
		try {
			const res = await initialPayment(appt.id).unwrap()
			const url = res?.paymentUrl
			if (url) {
				window.location.href = url
			} else {
				toast.error("Could not start payment. Please try again.")
				setPayingId(null)
			}
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
			setPayingId(null)
		}
	}

	const subtitle = isLoading
		? "Loading your consultations…"
		: `Manage all your consultations — upcoming, past, and cancelled. ${total} total.`

	const tabs: { key: StatusTab; label: string; count: number }[] = [
		{ key: "upcoming", label: "Upcoming", count: counts.upcoming },
		{ key: "past", label: "Past", count: counts.past },
		{ key: "cancelled", label: "Cancelled", count: counts.cancelled },
	]

	const statusFilterOptions =
		tab === "upcoming"
			? [
					{ value: "", label: "Any" },
					{ value: "SCHEDULED", label: "Scheduled" },
					{ value: "INPROGRESS", label: "In progress" },
				]
			: [{ value: "", label: "Any" }]

	return (
		<>
			<PageHead
				title="My appointments"
				subtitle={subtitle}
				actions={
					<Button
						component={Link}
						href="/doctors"
						variant="contained"
						startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
						sx={{
							textTransform: "none",
							borderRadius: "10px",
							boxShadow: "none",
							"&:hover": { boxShadow: "none" },
						}}
					>
						Book new
					</Button>
				}
			/>

			{/* Tabs */}
			<Stack
				direction="row"
				sx={{
					gap: 0.5,
					borderBottom: "1px solid",
					borderColor: "divider",
					mb: 2,
					flexWrap: "wrap",
				}}
			>
				{tabs.map((t) => {
					const active = tab === t.key
					return (
						<Box
							key={t.key}
							onClick={() => {
								setTab(t.key)
								setStatusFilter("")
							}}
							sx={{
								display: "inline-flex",
								alignItems: "center",
								gap: 0.75,
								px: 1.5,
								py: 1.25,
								cursor: "pointer",
								fontSize: 13,
								fontWeight: 600,
								color: active ? "primary.main" : "text.secondary",
								borderBottom: "2px solid",
								borderColor: active ? "primary.main" : "transparent",
								mb: "-1px",
							}}
						>
							<span>{t.label}</span>
							<Box
								component="span"
								sx={{
									fontFamily: MONO,
									fontSize: 11,
									px: 0.75,
									py: "1px",
									borderRadius: 999,
									bgcolor: active ? "primary.light" : SHELL.bgSoft,
									color: active ? "primary.main" : "text.secondary",
								}}
							>
								{t.count}
							</Box>
						</Box>
					)
				})}
			</Stack>

			{/* Toolbar */}
			<Stack direction="row" sx={{ gap: 1.25, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
				<Stack
					direction="row"
					sx={{
						alignItems: "center",
						gap: 1,
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "10px",
						px: 1.5,
						py: 0.5,
						flex: { xs: "1 1 100%", sm: "0 1 320px" },
					}}
				>
					<SearchRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
					<InputBase
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by doctor name…"
						sx={{ fontSize: 13, flex: 1 }}
					/>
				</Stack>
				{statusFilterOptions.length > 1 && (
					<ChipFilter
						label="Status"
						value={statusFilter}
						onChange={setStatusFilter}
						options={statusFilterOptions}
					/>
				)}
				<ChipFilter
					label="Payment"
					value={paymentFilter}
					onChange={setPaymentFilter}
					options={[
						{ value: "", label: "Any" },
						{ value: "PAID", label: "Paid" },
						{ value: "UNPAID", label: "Unpaid" },
					]}
				/>
			</Stack>

			{/* Table card */}
			<Card sx={{ overflow: "hidden" }}>
				{/* Header row (md+) */}
				<Box
					sx={{
						display: { xs: "none", md: "grid" },
						gridTemplateColumns: "1.6fr 1.3fr 1fr 1fr 1.4fr",
						gap: 2,
						px: 2.5,
						py: 1.5,
						bgcolor: SHELL.bgSoft,
						borderBottom: "1px solid",
						borderColor: "divider",
					}}
				>
					{["Doctor", "Date & time", "Status", "Payment", "Actions"].map((h, i) => (
						<Typography
							key={h}
							sx={{
								fontFamily: MONO,
								fontSize: 11,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								color: "text.secondary",
								textAlign: i === 4 ? "right" : "left",
							}}
						>
							{h}
						</Typography>
					))}
				</Box>

				{isLoading ? (
					<Box sx={{ p: 2.5 }}>
						<Stack sx={{ gap: 1.5 }}>
							{[0, 1, 2, 3].map((i) => (
								<Skeleton key={i} variant="rounded" height={64} sx={{ borderRadius: "12px" }} />
							))}
						</Stack>
					</Box>
				) : isError ? (
					<Box sx={{ textAlign: "center", py: 7, px: 2.5 }}>
						<Typography sx={{ fontSize: 14, fontWeight: 600, color: SHELL.urgent }}>
							Could not load your appointments
						</Typography>
						<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
							Please refresh and try again.
						</Typography>
					</Box>
				) : appointments.length === 0 ? (
					<Box sx={{ textAlign: "center", py: 8, px: 2.5 }}>
						<EventBusyRoundedIcon sx={{ fontSize: 44, color: "text.disabled", mb: 1.5 }} />
						<Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
							No appointments yet
						</Typography>
						<Typography
							sx={{
								fontSize: 13,
								color: "text.secondary",
								mt: 0.75,
								mb: 2.5,
								maxWidth: 360,
								mx: "auto",
							}}
						>
							Book a consultation with one of our doctors and it will show up here.
						</Typography>
						<Button
							component={Link}
							href="/doctors"
							variant="contained"
							startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
							sx={{
								textTransform: "none",
								borderRadius: "10px",
								boxShadow: "none",
								"&:hover": { boxShadow: "none" },
							}}
						>
							Book your first appointment
						</Button>
					</Box>
				) : filtered.length === 0 ? (
					<Box sx={{ textAlign: "center", py: 8, px: 2.5 }}>
						<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
							No matching appointments
						</Typography>
						<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
							Try a different tab, filter, or search term.
						</Typography>
					</Box>
				) : (
					paged.map((a) => {
						const doctor = a?.doctor || {}
						const status = (a?.status || "SCHEDULED").toUpperCase()
						const paid = a?.paymentStatus === "PAID"
						const start = dayjs(a?.schedule?.startDateTime)
						const upcoming = UPCOMING_STATUSES.includes(status)
						const rx = rxByAppointment[a.id]
						const reviewed = !!reviewedIds[a.id]
						const fee = doctor?.appointmentFee

						return (
							<Box
								key={a.id}
								sx={{
									display: "grid",
									gridTemplateColumns: { xs: "1fr", md: "1.6fr 1.3fr 1fr 1fr 1.4fr" },
									gap: { xs: 1.5, md: 2 },
									alignItems: "center",
									px: 2.5,
									py: 2,
									borderBottom: "1px solid",
									borderColor: "divider",
									"&:last-of-type": { borderBottom: "none" },
								}}
							>
								{/* Doctor */}
								<Stack direction="row" sx={{ alignItems: "center", gap: 1.5, minWidth: 0 }}>
									<AvatarGradient
										initials={initials(doctor?.name)}
										variant={variantFor(doctor?.id || doctor?.name)}
										size={40}
									/>
									<Box sx={{ minWidth: 0 }}>
										<Typography
											sx={{
												fontSize: 14,
												fontWeight: 600,
												color: "text.primary",
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}
										>
											{doctor?.name || "Unknown doctor"}
										</Typography>
										<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
											{doctorSpecialty(doctor)}
										</Typography>
									</Box>
								</Stack>

								{/* Date & time */}
								<Box>
									<Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
										{start.isValid() ? formatDate(a.schedule.startDateTime) : "—"}
									</Typography>
									<Typography
										sx={{ fontFamily: MONO, fontSize: 12, color: "text.secondary", mt: 0.25 }}
									>
										{a?.schedule?.startDateTime && a?.schedule?.endDateTime
											? `${getTimeIn12HourFormat(
													a.schedule.startDateTime,
												)} — ${getTimeIn12HourFormat(a.schedule.endDateTime)}`
											: "—"}
									</Typography>
									{relativeWhen(start) && (
										<Typography sx={{ fontSize: 11, color: "text.disabled", mt: 0.25 }}>
											{relativeWhen(start)}
										</Typography>
									)}
								</Box>

								{/* Status */}
								<Box>
									<StatusBadge
										kind={STATUS_KIND[status] || "neutral"}
										label={STATUS_LABEL[status] || status}
									/>
								</Box>

								{/* Payment */}
								<Box>
									<StatusBadge
										kind={paid ? "paid" : "unpaid"}
										label={paid ? "Paid" : "Unpaid"}
									/>
								</Box>

								{/* Actions */}
								<Stack
									direction="row"
									sx={{
										gap: 1,
										alignItems: "center",
										justifyContent: { xs: "flex-start", md: "flex-end" },
										flexWrap: "wrap",
									}}
								>
									{/* UNPAID + upcoming -> Pay */}
									{upcoming && !paid && (
										<Button
											onClick={() => handlePay(a)}
											disabled={payingId === a.id}
											variant="contained"
											size="small"
											sx={{
												textTransform: "none",
												borderRadius: "8px",
												boxShadow: "none",
												"&:hover": { boxShadow: "none" },
											}}
										>
											{payingId === a.id
												? "Redirecting…"
												: `Pay ৳${fee != null ? Number(fee).toLocaleString() : ""}`}
										</Button>
									)}

									{/* PAID + upcoming -> Join call */}
									{upcoming && paid && (
										<Button
											component={Link}
											href={`/video?videoCallingId=${a?.videoCallingId}`}
											variant="contained"
											size="small"
											startIcon={<VideocamRoundedIcon sx={{ fontSize: 16 }} />}
											sx={{
												textTransform: "none",
												borderRadius: "8px",
												boxShadow: "none",
												bgcolor: "text.primary",
												"&:hover": { boxShadow: "none", bgcolor: "text.primary" },
											}}
										>
											Join call
										</Button>
									)}

									{/* COMPLETED -> View Rx + Leave review */}
									{status === "COMPLETED" && (
										<>
											<Button
												onClick={() => setRxAppt(a)}
												disabled={!rx}
												size="small"
												startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />}
												sx={{
													textTransform: "none",
													borderRadius: "8px",
													color: "#fff",
													// Disabled ("No Rx"): drop teal for a light bg so the text reads.
													"&.Mui-disabled": { bgcolor: SHELL.bgSoft, color: "text.disabled" },
												}}
											>
												{rx ? "View Rx" : "No Rx"}
											</Button>
											{!reviewed && (
												<Button
													onClick={() => setReviewApptId(a.id)}
													size="small"
													startIcon={<StarRoundedIcon sx={{ fontSize: 16, color: SHELL.star }} />}
													sx={{
														textTransform: "none",
														borderRadius: "8px",
														color: "#fff",
													}}
												>
													Leave review
												</Button>
											)}
										</>
									)}

									{/* CANCELLED -> Re-book */}
									{status === "CANCELLED" && (
										<Button
											component={Link}
											href="/doctors"
											size="small"
											sx={{
												textTransform: "none",
												borderRadius: "8px",
												color: "primary.main",
											}}
										>
											Re-book
										</Button>
									)}

									{/* DEFER: no patient cancel/reschedule route. */}
									{upcoming && (
										<Tooltip title="Contact support to cancel">
											<span>
												<Button
													disabled
													size="small"
													sx={{ textTransform: "none", borderRadius: "8px", color: "text.disabled" }}
												>
													Cancel
												</Button>
											</span>
										</Tooltip>
									)}
								</Stack>
							</Box>
						)
					})
				)}

				{/* Pagination footer */}
				{!isLoading && !isError && filtered.length > 0 && (
					<Stack
						direction="row"
						sx={{
							justifyContent: "space-between",
							alignItems: "center",
							px: 2.5,
							py: 2,
							borderTop: "1px solid",
							borderColor: "divider",
							flexWrap: "wrap",
							gap: 1,
						}}
					>
						<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
							Showing {(page - 1) * PER_PAGE + 1} — {Math.min(page * PER_PAGE, filtered.length)} of{" "}
							{filtered.length} appointment{filtered.length === 1 ? "" : "s"}
						</Typography>
						{pageCount > 1 && (
							<Pagination
								count={pageCount}
								page={page}
								onChange={(_e, v) => setPage(v)}
								size="small"
								color="primary"
							/>
						)}
					</Stack>
				)}
			</Card>

			{/* Dialogs */}
			<ViewRxDialog
				open={!!rxAppt}
				onClose={() => setRxAppt(null)}
				prescription={rxAppt ? rxByAppointment[rxAppt.id] : null}
				doctorName={rxAppt?.doctor?.name}
			/>
			{reviewApptId && (
				<ReviewModal
					open={!!reviewApptId}
					onClose={() => setReviewApptId(null)}
					appointmentId={reviewApptId}
					doctorName={
						appointments.find((a) => a.id === reviewApptId)?.doctor?.name
					}
					onReviewed={(id) => setReviewedIds((prev) => ({ ...prev, [id]: true }))}
				/>
			)}
		</>
	)
}

export default PatientAppointmentsPage
