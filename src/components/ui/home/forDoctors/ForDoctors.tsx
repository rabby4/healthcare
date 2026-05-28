import { Box, Button, Container, Stack, Typography } from "@mui/material"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import { MONO } from "../SectionHead"

const perks = [
	"Build your weekly availability in minutes",
	"Patient health data + reports ready before the call",
	"Weekly payouts, transparent breakdown",
	"Earn from anywhere — no chamber required",
]

const earnings = [
	{ lbl: "Consultations", val: "86" },
	{ lbl: "Avg. fee", val: "৳ 1,250" },
	{ lbl: "Gross earnings", val: "৳ 107,500" },
	{ lbl: "Rating", val: "4.8 ★" },
]

const ForDoctors = () => {
	return (
		<Box component="section" id="for-doctors" sx={{ py: { xs: 9, md: 15 } }}>
			<Container>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
						borderRadius: "28px",
						overflow: "hidden",
						bgcolor: "primary.main",
						color: "#fff",
					}}
				>
					{/* Left */}
					<Box sx={{ p: { xs: 4, md: 8 } }}>
						<Typography sx={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
							For doctors
						</Typography>
						<Typography variant="h2" sx={{ color: "#fff", mt: 2 }}>
							Grow your practice
							<br />
							without growing your overhead.
						</Typography>
						<Typography sx={{ color: "rgba(255,255,255,0.8)", mt: 2.25, maxWidth: 480, fontSize: 16, lineHeight: 1.55 }}>
							Set your own hours, your own fees. We handle the booking, the
							payments, the prescription pad, and the follow-up reminders. You
							consult.
						</Typography>

						<Stack sx={{ gap: 1.5, my: 4 }}>
							{perks.map((p) => (
								<Stack key={p} direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
									<Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
										<CheckRoundedIcon sx={{ fontSize: 14 }} />
									</Box>
									<Typography sx={{ fontSize: 15, color: "rgba(255,255,255,0.95)" }}>
										{p}
									</Typography>
								</Stack>
							))}
						</Stack>

						<Button
							href="/register"
							sx={{ bgcolor: "#fff", color: "primary.main", px: 3.5, py: 1.75, fontSize: 15, "&:hover": { bgcolor: "#f1f5f5" } }}
						>
							Apply to join →
						</Button>
					</Box>

					{/* Right */}
					<Box
						sx={{
							bgcolor: "rgba(0,0,0,0.15)",
							p: { xs: 4, md: 8 },
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							borderLeft: { md: "1px solid rgba(255,255,255,0.1)" },
						}}
					>
						<Typography sx={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", mb: 1 }}>
							Average doctor, last 30 days
						</Typography>
						{earnings.map((e, i) => (
							<Stack
								key={e.lbl}
								direction="row"
								sx={{
									justifyContent: "space-between",
									alignItems: "baseline",
									py: 2,
									borderBottom: i === earnings.length - 1 ? "none" : "1px dashed rgba(255,255,255,0.18)",
								}}
							>
								<Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
									{e.lbl}
								</Typography>
								<Typography sx={{ fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
									{e.val}
								</Typography>
							</Stack>
						))}
					</Box>
				</Box>
			</Container>
		</Box>
	)
}

export default ForDoctors
