/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Box, Button, Stack, Typography } from "@mui/material"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import dayjs from "dayjs"
import { useState } from "react"

import { useGetAllAppointmentsQuery } from "@/redux/api/appointmentApi"
import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge, { StatusKind } from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"

const filters: { label: string; status?: string }[] = [
	{ label: "All" },
	{ label: "Scheduled", status: "SCHEDULED" },
	{ label: "In progress", status: "INPROGRESS" },
	{ label: "Completed", status: "COMPLETED" },
	{ label: "Cancelled", status: "CANCELLED" },
]

const statusKindMap: Record<string, StatusKind> = {
	SCHEDULED: "scheduled",
	INPROGRESS: "inprogress",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
}

const paymentKindMap: Record<string, StatusKind> = {
	PAID: "paid",
	UNPAID: "unpaid",
}

const avatarVariants: AvatarVariant[] = ["teal", "blue", "purple", "orange", "green"]

const getInitials = (name?: string) => {
	if (!name) return "?"
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return "?"
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const getVariant = (key: string): AvatarVariant => {
	let hash = 0
	for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i)) % avatarVariants.length
	return avatarVariants[hash]
}

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
	const [patientEmail, setPatientEmail] = useState("")

	const activeStatus = filters.find((f) => f.label === activeFilter)?.status

	const queryArg: Record<string, any> = {}
	if (activeStatus) queryArg.status = activeStatus
	if (patientEmail.trim()) queryArg.patientEmail = patientEmail.trim()

	const { data, isLoading, isError } = useGetAllAppointmentsQuery(queryArg)
	const appointments: any[] = data?.appointments ?? []
	const meta = data?.meta

	const rangeStart = meta?.total ? ((meta.page ?? 1) - 1) * (meta.limit ?? appointments.length) + 1 : 0
	const rangeEnd = meta?.total
		? Math.min((meta.page ?? 1) * (meta.limit ?? appointments.length), meta.total)
		: appointments.length
	const total = meta?.total ?? appointments.length

	return (
		<>
			<PageHead
				title="All appointments"
				subtitle="Filter by status or search by patient email."
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
							value={patientEmail}
							onChange={(e: any) => setPatientEmail(e.target.value)}
							placeholder="Search by patient email…"
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
							{isLoading ? (
								[0, 1, 2, 3, 4].map((r) => (
									<Box key={r} component="tr">
										<Box
											component="td"
											colSpan={headers.length}
											sx={{
												...cellSx(r === 4),
												color: "text.secondary",
												fontSize: 13,
											}}
										>
											Loading…
										</Box>
									</Box>
								))
							) : isError ? (
								<Box component="tr">
									<Box
										component="td"
										colSpan={headers.length}
										sx={{
											...cellSx(true),
											textAlign: "center",
											color: SHELL.urgent,
											py: "32px",
										}}
									>
										Failed to load appointments. Please try again.
									</Box>
								</Box>
							) : appointments.length === 0 ? (
								<Box component="tr">
									<Box
										component="td"
										colSpan={headers.length}
										sx={{
											...cellSx(true),
											textAlign: "center",
											color: "text.secondary",
											py: "32px",
										}}
									>
										No appointments found.
									</Box>
								</Box>
							) : (
								appointments.map((a, i) => {
									const isLast = i === appointments.length - 1
									const doctorName: string | undefined = a.doctor?.name
									const statusKind = statusKindMap[a.status] ?? "neutral"
									const paymentKind = paymentKindMap[a.paymentStatus] ?? "neutral"
									const fee = a.doctor?.appointmentFee
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
												{"#" + String(a.id).slice(0, 8)}
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
													<AvatarGradient
														initials={getInitials(doctorName)}
														variant={getVariant(doctorName ?? a.id)}
														size={28}
													/>
													<Typography sx={{ fontSize: 13, color: "text.primary" }}>
														{doctorName ?? "—"}
													</Typography>
												</Stack>
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												{a.patient?.name ?? "—"}
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												{a.createdAt ? dayjs(a.createdAt).format("D MMM YYYY · HH:mm") : "—"}
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												<StatusBadge kind={statusKind} />
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												<StatusBadge kind={paymentKind} />
											</Box>
											<Box
												component="td"
												sx={{
													...cellSx(isLast),
													textAlign: "right",
													fontVariantNumeric: "tabular-nums",
													color: fee == null ? "text.secondary" : "text.primary",
												}}
											>
												{"৳ " + (fee ?? "—")}
											</Box>
										</Box>
									)
								})
							)}
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
					<Box>
						{appointments.length === 0
							? "Showing 0 of 0 appointments"
							: `Showing ${rangeStart} to ${rangeEnd} of ${total} appointments`}
					</Box>
				</Stack>
			</Box>
		</>
	)
}

export default AppointmentsPage
