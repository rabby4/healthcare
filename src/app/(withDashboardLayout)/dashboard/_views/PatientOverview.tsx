"use client"

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined"
import { Box, Stack, Typography } from "@mui/material"
import Link from "next/link"

import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"

const quickLinks = [
	{
		label: "My appointments",
		href: "/dashboard/patient/appointments",
		icon: <CalendarMonthRoundedIcon sx={{ fontSize: 22 }} />,
		desc: "Upcoming, in progress, and past consultations",
	},
	{
		label: "Browse doctors",
		href: "/doctors",
		icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 22 }} />,
		desc: "Find a specialist and book a slot",
	},
]

const PatientOverview = () => {
	return (
		<>
			<PageHead
				title="Welcome back"
				subtitle="Your appointments, prescriptions, and follow-ups — all in one place."
			/>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(3, 1fr)" },
					gap: 2,
					mb: 3,
				}}
			>
				<Stat label="Upcoming" value="2" delta="" deltaLabel="next: today 5:30 PM" deltaTrend="neutral" />
				<Stat label="Past visits" value="14" delta="" deltaLabel="all-time" deltaTrend="neutral" />
				<Stat label="Prescriptions" value="3" delta="" deltaLabel="active" deltaTrend="neutral" />
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
					gap: 2,
				}}
			>
				{quickLinks.map((l) => (
					<Link key={l.href} href={l.href} style={{ textDecoration: "none" }}>
						<Stack
							sx={{
								p: 3,
								bgcolor: "#fff",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "22px",
								gap: 1.5,
								transition: "all 140ms",
								"&:hover": {
									borderColor: "primary.main",
									boxShadow: "0 12px 24px -14px rgba(14,124,123,0.2)",
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
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{l.icon}
							</Box>
							<Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
								{l.label}
							</Typography>
							<Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.5 }}>
								{l.desc}
							</Typography>
							<Box
								sx={{
									fontFamily: MONO,
									fontSize: 11,
									letterSpacing: "0.06em",
									textTransform: "uppercase",
									color: "primary.main",
									fontWeight: 600,
									mt: 0.5,
								}}
							>
								Open →
							</Box>
						</Stack>
					</Link>
				))}
			</Box>

			<Box
				sx={{
					mt: 3,
					p: 3,
					bgcolor: SHELL.bgSoft,
					border: "1px dashed",
					borderColor: "divider",
					borderRadius: "16px",
					textAlign: "center",
				}}
			>
				<Typography sx={{ fontSize: 13, color: "text.secondary" }}>
					Patient dashboard data integration coming soon — your appointments page is wired to the live API.
				</Typography>
			</Box>
		</>
	)
}

export default PatientOverview
