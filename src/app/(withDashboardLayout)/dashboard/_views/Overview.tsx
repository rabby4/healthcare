"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Box, Button, Menu, MenuItem, Stack, Typography } from "@mui/material"
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined"
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined"
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined"
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined"
import PercentRoundedIcon from "@mui/icons-material/PercentRounded"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import Link from "next/link"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"
import { useGetAppointmentTrendQuery, useGetMetaQuery } from "@/redux/api/metaApi"
import { useGetAllAdminsQuery } from "@/redux/api/adminApi"

const AVATAR_VARIANTS: AvatarVariant[] = ["purple", "blue", "orange", "green", "teal"]

const initialsOf = (name?: string) => {
	if (!name) return "—"
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return "—"
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatDate = (iso?: string) => {
	if (!iso) return "—"
	const d = new Date(iso)
	if (isNaN(d.getTime())) return "—"
	return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
}

const STATUS_COLORS: Record<string, string> = {
	SCHEDULED: SHELL.info,
	COMPLETED: SHELL.success,
	CANCELLED: SHELL.urgent,
	CANCELED: SHELL.urgent,
	INPROGRESS: SHELL.warning,
	IN_PROGRESS: SHELL.warning,
}
const FALLBACK_COLORS = [SHELL.info, SHELL.success, SHELL.urgent, SHELL.warning, SHELL.purple]
const colorForStatus = (status: string, i: number) =>
	STATUS_COLORS[String(status).toUpperCase()] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]

const prettyStatus = (status: string) =>
	String(status)
		.replace(/_/g, " ")
		.toLowerCase()
		.replace(/^\w/, (c) => c.toUpperCase())

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

type TrendUnit = "year" | "month" | "week"
const UNIT_OPTIONS: { value: TrendUnit; label: string }[] = [
	{ value: "year", label: "Yearly" },
	{ value: "month", label: "Monthly" },
	{ value: "week", label: "Weekly" },
]
// Cap the number of trailing periods shown so axis labels never crowd.
const MAX_BARS: Record<TrendUnit, number> = { year: 6, month: 12, week: 12 }

// Format a DATE_TRUNC period (ISO string / Date) for the chosen unit:
// year → "2026", month → "May", week → "12 May" (the week's start date).
const periodLabel = (period: any, unit: TrendUnit) => {
	const d = period instanceof Date ? period : new Date(period)
	if (isNaN(d.getTime())) return String(period ?? "—")
	if (unit === "year") return String(d.getUTCFullYear())
	if (unit === "week")
		return d.toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" })
	return MONTH_LABELS[d.getUTCMonth()]
}

