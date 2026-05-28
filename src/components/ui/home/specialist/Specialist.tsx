import { Box, Container, Typography } from "@mui/material"
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded"
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded"
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded"
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded"
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded"
import AirRoundedIcon from "@mui/icons-material/AirRounded"
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded"
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded"
import { LinkArrow, MONO, SectionHead } from "../SectionHead"

const specialties = [
	{ name: "Cardiology", count: 48, Icon: FavoriteBorderRoundedIcon },
	{ name: "Neurology", count: 32, Icon: PsychologyRoundedIcon },
	{ name: "Pediatrics", count: 29, Icon: ChildCareRoundedIcon },
	{ name: "Ophthalmology", count: 21, Icon: VisibilityRoundedIcon },
	{ name: "Dental", count: 36, Icon: MedicalServicesRoundedIcon },
	{ name: "Pulmonology", count: 18, Icon: AirRoundedIcon },
	{ name: "General Medicine", count: 54, Icon: HealthAndSafetyRoundedIcon },
	{ name: "Orthopedics", count: 22, Icon: AccessibilityNewRoundedIcon },
]

const Specialist = () => {
	return (
		<Box component="section" id="specialties" sx={{ py: { xs: 9, md: 15 } }}>
			<Container>
				<SectionHead
					eyebrow="Specialties"
					title="Care for every part of you."
					sub="18 medical specialties, from primary care to highly specialized consultations."
					action={<LinkArrow href="/doctors">View all →</LinkArrow>}
				/>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
						gap: 1.75,
					}}
				>
					{specialties.map(({ name, count, Icon }) => (
						<Box
							key={name}
							component="a"
							href={`/doctors?specialties=${encodeURIComponent(name)}`}
							sx={{
								textDecoration: "none",
								bgcolor: "#fff",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "18px",
								p: "24px 20px",
								display: "flex",
								flexDirection: "column",
								gap: 2,
								transition: "transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
								"&:hover": {
									transform: "translateY(-2px)",
									borderColor: "primary.main",
									boxShadow: "0 12px 24px -12px rgba(14, 124, 123, 0.2)",
								},
							}}
						>
							<Box
								sx={{
									width: 44,
									height: 44,
									borderRadius: "12px",
									bgcolor: "primary.light",
									color: "primary.main",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Icon />
							</Box>
							<Box>
								<Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
									{name}
								</Typography>
								<Typography sx={{ fontFamily: MONO, fontSize: 12, color: "secondary.main", letterSpacing: "0.04em", mt: 0.25 }}>
									{count} doctors
								</Typography>
							</Box>
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	)
}

export default Specialist
