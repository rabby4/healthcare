import { Box, Container, Stack, Typography } from "@mui/material"
import { SectionHead } from "../SectionHead"

const testimonials = [
	{
		quote:
			"Booked a cardiologist on the bus to work and had my consultation that evening. The prescription was on my phone before I got home.",
		initials: "FR",
		name: "Farzana R.",
		meta: "Patient · Dhaka",
		grad: "linear-gradient(135deg, #0E7C7B, #16A085)",
	},
	{
		quote:
			"My daughter spiked a fever on a Saturday night. We had a pediatrician on video in twelve minutes — no clinic dash, no panic.",
		initials: "SI",
		name: "Shahriar I.",
		meta: "Patient · Chittagong",
		grad: "linear-gradient(135deg, #C56A3F, #E59364)",
	},
	{
		quote:
			"It feels like a real clinic visit — but better. The doctor pulled up my reports right there, walked me through everything, and I had a follow-up booked in seconds.",
		initials: "NA",
		name: "Nadia A.",
		meta: "Patient · Sylhet",
		grad: "linear-gradient(135deg, #2A6FB5, #4A90D9)",
	},
]

const Testimonials = () => {
	return (
		<Box component="section" sx={{ py: { xs: 9, md: 15 } }}>
			<Container>
				<SectionHead
					center
					eyebrow="Patient stories"
					title="Care that meets you where you are."
				/>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
						gap: 2.5,
					}}
				>
					{testimonials.map((t) => (
						<Stack
							key={t.initials}
							sx={{
								bgcolor: "#fff",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "22px",
								p: 3.5,
								gap: 2.5,
							}}
						>
							<Typography sx={{ fontSize: 18, color: "text.primary", letterSpacing: "-0.01em", lineHeight: 1.45 }}>
								<Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
									“
								</Box>
								{t.quote}
								<Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
									”
								</Box>
							</Typography>
							<Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mt: "auto" }}>
								<Box sx={{ width: 40, height: 40, borderRadius: "50%", background: t.grad, color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
									{t.initials}
								</Box>
								<Box>
									<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
										{t.name}
									</Typography>
									<Typography sx={{ fontSize: 12, color: "secondary.main", mt: "1px" }}>
										{t.meta}
									</Typography>
								</Box>
							</Stack>
						</Stack>
					))}
				</Box>
			</Container>
		</Box>
	)
}

export default Testimonials
