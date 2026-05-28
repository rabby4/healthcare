import { Box, Button, Container, Stack, Typography } from "@mui/material"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded"
import { MONO } from "../SectionHead"

const trust = [
	{ num: "240+", lbl: "verified doctors" },
	{ num: "18", lbl: "specialties" },
	{ num: "4.8★", lbl: "avg. rating" },
	{ num: "30k+", lbl: "consultations" },
]

const phoneCards = [
	{ initials: "AR", name: "Dr. Asma Rahman", spec: "Cardiologist · FCPS", meta: "★ 4.9 · 14y exp", fee: "৳ 1,500", grad: "linear-gradient(135deg, #0E7C7B, #16A085)", featured: true },
	{ initials: "TH", name: "Dr. Tanvir Hossain", spec: "Cardiologist · MD", meta: "★ 4.8 · 11y exp", fee: "৳ 1,200", grad: "linear-gradient(135deg, #2A6FB5, #4A90D9)" },
	{ initials: "MI", name: "Dr. Mehnaz Iqbal", spec: "Cardiologist · DM", meta: "★ 4.7 · 9y exp", fee: "৳ 1,000", grad: "linear-gradient(135deg, #7B4DA8, #A26CC8)" },
]

const SearchField = ({ label, value }: { label: string; value: string }) => (
	<Box
		sx={{
			px: 2,
			py: 1.5,
			borderRadius: "14px",
			cursor: "pointer",
			transition: "background 160ms",
			"&:hover": { bgcolor: "secondary.light" },
		}}
	>
		<Typography sx={{ fontSize: 11, color: "secondary.main", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
			{label}
		</Typography>
		<Stack direction="row" sx={{ alignItems: "center", gap: 0.75, mt: 0.5 }}>
			<Typography sx={{ fontSize: 14, color: "text.primary", fontWeight: 500 }}>
				{value}
			</Typography>
			<KeyboardArrowDownRoundedIcon sx={{ fontSize: 16, color: "secondary.main", ml: "auto" }} />
		</Stack>
	</Box>
)

const FloatCard = ({
	icon,
	title,
	value,
	sx,
	urgent,
}: {
	icon: React.ReactNode
	title: string
	value: string
	sx?: object
	urgent?: boolean
}) => (
	<Stack
		direction="row"
		sx={{
			position: "absolute",
			bgcolor: "#fff",
			borderRadius: "16px",
			px: 2,
			py: 1.75,
			alignItems: "center",
			gap: 1.5,
			boxShadow: "0 20px 40px -12px rgba(15, 30, 46, 0.22), 0 0 0 1px rgba(15, 30, 46, 0.04)",
			...sx,
		}}
	>
		<Box
			sx={{
				width: 38,
				height: 38,
				borderRadius: "10px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
				bgcolor: urgent ? "rgba(217, 98, 74, 0.12)" : "primary.light",
				color: urgent ? "error.main" : "primary.main",
			}}
		>
			{icon}
		</Box>
		<Box>
			<Typography sx={{ fontSize: 11, color: "secondary.main", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
				{title}
			</Typography>
			<Typography sx={{ fontSize: 14, fontWeight: 700, color: "text.primary", mt: 0.25 }}>
				{value}
			</Typography>
		</Box>
	</Stack>
)

const HeroSection = () => {
	return (
		<Box
			sx={{
				position: "relative",
				overflow: "hidden",
				background:
					"radial-gradient(ellipse 1200px 700px at 80% -10%, rgba(14, 124, 123, 0.08), transparent 60%), linear-gradient(180deg, #FAFBFC 0%, #F4F6F8 100%)",
				py: { xs: 7, md: 14 },
			}}
		>
			<Container>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 460px" },
						gap: { xs: 6, md: 12 },
						alignItems: "center",
					}}
				>
					{/* Left */}
					<Box>
						<Stack direction="row" sx={{ alignItems: "center", gap: 1.25, mb: 3 }}>
							<Box sx={{ width: 24, height: "1px", bgcolor: "primary.main" }} />
							<Typography sx={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "primary.main" }}>
								Telemedicine · Bangladesh
							</Typography>
						</Stack>

						<Typography variant="h1" sx={{ fontSize: { xs: 40, sm: 54, md: 70 } }}>
							The doctor you need,
							<br />
							<Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
								in 3 taps.
							</Box>
						</Typography>

						<Typography sx={{ mt: 3, maxWidth: 540, fontSize: { xs: 16, md: 19 }, lineHeight: 1.55, color: "text.secondary" }}>
							Book verified specialists online. Pay securely in BDT, meet over
							encrypted video, and walk away with a signed digital prescription —
							no waiting rooms, no phone trees.
						</Typography>

						{/* Search */}
						<Box
							sx={{
								mt: 4.5,
								bgcolor: "#fff",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "20px",
								p: 1,
								display: "grid",
								gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr auto" },
								gap: 0.5,
								maxWidth: 580,
								boxShadow: "0 24px 48px -16px rgba(15, 30, 46, 0.12)",
							}}
						>
							<SearchField label="Specialty" value="Cardiology" />
							<SearchField label="Date" value="Today, 27 May" />
							<Button href="/doctors" startIcon={<SearchRoundedIcon />} sx={{ borderRadius: "14px", px: 3 }}>
								Search
							</Button>
						</Box>

						{/* Trust */}
						<Stack direction="row" sx={{ flexWrap: "wrap", gap: "20px 36px", mt: 4.5, alignItems: "baseline" }}>
							{trust.map((t) => (
								<Stack key={t.lbl} direction="row" sx={{ alignItems: "baseline", gap: 0.75 }}>
									<Typography sx={{ fontSize: 26, fontWeight: 300, color: "text.primary", letterSpacing: "-0.02em" }}>
										{t.num}
									</Typography>
									<Typography sx={{ fontSize: 13, color: "secondary.main" }}>
										{t.lbl}
									</Typography>
								</Stack>
							))}
						</Stack>
					</Box>

					{/* Right: phone art */}
					<Box
						sx={{
							position: "relative",
							height: 540,
							width: "100%",
							maxWidth: 460,
							mx: "auto",
							display: { xs: "none", sm: "block" },
							order: { xs: -1, md: 0 },
						}}
					>
						<Box
							sx={{
								position: "absolute",
								left: { sm: 30 },
								top: 0,
								width: 320,
								height: 520,
								bgcolor: "#0a0a0a",
								borderRadius: "44px",
								p: 1.25,
								boxShadow: "0 40px 80px -20px rgba(15, 30, 46, 0.35), 0 0 0 1px rgba(15, 30, 46, 0.04)",
								transform: "rotate(-2deg)",
							}}
						>
							<Box
								sx={{
									width: "100%",
									height: "100%",
									bgcolor: "secondary.light",
									borderRadius: "34px",
									overflow: "hidden",
									position: "relative",
									pt: "38px",
									px: 2.25,
									pb: 2.25,
								}}
							>
								<Box sx={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 80, height: 22, bgcolor: "#0a0a0a", borderRadius: "12px" }} />
								<Typography sx={{ fontSize: 18, fontWeight: 600, color: "text.primary", mb: 1.75 }}>
									Top cardiologists
								</Typography>
								<Stack direction="row" sx={{ alignItems: "center", gap: 1, px: 1.5, py: 1.25, bgcolor: "#fff", borderRadius: "12px", border: "1px solid", borderColor: "divider", mb: 1.75 }}>
									<SearchRoundedIcon sx={{ fontSize: 14, color: "secondary.main" }} />
									<Typography sx={{ fontSize: 12, color: "secondary.main" }}>
										Search doctors…
									</Typography>
								</Stack>

								{phoneCards.map((c) => (
									<Stack
										key={c.initials}
										direction="row"
										sx={{
											bgcolor: "#fff",
											borderRadius: "14px",
											p: 1.5,
											gap: 1.25,
											mb: 1,
											border: c.featured ? "1.5px solid" : "1px solid",
											borderColor: c.featured ? "primary.main" : "divider",
											boxShadow: c.featured ? "0 10px 24px -8px rgba(14, 124, 123, 0.25)" : "none",
										}}
									>
										<Box sx={{ width: 40, height: 40, borderRadius: "50%", background: c.grad, color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
											{c.initials}
										</Box>
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.primary" }}>
												{c.name}
											</Typography>
											<Typography sx={{ fontSize: 10, color: "text.secondary", mt: "1px" }}>
												{c.spec}
											</Typography>
											<Stack direction="row" sx={{ justifyContent: "space-between", mt: 0.75 }}>
												<Typography sx={{ fontSize: 10, color: "secondary.main" }}>
													{c.meta}
												</Typography>
												<Typography sx={{ fontSize: 11, fontWeight: 700, color: "primary.main" }}>
													{c.fee}
												</Typography>
											</Stack>
										</Box>
									</Stack>
								))}
							</Box>
						</Box>

						<FloatCard
							icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
							title="Next slot"
							value="Today · 11:00"
							sx={{ top: 70, right: -10, transform: "rotate(3deg)" }}
						/>
						<FloatCard
							icon={<VideocamRoundedIcon sx={{ fontSize: 18 }} />}
							title="Encrypted video"
							value="End-to-end secure"
							urgent
							sx={{ bottom: 60, left: -20, transform: "rotate(-2deg)" }}
						/>
					</Box>
				</Box>
			</Container>
		</Box>
	)
}

export default HeroSection
