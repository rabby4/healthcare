"use client"

import { Box, Button, Stack, Typography } from "@mui/material"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined"
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined"
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined"
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"

const TEAL = "#0E7C7B"
const TEAL_TINT = "#E6F2F1"

const tnum = { fontVariantNumeric: "tabular-nums" as const }

const bars: Array<{ height: number; lead?: boolean; valueLabel?: string }> = [
	{ height: 42, valueLabel: "280k" },
	{ height: 50 },
	{ height: 38 },
	{ height: 58 },
	{ height: 64 },
	{ height: 55 },
	{ height: 70 },
	{ height: 62 },
	{ height: 78 },
	{ height: 72 },
	{ height: 85 },
	{ height: 96, lead: true, valueLabel: "512k" },
]

const axisLabels = [
	"W10",
	"W11",
	"W12",
	"W13",
	"W14",
	"W15",
	"W16",
	"W17",
	"W18",
	"W19",
	"W20",
	"NOW",
]

const statusLegend: Array<{ label: string; value: string; color: string }> = [
	{ label: "Scheduled", value: "1,814", color: SHELL.info },
	{ label: "Completed", value: "750", color: SHELL.success },
	{ label: "Cancelled", value: "313", color: SHELL.urgent },
	{ label: "In progress", value: "251", color: SHELL.warning },
]

const topDoctors: Array<{
	initials: string
	variant: AvatarVariant
	name: string
	specialty: string
	visits: string
	revenue: string
	rating: string
}> = [
	{
		initials: "AR",
		variant: "teal",
		name: "Dr. Asma Rahman",
		specialty: "Cardiology",
		visits: "312",
		revenue: "৳ 468k",
		rating: "4.9 ★",
	},
	{
		initials: "SK",
		variant: "orange",
		name: "Dr. Sadia Khan",
		specialty: "Pediatrics",
		visits: "402",
		revenue: "৳ 361k",
		rating: "4.9 ★",
	},
	{
		initials: "TH",
		variant: "blue",
		name: "Dr. Tanvir Hossain",
		specialty: "Cardiology",
		visits: "208",
		revenue: "৳ 249k",
		rating: "4.8 ★",
	},
	{
		initials: "MI",
		variant: "purple",
		name: "Dr. Mehnaz Iqbal",
		specialty: "Neurology",
		visits: "184",
		revenue: "৳ 257k",
		rating: "4.9 ★",
	},
]

type AttentionItem = {
	href: string
	title: string
	sub: string
	icon: React.ReactNode
	iconBg: string
	iconColor: string
}

const attentionItems: AttentionItem[] = [
	{
		href: "/dashboard/admin/doctors",
		title: "3 doctors pending verification",
		sub: "BMDC documents awaiting review",
		icon: <ShieldOutlinedIcon sx={{ fontSize: 18 }} />,
		iconBg: SHELL.warningBg,
		iconColor: SHELL.warning,
	},
	{
		href: "/dashboard/admin/reviews",
		title: "5 reviews flagged",
		sub: "Reported for inappropriate content",
		icon: <ReportOutlinedIcon sx={{ fontSize: 18 }} />,
		iconBg: SHELL.dangerBg,
		iconColor: SHELL.urgent,
	},
	{
		href: "/dashboard/admin/users",
		title: "2 account appeals",
		sub: "Blocked users requesting reinstatement",
		icon: <GroupOutlinedIcon sx={{ fontSize: 18 }} />,
		iconBg: TEAL_TINT,
		iconColor: TEAL,
	},
	{
		href: "/dashboard/admin/schedules",
		title: "Generate next week's slots",
		sub: "14 doctors have no availability set",
		icon: <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />,
		iconBg: SHELL.bgSoft,
		iconColor: "text.primary",
	},
]

