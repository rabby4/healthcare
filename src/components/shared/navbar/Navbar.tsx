"use client"

import useUserInfo from "@/hooks/useUserInfo"
import { logoutUser } from "@/services/actions/logoutUser"
import { USER_ROLE } from "@/constants/role"
import {
	adminNav,
	doctorNav,
	patientNav,
	superAdminNav,
} from "@/components/dashboard/shell/navItems"
import {
	Avatar,
	Box,
	Button,
	Container,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Stack,
	Typography,
} from "@mui/material"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace"

const navLinks = [
	{ label: "Find a doctor", href: "/doctors" },
	{ label: "Specialties", href: "/#specialties" },
	{ label: "How it works", href: "/#how" },
	{ label: "For doctors", href: "/#for-doctors" },
]

// Initials from the email local-part (the token carries no name).
const initialsFromEmail = (email?: string) => {
	if (!email) return "U"
	const local = email.split("@")[0]
	const parts = local.split(/[._-]+/).filter(Boolean)
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
	return local.slice(0, 2).toUpperCase()
}

const roleLabel = (role?: string) => {
	switch (role) {
		case USER_ROLE.SUPER_ADMIN:
			return "Super admin"
		case USER_ROLE.ADMIN:
			return "Admin"
		case USER_ROLE.DOCTOR:
			return "Doctor"
		case USER_ROLE.PATIENT:
			return "Patient"
		default:
			return "Account"
	}
}

// Reuse the real dashboard navigation so the avatar menu links are always
// in sync with the actual routes (no duplicated, drift-prone link list).
const navGroupsForRole = (role?: string) => {
	switch (role) {
		case USER_ROLE.SUPER_ADMIN:
			return superAdminNav
		case USER_ROLE.ADMIN:
			return adminNav
		case USER_ROLE.DOCTOR:
			return doctorNav
		case USER_ROLE.PATIENT:
			return patientNav
		default:
			return []
	}
}

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
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const menuOpen = Boolean(anchorEl)

	const handleLogOut = () => {
		setAnchorEl(null)
		logoutUser(router)
	}

	const menuItems = navGroupsForRole(userInfo?.role).flatMap((g) => g.items)

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
									<IconButton
										onClick={(e) => setAnchorEl(e.currentTarget)}
										aria-label="Account menu"
										sx={{
											p: 0.5,
											borderRadius: "999px",
											border: "1px solid",
											borderColor: menuOpen ? "primary.main" : "divider",
											gap: 0.5,
											transition: "border-color 140ms",
											"&:hover": { borderColor: "primary.main" },
										}}
									>
										<Avatar
											sx={{
												width: 32,
												height: 32,
												fontSize: 13,
												fontWeight: 600,
												color: "#fff",
												background: "linear-gradient(135deg, #0E7C7B, #16A085)",
											}}
										>
											{initialsFromEmail(userInfo?.email)}
										</Avatar>
										<KeyboardArrowDownRoundedIcon
											sx={{
												fontSize: 18,
												color: "text.secondary",
												display: { xs: "none", sm: "block" },
											}}
										/>
									</IconButton>

									<Menu
										anchorEl={anchorEl}
										open={menuOpen}
										onClose={() => setAnchorEl(null)}
										onClick={() => setAnchorEl(null)}
										anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
										transformOrigin={{ vertical: "top", horizontal: "right" }}
										slotProps={{
											paper: {
												sx: {
													mt: 1,
													minWidth: 240,
													maxHeight: 460,
													borderRadius: "14px",
													boxShadow:
														"0 24px 48px -16px rgba(15, 30, 46, 0.22), 0 0 0 1px rgba(15, 30, 46, 0.04)",
												},
											},
										}}
									>
										<Box sx={{ px: 2, py: 1.5 }}>
											<Typography
												noWrap
												sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", maxWidth: 220 }}
											>
												{userInfo?.email}
											</Typography>
											<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
												{roleLabel(userInfo?.role)}
											</Typography>
										</Box>
										<Divider />

										{menuItems.map((item) => (
											<MenuItem
												key={item.href}
												component={Link}
												href={item.href}
												sx={{ fontSize: 14, py: 1, gap: 0.5 }}
											>
												<ListItemIcon sx={{ color: "text.secondary", minWidth: "0 !important" }}>
													{item.icon}
												</ListItemIcon>
												{item.href === "/dashboard" ? "Dashboard" : item.label}
											</MenuItem>
										))}

										<Divider />
										<MenuItem onClick={handleLogOut} sx={{ fontSize: 14, py: 1, gap: 0.5, color: "error.main" }}>
											<ListItemIcon sx={{ minWidth: "0 !important" }}>
												<LogoutOutlinedIcon sx={{ fontSize: 18, color: "error.main" }} />
											</ListItemIcon>
											Log out
										</MenuItem>
									</Menu>
								</>
							) : (
								<>
									<Button
										component={Link}
										href="/login"
										variant="outlined"
										sx={{
											display: { xs: "none", sm: "inline-flex" },
											borderColor: "divider",
											color: "text.primary",
											"&:hover": {
												borderColor: "text.primary",
												bgcolor: "secondary.light",
											},
										}}
									>
										Log in
									</Button>
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
