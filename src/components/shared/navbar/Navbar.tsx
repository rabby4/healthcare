"use client"

import useUserInfo from "@/hooks/useUserInfo"
import { logoutUser } from "@/services/actions/logoutUser"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"

const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace"

const navLinks = [
	{ label: "Find a doctor", href: "/doctors" },
	{ label: "Specialties", href: "/#specialties" },
	{ label: "How it works", href: "/#how" },
	{ label: "For doctors", href: "/#for-doctors" },
]

const BrandMark = () => (
	<Box sx={{ position: "relative", width: 22, height: 22 }}>
		<Box
			sx={{
				position: "absolute",
				top: 0,
				left: "50%",
				transform: "translateX(-50%)",
				width: 6,
				height: 22,
				borderRadius: "3px",
				bgcolor: "primary.main",
			}}
		/>
		<Box
			sx={{
				position: "absolute",
				left: 0,
				top: "50%",
				transform: "translateY(-50%)",
				width: 22,
				height: 6,
				borderRadius: "3px",
				bgcolor: "primary.main",
			}}
		/>
	</Box>
)

const Navbar = () => {
	const userInfo = useUserInfo()
	const router = useRouter()
	const handleLogOut = () => {
		logoutUser(router)
	}

	return (
		<Box component="header">
			{/* Announcement strip */}
			<Box sx={{ bgcolor: "text.primary", py: "9px" }}>
				<Container>
					<Stack
						direction="row"
						sx={{ alignItems: "center", justifyContent: "center", gap: 1.5 }}
					>
						<Box
							sx={{
								width: 6,
								height: 6,
								borderRadius: "50%",
								bgcolor: "#16A085",
								boxShadow: "0 0 0 4px rgba(22, 160, 133, 0.2)",
							}}
						/>
						<Typography
							sx={{
								fontFamily: MONO,
								fontSize: 12,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								color: "rgba(255,255,255,0.85)",
							}}
						>
							240+ verified specialists · Available across Bangladesh · 24/7
						</Typography>
					</Stack>
				</Container>
			</Box>

			{/* Sticky nav */}
			<Box
				sx={{
					position: "sticky",
					top: 0,
					zIndex: 50,
					bgcolor: "rgba(255,255,255,0.86)",
					backdropFilter: "saturate(180%) blur(12px)",
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				<Container>
					<Stack
						direction="row"
						sx={{
							height: 72,
							alignItems: "center",
							justifyContent: "space-between",
							gap: 4,
						}}
					>
						<Stack
							component={Link}
							href="/"
							direction="row"
							sx={{
								alignItems: "center",
								gap: 1.25,
								textDecoration: "none",
								color: "text.primary",
							}}
						>
							<BrandMark />
							<Typography
								sx={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}
							>
								Medi
								<Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
									care
								</Box>
							</Typography>
						</Stack>

						<Stack
							direction="row"
							sx={{
								alignItems: "center",
								gap: 4,
								display: { xs: "none", md: "flex" },
							}}
						>
							{navLinks.map((item) => (
								<Typography
									key={item.label}
									component={Link}
									href={item.href}
									sx={{
										fontSize: 14,
										fontWeight: 500,
										color: "text.secondary",
										textDecoration: "none",
										transition: "color 140ms",
										"&:hover": { color: "text.primary" },
									}}
								>
									{item.label}
								</Typography>
							))}
						</Stack>

						<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
							{userInfo?.id ? (
								<>
									<Typography
										component={Link}
										href="/dashboard"
										sx={{
											fontSize: 14,
											fontWeight: 500,
											color: "text.primary",
											textDecoration: "none",
											display: { xs: "none", sm: "block" },
										}}
									>
										Dashboard
									</Typography>
									<Button onClick={handleLogOut} variant="outlined" color="error">
										Log out
									</Button>
								</>
							) : (
								<>
									<Typography
										component={Link}
										href="/login"
										sx={{
											fontSize: 14,
											fontWeight: 500,
											color: "text.primary",
											textDecoration: "none",
											display: { xs: "none", sm: "block" },
										}}
									>
										Log in
									</Typography>
									<Button component={Link} href="/register">
										Get started
									</Button>
								</>
							)}
						</Stack>
					</Stack>
				</Container>
			</Box>
		</Box>
	)
}

export default Navbar
