"use client"

import { Box, Button, Stack, Typography } from "@mui/material"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import { useState } from "react"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"
import GenerateSlotsModal from "./GenerateSlotsModal"

type DoctorRow = {
	initials: string
	variant: AvatarVariant
	name: string
	specialty: string
	range: string
	generated: number
	booked: number
	open: number
	actionLabel: string
}

const rows: DoctorRow[] = [
	{
		initials: "AR",
		variant: "teal",
		name: "Dr. Asma Rahman",
		specialty: "Cardiology",
		range: "Mon–Fri · 09:00–18:00",
		generated: 90,
		booked: 62,
		open: 28,
		actionLabel: "Generate more",
	},
	{
		initials: "TH",
		variant: "blue",
		name: "Dr. Tanvir Hossain",
		specialty: "Cardiology",
		range: "Mon–Sat · 10:00–16:00",
		generated: 72,
		booked: 48,
		open: 24,
		actionLabel: "Generate more",
	},
	{
		initials: "SK",
		variant: "orange",
		name: "Dr. Sadia Khan",
		specialty: "Pediatrics",
		range: "Sun–Thu · 09:00–14:00",
		generated: 60,
		booked: 55,
		open: 5,
		actionLabel: "Generate more",
	},
	{
		initials: "FA",
		variant: "green",
		name: "Dr. Faisal Ahmed",
		specialty: "Orthopedics",
		range: "—",
		generated: 0,
		booked: 0,
		open: 0,
		actionLabel: "Generate now",
	},
]

const headers = [
	{ label: "Doctor", align: "left" as const, width: "28%" },
	{ label: "Range", align: "left" as const },
	{ label: "Generated", align: "right" as const },
	{ label: "Booked", align: "right" as const },
	{ label: "Open", align: "right" as const },
	{ label: "Actions", align: "right" as const },
]

const cellSx = (last: boolean) => ({
	p: "16px 20px",
	fontSize: 14,
	color: "text.primary",
	borderBottom: last ? "none" : `1px solid ${SHELL.dividerSoft}`,
	verticalAlign: "middle" as const,
})

const numCellSx = (last: boolean) => ({
	...cellSx(last),
	textAlign: "right" as const,
	fontFamily: MONO,
	fontVariantNumeric: "tabular-nums" as const,
})

const SchedulesPage = () => {
	const [modalOpen, setModalOpen] = useState(false)

	const openModal = () => setModalOpen(true)
	const closeModal = () => setModalOpen(false)

	return (
		<>
			<PageHead
				title="Schedule slots"
				subtitle="Generate 30-minute slots across doctors and date ranges in bulk."
				actions={<Button onClick={openModal}>+ Generate slots</Button>}
			/>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						sm: "repeat(2, 1fr)",
						lg: "repeat(4, 1fr)",
					},
					gap: 2,
					mb: 3,
				}}
			>
				<Stat
					label="Slots generated · this week"
					value="2,140"
					deltaTrend="neutral"
					deltaLabel="across 240 doctors"
				/>
				<Stat
					label="Booked"
					value="1,492"
					delta="70%"
					deltaTrend="up"
					deltaLabel="utilization"
				/>
				<Stat
					label="Open"
					value="648"
					deltaTrend="neutral"
					deltaLabel="still bookable"
				/>
				<Stat
					label="Doctors with no slots"
					value="14"
					deltaTrend="down"
					deltaLabel="needs attention"
				/>
			</Box>

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
							placeholder="Search doctor…"
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
					<Stack
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
						<Box component="span">Specialty: All</Box>
						<KeyboardArrowDownRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
					</Stack>
					<Stack
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
						<Box component="span">Week of 25 May</Box>
						<KeyboardArrowDownRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
					</Stack>
				</Stack>

				{/* Table */}
				<Box sx={{ overflowX: "auto" }}>
					<Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
						<Box component="thead">
							<Box component="tr">
								{headers.map((h) => (
									<Box
										key={h.label}
										component="th"
										sx={{
											textAlign: h.align,
											fontSize: 11,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											color: "text.secondary",
											fontWeight: 500,
											p: "12px 20px",
											bgcolor: SHELL.bgSoft,
											borderBottom: "1px solid",
											borderColor: "divider",
											...(h.width ? { width: h.width } : {}),
										}}
									>
										{h.label}
									</Box>
								))}
							</Box>
						</Box>
						<Box component="tbody">
							{rows.map((r, i) => {
								const isLast = i === rows.length - 1
								const isEmpty = r.generated === 0
								return (
									<Box
										key={r.name}
										component="tr"
										sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
									>
										<Box component="td" sx={cellSx(isLast)}>
											<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
												<AvatarGradient initials={r.initials} variant={r.variant} size={36} />
												<Box>
													<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
														{r.name}
													</Typography>
													<Typography sx={{ fontSize: 12, color: "text.secondary", mt: "1px" }}>
														{r.specialty}
													</Typography>
												</Box>
											</Stack>
										</Box>
										<Box
											component="td"
											sx={{
												...cellSx(isLast),
												color: r.range === "—" ? "text.secondary" : "text.primary",
											}}
										>
											{r.range}
										</Box>
										<Box
											component="td"
											sx={{
												...numCellSx(isLast),
												color: isEmpty ? "text.secondary" : "text.primary",
											}}
										>
											{r.generated}
										</Box>
										<Box
											component="td"
											sx={{
												...numCellSx(isLast),
												color: isEmpty ? "text.secondary" : "text.primary",
											}}
										>
											{r.booked}
										</Box>
										<Box
											component="td"
											sx={{
												...numCellSx(isLast),
												color: isEmpty ? "text.secondary" : "text.primary",
											}}
										>
											{r.open}
										</Box>
										<Box
											component="td"
											sx={{
												...cellSx(isLast),
												textAlign: "right",
											}}
										>
											<Box
												component="button"
												onClick={openModal}
												sx={{
													fontSize: 12,
													fontWeight: 600,
													px: 1,
													py: 0.5,
													borderRadius: "6px",
													border: "none",
													bgcolor: "transparent",
													cursor: "pointer",
													color: "primary.main",
													"&:hover": { bgcolor: SHELL.bgSoft, color: "primary.main" },
												}}
											>
												{r.actionLabel}
											</Box>
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
					<Box>Showing 1 — 4 of 240 doctors</Box>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{[
							{ label: "‹", disabled: true },
							{ label: "1", active: true },
							{ label: "2" },
							{ label: "3" },
							{ label: "›" },
						].map((p, i) => (
							<Box
								key={i}
								component="button"
								disabled={p.disabled}
								sx={{
									width: 30,
									height: 30,
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

			<GenerateSlotsModal open={modalOpen} onClose={closeModal} />
		</>
	)
}

export default SchedulesPage