const SelectChip = ({
	label,
	size = "md",
}: {
	label: string
	size?: "md" | "sm"
}) => (
	<Stack
		direction="row"
		sx={{
			alignItems: "center",
			gap: 0.75,
			bgcolor: "#fff",
			border: "1px solid",
			borderColor: "divider",
			borderRadius: 999,
			px: size === "sm" ? "10px" : "14px",
			py: size === "sm" ? "6px" : "8px",
			fontSize: size === "sm" ? 12 : 13,
			fontWeight: 500,
			color: "text.primary",
			cursor: "pointer",
			"&:hover": { borderColor: "text.primary" },
		}}
	>
		<Box component="span">{label}</Box>
		<ExpandMoreRoundedIcon sx={{ fontSize: size === "sm" ? 14 : 16, color: "text.secondary" }} />
	</Stack>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
	<Typography
		component="h3"
		sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: "text.primary" }}
	>
		{children}
	</Typography>
)

const AdminOverview = () => {
	return (
		<>
			<PageHead
				title="Platform overview"
				subtitle="Thursday, 29 May 2026 · Everything running smoothly."
				actions={
					<>
						<SelectChip label="Last 30 days" />
						<Button
							variant="outlined"
							startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
							sx={{
								bgcolor: "#fff",
								color: "text.primary",
								borderColor: "divider",
								fontSize: 13,
								fontWeight: 500,
								px: 1.75,
								py: 0.9,
								textTransform: "none",
								borderRadius: 999,
								"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
							}}
						>
							Export report
						</Button>
					</>
				}
			/>

			{/* KPI stat cards */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" },
					gap: 2,
					mb: 3,
				}}
			>
				<Stat
					label="Doctors"
					value="240"
					icon={<MedicalServicesOutlinedIcon sx={{ fontSize: 14 }} />}
					iconBg={TEAL_TINT}
					iconColor={TEAL}
					delta="↑ 8"
					deltaLabel="new this month"
					deltaTrend="up"
				/>
				<Stat
					label="Patients"
					value="18,402"
					icon={<GroupOutlinedIcon sx={{ fontSize: 14 }} />}
					iconBg={SHELL.infoBg}
					iconColor={SHELL.info}
					delta="↑ 6.4%"
					deltaLabel="vs last month"
					deltaTrend="up"
				/>
				<Stat
					label="Appointments"
					value="3,128"
					icon={<CalendarMonthRoundedIcon sx={{ fontSize: 14 }} />}
					iconBg={SHELL.warningBg}
					iconColor={SHELL.warning}
					delta="↑ 11%"
					deltaLabel="this month"
					deltaTrend="up"
				/>
				<Stat
					label="Revenue"
					value={
						<>
							৳{" "}
							<Box component="span" sx={tnum}>
								4.2M
							</Box>
						</>
					}
					icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 14 }} />}
					iconBg={SHELL.purpleTint}
					iconColor={SHELL.purple}
					delta="↑ 9%"
					deltaLabel="commission ৳ 336k"
					deltaTrend="up"
				/>
			</Box>

			{/* Revenue chart + appointment status donut */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
					gap: 3,
				}}
			>
				{/* Revenue chart card */}
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
						sx={{
							alignItems: "center",
							justifyContent: "space-between",
							gap: 1.5,
							mb: 2.5,
						}}
					>
						<SectionTitle>Revenue · last 12 weeks</SectionTitle>
						<SelectChip label="Weekly" size="sm" />
					</Stack>

					{/* Bars */}
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
						{bars.map((b, i) => (
							<Box
								key={i}
								sx={{
									position: "relative",
									flex: 1,
									height: `${b.height}%`,
									minWidth: 0,
									borderRadius: "8px 8px 4px 4px",
									bgcolor: b.lead ? TEAL : TEAL_TINT,
									transition: "background-color .2s ease",
									"&:hover": { bgcolor: b.lead ? TEAL : "#D5E9E7" },
								}}
							>
								{b.valueLabel && (
									<Box
										component="span"
										sx={{
											position: "absolute",
											top: -22,
											left: "50%",
											transform: "translateX(-50%)",
											fontFamily: MONO,
											fontSize: 10,
											fontWeight: 600,
											color: b.lead ? TEAL : "text.secondary",
											letterSpacing: "0.02em",
											whiteSpace: "nowrap",
											...tnum,
										}}
									>
										{b.valueLabel}
									</Box>
								)}
							</Box>
						))}
					</Box>

					{/* Axis */}
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							gap: 1,
							mt: 1.25,
							px: 0.5,
						}}
					>
						{axisLabels.map((l) => (
							<Box
								key={l}
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
								{l}
							</Box>
						))}
					</Box>

					{/* KPI row */}
					<Stack
						direction="row"
						sx={{
							gap: 4.5,
							mt: 3.5,
							pt: 3,
							borderTop: "1px solid",
							borderColor: "divider",
						}}
					>
						{[
							{ k: "Gross · 12w", v: "৳ 5.1M" },
							{ k: "Commission", v: "৳ 408k" },
							{ k: "Avg. fee", v: "৳ 1,310" },
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
								<Typography
									sx={{
										fontSize: 22,
										fontWeight: 600,
										mt: 0.75,
										color: "text.primary",
										...tnum,
									}}
								>
									{m.v}
								</Typography>
							</Box>
						))}
					</Stack>
				</Box>

				{/* Appointments by status card */}
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
						sx={{ alignItems: "center", mb: 2.5 }}
					>
						<SectionTitle>Appointments by status</SectionTitle>
					</Stack>

					<Stack direction="row" sx={{ gap: 3.5, alignItems: "center" }}>
						{/* Donut */}
						<Box
							sx={{
								position: "relative",
								width: 120,
								height: 120,
								borderRadius: "50%",
								flexShrink: 0,
								background: `conic-gradient(${SHELL.info} 0% 58%, ${SHELL.success} 58% 82%, ${SHELL.urgent} 82% 92%, ${SHELL.warning} 92% 100%)`,
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
								<Typography
									sx={{
										fontSize: 22,
										fontWeight: 600,
										color: "text.primary",
										lineHeight: 1,
										...tnum,
									}}
								>
									3,128
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

						{/* Legend */}
						<Stack sx={{ flex: 1, gap: 1.25 }}>
							{statusLegend.map((s) => (
								<Stack
									key={s.label}
									direction="row"
									sx={{ alignItems: "center", gap: 1.25 }}
								>
									<Box
										sx={{
											width: 10,
											height: 10,
											borderRadius: "3px",
											bgcolor: s.color,
											flexShrink: 0,
										}}
									/>
									<Box
										component="span"
										sx={{ flex: 1, fontSize: 13, color: "text.primary" }}
									>
										{s.label}
									</Box>
									<Box
										component="span"
										sx={{
											fontSize: 13,
											fontWeight: 600,
											color: "text.primary",
											...tnum,
										}}
									>
										{s.value}
									</Box>
								</Stack>
							))}
						</Stack>
					</Stack>

					{/* Bottom stats */}
					<Stack
						direction="row"
						sx={{
							mt: 3,
							pt: 2.5,
							borderTop: "1px solid",
							borderColor: "divider",
							justifyContent: "space-between",
						}}
					>
						<Box>
							<Typography sx={{ fontSize: 12, color: "text.secondary" }}>Paid rate</Typography>
							<Typography
								sx={{
									fontSize: 20,
									fontWeight: 600,
									mt: 0.5,
									color: SHELL.success,
									...tnum,
								}}
							>
								88%
							</Typography>
						</Box>
						<Box>
							<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
								Auto-cancelled (unpaid)
							</Typography>
							<Typography
								sx={{
									fontSize: 20,
									fontWeight: 600,
									mt: 0.5,
									color: "text.primary",
									...tnum,
								}}
							>
								142
							</Typography>
						</Box>
						<Box>
							<Typography sx={{ fontSize: 12, color: "text.secondary" }}>Avg. wait</Typography>
							<Typography
								sx={{
									fontSize: 20,
									fontWeight: 600,
									mt: 0.5,
									color: "text.primary",
									...tnum,
								}}
							>
								6m
							</Typography>
						</Box>
					</Stack>
				</Box>
			</Box>

			{/* Top doctors + Needs your attention */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
					gap: 3,
					mt: 3,
				}}
			>
				{/* Top performing doctors */}
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
						<SectionTitle>Top performing doctors</SectionTitle>
						<Box
							component="a"
							href="/dashboard/admin/doctors"
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
							View all →
						</Box>
					</Stack>
					<Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
						<Box component="thead">
							<Box component="tr">
								{[
									{ label: "Doctor", align: "left" },
									{ label: "Specialty", align: "left" },
									{ label: "Visits", align: "right" },
									{ label: "Revenue", align: "right" },
									{ label: "Rating", align: "right" },
								].map((h) => (
									<Box
										key={h.label}
										component="th"
										sx={{
											textAlign: h.align as "left" | "right",
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
										{h.label}
									</Box>
								))}
							</Box>
						</Box>
						<Box component="tbody">
							{topDoctors.map((d, i) => {
								const isLast = i === topDoctors.length - 1
								const cellBorder = isLast
									? "none"
									: `1px solid ${SHELL.dividerSoft}`
								return (
									<Box
										key={d.name}
										component="tr"
										sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
									>
										<Box
											component="td"
											sx={{
												p: "16px 20px",
												borderBottom: cellBorder,
											}}
										>
											<Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
												<AvatarGradient
													initials={d.initials}
													variant={d.variant}
													size={34}
												/>
												<Typography
													sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}
												>
													{d.name}
												</Typography>
											</Stack>
										</Box>
										<Box
											component="td"
											sx={{
												p: "16px 20px",
												fontSize: 13,
												color: "text.secondary",
												borderBottom: cellBorder,
											}}
										>
											{d.specialty}
										</Box>
										<Box
											component="td"
											sx={{
												p: "16px 20px",
												fontSize: 13,
												textAlign: "right",
												color: "text.primary",
												borderBottom: cellBorder,
												...tnum,
											}}
										>
											{d.visits}
										</Box>
										<Box
											component="td"
											sx={{
												p: "16px 20px",
												fontSize: 13,
												textAlign: "right",
												color: "text.primary",
												fontWeight: 500,
												borderBottom: cellBorder,
												...tnum,
											}}
										>
											{d.revenue}
										</Box>
										<Box
											component="td"
											sx={{
												p: "16px 20px",
												fontSize: 13,
												textAlign: "right",
												color: "text.primary",
												borderBottom: cellBorder,
												...tnum,
											}}
										>
											{d.rating}
										</Box>
									</Box>
								)
							})}
						</Box>
					</Box>
				</Box>

				{/* Needs your attention */}
				<Box
					sx={{
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "22px",
						p: 3,
					}}
				>
					<Stack direction="row" sx={{ alignItems: "center", mb: 2.25 }}>
						<SectionTitle>Needs your attention</SectionTitle>
					</Stack>
					<Stack sx={{ gap: 1.25 }}>
						{attentionItems.map((item) => (
							<Stack
								key={item.title}
								component="a"
								href={item.href}
								direction="row"
								sx={{
									alignItems: "center",
									gap: 1.75,
									p: 1.75,
									border: "1px solid",
									borderColor: "divider",
									borderRadius: "14px",
									textDecoration: "none",
									color: "inherit",
									transition: "border-color .15s ease, background-color .15s ease",
									"&:hover": {
										borderColor: "text.primary",
										bgcolor: SHELL.bgSoft,
									},
								}}
							>
								<Box
									sx={{
										width: 36,
										height: 36,
										borderRadius: "10px",
										bgcolor: item.iconBg,
										color: item.iconColor,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
									}}
								>
									{item.icon}
								</Box>
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Typography
										sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}
									>
										{item.title}
									</Typography>
									<Typography
										sx={{ fontSize: 12, color: "text.secondary", mt: "2px" }}
									>
										{item.sub}
									</Typography>
								</Box>
								<ChevronRightRoundedIcon
									sx={{ fontSize: 18, color: "text.secondary" }}
								/>
							</Stack>
						))}
					</Stack>
				</Box>
			</Box>
		</>
	)
}

export default AdminOverview
