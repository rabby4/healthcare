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
	Typography,
} from "@mui/material"
import SearchRoundedIcon from "@mui/icons-material/Search"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDown"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrow"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNew"
import EventBusyRoundedIcon from "@mui/icons-material/EventBusy"
import TouchAppRoundedIcon from "@mui/icons-material/TouchApp"
import dayjs from "dayjs"
import { toast } from "sonner"

import {
	useGetMyAppointmentsQuery,
	useAppointmentStatusChangeMutation,
} from "@/redux/api/appointmentApi"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import { useConfirm } from "@/components/dashboard/shell/useConfirm"
import PrescriptionModal from "./components/PrescriptionModal"

// ---------- helpers ----------

const APPT_STATUSES = ["SCHEDULED", "INPROGRESS", "COMPLETED", "CANCELLED"] as const
type ApptStatus = (typeof APPT_STATUSES)[number]

const STATUS_KIND: Record<ApptStatus, "scheduled" | "inprogress" | "completed" | "cancelled"> = {
	SCHEDULED: "scheduled",
	INPROGRESS: "inprogress",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
}

const STATUS_LABEL: Record<ApptStatus, string> = {
	SCHEDULED: "Scheduled",
	INPROGRESS: "In progress",
	COMPLETED: "Completed",
	CANCELLED: "Cancelled",
}

const STATUS_HINT: Record<ApptStatus, string> = {
	SCHEDULED: "Booked, waiting to start",
	INPROGRESS: "Mark when video starts",
	COMPLETED: "After issuing Rx",
	CANCELLED: "Refunds the patient",
}

const initials = (name?: string) =>
	(name || "?")
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase() || "")
		.join("") || "?"

const formatBlood = (bg?: string) => {
	if (!bg) return undefined
	const [grp, sign] = bg.split("_")
	return `${grp}${sign === "POSITIVE" ? "+" : sign === "NEGATIVE" ? "−" : ""}`
}

const formatGender = (g?: string) =>
	g ? g.charAt(0) + g.slice(1).toLowerCase() : undefined

const ageFromDob = (dob?: string) => {
	if (!dob) return undefined
	const d = dayjs(dob)
	if (!d.isValid()) return undefined
	const years = dayjs().diff(d, "year")
	return years >= 0 ? years : undefined
}

// Condition flag-pills derived from boolean-ish patientHealthData fields.
const conditionFlags = (h: any): { label: string; warn: boolean }[] => {
	if (!h) return []
	const isTrue = (v: any) => v === true || v === "true" || v === "YES"
	const flags: { label: string; warn: boolean }[] = []
	if (isTrue(h.hasDiabetes)) flags.push({ label: "Diabetes", warn: true })
	if (isTrue(h.hasAllergies)) flags.push({ label: "Allergies", warn: true })
	if (h.smokingStatus && isTrue(h.smokingStatus)) flags.push({ label: "Smoker", warn: true })
	if (isTrue(h.recentAnxiety)) flags.push({ label: "Anxiety", warn: false })
	if (isTrue(h.recentDepression)) flags.push({ label: "Depression", warn: false })
	if (isTrue(h.hasPastSurgeries)) flags.push({ label: "Past surgeries", warn: false })
	if (isTrue(h.pregnancyStatus)) flags.push({ label: "Pregnant", warn: false })
	if (isTrue(h.mentalHealthHistory)) flags.push({ label: "Mental health history", warn: false })
	return flags
}

// ---------- small UI pieces ----------

const FlagPill = ({ label, warn }: { label: string; warn?: boolean }) => (
	<Box
		component="span"
		sx={{
			display: "inline-flex",
			alignItems: "center",
			px: 1,
			py: "3px",
			borderRadius: 999,
			fontSize: 11,
			fontWeight: 500,
			bgcolor: warn ? SHELL.dangerBg : SHELL.bgSoft,
			color: warn ? SHELL.urgent : "#465065",
		}}
	>
		{label}
	</Box>
)

