import { Box, Button, Container, Stack, Typography } from "@mui/material"
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import { LinkArrow, SectionHead } from "../SectionHead"

const doctors = [
	{
		initials: "AR",
		name: "Dr. Asma Rahman",
		spec: "Cardiologist · MBBS, FCPS",
		rating: "4.9",
		reviews: "312 reviews",
		exp: "14 yrs",
		tags: ["English · Bangla", "Heart failure", "Hypertension"],
		fee: "৳ 1,500",
		grad: "linear-gradient(135deg, #0E7C7B, #16A085)",
	},
	{
		initials: "TH",
		name: "Dr. Tanvir Hossain",
		spec: "Cardiologist · MD",
		rating: "4.8",
		reviews: "208 reviews",
		exp: "11 yrs",
		tags: ["English", "Arrhythmia", "Echo"],
		fee: "৳ 1,200",
		grad: "linear-gradient(135deg, #2A6FB5, #4A90D9)",
	},
	{
		initials: "MI",
		name: "Dr. Mehnaz Iqbal",
		spec: "Neurologist · DM, FCPS",
		rating: "4.9",
		reviews: "184 reviews",
		exp: "9 yrs",
		tags: ["English · Bangla", "Migraine", "Epilepsy"],
		fee: "৳ 1,400",
		grad: "linear-gradient(135deg, #7B4DA8, #A26CC8)",
	},
	{
		initials: "SK",
		name: "Dr. Sadia Khan",
		spec: "Pediatrician · MBBS, MCPS",
		rating: "4.9",
		reviews: "402 reviews",
		exp: "12 yrs",
		tags: ["Bangla", "Newborn care", "Vaccines"],
		fee: "৳ 900",
		grad: "linear-gradient(135deg, #C56A3F, #E59364)",
	},
]

const TopRatedDoctors = () => {
	return (
		<Box component="section" id="doctors" sx={{ py: { xs: 9, md: 15 } }}>
			<Container>
				<SectionHead
					eyebrow="Top rated"
					title="Meet a few of our doctors."
					sub="Hand-picked, verified, and reviewed by thousands of patients."
					action={<LinkArrow href="/doctors">Browse all doctors →</LinkArrow>}
				/>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
						gap: 2.5,
					}}
				>
					{doctors.map((d) => (
						<Stack
							key={d.initials}
							sx={{
								bgcolor: "#fff",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "22px",
								p: 3,
								gap: 2.5,
								transition: "transform 200ms ease, box-shadow 200ms ease",
								"&:hover": {
									transform: "translateY(-3px)",
									boxShadow: "0 24px 40px -20px rgba(15, 30, 46, 0.18)",
								},
							}}
						>
							<Stack direction="row" sx={{ alignItems: "flex-start", gap: 2 }}>
								<Box sx={{ width: 64, height: 64, borderRadius: "50%", background: d.grad, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 600, flexShrink: 0 }}>
									{d.initials}
								</Box>
								<Box>
									<Typography sx={{ fontSize: 17, fontWeight: 700, color: "text.primary", letterSpacing: "-0.01em" }}>
										{d.name}
									</Typography>
									<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
										{d.spec}
									</Typography>
									<Stack direction="row" sx={{ alignItems: "center", gap: 1, mt: 1.25, color: "secondary.main", fontSize: 12 }}>
										<Stack direction="row" sx={{ alignItems: "center", gap: 0.5, color: "text.primary", fontWeight: 600 }}>
											<StarRoundedIcon sx={{ fontSize: 14, color: "warning.main" }} />
											{d.rating}
										</Stack>
										<Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "divider" }} />
										<Typography sx={{ fontSize: 12, color: "secondary.main" }}>{d.reviews}</Typography>
										<Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "divider" }} />
										<Typography sx={{ fontSize: 12, color: "secondary.main" }}>{d.exp}</Typography>
									</Stack>
								</Box>
							</Stack>

							<Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
								{d.tags.map((t) => (
									<Box key={t} sx={{ fontSize: 11, letterSpacing: "0.04em", px: 1.25, py: 0.625, bgcolor: "secondary.light", color: "text.secondary", borderRadius: "999px", fontWeight: 500 }}>
										{t}
									</Box>
								))}
							</Stack>

							<Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", pt: 2.25, borderTop: "1px solid", borderColor: "divider" }}>
								<Typography sx={{ fontSize: 12, color: "secondary.main" }}>
									<Box component="span" sx={{ fontSize: 20, fontWeight: 700, color: "text.primary" }}>
										{d.fee}
									</Box>{" "}
									/ visit
								</Typography>
								<Button
									href="/doctors"
									sx={{ bgcolor: "text.primary", py: "9px", px: 2.25, fontSize: 13, "&:hover": { bgcolor: "primary.main" } }}
								>
									Book →
								</Button>
							</Stack>
						</Stack>
					))}
				</Box>
			</Container>
		</Box>
	)
}

export default TopRatedDoctors
