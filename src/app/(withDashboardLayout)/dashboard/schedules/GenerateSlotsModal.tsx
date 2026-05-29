"use client"

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { useState } from "react"

import { SHELL } from "@/components/dashboard/shell/tokens"

type Props = {
	open: boolean
	onClose: () => void
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

const TEAL = "#0E7C7B"
const TEAL_TINT_BG = "rgba(14, 124, 123, 0.08)"
const TEAL_TINT_BORDER = "rgba(14, 124, 123, 0.45)"

const FieldLabel = ({ children, sx }: { children: React.ReactNode; sx?: object }) => (
	<Typography
		sx={{
			fontSize: 12,
			fontWeight: 600,
			color: "text.secondary",
			mb: 0.75,
			...sx,
		}}
	>
		{children}
	</Typography>
)

const FakeSelect = ({ children }: { children: React.ReactNode }) => (
	<Box
		sx={{
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 1,
			px: 1.75,
			py: "10px",
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
		<Box component="span">{children}</Box>
		<KeyboardArrowDownRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
	</Box>
)

const GenerateSlotsModal = ({ open, onClose }: Props) => {
	const [days, setDays] = useState<Set<string>>(
		new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]),
	)

	const toggleDay = (d: string) => {
		setDays((prev) => {
			const next = new Set(prev)
			if (next.has(d)) next.delete(d)
			else next.add(d)
			return next
		})
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
			slotProps={{
				paper: {
					sx: {
						borderRadius: "22px",
						boxShadow: "0 40px 80px -20px rgba(15, 30, 46, 0.35)",
						overflow: "hidden",
					},
				},
			}}
		>
			<DialogTitle
				sx={{
					p: 3,
					pb: 0,
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: 2,
				}}
			>
				<Box>
					<Typography sx={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>
						Generate schedule slots
					</Typography>
					<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
						Creates 30-minute bookable slots over a date and time range.
					</Typography>
				</Box>
				<IconButton
					onClick={onClose}
					size="small"
					sx={{
						color: "text.secondary",
						"&:hover": { color: "text.primary", bgcolor: SHELL.bgSoft },
					}}
				>
					<CloseRoundedIcon fontSize="small" />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ p: 3 }}>
				{/* Doctor (full-width fake select) */}
				<Box>
					<FieldLabel>Doctor</FieldLabel>
					<FakeSelect>Dr. Asma Rahman · Cardiology</FakeSelect>
				</Box>

				{/* 2-col grid */}
				<Box
					sx={{
						mt: 2.25,
						display: "grid",
						gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
						gap: 2.25,
					}}
				>
					<Box>
						<FieldLabel>Start date</FieldLabel>
						<TextField
							type="date"
							defaultValue="2026-06-01"
							fullWidth
							size="small"
						/>
					</Box>
					<Box>
						<FieldLabel>End date</FieldLabel>
						<TextField
							type="date"
							defaultValue="2026-06-07"
							fullWidth
							size="small"
						/>
					</Box>
					<Box>
						<FieldLabel>Start time</FieldLabel>
						<TextField
							type="time"
							defaultValue="09:00"
							fullWidth
							size="small"
						/>
					</Box>
					<Box>
						<FieldLabel>End time</FieldLabel>
						<TextField
							type="time"
							defaultValue="18:00"
							fullWidth
							size="small"
						/>
					</Box>
					<Box>
						<FieldLabel>Slot length</FieldLabel>
						<FakeSelect>30 min</FakeSelect>
					</Box>
					<Box>
						<FieldLabel>Break</FieldLabel>
						<FakeSelect>Lunch 13:00–14:00</FakeSelect>
					</Box>
				</Box>

				{/* Days of week */}
				<FieldLabel sx={{ mt: 2.5 }}>Days of week</FieldLabel>
				<Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
					{DAYS.map((d) => {
						const on = days.has(d)
						return (
							<Box
								key={d}
								onClick={() => toggleDay(d)}
								sx={{
									px: 1.5,
									py: 1,
									borderRadius: "8px",
									border: "1px solid",
									borderColor: on ? TEAL_TINT_BORDER : "divider",
									bgcolor: on ? TEAL_TINT_BG : "#fff",
									color: on ? TEAL : "text.primary",
									fontWeight: on ? 600 : 500,
									fontSize: 13,
									cursor: "pointer",
									userSelect: "none",
									transition: "all 140ms",
									"&:hover": {
										borderColor: on ? TEAL_TINT_BORDER : "text.primary",
									},
								}}
							>
								{d}
							</Box>
						)
					})}
				</Stack>

				{/* Info banner */}
				<Stack
					direction="row"
					sx={{
						mt: 2.75,
						gap: 1.5,
						p: 2,
						borderRadius: "16px",
						bgcolor: "#E6F0FA",
						border: "1px solid #C4D8EC",
						color: "#1E4D7F",
					}}
				>
					<Box
						sx={{
							width: 32,
							height: 32,
							borderRadius: "10px",
							bgcolor: "rgba(42, 111, 181, 0.15)",
							color: SHELL.info,
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<InfoOutlinedIcon sx={{ fontSize: 16 }} />
					</Box>
					<Box>
						<Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1E4D7F" }}>
							This will create 80 slots
						</Typography>
						<Typography sx={{ fontSize: 12, mt: 0.5, color: "#1E4D7F" }}>
							16 slots/day × 5 weekdays. Existing slots in this range are kept.
						</Typography>
					</Box>
				</Stack>
			</DialogContent>

			<DialogActions
				sx={{
					p: 2,
					px: 3,
					bgcolor: SHELL.bgSoft,
					borderTop: "1px solid",
					borderColor: "divider",
					gap: 1.25,
				}}
			>
				<Button
					onClick={onClose}
					variant="outlined"
					sx={{
						bgcolor: "#fff",
						color: "text.primary",
						borderColor: "divider",
						"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
					}}
				>
					Cancel
				</Button>
				<Button onClick={onClose}>Generate 80 slots</Button>
			</DialogActions>
		</Dialog>
	)
}

export default GenerateSlotsModal