const Card = ({ children, sx }: { children: React.ReactNode; sx?: any }) => (
	<Box
		sx={{
			bgcolor: "#fff",
			border: "1px solid",
			borderColor: "divider",
			borderRadius: "16px",
			p: 2.5,
			...sx,
		}}
	>
		{children}
	</Box>
)

const CardHead = ({ title, right }: { title: string; right?: React.ReactNode }) => (
	<Stack
		direction="row"
		sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}
	>
		<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
			{title}
		</Typography>
		{right}
	</Stack>
)

const InfoRow = ({ k, v }: { k: string; v: React.ReactNode }) => (
	<Stack
		direction="row"
		sx={{
			alignItems: "baseline",
			justifyContent: "space-between",
			py: 1.25,
			borderBottom: "1px dashed",
			borderColor: "divider",
			"&:last-of-type": { borderBottom: "none" },
		}}
	>
		<Typography sx={{ fontSize: 12, color: "text.secondary" }}>{k}</Typography>
		<Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", textAlign: "right" }}>
			{v}
		</Typography>
	</Stack>
)

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

// ---------- main page ----------

type TimeTab = "today" | "week" | "all"

const DoctorAppointmentsPage = () => {
	const [tab, setTab] = useState<TimeTab>("all")
	const [statusFilter, setStatusFilter] = useState<string>("")
	const [paymentFilter, setPaymentFilter] = useState<string>("")
	const [search, setSearch] = useState("")
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [rxOpen, setRxOpen] = useState(false)
	const [page, setPage] = useState(1)
	const PER_PAGE = 8

	// my-appointments is auto-scoped to the doctor; status/paymentStatus are
	// applied CLIENT-SIDE below (the endpoint does not reliably honor them as
	// query params), so the fetch stays stable and the chips always work.
	const { data, isLoading, isError } = useGetMyAppointmentsQuery({ limit: 100 })
	const [changeStatus, { isLoading: isStatusChanging }] = useAppointmentStatusChangeMutation()
	const { confirm, ConfirmDialog } = useConfirm()

	const appointments: any[] = data?.appointments ?? []

	// Time tab + status + payment + search applied client-side.
	const filtered = useMemo(() => {
		const now = dayjs()
		return appointments.filter((a) => {
			const start = dayjs(a?.schedule?.startDateTime)
			if (tab === "today" && start.isValid() && !start.isSame(now, "day")) return false
			if (
				tab === "week" &&
				start.isValid() &&
				!(start.isAfter(now.startOf("week")) && start.isBefore(now.endOf("week")))
			)
				return false
			if (statusFilter && (a?.status || "").toUpperCase() !== statusFilter) return false
			if (paymentFilter && (a?.paymentStatus || "").toUpperCase() !== paymentFilter)
				return false
			if (search.trim()) {
				const q = search.trim().toLowerCase()
				const name = (a?.patient?.name || "").toLowerCase()
				const email = (a?.patient?.email || "").toLowerCase()
				if (!name.includes(q) && !email.includes(q)) return false
			}
			return true
		})
	}, [appointments, tab, statusFilter, paymentFilter, search])

	// Counts for tabs (ignore search; reflect loaded set).
	const counts = useMemo(() => {
		const now = dayjs()
		let today = 0
		let week = 0
		appointments.forEach((a) => {
			const start = dayjs(a?.schedule?.startDateTime)
			if (start.isValid() && start.isSame(now, "day")) today++
			if (
				start.isValid() &&
				start.isAfter(now.startOf("week")) &&
				start.isBefore(now.endOf("week"))
			)
				week++
		})
		return { today, week, all: appointments.length }
	}, [appointments])

	// Client-side pagination over the filtered set.
	const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
	const paged = useMemo(
		() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
		[filtered, page],
	)
	// Reset to page 1 whenever the filters change.
	useEffect(() => {
		setPage(1)
	}, [tab, statusFilter, paymentFilter, search])

	const selected = useMemo(
		() => appointments.find((a) => a.id === selectedId) || null,
		[appointments, selectedId],
	)

	const total = data?.meta?.total ?? appointments.length
	const loadedCapped = total > appointments.length

	const handleStatusChange = async (appt: any, next: ApptStatus) => {
		if (!appt) return
		if (appt.status === next) return
		if (next === "CANCELLED") {
			const ok = await confirm({
				title: "Cancel this appointment?",
				message: "This refunds the patient and cannot be undone.",
				confirmLabel: "Cancel appointment",
				cancelLabel: "Keep it",
				danger: true,
			})
			if (!ok) return
		}
		try {
			await changeStatus({ id: appt.id, body: { appointmentStatus: next } }).unwrap()
			toast.success(`Status updated to ${STATUS_LABEL[next]}`)
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const subtitle = isLoading
		? "Loading your queue…"
		: `${dayjs().format("ddd, DD MMM YYYY")} · ${total} appointment${
				total === 1 ? "" : "s"
			}${loadedCapped ? ` · showing latest ${appointments.length}` : ""}`

	const tabs: { key: TimeTab; label: string; count: number }[] = [
		{ key: "today", label: "Today", count: counts.today },
		{ key: "week", label: "This week", count: counts.week },
		{ key: "all", label: "All", count: counts.all },
	]

	return (
		<>
			<PageHead title="Appointments queue" subtitle={subtitle} />

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
							onClick={() => setTab(t.key)}
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

			{/* Filters */}
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
						placeholder="Search by patient name or email…"
						sx={{ fontSize: 13, flex: 1 }}
					/>
				</Stack>
				<ChipFilter
					label="Status"
					value={statusFilter}
					onChange={setStatusFilter}
					options={[
						{ value: "", label: "Any" },
						{ value: "SCHEDULED", label: "Scheduled" },
						{ value: "INPROGRESS", label: "In progress" },
						{ value: "COMPLETED", label: "Completed" },
						{ value: "CANCELLED", label: "Cancelled" },
					]}
				/>
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

			{/* Two-pane layout */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
					gap: 3,
					alignItems: "start",
				}}
			>
				{/* Left: list */}
				<Stack sx={{ gap: 1.5 }}>
					{isLoading ? (
						[0, 1, 2].map((i) => (
							<Skeleton key={i} variant="rounded" height={96} sx={{ borderRadius: "16px" }} />
						))
					) : isError ? (
						<Card sx={{ textAlign: "center", py: 5 }}>
							<Typography sx={{ fontSize: 14, fontWeight: 600, color: SHELL.urgent }}>
								Could not load appointments
							</Typography>
							<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
								Please refresh and try again.
							</Typography>
						</Card>
					) : appointments.length === 0 ? (
						<Card sx={{ textAlign: "center", py: 6 }}>
							<EventBusyRoundedIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
							<Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>
								No appointments yet
							</Typography>
							<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5, maxWidth: 320, mx: "auto" }}>
								When patients book a slot from your schedule, their appointments will appear here.
							</Typography>
						</Card>
					) : filtered.length === 0 ? (
						<Card sx={{ textAlign: "center", py: 6 }}>
							<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
								No matching appointments
							</Typography>
							<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
								Try a different time range, filter, or search term.
							</Typography>
						</Card>
					) : (
						paged.map((a) => {
							const active = a.id === selectedId
							const status = (a.status as ApptStatus) || "SCHEDULED"
							const paid = a.paymentStatus === "PAID"
							const start = dayjs(a?.schedule?.startDateTime)
							const end = dayjs(a?.schedule?.endDateTime)
							const h = a?.patient?.patientHealthData
							const gender = formatGender(h?.gender)
							const blood = formatBlood(h?.bloodGroup)
							const metaParts = [gender, blood].filter(Boolean)
							const past = status === "COMPLETED" || status === "CANCELLED"
							return (
								<Box
									key={a.id}
									onClick={() => setSelectedId(a.id)}
									sx={{
										display: "grid",
										gridTemplateColumns: "70px 1fr",
										gap: 2,
										p: 2,
										bgcolor: "#fff",
										border: "1px solid",
										borderColor: active ? "primary.main" : "divider",
										borderRadius: "16px",
										cursor: "pointer",
										opacity: past && !active ? 0.7 : 1,
										boxShadow: active ? "0 0 0 3px rgba(14,124,123,0.1)" : "none",
										transition: "border-color 140ms, box-shadow 140ms",
										"&:hover": { borderColor: active ? "primary.main" : "text.primary" },
									}}
								>
									<Box>
										<Typography
											sx={{
												fontFamily: MONO,
												fontSize: 13,
												fontWeight: 600,
												color: active ? "primary.main" : "text.primary",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											{start.isValid() ? start.format("hh:mm A") : "--"}
										</Typography>
										<Typography
											sx={{
												fontFamily: MONO,
												fontSize: 11,
												color: "text.secondary",
												mt: 0.25,
											}}
										>
											→ {end.isValid() ? end.format("hh:mm A") : "--"}
										</Typography>
									</Box>
									<Box sx={{ minWidth: 0 }}>
										<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
											{a?.patient?.name || "Unknown patient"}
										</Typography>
										<Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.4 }}>
											{metaParts.length ? metaParts.join(" · ") : "No health data on file"}
										</Typography>
										<Stack direction="row" sx={{ gap: 0.75, flexWrap: "wrap", mt: 1 }}>
											<StatusBadge kind={STATUS_KIND[status]} label={STATUS_LABEL[status]} />
											<StatusBadge kind={paid ? "paid" : "unpaid"} label={paid ? "Paid" : "Unpaid"} />
										</Stack>
									</Box>
								</Box>
							)
						})
					)}

					{!isLoading && !isError && pageCount > 1 && (
						<Stack
							direction="row"
							sx={{ justifyContent: "space-between", alignItems: "center", pt: 1, flexWrap: "wrap", gap: 1 }}
						>
							<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
								{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of{" "}
								{filtered.length}
							</Typography>
							<Pagination
								count={pageCount}
								page={page}
								onChange={(_e, v) => setPage(v)}
								size="small"
								color="primary"
							/>
						</Stack>
					)}
				</Stack>

				{/* Right: detail */}
				<Box sx={{ position: { lg: "sticky" }, top: { lg: 24 } }}>
					{!selected ? (
						<Card sx={{ textAlign: "center", py: 7 }}>
							<TouchAppRoundedIcon sx={{ fontSize: 38, color: "text.disabled", mb: 1 }} />
							<Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>
								Select an appointment
							</Typography>
							<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5, maxWidth: 280, mx: "auto" }}>
								Pick a patient from the queue to see their health snapshot, shared reports, and status controls.
							</Typography>
						</Card>
					) : (
						<DetailPane
							appt={selected}
							isStatusChanging={isStatusChanging}
							onStatusChange={handleStatusChange}
							onWriteRx={() => setRxOpen(true)}
						/>
					)}
				</Box>
			</Box>

			{selected && (
				<PrescriptionModal
					open={rxOpen}
					onClose={() => setRxOpen(false)}
					appointmentId={selected.id}
					patientName={selected?.patient?.name}
				/>
			)}
			{ConfirmDialog}
		</>
	)
}