// Interactive Year / Month / Week picker for the appointments chart.
const UnitDropdown = ({
	value,
	onChange,
}: {
	value: TrendUnit
	onChange: (u: TrendUnit) => void
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const current = UNIT_OPTIONS.find((o) => o.value === value) ?? UNIT_OPTIONS[1]
	return (
		<>
			<Stack
				direction="row"
				onClick={(e) => setAnchorEl(e.currentTarget)}
				sx={{
					alignItems: "center",
					gap: 0.75,
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: anchorEl ? "text.primary" : "divider",
					borderRadius: 999,
					px: "10px",
					py: "6px",
					fontSize: 12,
					fontWeight: 500,
					color: "text.primary",
					cursor: "pointer",
					userSelect: "none",
					transition: "border-color .15s ease",
					"&:hover": { borderColor: "text.primary" },
				}}
			>
				<Box component="span">{current.label}</Box>
				<ExpandMoreRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
			</Stack>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				slotProps={{
					paper: {
						sx: {
							mt: 0.75,
							borderRadius: "12px",
							minWidth: 140,
							boxShadow: "0 12px 32px -12px rgba(15, 30, 46, 0.18)",
						},
					},
				}}
			>
				{UNIT_OPTIONS.map((o) => (
					<MenuItem
						key={o.value}
						selected={o.value === value}
						onClick={() => {
							onChange(o.value)
							setAnchorEl(null)
						}}
						sx={{ fontSize: 13, py: 1 }}
					>
						{o.label}
					</MenuItem>
				))}
			</Menu>
		</>
	)
}

const DemoChip = () => (
	<Box
		component="span"
		sx={{
			px: 0.875,
			py: 0.25,
			borderRadius: 999,
			fontFamily: MONO,
			fontSize: 10,
			fontWeight: 600,
			letterSpacing: "0.06em",
			textTransform: "uppercase",
			bgcolor: SHELL.bgSoft,
			color: "text.secondary",
		}}
	>
		Demo
	</Box>
)

const systemHealth: Array<{ name: string; meta: string; ok: boolean; warn?: boolean }> = [
	{ name: "SSLCommerz · payments", meta: "99.98% uptime", ok: true },
	{ name: "Agora · video calls", meta: "99.95% uptime", ok: true },
	{ name: "Cloudinary · uploads", meta: "100% uptime", ok: true },
	{ name: "Email · password reset", meta: "degraded · 2.1s avg", ok: false, warn: true },
	{ name: "Auto-cancel cron", meta: "last run 2 min ago", ok: true },
]

const audit: Array<{
	initials: string
	variant: AvatarVariant
	you?: boolean
	body: React.ReactNode
	time: string
}> = [
	{
		initials: "AD",
		variant: "blue",
		body: (
			<>
				<strong>Anika Das</strong> verified doctor <strong>Dr. Faisal Ahmed</strong>
			</>
		),
		time: "12 min ago",
	},
	{
		initials: "MR",
		variant: "blue",
		body: (
			<>
				<strong>Masud Rana</strong> removed a flagged review on{" "}
				<strong>Dr. Rumana Nasir</strong>
			</>
		),
		time: "1 hour ago",
	},
	{
		initials: "SA",
		variant: "purple",
		you: true,
		body: (
			<>
				<strong>You</strong> invited a new admin <strong>Jamila Karim</strong>
			</>
		),
		time: "3 hours ago",
	},
	{
		initials: "AD",
		variant: "blue",
		body: (
			<>
				<strong>Anika Das</strong> blocked patient account{" "}
				<strong>sumon.p@email.com</strong>
			</>
		),
		time: "Yesterday",
	},
]

const tnum = { fontVariantNumeric: "tabular-nums" as const }

const Overview = ({ role }: { role: "ADMIN" | "SUPER_ADMIN" }) => {
	const isSuperAdmin = role === "SUPER_ADMIN"

	const { data: meta, isLoading: metaLoading, isError: metaError } = useGetMetaQuery(undefined)
	const {
		data: adminsData,
		isLoading: adminsLoading,
		isError: adminsError,
	} = useGetAllAdminsQuery({ page: 1, limit: 5 })

	// Appointments-by-period chart, driven by the unit dropdown (year/month/week).
	const [trendUnit, setTrendUnit] = useState<TrendUnit>("month")
	const {
		data: trendResp,
		isFetching: trendLoading,
		isError: trendError,
	} = useGetAppointmentTrendQuery({ unit: trendUnit })
	const trendBars: Array<{ period: any; count: number }> = (
		trendResp?.trend ?? []
	).slice(-MAX_BARS[trendUnit])
	const maxTrendBar = trendBars.reduce((m, b) => Math.max(m, Number(b?.count) || 0), 0)

	const stats: any = meta ?? {}
	const adminCount = stats?.adminCount ?? 0
	const doctorCount = stats?.doctorCount ?? 0
	const patientCount = stats?.patientCount ?? 0
	const appointmentCount = stats?.appointmentCount ?? 0
	const revenueAmount = stats?.revenue?._sum?.amount ?? 0
	// Finance breakdown comes pre-split from the meta API — the commission rate
	// lives in the backend config (single source of truth), never hardcoded here.
	const earnings = stats?.earnings ?? {}
	const grossFees = earnings.gross ?? revenueAmount
	const commissionEarned = earnings.commission ?? 0
	const netPayout = earnings.net ?? 0
	const commissionPct =
		earnings.commissionRate != null
			? Math.round(earnings.commissionRate * 100)
			: null
	const commissionLabel =
		commissionPct != null ? `Commission · ${commissionPct}%` : "Commission"
	const avgFee = Math.round(stats?.revenue?._avg?.amount ?? 0)

	const pieChartData: Array<{ status: string; count: number }> = stats?.pieChartData ?? []
	const pieTotal = pieChartData.reduce((s, p) => s + (Number(p?.count) || 0), 0)
	const donutTotal = pieTotal || appointmentCount

	// Build conic-gradient stops from cumulative percentages.
	let acc = 0
	const conicStops = pieChartData
		.map((p, i) => {
			const pct = pieTotal > 0 ? ((Number(p?.count) || 0) / pieTotal) * 100 : 0
			const start = acc
			acc += pct
			return `${colorForStatus(p.status, i)} ${start}% ${acc}%`
		})
		.join(", ")
	const donutBg =
		pieTotal > 0 ? `conic-gradient(${conicStops})` : SHELL.bgSoft

	// Admins must never see the super admin (the backend already filters, but we
	// guard on the client too); super admins see the full team.
	const allAdmins: any[] = adminsData?.admins ?? []
	const admins = isSuperAdmin
		? allAdmins
		: allAdmins.filter((a) => a?.user?.role !== "SUPER_ADMIN")

	return (
		<>
			<PageHead
				title="Platform overview"
				subtitle="Everything in one place: live counts and appointment trends."
				actions={
					// Admin management lives on /dashboard/admins, which only super
					// admins can open (proxy-guarded) — so admins see no admin actions.
					isSuperAdmin ? (
						<>
							<Button
								component={Link}
								href="/dashboard/admins"
								variant="outlined"
								sx={{
									bgcolor: "#fff",
									color: "text.primary",
									borderColor: "divider",
									"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
								}}
							>
								Manage admins
							</Button>
							<Button component={Link} href="/dashboard/admins">
								+ Invite admin
							</Button>
						</>
					) : undefined
				}
			/>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" },
					gap: 2,
					mb: 3,
				}}
			>
				<Stat
					label="Admins"
					value={metaLoading ? "…" : adminCount}
					icon={<ShieldOutlinedIcon sx={{ fontSize: 14 }} />}
					iconBg={SHELL.purpleTint}
					iconColor={SHELL.purple}
					delta=""
					deltaLabel="total admins"
					deltaTrend="neutral"
				/>
				<Stat
					label="Doctors"
					value={metaLoading ? "…" : doctorCount}
					icon={<MedicalServicesOutlinedIcon sx={{ fontSize: 14 }} />}
					delta=""
					deltaLabel="total"
					deltaTrend="neutral"
				/>
				<Stat
					label="Patients"
					value={metaLoading ? "…" : patientCount}
					icon={<GroupOutlinedIcon sx={{ fontSize: 14 }} />}
					delta=""
					deltaLabel="total"
					deltaTrend="neutral"
				/>
				<Stat
					label="Appointments"
					value={metaLoading ? "…" : appointmentCount}
					icon={<CalendarMonthRoundedIcon sx={{ fontSize: 14 }} />}
					delta=""
					deltaLabel="all time"
					deltaTrend="neutral"
				/>
			</Box>

			{/* Finance cards — real figures from PAID appointments via the meta API */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
					gap: 2,
					mb: 3,
				}}
			>
				<Stat
					label="Gross fees"
					value={
						<>
							৳{" "}
							<Box component="span" sx={tnum}>
								{metaLoading ? "…" : grossFees.toLocaleString()}
							</Box>
						</>
					}
					icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 14 }} />}
					delta=""
					deltaLabel="all paid appointments"
					deltaTrend="neutral"
				/>
				<Stat
					label={commissionLabel}
					value={
						<>
							৳{" "}
							<Box component="span" sx={tnum}>
								{metaLoading ? "…" : commissionEarned.toLocaleString()}
							</Box>
						</>
					}
					icon={<PercentRoundedIcon sx={{ fontSize: 14 }} />}
					iconBg={SHELL.purpleTint}
					iconColor={SHELL.purple}
					delta=""
					deltaLabel="platform earnings"
					deltaTrend="neutral"
				/>
				<Stat
					label="Doctor payout"
					value={
						<>
							৳{" "}
							<Box component="span" sx={tnum}>
								{metaLoading ? "…" : netPayout.toLocaleString()}
							</Box>
						</>
					}
					icon={<PaymentsOutlinedIcon sx={{ fontSize: 14 }} />}
					delta=""
					deltaLabel="gross − commission"
					deltaTrend="neutral"
				/>
			</Box>

			{/* Appointments by month + appointments by status */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
					gap: 3,
					mb: 3,
				}}
			>
				{/* Appointments by month (bar chart) */}
				<Box
					sx={{
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "22px",
						p: 3,
					}}
				>
					<Stack
						direction="row"
						sx={{ alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 2.5 }}
					>
						<Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
							{`Appointments · by ${trendUnit}`}
						</Typography>
						<UnitDropdown value={trendUnit} onChange={setTrendUnit} />
					</Stack>

					{trendLoading ? (
						<Box sx={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary", fontSize: 13 }}>
							Loading…
						</Box>
					) : trendError ? (
						<Box sx={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: SHELL.urgent, fontSize: 13 }}>
							Failed to load appointment trend.
						</Box>
					) : trendBars.length === 0 ? (
						<Box sx={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary", fontSize: 13 }}>
							No appointment data yet
						</Box>
					) : (
						<>
							<Box
								sx={{
									display: "flex",
									alignItems: "flex-end",
									justifyContent: "space-between",
									gap: 1,
									height: 180,
									px: 0.5,
								}}
							>
								{trendBars.map((b, i) => {
									const count = Number(b?.count) || 0
									const height = maxTrendBar > 0 ? Math.max((count / maxTrendBar) * 100, 2) : 2
									const lead = count === maxTrendBar && maxTrendBar > 0
									return (
										<Box
											key={i}
											title={`${periodLabel(b.period, trendUnit)}: ${count}`}
											sx={{
												position: "relative",
												flex: 1,
												height: `${height}%`,
												minWidth: 0,
												borderRadius: "8px 8px 4px 4px",
												bgcolor: lead ? SHELL.purple : SHELL.purpleTint,
												transition: "background-color .2s ease",
												"&:hover": { bgcolor: SHELL.purple },
											}}
										/>
									)
								})}
							</Box>
							<Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 1.25, px: 0.5 }}>
								{trendBars.map((b, i) => (
									<Box
										key={i}
										component="span"
										sx={{
											flex: 1,
											textAlign: "center",
											fontFamily: MONO,
											fontSize: 10,
											color: "text.secondary",
											letterSpacing: "0.04em",
											...tnum,
										}}
									>
										{periodLabel(b.period, trendUnit)}
									</Box>
								))}
							</Box>
						</>
					)}

					{/* Finance strip — values come from the meta API; the rate is set in backend config */}
					<Stack
						direction="row"
						sx={{ gap: 4.5, mt: 3.5, pt: 3, borderTop: "1px solid", borderColor: "divider", alignItems: "flex-start" }}
					>
						{[
							{ k: "Gross · all", v: metaLoading ? "…" : `৳ ${grossFees.toLocaleString()}` },
							{ k: commissionLabel, v: metaLoading ? "…" : `৳ ${commissionEarned.toLocaleString()}` },
							{ k: "Net payout", v: metaLoading ? "…" : `৳ ${netPayout.toLocaleString()}` },
							{ k: "Avg. fee", v: metaLoading ? "…" : `৳ ${avgFee.toLocaleString()}` },
						].map((m) => (
							<Box key={m.k}>
								<Typography
									sx={{
										fontFamily: MONO,
										fontSize: 11,
										color: "text.secondary",
										letterSpacing: "0.04em",
										textTransform: "uppercase",
									}}
								>
									{m.k}
								</Typography>
								<Typography sx={{ fontSize: 22, fontWeight: 600, mt: 0.75, color: "text.primary", ...tnum }}>
									{m.v}
								</Typography>
							</Box>
						))}
					</Stack>
					<Typography sx={{ fontSize: 11, color: "text.secondary", mt: 1.25 }}>
						{commissionPct != null
							? `Platform keeps ${commissionPct}% of each paid fee, doctors receive the rest.`
							: "Platform commission is deducted from each paid fee."}
					</Typography>
				</Box>

				{/* Appointments by status (donut) */}
				<Box
					sx={{
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "22px",
						p: 3,
					}}
				>
					<Stack direction="row" sx={{ alignItems: "center", mb: 2.5 }}>
						<Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
							Appointments by status
						</Typography>
					</Stack>

					{metaLoading ? (
						<Box sx={{ py: 4, textAlign: "center", color: "text.secondary", fontSize: 13 }}>Loading…</Box>
					) : pieChartData.length === 0 ? (
						<Stack direction="row" sx={{ gap: 3.5, alignItems: "center" }}>
							<Box
								sx={{
									position: "relative",
									width: 120,
									height: 120,
									borderRadius: "50%",
									flexShrink: 0,
									background: SHELL.bgSoft,
								}}
							>
								<Box
									sx={{
										position: "absolute",
										inset: 18,
										bgcolor: "#fff",
										borderRadius: "50%",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Typography sx={{ fontSize: 22, fontWeight: 600, color: "text.primary", lineHeight: 1, ...tnum }}>
										0
									</Typography>
								</Box>
							</Box>
							<Typography sx={{ flex: 1, fontSize: 13, color: "text.secondary" }}>
								No appointments yet.
							</Typography>
						</Stack>
					) : (
						<Stack direction="row" sx={{ gap: 3.5, alignItems: "center" }}>
							<Box
								sx={{
									position: "relative",
									width: 120,
									height: 120,
									borderRadius: "50%",
									flexShrink: 0,
									background: donutBg,
								}}
							>
								<Box
									sx={{
										position: "absolute",
										inset: 18,
										bgcolor: "#fff",
										borderRadius: "50%",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Typography sx={{ fontSize: 22, fontWeight: 600, color: "text.primary", lineHeight: 1, ...tnum }}>
										{donutTotal}
									</Typography>
									<Typography
										sx={{
											fontFamily: MONO,
											fontSize: 10,
											color: "text.secondary",
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											mt: 0.5,
										}}
									>
										Total
									</Typography>
								</Box>
							</Box>
							<Stack sx={{ flex: 1, gap: 1.25 }}>
								{pieChartData.map((s, i) => (
									<Stack key={`${s.status}-${i}`} direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
										<Box
											sx={{
												width: 10,
												height: 10,
												borderRadius: "3px",
												bgcolor: colorForStatus(s.status, i),
												flexShrink: 0,
											}}
										/>
										<Box component="span" sx={{ flex: 1, fontSize: 13, color: "text.primary" }}>
											{prettyStatus(s.status)}
										</Box>
										<Box component="span" sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", ...tnum }}>
											{Number(s.count) || 0}
										</Box>
									</Stack>
								))}
							</Stack>
						</Stack>
					)}
				</Box>
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
					gap: 3,
				}}
			>
				{/* Admin team */}
				<Box
					sx={{
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "22px",
						overflow: "hidden",
					}}
				>
					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							gap: 1.5,
							p: "16px 20px",
							borderBottom: "1px solid",
							borderColor: "divider",
						}}
					>
						<Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
							Admin team
						</Typography>
						{isSuperAdmin && (
							<Box
								component={Link}
								href="/dashboard/admins"
								sx={{
									ml: "auto",
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
								Manage →
							</Box>
						)}
					</Stack>
					<Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
						<Box component="thead">
							<Box component="tr">
								{["Admin", "Role", "Joined", "Status"].map((h) => (
									<Box
										key={h}
										component="th"
										sx={{
											textAlign: "left",
											fontSize: 11,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											color: "text.secondary",
											fontWeight: 500,
											p: "12px 20px",
											bgcolor: SHELL.bgSoft,
											borderBottom: "1px solid",
											borderColor: "divider",
										}}
									>
										{h}
									</Box>
								))}
							</Box>
						</Box>
						<Box component="tbody">
							{adminsLoading ? (
								<Box component="tr">
									<Box component="td" colSpan={4} sx={{ p: "20px", fontSize: 13, color: "text.secondary" }}>
										Loading…
									</Box>
								</Box>
							) : adminsError ? (
								<Box component="tr">
									<Box component="td" colSpan={4} sx={{ p: "20px", fontSize: 13, color: SHELL.urgent }}>
										Failed to load admins.
									</Box>
								</Box>
							) : admins.length === 0 ? (
								<Box component="tr">
									<Box component="td" colSpan={4} sx={{ p: "20px", fontSize: 13, color: "text.secondary" }}>
										No admins yet.
									</Box>
								</Box>
							) : (
								admins.map((m, i) => {
									const isLast = i === admins.length - 1
									const cellBorder = isLast ? "none" : `1px solid ${SHELL.dividerSoft}`
									return (
										<Box
											key={m.id ?? m.email}
											component="tr"
											sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
										>
											<Box component="td" sx={{ p: "16px 20px", borderBottom: cellBorder }}>
												<Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
													<AvatarGradient
														initials={initialsOf(m.name)}
														variant={AVATAR_VARIANTS[i % AVATAR_VARIANTS.length]}
														size={36}
													/>
													<Box>
														<Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
															{m.name ?? "—"}
														</Typography>
														<Typography sx={{ fontSize: 12, color: "text.secondary", mt: "1px" }}>
															{m.email ?? "—"}
														</Typography>
													</Box>
												</Stack>
											</Box>
											<Box component="td" sx={{ p: "16px 20px", borderBottom: cellBorder }}>
												<StatusBadge
													kind="teal"
													label={m.user?.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}
													withDot={false}
												/>
											</Box>
											<Box
												component="td"
												sx={{ p: "16px 20px", fontSize: 13, color: "text.secondary", borderBottom: cellBorder }}
											>
												{formatDate(m.createdAt)}
											</Box>
											<Box component="td" sx={{ p: "16px 20px", borderBottom: cellBorder }}>
												<StatusBadge kind={m.isDeleted ? "revoked" : "active"} />
											</Box>
										</Box>
									)
								})
							)}
						</Box>
					</Box>
				</Box>

				{/* System health — static / illustrative */}
				<Box
					sx={{
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "22px",
						p: 3,
					}}
				>
					<Stack
						direction="row"
						sx={{ alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 1 }}
					>
						<Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
							System health
						</Typography>
						<DemoChip />
					</Stack>
					<Typography sx={{ fontSize: 11, color: "text.secondary", mb: 2 }}>
						Illustrative, not live.
					</Typography>
					<Stack sx={{ flexDirection: "column" }}>
						{systemHealth.map((s, i) => (
							<Stack
								key={s.name}
								direction="row"
								sx={{
									alignItems: "center",
									justifyContent: "space-between",
									py: 1.75,
									borderBottom: i === systemHealth.length - 1 ? "none" : "1px solid",
									borderColor: "divider",
								}}
							>
								<Stack direction="row" sx={{ alignItems: "center", gap: 1.25, fontSize: 13 }}>
									<Box
										component="span"
										sx={{
											width: 8,
											height: 8,
											borderRadius: "50%",
											bgcolor: s.warn ? SHELL.warning : SHELL.success,
										}}
									/>
									<Box component="span">{s.name}</Box>
								</Stack>
								<Typography
									sx={{
										fontFamily: MONO,
										fontSize: 12,
										color: s.warn ? SHELL.warning : "text.secondary",
									}}
								>
									{s.meta}
								</Typography>
							</Stack>
						))}
					</Stack>
				</Box>
			</Box>

			{/* Recent admin activity — static / illustrative */}
			<Box
				sx={{
					mt: 3,
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "22px",
					p: 3,
				}}
			>
				<Stack
					direction="row"
					sx={{ alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 1 }}
				>
					<Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
						<Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
							Recent admin activity
						</Typography>
						<DemoChip />
					</Stack>
				</Stack>
				<Typography sx={{ fontSize: 11, color: "text.secondary", mb: 2 }}>
					Illustrative, audit log is not live.
				</Typography>
				<Stack>
					{audit.map((a, i) => (
						<Stack
							key={i}
							direction="row"
							sx={{
								alignItems: "center",
								gap: 1.75,
								py: 1.5,
								borderBottom: i === audit.length - 1 ? "none" : `1px solid ${SHELL.dividerSoft}`,
							}}
						>
							<AvatarGradient initials={a.initials} variant={a.variant} size={30} />
							<Typography sx={{ flex: 1, fontSize: 13 }}>{a.body}</Typography>
							<Typography
								sx={{ fontFamily: MONO, fontSize: 11, color: "text.secondary", whiteSpace: "nowrap" }}
							>
								{a.time}
							</Typography>
						</Stack>
					))}
				</Stack>
			</Box>

			{metaError && (
				<Typography sx={{ mt: 2, fontSize: 12, color: SHELL.urgent }}>
					Failed to load platform stats.
				</Typography>
			)}
		</>
	)
}

export default Overview
