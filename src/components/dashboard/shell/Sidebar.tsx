"use client"

import { Box, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

import AvatarGradient from "./AvatarGradient"
import { AvatarVariant, MONO, SHELL } from "./tokens"

export type NavItem = {
	label: string
	href: string
	icon: ReactNode
	badge?: string | number
	matchExact?: boolean
}

export type NavGroup = {
	heading: string
	items: NavItem[]
}

type Props = {
	groups: NavGroup[]
	roleLabel: string
	roleVariant: AvatarVariant
	userName: string
	userInitials: string
}

const BrandMark = () => (
	<Box sx={{ position: "relative", width: 20, height: 20 }}>
		<Box
			sx={{
				position: "absolute",
				top: 0,
				left: "50%",
				transform: "translateX(-50%)",
				width: 5,
				height: 20,
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
				width: 20,
				height: 5,
				borderRadius: "3px",
				bgcolor: "primary.main",
			}}
		/>
	</Box>
)

const Sidebar = ({ groups, roleLabel, roleVariant, userName, userInitials }: Props) => {
	const pathname = usePathname()

	const isActive = (item: NavItem) => {
		if (item.matchExact) return pathname === item.href
		return pathname === item.href || pathname.startsWith(item.href + "/")
	}

	const roleColor = roleVariant === "purple" ? SHELL.purple : "primary.main"
	const roleBg = roleVariant === "purple" ? SHELL.purpleTint : "primary.light"

	return (
		<Box
			component="aside"
			sx={{
				bgcolor: "#fff",
				borderRight: "1px solid",
				borderColor: "divider",
				display: { xs: "none", md: "flex" },
				flexDirection: "column",
				position: "sticky",
				top: 0,
				height: "100vh",
				width: 252,
			}}
		>
			<Stack
				component={Link}
				href="/"
				direction="row"
				sx={{
					alignItems: "center",
					gap: 1.25,
					px: 3,
					py: 2.5,
					textDecoration: "none",
					color: "text.primary",
				}}
			>
				<BrandMark />
				<Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
					Medi
					<Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
						care
					</Box>
				</Typography>
			</Stack>

			<Stack
				direction="row"
				sx={{
					mx: 2,
					mb: 2,
					px: 1.5,
					py: 1.25,
					borderRadius: "12px",
					bgcolor: roleBg,
					alignItems: "center",
					gap: 1.25,
				}}
			>
				<AvatarGradient initials={userInitials} variant={roleVariant} size={32} />
				<Box sx={{ minWidth: 0 }}>
					<Typography
						sx={{
							fontSize: 13,
							fontWeight: 600,
							color: "text.primary",
							lineHeight: 1.2,
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{userName}
					</Typography>
					<Typography
						sx={{
							fontFamily: MONO,
							fontSize: 11,
							letterSpacing: "0.04em",
							textTransform: "uppercase",
							color: roleColor,
							lineHeight: 1.3,
						}}
					>
						{roleLabel}
					</Typography>
				</Box>
			</Stack>

			<Box sx={{ flex: 1, overflowY: "auto" }}>
				{groups.map((g) => (
					<Box key={g.heading}>
						<Typography
							sx={{
								px: 3,
								pt: 1.75,
								pb: 0.75,
								fontFamily: MONO,
								fontSize: 10,
								letterSpacing: "0.14em",
								color: "text.secondary",
								textTransform: "uppercase",
							}}
						>
							{g.heading}
						</Typography>
						<Stack component="ul" sx={{ listStyle: "none", m: 0, p: "0 12px", gap: "2px" }}>
							{g.items.map((item) => {
								const active = isActive(item)
								return (
									<Box component="li" key={item.href}>
										<Stack
											component={Link}
											href={item.href}
											direction="row"
											sx={{
												alignItems: "center",
												gap: 1.5,
												px: 1.5,
												py: 1.25,
												borderRadius: "12px",
												fontSize: 14,
												fontWeight: 500,
												textDecoration: "none",
												color: active ? "#fff" : "text.secondary",
												bgcolor: active ? "text.primary" : "transparent",
												transition: "background 140ms, color 140ms",
												"&:hover": {
													bgcolor: active ? "text.primary" : SHELL.bgSoft,
													color: active ? "#fff" : "text.primary",
												},
											}}
										>
											<Box
												component="span"
												sx={{
													display: "inline-flex",
													color: active ? "#fff" : "text.secondary",
												}}
											>
												{item.icon}
											</Box>
											<Box component="span">{item.label}</Box>
											{item.badge !== undefined && (
												<Box
													component="span"
													sx={{
														ml: "auto",
														fontSize: 11,
														fontWeight: 600,
														px: 1,
														py: "2px",
														borderRadius: 999,
														bgcolor: active
															? "rgba(255,255,255,0.15)"
															: "primary.light",
														color: active ? "#fff" : "primary.main",
														fontVariantNumeric: "tabular-nums",
													}}
												>
													{item.badge}
												</Box>
											)}
										</Stack>
									</Box>
								)
							})}
						</Stack>
					</Box>
				))}
			</Box>

			<Stack
				sx={{
					mt: "auto",
					px: 3,
					py: 2,
					borderTop: "1px solid",
					borderColor: "divider",
					gap: 1.25,
					fontSize: 13,
					color: "text.secondary",
				}}
			>
				<Box
					component={Link}
					href="/"
					sx={{
						textDecoration: "none",
						color: "inherit",
						"&:hover": { color: "text.primary" },
					}}
				>
					Back to website
				</Box>
			</Stack>
		</Box>
	)
}

export default Sidebar
