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
import { useState } from "react"

import { MONO, SHELL } from "@/components/dashboard/shell/tokens"

type Props = {
	open: boolean
	onClose: () => void
}

type Gender = "Female" | "Male" | "Other"

const genders: Gender[] = ["Female", "Male", "Other"]

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
	<Typography
		sx={{
			fontSize: 12,
			fontWeight: 600,
			color: "text.secondary",
			mb: 0.75,
			letterSpacing: "0.01em",
		}}
	>
		{children}
	</Typography>
)

const inputSx = {
	"& .MuiOutlinedInput-root": {
		borderRadius: "10px",
		bgcolor: "#fff",
		fontSize: 14,
		"& fieldset": { borderColor: "divider" },
		"&:hover fieldset": { borderColor: "text.secondary" },
		"&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: "1px" },
	},
	"& .MuiOutlinedInput-input": {
		py: 1.25,
	},
}

const DoctorFormModal = ({ open, onClose }: Props) => {
	const [gender, setGender] = useState<Gender>("Female")
	const [specialties, setSpecialties] = useState<string[]>(["Cardiology"])

	const removeSpecialty = (s: string) =>
		setSpecialties((prev) => prev.filter((x) => x !== s))

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="md"
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
					<Typography
						sx={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}
					>
						Add a doctor
					</Typography>
					<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
						They&apos;ll receive an email to set their password on first login.
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
				{/* Profile photo upload row */}
				<Stack
					direction="row"
					sx={{
						alignItems: "center",
						gap: 2,
						mb: "22px",
					}}
				>
					<Box
						sx={{
							width: 80,
							height: 80,
							borderRadius: "16px",
							bgcolor: SHELL.bgSoft,
							color: "text.secondary",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 12,
							fontFamily: MONO,
							flexShrink: 0,
						}}
					>
						IMG
					</Box>
					<Box sx={{ flex: 1 }}>
						<Typography
							sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}
						>
							Profile photo
						</Typography>
						<Typography
							sx={{ fontSize: 12, color: "text.secondary", mt: "4px" }}
						>
							Uploaded to Cloudinary. Square, up to 5 MB.
						</Typography>
						<Button
							variant="outlined"
							size="small"
							sx={{
								mt: 1.25,
								bgcolor: "#fff",
								color: "text.primary",
								borderColor: "divider",
								fontSize: 12,
								"&:hover": {
									borderColor: "text.primary",
									bgcolor: SHELL.bgSoft,
								},
							}}
						>
							Upload
						</Button>
					</Box>
				</Stack>

				{/* Form grid */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
						columnGap: 3,
						rowGap: "18px",
					}}
				>
					<Box>
						<FieldLabel>Full name</FieldLabel>
						<TextField
							placeholder="Dr. Full Name"
							fullWidth
							size="small"
							sx={inputSx}
						/>
					</Box>
					<Box>
						<FieldLabel>Designation</FieldLabel>
						<TextField
							placeholder="Consultant Cardiologist"
							fullWidth
							size="small"
							sx={inputSx}
						/>
					</Box>
					<Box>
						<FieldLabel>Email (login)</FieldLabel>
						<TextField
							placeholder="name@medicare.app"
							fullWidth
							size="small"
							sx={inputSx}
						/>
					</Box>
					<Box>
						<FieldLabel>Contact</FieldLabel>
						<TextField
							placeholder="+880 1XXX XXX XXX"
							fullWidth
							size="small"
							sx={inputSx}
						/>
					</Box>
					<Box>
						<FieldLabel>BMDC Registration No.</FieldLabel>
						<TextField
							placeholder="A-00000"
							fullWidth
							size="small"
							sx={inputSx}
						/>
					</Box>
					<Box>
						<FieldLabel>Gender</FieldLabel>
						<Stack direction="row" sx={{ gap: 1 }}>
							{genders.map((g) => {
								const on = gender === g
								return (
									<Box
										key={g}
										onClick={() => setGender(g)}
										sx={{
											flex: 1,
											textAlign: "center",
											py: 1.1,
											borderRadius: "8px",
											border: "1px solid",
											borderColor: on ? "primary.main" : "divider",
											bgcolor: on ? "primary.light" : "#fff",
											color: on ? "primary.main" : "text.primary",
											fontWeight: on ? 600 : 500,
											fontSize: 13,
											cursor: "pointer",
											transition: "all 140ms",
											"&:hover": {
												borderColor: on ? "primary.main" : "text.primary",
											},
										}}
									>
										{g}
									</Box>
								)
							})}
						</Stack>
					</Box>
					<Box>
						<FieldLabel>Experience (yrs)</FieldLabel>
						<TextField
							type="number"
							placeholder="0"
							fullWidth
							size="small"
							sx={inputSx}
						/>
					</Box>
					<Box>
						<FieldLabel>Appointment fee (৳)</FieldLabel>
						<TextField
							type="number"
							placeholder="1000"
							fullWidth
							size="small"
							sx={inputSx}
						/>
					</Box>

					{/* Full-row fields */}
					<Box sx={{ gridColumn: { sm: "1 / -1" } }}>
						<FieldLabel>Current workplace</FieldLabel>
						<TextField
							placeholder="Hospital / clinic name"
							fullWidth
							size="small"
							sx={inputSx}
						/>
					</Box>
					<Box sx={{ gridColumn: { sm: "1 / -1" } }}>
						<FieldLabel>Specialties</FieldLabel>
						<Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
							{specialties.map((s) => (
								<Stack
									key={s}
									direction="row"
									sx={{
										alignItems: "center",
										gap: 0.75,
										px: 1.5,
										py: 0.75,
										borderRadius: 999,
										bgcolor: "primary.light",
										color: "primary.main",
										border: "1px solid",
										borderColor: "primary.main",
										fontSize: 12,
										fontWeight: 600,
									}}
								>
									<Box component="span">{s}</Box>
									<Box
										component="button"
										onClick={() => removeSpecialty(s)}
										sx={{
											border: "none",
											bgcolor: "transparent",
											color: "primary.main",
											cursor: "pointer",
											fontSize: 14,
											lineHeight: 1,
											p: 0,
											display: "inline-flex",
											alignItems: "center",
										}}
									>
										×
									</Box>
								</Stack>
							))}
							<Box
								component="button"
								sx={{
									px: 1.5,
									py: 0.75,
									borderRadius: 999,
									bgcolor: "transparent",
									color: "text.secondary",
									border: "1px dashed",
									borderColor: "divider",
									fontSize: 12,
									fontWeight: 600,
									cursor: "pointer",
									"&:hover": {
										borderColor: "text.primary",
										color: "text.primary",
									},
								}}
							>
								+ Add specialty
							</Box>
						</Stack>
					</Box>
					<Box sx={{ gridColumn: { sm: "1 / -1" } }}>
						<FieldLabel>Qualification</FieldLabel>
						<TextField
							placeholder="MBBS, FCPS (Cardiology)…"
							fullWidth
							size="small"
							sx={inputSx}
						/>
					</Box>
				</Box>
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
				<Button onClick={onClose}>Create doctor</Button>
			</DialogActions>
		</Dialog>
	)
}

export default DoctorFormModal
