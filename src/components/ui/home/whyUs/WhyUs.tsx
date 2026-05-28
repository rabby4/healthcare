import { Box, Container, Typography } from "@mui/material"
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded"
import LockRoundedIcon from "@mui/icons-material/LockRounded"
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded"
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded"
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded"
import PublicRoundedIcon from "@mui/icons-material/PublicRounded"
import { SectionHead } from "../SectionHead"

const items = [
	{
		Icon: VerifiedUserRoundedIcon,
		title: "Verified doctors only",
		desc: "Every doctor on Medicare is BMDC-registered, identity-verified, and reviewed by our medical board before they see a single patient.",
	},
	{
		Icon: LockRoundedIcon,
		title: "Secure SSLCommerz payments",
		desc: "Cards, bKash, Nagad, bank transfers — all routed through SSLCommerz. No card data ever touches our servers.",
	},
	{
		Icon: VideocamRoundedIcon,
		title: "Encrypted video, Agora-powered",
		desc: "Studio-grade quality with end-to-end encryption. Share files, take notes, and pull up your medical history mid-call.",
	},
	{
		Icon: DescriptionRoundedIcon,
		title: "Digital prescriptions",
		desc: "Signed, dated, downloadable. Forward to any pharmacy, or use Medicare's partner network for same-day home delivery.",
	},
	{
		Icon: ScheduleRoundedIcon,
		title: "30-minute slot guarantee",
		desc: "Slots are held for 30 minutes while you pay. If you don't make it, the slot auto-frees — no being charged for what you didn't get.",
	},
	{
		Icon: PublicRoundedIcon,
		title: "Care anywhere in Bangladesh",
		desc: "From Dhaka to a tea garden in Sylhet — if you have signal, you have a doctor. No travel, no queues, no chamber fees.",
	},
]

const WhyUs = () => {
	return (
		<Box component="section" sx={{ py: { xs: 9, md: 15 }, bgcolor: "secondary.light" }}>
			<Container>
				<SectionHead
					eyebrow="Why Medicare"
					title="Built for trust. Designed for ease."
				/>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
						gap: "1px",
						bgcolor: "divider",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "24px",
						overflow: "hidden",
					}}
				>
					{items.map(({ Icon, title, desc }) => (
						<Box key={title} sx={{ bgcolor: "#fff", p: "32px 28px", display: "flex", flexDirection: "column", gap: 2 }}>
							<Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: "primary.light", color: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
								<Icon />
							</Box>
							<Typography sx={{ fontSize: 18, fontWeight: 600, color: "text.primary" }}>
								{title}
							</Typography>
							<Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6 }}>
								{desc}
							</Typography>
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	)
}

export default WhyUs
