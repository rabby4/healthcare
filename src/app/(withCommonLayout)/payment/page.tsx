"use client"

import { Box, Button, Container, Stack, Typography } from "@mui/material"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded"
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded"
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded"
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ReactNode, Suspense } from "react"

import { MONO } from "@/components/ui/home/SectionHead"

type BtnDef = {
	label: string
	href: string
	icon?: ReactNode
	variant?: "primary" | "outlined"
}

type StatusConfig = {
	eyebrow: string
	title: string
	message: string
	icon: ReactNode
	accent: string // main color
	tint: string // soft background for the icon badge
	buttons: BtnDef[]
}

const CONFIG: Record<string, StatusConfig> = {
	success: {
		eyebrow: "Payment · Confirmed",
		title: "Payment successful",
		message:
			"Your appointment is confirmed and your slot is secured. You'll find it — along with the join link — in your appointments.",
		icon: <CheckCircleRoundedIcon sx={{ fontSize: 44 }} />,
		accent: "#0E7C7B",
		tint: "#E6F2F1",
		buttons: [
			{
				label: "View my appointments",
				href: "/dashboard/patient/appointments",
				icon: <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />,
				variant: "primary",
			},
			{
				label: "Find more doctors",
				href: "/doctors",
				icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 18 }} />,
				variant: "outlined",
			},
		],
	},
	cancel: {
		eyebrow: "Payment · Cancelled",
		title: "Payment cancelled",
		message:
			"You cancelled before completing payment, so nothing was charged. Your slot is held briefly — finish payment soon, or pick another time.",
		icon: <HighlightOffRoundedIcon sx={{ fontSize: 44 }} />,
		accent: "#B5811C",
		tint: "#FFF3D6",
		buttons: [
			{
				label: "Try booking again",
				href: "/doctors",
				icon: <ReplayRoundedIcon sx={{ fontSize: 18 }} />,
				variant: "primary",
			},
			{ label: "Back to home", href: "/", icon: <HomeRoundedIcon sx={{ fontSize: 18 }} />, variant: "outlined" },
		],
	},
	failed: {
		eyebrow: "Payment · Failed",
		title: "Payment failed",
		message:
			"We couldn't process your payment, so you haven't been charged. This is usually a temporary card or network issue — please try again.",
		icon: <ErrorOutlineRoundedIcon sx={{ fontSize: 44 }} />,
		accent: "#D9624A",
		tint: "#FDE9E4",
		buttons: [
			{
				label: "Try again",
				href: "/doctors",
				icon: <ReplayRoundedIcon sx={{ fontSize: 18 }} />,
				variant: "primary",
			},
			{ label: "Back to home", href: "/", icon: <HomeRoundedIcon sx={{ fontSize: 18 }} />, variant: "outlined" },
		],
	},
	unknown: {
		eyebrow: "Payment · Status",
		title: "We couldn't read your payment status",
		message:
			"Something looks off with this link. Check your appointments to confirm whether your payment went through.",
		icon: <HelpOutlineRoundedIcon sx={{ fontSize: 44 }} />,
		accent: "#465065",
		tint: "#F4F6F8",
		buttons: [
			{
				label: "Go to my appointments",
				href: "/dashboard/patient/appointments",
				icon: <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />,
				variant: "primary",
			},
			{ label: "Back to home", href: "/", icon: <HomeRoundedIcon sx={{ fontSize: 18 }} />, variant: "outlined" },
		],
	},
}

const PaymentStatusContent = () => {
	const statusParam = useSearchParams().get("status") || ""
	const cfg = CONFIG[statusParam] ?? CONFIG.unknown

	return (
		<Container
			sx={{
				minHeight: "70vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				py: { xs: 6, md: 10 },
			}}
		>
			<Stack
				sx={{
					width: "100%",
					maxWidth: 520,
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "24px",
					p: { xs: 4, md: 6 },
					textAlign: "center",
					alignItems: "center",
					boxShadow: "0 24px 48px -20px rgba(15, 30, 46, 0.12)",
				}}
			>
				{/* Icon badge */}
				<Box
					sx={{
						width: 88,
						height: 88,
						borderRadius: "50%",
						bgcolor: cfg.tint,
						color: cfg.accent,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						mb: 3,
					}}
				>
					{cfg.icon}
				</Box>

				{/* Eyebrow */}
				<Typography
					sx={{
						fontFamily: MONO,
						fontSize: 12,
						letterSpacing: "0.14em",
						textTransform: "uppercase",
						fontWeight: 600,
						color: cfg.accent,
						mb: 1.25,
					}}
				>
					{cfg.eyebrow}
				</Typography>

				{/* Title */}
				<Typography
					component="h1"
					sx={{
						fontSize: { xs: 26, md: 32 },
						fontWeight: 700,
						letterSpacing: "-0.02em",
						color: "text.primary",
						lineHeight: 1.15,
					}}
				>
					{cfg.title}
				</Typography>

				{/* Message */}
				<Typography
					sx={{
						mt: 2,
						fontSize: 15,
						lineHeight: 1.6,
						color: "text.secondary",
						maxWidth: 420,
					}}
				>
					{cfg.message}
				</Typography>

				{/* Buttons */}
				<Stack
					direction={{ xs: "column", sm: "row" }}
					sx={{
						gap: 1.5,
						mt: 4,
						width: "100%",
						flexWrap: "wrap",
						justifyContent: "center",
					}}
				>
					{cfg.buttons.map((b) => (
						<Button
							key={b.label}
							component={Link}
							href={b.href}
							startIcon={b.icon}
							variant={b.variant === "outlined" ? "outlined" : "contained"}
							sx={{
								px: 3,
								py: 1.25,
								fontSize: 14,
								whiteSpace: "nowrap",
								flexShrink: 0,
								...(b.variant === "outlined"
									? {
											bgcolor: "#fff",
											color: "text.primary",
											borderColor: "divider",
											"&:hover": { borderColor: "text.primary", bgcolor: "secondary.light" },
									  }
									: {}),
							}}
						>
							{b.label}
						</Button>
					))}
				</Stack>
			</Stack>
		</Container>
	)
}

const PaymentStatusPage = () => (
	<Suspense>
		<PaymentStatusContent />
	</Suspense>
)

export default PaymentStatusPage
