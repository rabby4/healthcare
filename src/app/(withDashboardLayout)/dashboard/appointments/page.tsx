"use client"

import { Box, Button, Stack, Typography } from "@mui/material"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import { useState } from "react"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge, { StatusKind } from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"

type PaymentKind = StatusKind
type Appointment = {
	id: string
	doctor: { name: string; initials: string; variant: AvatarVariant }
	patient: string
	when: string
	status: { kind: StatusKind; label?: string }
	payment: { kind: PaymentKind; label?: string }
	amount: string
	amountMuted?: boolean
}

const appointments: Appointment[] = [
	{
		id: "#A-9241",
		doctor: { name: "Dr. Asma Rahman", initials: "AR", variant: "teal" },
		patient: "Farzana Rahman",
		when: "Today · 11:00",
		status: { kind: "scheduled" },
		payment: { kind: "unpaid" },
		amount: "৳ 1,500",
	},
	{
		id: "#A-9238",
		doctor: { name: "Dr. Mehnaz Iqbal", initials: "MI", variant: "purple" },
		patient: "Shahriar Islam",
		when: "Today · 10:30",
		status: { kind: "inprogress" },
		payment: { kind: "paid" },
		amount: "৳ 1,400",
	},
	{
		id: "#A-9230",
		doctor: { name: "Dr. Sadia Khan", initials: "SK", variant: "orange" },
		patient: "Nadia Ahmed",
		when: "Today · 09:00",
		status: { kind: "completed" },
		payment: { kind: "paid" },
		amount: "৳ 900",
	},
	{
		id: "#A-9221",
		doctor: { name: "Dr. Tanvir Hossain", initials: "TH", variant: "blue" },
		patient: "Rahim Uddin",
		when: "Yest. · 16:30",
		status: { kind: "completed" },
		payment: { kind: "paid" },
		amount: "৳ 1,200",
	},
	{
		id: "#A-9215",
		doctor: { name: "Dr. Rumana Nasir", initials: "RN", variant: "orange" },
		patient: "Tasneem Karim",
		when: "Yest. · 14:00",
		status: { kind: "cancelled" },
		payment: { kind: "neutral", label: "Refunded" },
		amount: "৳ 1,100",
	},
	{
		id: "#A-9209",
		doctor: { name: "Dr. Asma Rahman", initials: "AR", variant: "teal" },
		patient: "Mahmuda Akter",
		when: "26 May · 11:30",
		status: { kind: "completed" },
		payment: { kind: "paid" },
		amount: "৳ 1,500",
	},
	{
		id: "#A-9201",
		doctor: { name: "Dr. Mehnaz Iqbal", initials: "MI", variant: "purple" },
		patient: "Imran Hossain",
		when: "26 May · 09:30",
		status: { kind: "cancelled" },
		payment: { kind: "unpaid", label: "Auto-freed" },
		amount: "—",
		amountMuted: true,
	},
]

const filters = [
	{ label: "All", count: "3,128" },
	{ label: "Scheduled", count: "1,814" },
	{ label: "In progress", count: "251" },
	{ label: "Completed", count: "750" },
	{ label: "Cancelled", count: "313" },
]

const headers = ["ID", "Doctor", "Patient", "Date & time", "Status", "Payment", "Amount"]

const cellSx = (last: boolean) => ({
	p: "14px 20px",
	fontSize: 13,
	color: "text.primary",
	borderBottom: last ? "none" : `1px solid ${SHELL.dividerSoft}`,
	verticalAlign: "middle" as const,
})

