"use client"

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	Typography,
} from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded"
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded"
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined"
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded"
import AirRoundedIcon from "@mui/icons-material/AirRounded"
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined"
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import PublicRoundedIcon from "@mui/icons-material/PublicRounded"
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined"
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined"
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined"
import { ComponentType, useState } from "react"

import { MONO, SHELL } from "@/components/dashboard/shell/tokens"

type Props = {
	open: boolean
	onClose: () => void
}

const iconChoices: ComponentType<{ sx?: object }>[] = [
	FavoriteBorderRoundedIcon,
	PsychologyRoundedIcon,
	RemoveRedEyeOutlinedIcon,
	ChildCareRoundedIcon,
	AirRoundedIcon,
	HealthAndSafetyOutlinedIcon,
	AccessibilityNewRoundedIcon,
	AccessTimeRoundedIcon,
	PublicRoundedIcon,
	AddBoxOutlinedIcon,
	ShieldOutlinedIcon,
	MedicalServicesOutlinedIcon,
]

const FieldLabel = ({ children, sx }: { children: React.ReactNode; sx?: object }) => (
	<Typography
		sx={{
			fontSize: 12,
			fontWeight: 600,
			color: "text.secondary",
			mb: 0.75,
			...(sx || {}),
		}}
	>
		{children}
	</Typography>
)

const AddSpecialtyModal = ({ open, onClose }: Props) => {
	const [selected, setSelected] = useState(0)
	const uploadIndex = iconChoices.length // last cell is Upload

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
						Add a specialty
					</Typography>
					<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
						Pick an icon and give it a clear, patient-friendly name.
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
				<FieldLabel>Specialty name</FieldLabel>
				<TextField placeholder="e.g. Endocrinology" fullWidth size="small" />

				<FieldLabel sx={{ mt: 2, mb: 1 }}>Choose an icon</FieldLabel>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(6, 1fr)",
						gap: "8px",
					}}
				>
					{iconChoices.map((Icon, i) => {
						const on = selected === i
						return (
							<Box
								key={i}
								onClick={() => setSelected(i)}
								sx={{
									aspectRatio: "1 / 1",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									border: "1px solid",
									borderColor: on ? "primary.main" : "divider",
									bgcolor: on ? "primary.light" : "#fff",
									color: on ? "primary.main" : "text.secondary",
									borderRadius: "12px",
									cursor: "pointer",
									transition: "all 140ms ease",
									"&:hover": {
										borderColor: on ? "primary.main" : "text.primary",
										color: on ? "primary.main" : "text.primary",
									},
								}}
							>
								<Icon sx={{ fontSize: 22 }} />
							</Box>
						)
					})}

					{/* Upload cell */}
					<Box
						onClick={() => setSelected(uploadIndex)}
						sx={{
							aspectRatio: "1 / 1",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							border: "1px solid",
							borderColor: selected === uploadIndex ? "primary.main" : "divider",
							bgcolor: selected === uploadIndex ? "primary.light" : "#fff",
							color:
								selected === uploadIndex ? "primary.main" : "text.secondary",
							borderRadius: "12px",
							cursor: "pointer",
							fontFamily: MONO,
							fontSize: 11,
							transition: "all 140ms ease",
							"&:hover": {
								borderColor:
									selected === uploadIndex ? "primary.main" : "text.primary",
								color:
									selected === uploadIndex ? "primary.main" : "text.primary",
							},
						}}
					>
						Upload
					</Box>
				</Box>

				<Typography
					sx={{
						mt: "10px",
						fontSize: 11,
						color: "text.secondary",
					}}
				>
					Or upload a custom SVG/PNG via Cloudinary. Recommended 48×48.
				</Typography>
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
				<Button onClick={onClose}>Add specialty</Button>
			</DialogActions>
		</Dialog>
	)
}

export default AddSpecialtyModal
