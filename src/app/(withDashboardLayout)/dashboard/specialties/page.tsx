"use client"

import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded"
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded"
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded"
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded"
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined"
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined"
import AirRoundedIcon from "@mui/icons-material/AirRounded"
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined"
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded"
import { ComponentType, useState } from "react"

import PageHead from "@/components/dashboard/shell/PageHead"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import AddSpecialtyModal from "./AddSpecialtyModal"

type Specialty = {
	name: string
	Icon: ComponentType<{ sx?: object }>
	count: string
}

const specialties: Specialty[] = [
	{ name: "Cardiology", Icon: FavoriteBorderRoundedIcon, count: "48 doctors" },
	{ name: "Neurology", Icon: PsychologyRoundedIcon, count: "32 doctors" },
	{ name: "Pediatrics", Icon: ChildCareRoundedIcon, count: "29 doctors" },
	{ name: "Ophthalmology", Icon: RemoveRedEyeOutlinedIcon, count: "21 doctors" },
	{ name: "Dental", Icon: MedicalServicesOutlinedIcon, count: "36 doctors" },
	{ name: "Pulmonology", Icon: AirRoundedIcon, count: "18 doctors" },
	{ name: "General Medicine", Icon: HealthAndSafetyOutlinedIcon, count: "54 doctors" },
	{ name: "Orthopedics", Icon: AccessibilityNewRoundedIcon, count: "22 doctors" },
]

const SpecialtiesPage = () => {
	const [addOpen, setAddOpen] = useState(false)

	return (
		<>
			<PageHead
				title="Specialties"
				subtitle="18 specialties · Each has an icon patients see when browsing."
				actions={<Button onClick={() => setAddOpen(true)}>+ Add specialty</Button>}
			/>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
					gap: 2,
				}}
			>
				{/* Add specialty (dashed) card */}
				<Box
					onClick={() => setAddOpen(true)}
					sx={{
						minHeight: 168,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 1,
						p: "22px",
						border: "1.5px dashed",
						borderColor: "divider",
						borderRadius: "22px",
						color: "text.secondary",
						cursor: "pointer",
						transition: "all 160ms ease",
						bgcolor: "transparent",
						"&:hover": {
							borderColor: "primary.main",
							bgcolor: SHELL.tealTint2,
							color: "primary.main",
						},
					}}
				>
					<AddRoundedIcon sx={{ fontSize: 28 }} />
					<Typography sx={{ fontSize: 13, fontWeight: 600 }}>Add specialty</Typography>
				</Box>

				{specialties.map((s) => {
					const Icon = s.Icon
					return (
						<Box
							key={s.name}
							sx={{
								position: "relative",
								bgcolor: "#fff",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "22px",
								p: "22px",
								transition: "all 160ms ease",
								"&:hover": {
									borderColor: "primary.main",
									boxShadow: "0 10px 28px -16px rgba(14, 124, 123, 0.35)",
								},
							}}
						>
							<IconButton
								size="small"
								sx={{
									position: "absolute",
									top: 16,
									right: 16,
									width: 28,
									height: 28,
									borderRadius: "8px",
									color: "text.secondary",
									"&:hover": { bgcolor: SHELL.bgSoft, color: "text.primary" },
								}}
							>
								<MoreHorizRoundedIcon sx={{ fontSize: 16 }} />
							</IconButton>

							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: "14px",
									bgcolor: "primary.light",
									color: "primary.main",
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
									mb: 1.75,
								}}
							>
								<Icon sx={{ fontSize: 24 }} />
							</Box>

							<Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
								{s.name}
							</Typography>
							<Typography
								sx={{
									mt: 0.5,
									fontSize: 12,
									color: "text.secondary",
									fontFamily: MONO,
									textTransform: "uppercase",
									letterSpacing: "0.04em",
								}}
							>
								{s.count}
							</Typography>
						</Box>
					)
				})}
			</Box>

			<AddSpecialtyModal open={addOpen} onClose={() => setAddOpen(false)} />
		</>
	)
}

export default SpecialtiesPage