const AppointmentsPage = () => {
	const [activeFilter, setActiveFilter] = useState("All")

	return (
		<>
			<PageHead
				title="All appointments"
				subtitle="3,128 total this month · filter by doctor, patient, status, or payment."
				actions={
					<Button
						variant="outlined"
						startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
						sx={{
							textTransform: "none",
							fontSize: 13,
							fontWeight: 500,
							borderRadius: "10px",
							borderColor: "divider",
							color: "text.primary",
							px: 1.75,
							py: 0.875,
							"&:hover": { borderColor: "text.primary", bgcolor: "transparent" },
						}}
					>
						Export CSV
					</Button>
				}
			/>

			{/* Filter pills */}
			<Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", mb: 2 }}>
				{filters.map((f) => {
					const isActive = activeFilter === f.label
					return (
						<Box
							key={f.label}
							component="button"
							onClick={() => setActiveFilter(f.label)}
							sx={{
								display: "inline-flex",
								alignItems: "center",
								gap: 0.75,
								padding: "7px 14px",
								borderRadius: 999,
								fontSize: 13,
								fontWeight: 500,
								cursor: "pointer",
								bgcolor: isActive ? "text.primary" : "#fff",
								color: isActive ? "#fff" : "text.secondary",
								border: "1px solid",
								borderColor: isActive ? "text.primary" : "divider",
								transition: "all 120ms ease",
								"&:hover": {
									borderColor: isActive ? "text.primary" : "text.primary",
									color: isActive ? "#fff" : "text.primary",
								},
							}}
						>
							{f.label}
							<Box
								component="span"
								sx={{
									fontFamily: MONO,
									fontSize: 12,
									opacity: 0.6,
									fontVariantNumeric: "tabular-nums",
								}}
							>
								{f.count}
							</Box>
						</Box>
					)
				})}
			</Stack>

			<Box
				sx={{
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "22px",
					overflow: "hidden",
				}}
			>
				{/* Toolbar */}
				<Stack
					direction={{ xs: "column", md: "row" }}
					sx={{
						alignItems: { md: "center" },
						gap: 1.5,
						p: "16px 20px",
						borderBottom: "1px solid",
						borderColor: "divider",
						flexWrap: "wrap",
					}}
				>
					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							gap: 1,
							px: 1.75,
							py: 1,
							bgcolor: SHELL.bgSoft,
							borderRadius: "10px",
							border: "1px solid transparent",
							fontSize: 13,
							color: "text.secondary",
							flex: 1,
							minWidth: 220,
						}}
					>
						<SearchRoundedIcon sx={{ fontSize: 16 }} />
						<Box
							component="input"
							placeholder="Search by doctor or patient email…"
							sx={{
								flex: 1,
								bgcolor: "transparent",
								border: "none",
								outline: "none",
								fontSize: 13,
								color: "text.primary",
								"&::placeholder": { color: "text.secondary" },
							}}
						/>
					</Stack>
					{["Payment: All", "Last 30 days"].map((s) => (
						<Stack
							key={s}
							direction="row"
							sx={{
								alignItems: "center",
								gap: 1,
								px: 1.75,
								py: 1,
								bgcolor: "#fff",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "10px",
								fontSize: 13,
								color: "text.primary",
								cursor: "pointer",
								"&:hover": { borderColor: "text.primary" },
							}}
						>
							<Box component="span">{s}</Box>
							<KeyboardArrowDownRoundedIcon
								sx={{ fontSize: 14, color: "text.secondary" }}
							/>
						</Stack>
					))}
				</Stack>

				{/* Table */}
				<Box sx={{ overflowX: "auto" }}>
					<Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
						<Box component="thead">
							<Box component="tr">
								{headers.map((h, i) => (
									<Box
										key={h}
										component="th"
										sx={{
											textAlign: i === headers.length - 1 ? "right" : "left",
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
							{appointments.map((a, i) => {
								const isLast = i === appointments.length - 1
								return (
									<Box
										key={a.id}
										component="tr"
										sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
									>
										<Box
											component="td"
											sx={{
												...cellSx(isLast),
												fontFamily: MONO,
												fontSize: 12,
												color: "text.secondary",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											{a.id}
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
												<AvatarGradient
													initials={a.doctor.initials}
													variant={a.doctor.variant}
													size={28}
												/>
												<Typography sx={{ fontSize: 13, color: "text.primary" }}>
													{a.doctor.name}
												</Typography>
											</Stack>
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											{a.patient}
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											{a.when}
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											<StatusBadge kind={a.status.kind} label={a.status.label} />
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											<StatusBadge kind={a.payment.kind} label={a.payment.label} />
										</Box>
										<Box
											component="td"
											sx={{
												...cellSx(isLast),
												textAlign: "right",
												fontVariantNumeric: "tabular-nums",
												color: a.amountMuted ? "text.secondary" : "text.primary",
											}}
										>
											{a.amount}
										</Box>
									</Box>
								)
							})}
						</Box>
					</Box>
				</Box>

				{/* Pagination */}
				<Stack
					direction="row"
					sx={{
						alignItems: "center",
						justifyContent: "space-between",
						p: "14px 20px",
						borderTop: "1px solid",
						borderColor: "divider",
						fontSize: 12,
						color: "text.secondary",
					}}
				>
					<Box>Showing 1 — 7 of 3,128 appointments</Box>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{[
							{ label: "‹", disabled: true },
							{ label: "1", active: true },
							{ label: "2" },
							{ label: "3" },
							{ label: "…", disabled: true },
							{ label: "447" },
							{ label: "›" },
						].map((p, i) => (
							<Box
								key={i}
								component="button"
								disabled={p.disabled}
								sx={{
									minWidth: 30,
									height: 30,
									px: 1,
									borderRadius: "8px",
									border: "none",
									bgcolor: p.active ? "text.primary" : "transparent",
									color: p.active
										? "#fff"
										: p.disabled
											? "divider"
											: "text.secondary",
									fontSize: 12,
									fontFamily: MONO,
									cursor: p.disabled ? "not-allowed" : "pointer",
									fontVariantNumeric: "tabular-nums",
									"&:hover": {
										bgcolor: p.active
											? "text.primary"
											: p.disabled
												? "transparent"
												: SHELL.bgSoft,
										color: p.active ? "#fff" : p.disabled ? "divider" : "text.primary",
									},
								}}
							>
								{p.label}
							</Box>
						))}
					</Stack>
				</Stack>
			</Box>
		</>
	)
}

export default AppointmentsPage