// ---------- detail pane ----------

type DetailPaneProps = {
	appt: any
	isStatusChanging: boolean
	onStatusChange: (appt: any, next: ApptStatus) => void
	onWriteRx: () => void
}

const DetailPane = ({ appt, isStatusChanging, onStatusChange, onWriteRx }: DetailPaneProps) => {
	const patient = appt?.patient || {}
	const h = patient?.patientHealthData
	const reports: any[] = patient?.medicalReport ?? []
	const status = (appt.status as ApptStatus) || "SCHEDULED"
	const paid = appt.paymentStatus === "PAID"
	const canPrescribe = status === "COMPLETED" && paid

	const dob = h?.dateOfBirth
	const age = ageFromDob(dob)
	const gender = formatGender(h?.gender)
	const blood = formatBlood(h?.bloodGroup)
	const flags = conditionFlags(h)

	return (
		<Stack sx={{ gap: 2 }}>
			{/* Patient header */}
			<Card>
				<Stack direction="row" sx={{ gap: 1.75, alignItems: "center" }}>
					<AvatarGradient initials={initials(patient?.name)} size={56} />
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
							{patient?.name || "Unknown patient"}
						</Typography>
						<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
							{[patient?.email, patient?.contactNumber].filter(Boolean).join(" · ") || "No contact details"}
						</Typography>
					</Box>
				</Stack>
				<Stack direction="row" sx={{ gap: 1, mt: 2.25, flexWrap: "wrap" }}>
					<Button
						onClick={() => onStatusChange(appt, "INPROGRESS")}
						disabled={isStatusChanging || status === "INPROGRESS" || status === "COMPLETED" || status === "CANCELLED"}
						startIcon={<PlayArrowRoundedIcon sx={{ fontSize: 18 }} />}
						variant="contained"
						sx={{
							flex: 1,
							textTransform: "none",
							borderRadius: "10px",
							boxShadow: "none",
							"&:hover": { boxShadow: "none" },
						}}
					>
						Start consultation
					</Button>
				</Stack>
				<Typography sx={{ fontSize: 11, color: "text.disabled", mt: 1, fontStyle: "italic" }}>
					Video join screen · Demo (not live)
				</Typography>
			</Card>

			{/* Health snapshot */}
			<Card>
				<CardHead title="Health snapshot" />
				{h ? (
					<>
						<InfoRow
							k="DOB · Age"
							v={
								dob
									? `${dayjs(dob).isValid() ? dayjs(dob).format("DD MMM YYYY") : dob}${
											age != null ? ` · ${age}y` : ""
										}`
									: "—"
							}
						/>
						<InfoRow k="Gender" v={gender || "—"} />
						<InfoRow k="Blood" v={blood || "—"} />
						<InfoRow
							k="Height / Weight"
							v={
								h?.height || h?.weight
									? `${h?.height ? `${h.height} cm` : "—"} · ${h?.weight ? `${h.weight} kg` : "—"}`
									: "—"
							}
						/>
						{h?.maritalStatus && <InfoRow k="Marital status" v={formatGender(h.maritalStatus)} />}
						{h?.dietaryPreferences && (
							<InfoRow k="Diet" v={String(h.dietaryPreferences)} />
						)}

						<Box sx={{ mt: 2.25, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
							<Typography
								sx={{
									fontFamily: MONO,
									fontSize: 11,
									letterSpacing: "0.06em",
									textTransform: "uppercase",
									color: "text.secondary",
									mb: 1.25,
								}}
							>
								Conditions &amp; flags
							</Typography>
							{flags.length ? (
								<Stack direction="row" sx={{ gap: 0.75, flexWrap: "wrap" }}>
									{flags.map((f) => (
										<FlagPill key={f.label} label={f.label} warn={f.warn} />
									))}
								</Stack>
							) : (
								<Typography sx={{ fontSize: 13, color: "text.secondary" }}>
									No flagged conditions.
								</Typography>
							)}
						</Box>
					</>
				) : (
					<Typography sx={{ fontSize: 13, color: "text.secondary" }}>
						This patient has not shared health data yet.
					</Typography>
				)}
			</Card>

			{/* Reports shared */}
			<Card>
				<CardHead
					title="Reports shared"
					right={
						<Typography sx={{ fontFamily: MONO, fontSize: 11, color: "text.secondary" }}>
							{reports.length} {reports.length === 1 ? "FILE" : "FILES"}
						</Typography>
					}
				/>
				{reports.length ? (
					<Stack sx={{ gap: 0.75 }}>
						{reports.map((r, i) => (
							<Stack
								key={`${r?.reportName}-${i}`}
								component="a"
								href={r?.reportLink || "#"}
								target="_blank"
								rel="noopener noreferrer"
								direction="row"
								sx={{
									alignItems: "center",
									gap: 1.5,
									px: 1.5,
									py: 1.25,
									bgcolor: SHELL.bgSoft,
									borderRadius: "10px",
									textDecoration: "none",
									color: "inherit",
									"&:hover": { bgcolor: SHELL.bgSoft2 },
								}}
							>
								<Box
									sx={{
										width: 28,
										height: 34,
										borderRadius: "4px",
										bgcolor: "#fff",
										border: "1px solid",
										borderColor: "divider",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: SHELL.urgent,
									}}
								>
									<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />
								</Box>
								<Typography
									sx={{
										flex: 1,
										minWidth: 0,
										fontSize: 12,
										fontWeight: 600,
										color: "text.primary",
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
								>
									{r?.reportName || "Report"}
								</Typography>
								<OpenInNewRoundedIcon sx={{ fontSize: 15, color: "text.secondary" }} />
							</Stack>
						))}
					</Stack>
				) : (
					<Typography sx={{ fontSize: 13, color: "text.secondary" }}>
						No reports shared by this patient.
					</Typography>
				)}
			</Card>

			{/* Update status */}
			<Card>
				<CardHead title="Update status" />
				<Stack sx={{ gap: 1 }}>
					{APPT_STATUSES.map((s) => {
						const current = status === s
						return (
							<Button
								key={s}
								onClick={() => onStatusChange(appt, s)}
								disabled={isStatusChanging || current}
								sx={{
									justifyContent: "flex-start",
									textTransform: "none",
									textAlign: "left",
									gap: 1,
									px: 1.75,
									py: 1.25,
									borderRadius: "12px",
									border: "1px solid",
									borderColor: current ? "primary.main" : "divider",
									bgcolor: current ? "primary.light" : "#fff",
									"&:hover": { bgcolor: current ? "primary.light" : SHELL.bgSoft },
									"&.Mui-disabled": current
										? { borderColor: "primary.main", bgcolor: "primary.light", opacity: 1 }
										: {},
								}}
							>
								<StatusBadge kind={STATUS_KIND[s]} label={STATUS_LABEL[s]} />
								<Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 500 }}>
									{current ? "Current" : STATUS_HINT[s]}
								</Typography>
							</Button>
						)
					})}
				</Stack>
			</Card>

			{/* Prescription */}
			<Card>
				<CardHead title="Prescription" />
				<Button
					onClick={onWriteRx}
					disabled={!canPrescribe}
					variant="contained"
					fullWidth
					sx={{
						textTransform: "none",
						borderRadius: "10px",
						boxShadow: "none",
						bgcolor: SHELL.success,
						color: "#fff",
						"&:hover": { bgcolor: SHELL.success, boxShadow: "none" },
						// When disabled, drop the green so the muted text stays readable
						// (otherwise MUI greys the text on top of the forced green bg).
						"&.Mui-disabled": { bgcolor: SHELL.bgSoft, color: "text.disabled" },
					}}
				>
					Write prescription
				</Button>
				<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1.25, lineHeight: 1.5 }}>
					{canPrescribe
						? "Issue instructions and an optional follow-up date for this patient."
						: "Available once the appointment is Completed and Paid."}
				</Typography>
				<Typography sx={{ fontSize: 11, color: "text.disabled", mt: 0.5, fontStyle: "italic" }}>
					Reading past prescriptions · Demo (not live)
				</Typography>
			</Card>
		</Stack>
	)
}

export default DoctorAppointmentsPage
