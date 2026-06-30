import { Box, Container, Typography } from "@mui/material"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded"
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded"
import { MONO, SectionHead } from "../SectionHead"

const steps = [
	{
		num: "01 · FIND",
		title: "Search by specialty.",
		desc: "Filter by fee, rating, or years of experience. See live availability for the next 7 days.",
		Icon: SearchRoundedIcon,
	},
	{
		num: "02 · BOOK",
		title: "Pick a 30-min slot.",
		desc: "One tap to reserve. Your slot is held for 30 minutes while you confirm payment, then it's yours.",
		Icon: CalendarMonthRoundedIcon,
	},
	{
		num: "03 · CONSULT",
		title: "Meet over secure video.",
		desc: "Encrypted Agora video call. Share medical reports and chat alongside the conversation.",
		Icon: VideocamRoundedIcon,
	},
	{
		num: "04 · PRESCRIPTION",
		title: "Get a signed Rx.",
		desc: "Digital prescription delivered to your dashboard. Download as PDF. Follow-up booked in one tap.",
		Icon: DescriptionRoundedIcon,
	},
]

const HowItWorks = () => {
	return (
		<Box component="section" id="how" sx={{ py: { xs: 9, md: 15 }, bgcolor: "secondary.light" }}>
			<Container>
				<SectionHead
					eyebrow="How it works"
					title="From search to prescription in four steps."
					sub="A complete telemedicine flow, designed to feel like booking a ride, not navigating a hospital."
				/>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
						gap: "1px",
						bgcolor: "divider",
						border: "1px solid",
						borderColor: "divider",
					}}
				>
					{steps.map(({ num, title, desc, Icon }) => (
						<Box key={num} sx={{ bgcolor: "background.default", p: "36px 28px 40px" }}>
							<Typography sx={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.14em", color: "primary.main", fontWeight: 500, mb: 4.5 }}>
								{num}
							</Typography>
							<Typography sx={{ fontSize: 22, fontWeight: 600, color: "text.primary", letterSpacing: "-0.01em", mb: 1.5 }}>
								{title}
							</Typography>
							<Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6 }}>
								{desc}
							</Typography>
							<Box
								sx={{
									mt: 3.5,
									width: 38,
									height: 38,
									borderRadius: "10px",
									bgcolor: "primary.light",
									color: "primary.main",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Icon sx={{ fontSize: 20 }} />
							</Box>
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	)
}

export default HowItWorks
