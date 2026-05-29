"use client"

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined"
import { Box, Stack, Typography } from "@mui/material"
import Link from "next/link"

import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"

const quickLinks = [
	{
		label: "My appointments",
		href: "/dashboard/doctor/appointments",
		icon: <CalendarMonthRoundedIcon sx={{ fontSize: 22 }} />,
		desc: "See today's slots and patient history",
	},
	{
		label: "My schedules",
		href: "/dashboard/doctor/schedules",
		icon: <AccessTimeRoundedIcon sx={{ fontSize: 22 }} />,
		desc: "Set your weekly availability",
	},
	{
		label: "My profile",
		href: "/dashboard/doctor/profile",
		icon: <PersonOutlinedIcon sx={{ fontSize: 22 }} />,
		desc: "Update bio, fee, specialties",
	},
]

const DoctorOverview = () => {
	return (
		<>
			<PageHead
				title="Doctor dashboard"
				subtitle="Welcome back — here's a quick look at your practice."
			/>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(3, 1fr)" },
					gap: 2,
					mb: 3,
				}}
			>
				<Stat label="Today's appointments" value="6" delta="" deltaLabel="2 upcoming · 4 done" deltaTrend="neutral" />
				<Stat label="This week" value="28" delta="↑ 12%" deltaLabel="vs last week" />
				<Stat label="Avg. rating" value="4.9 ★" delta="" deltaLabel="from 312 reviews" deltaTrend="neutral" />
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
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
					Doctor dashboard data integration coming soon — pages above use your existing flows.
				</Typography>
			</Box>
		</>
	)
}

export default DoctorOverview
