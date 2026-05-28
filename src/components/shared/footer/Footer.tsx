import { Box, Container, Link, Stack, Typography } from "@mui/material"
import FacebookIcon from "@mui/icons-material/Facebook"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import TwitterIcon from "@mui/icons-material/Twitter"

const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace"

const columns = [
	{
		title: "For patients",
		links: ["Find a doctor", "Browse specialties", "My dashboard", "Pricing"],
	},
	{
		title: "For doctors",
		links: ["Apply to join", "Doctor portal", "Earnings", "Resources"],
	},
	{
		title: "Company",
		links: ["About", "Careers", "Press", "Contact"],
	},
	{
		title: "Legal",
		links: ["Terms of service", "Privacy policy", "Data security", "Refund policy"],
	},
]

const socials = [FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon]

const Footer = () => {
	return (
		<Box component="footer" sx={{ bgcolor: "text.primary", color: "rgba(255,255,255,0.7)", pt: 10, pb: 4.5 }}>
			<Container>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "1fr 1fr",
							md: "1.6fr repeat(4, 1fr)",
						},
						gap: 5,
						mb: 8,
					}}
				>
					<Box>
						<Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
							<Box sx={{ position: "relative", width: 22, height: 22 }}>
								<Box sx={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 6, height: 22, borderRadius: "3px", bgcolor: "#16A085" }} />
								<Box sx={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 22, height: 6, borderRadius: "3px", bgcolor: "#16A085" }} />
							</Box>
							<Typography sx={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>
								Medi
								<Box component="span" sx={{ fontWeight: 700, color: "#16A085" }}>
									care
								</Box>
							</Typography>
						</Stack>
						<Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, mt: 2.25, maxWidth: 280 }}>
							A modern telemedicine platform connecting patients across Bangladesh
							with verified specialists, secure payments, and digital prescriptions.
						</Typography>
					</Box>

					{columns.map((col) => (
						<Box key={col.title}>
							<Typography sx={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", mb: 2.25 }}>
								{col.title}
							</Typography>
							<Stack sx={{ gap: 1.5 }}>
								{col.links.map((link) => (
									<Link
										key={link}
										href="#"
										underline="none"
										sx={{ fontSize: 14, color: "rgba(255,255,255,0.78)", transition: "color 140ms", "&:hover": { color: "#fff" } }}
									>
										{link}
									</Link>
								))}
							</Stack>
						</Box>
					))}
				</Box>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					sx={{
						borderTop: "1px solid rgba(255,255,255,0.1)",
						pt: 3,
						alignItems: { xs: "flex-start", sm: "center" },
						justifyContent: "space-between",
						gap: 2,
					}}
				>
					<Typography sx={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
						© 2026 Medicare · BDT operations · BMDC-registered specialists
					</Typography>
					<Stack direction="row" sx={{ gap: 1.5 }}>
						{socials.map((Icon, i) => (
							<Box
								key={i}
								sx={{
									width: 36,
									height: 36,
									borderRadius: "50%",
									border: "1px solid rgba(255,255,255,0.18)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "rgba(255,255,255,0.7)",
									transition: "all 160ms",
									"&:hover": { bgcolor: "primary.main", borderColor: "primary.main", color: "#fff" },
								}}
							>
								<Icon sx={{ fontSize: 16 }} />
							</Box>
						))}
					</Stack>
					<Typography sx={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
						v1.0 · made in Dhaka
					</Typography>
				</Stack>
			</Container>
		</Box>
	)
}

export default Footer
