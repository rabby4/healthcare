import { Box, Container, Typography } from "@mui/material"
import { SectionHead } from "../SectionHead"

const stats = [
	{ num: "30,420", suffix: "", lbl: "Consultations completed" },
	{ num: "240", suffix: "+", lbl: "Verified specialists onboard" },
	{ num: "96", suffix: "%", lbl: "Patients who'd book again" },
	{ num: "4.8", suffix: "★", lbl: "Average doctor rating" },
]

const Stats = () => {
	return (
		<Box component="section" sx={{ py: { xs: 9, md: 15 }, bgcolor: "text.primary" }}>
			<Container>
				<SectionHead
					light
					eyebrow="By the numbers"
					title="Quiet, careful work at scale."
				/>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
						gap: "1px",
						bgcolor: "rgba(255,255,255,0.1)",
						borderRadius: "20px",
						overflow: "hidden",
					}}
				>
					{stats.map((s) => (
						<Box key={s.lbl} sx={{ bgcolor: "text.primary", p: "36px 28px" }}>
							<Typography sx={{ fontSize: { xs: 40, md: 54 }, fontWeight: 300, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
								{s.num}
								<Box component="span" sx={{ color: "#16A085", fontWeight: 500 }}>
									{s.suffix}
								</Box>
							</Typography>
							<Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.6)", mt: 2, maxWidth: 200 }}>
								{s.lbl}
							</Typography>
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	)
}

export default Stats
