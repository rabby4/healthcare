import { Box, Container, Typography } from "@mui/material"
import { SectionHead } from "../SectionHead"

const faqs = [
	{
		q: "How do I book an appointment?",
		a: "Search by specialty, pick a doctor, choose any open 30-minute slot, and confirm. You'll have 30 minutes to complete payment before the slot is released back to availability.",
	},
	{
		q: "What if I miss my payment window?",
		a: "The slot is automatically freed and you're not charged. You can re-book any available time — we'll never bill you for an appointment you didn't actually keep.",
	},
	{
		q: "How does the video call work?",
		a: 'At your scheduled time, a "Join" button appears in your dashboard. Tap it. You\'ll be connected to your doctor over an encrypted Agora video call right in your browser.',
	},
	{
		q: "Can I get a prescription?",
		a: "Yes — when clinically appropriate. Your doctor issues a signed digital prescription right after the consultation, downloadable as PDF from your dashboard.",
	},
	{
		q: "Is my data private?",
		a: "All consultations are end-to-end encrypted. Medical records are encrypted at rest and never shared without your explicit consent.",
	},
	{
		q: "Which payment methods work?",
		a: "All major cards, bKash, Nagad, and bank transfers — processed securely through SSLCommerz. We never see or store your payment details.",
	},
]

const Faq = () => {
	return (
		<Box component="section" sx={{ py: { xs: 9, md: 15 }, bgcolor: "secondary.light" }}>
			<Container>
				<SectionHead eyebrow="FAQ" title="The short answers." />

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
						columnGap: 7,
						borderTop: "1px solid",
						borderColor: "divider",
					}}
				>
					{faqs.map((f) => (
						<Box key={f.q} sx={{ py: 3.5, borderBottom: "1px solid", borderColor: "divider" }}>
							<Typography sx={{ fontSize: 17, fontWeight: 600, color: "text.primary", letterSpacing: "-0.01em", mb: 1.25 }}>
								{f.q}
							</Typography>
							<Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6 }}>
								{f.a}
							</Typography>
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	)
}

export default Faq
