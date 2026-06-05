"use client"

import { Box, Menu, MenuItem, Stack, Typography } from "@mui/material"
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded"
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import AvatarGradient from "./AvatarGradient"
import { logoutUser } from "@/services/actions/logoutUser"
import { AvatarVariant, MONO, SHELL } from "./tokens"

type Props = {
	roleVariant: AvatarVariant
	userInitials: string
	userName: string
}

const labelFor = (seg: string) =>
	seg
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase())

const Topbar = ({ roleVariant, userInitials, userName }: Props) => {
	const pathname = usePathname()
	const router = useRouter()
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)

	const crumbs = useMemo(() => {
		const segs = pathname.replace(/^\/+|\/+$/g, "").split("/")
		const friendly = segs.map(labelFor)
		// Treat /dashboard/<role>/ root as "Overview"
		if (segs.length === 2 && segs[0] === "dashboard") {
			friendly.push("Overview")
		}
		return friendly
	}, [pathname])

	const handleLogout = () => {
		setAnchor(null)
		logoutUser(router)
	}

	return (
		<Box
			component="header"
			sx={{
				height: 64,
				bgcolor: "#fff",
				borderBottom: "1px solid",
				borderColor: "divider",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 2,
				px: { xs: 2, md: 4 },
				position: "sticky",
				top: 0,
				zIndex: 30,
			}}
		>
			<Stack
				direction="row"
				sx={{
					alignItems: "center",
					gap: 1.25,
					fontFamily: MONO,
					fontSize: 13,
					color: "text.secondary",
					letterSpacing: "0.04em",
					minWidth: 0,
					flex: 1,
				}}
			>
				{crumbs.map((c, i) => (
					<Box
						key={`${c}-${i}`}
						component="span"
						sx={{
							display: "inline-flex",
							alignItems: "center",
							gap: 1.25,
							color: i === crumbs.length - 1 ? "text.primary" : "text.secondary",
							whiteSpace: "nowrap",
						}}
					>
						{i > 0 && (
							<Box component="span" sx={{ color: "divider" }}>
								/
							</Box>
						)}
						<Box component="span">{c}</Box>
					</Box>
				))}
			</Stack>

			<Stack
				direction="row"
				sx={{
					display: { xs: "none", lg: "flex" },
					alignItems: "center",
					gap: 1.25,
					px: 1.75,
					py: 1,
					bgcolor: SHELL.bgSoft,
					border: "1px solid transparent",
					borderRadius: "12px",
					minWidth: 320,
					color: "text.secondary",
					fontSize: 13,
					cursor: "text",
				}}
			>
				<SearchRoundedIcon sx={{ fontSize: 16 }} />
				<Box component="span">Search anything…</Box>
				<Box
					component="span"
					sx={{
						ml: "auto",
						fontFamily: MONO,
						fontSize: 11,
						px: 0.75,
						py: "1px",
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "4px",
						color: "text.secondary",
					}}
				>
					⌘K
				</Box>
			</Stack>

			<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
				<Box
					sx={{
						width: 36,
						height: 36,
						borderRadius: "10px",
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						color: "text.secondary",
						position: "relative",
						cursor: "pointer",
						"&:hover": { bgcolor: SHELL.bgSoft, color: "text.primary" },
					}}
				>
					<NotificationsNoneRoundedIcon sx={{ fontSize: 20 }} />
				</Box>

				<Stack
					direction="row"
					onClick={(e) => setAnchor(e.currentTarget)}
					sx={{
						alignItems: "center",
						gap: 1.25,
						pl: "4px",
						pr: 1.75,
						py: "4px",
						borderRadius: 999,
						bgcolor: SHELL.bgSoft,
						cursor: "pointer",
						"&:hover": { bgcolor: SHELL.bgSoft2 },
					}}
				>
					<AvatarGradient initials={userInitials} variant={roleVariant} size={30} />
					<Typography
						sx={{
							fontSize: 13,
							fontWeight: 600,
							color: "text.primary",
							display: { xs: "none", sm: "block" },
						}}
					>
						{userName}
					</Typography>
					<KeyboardArrowDownRounded sx={{ fontSize: 16, color: "text.secondary" }} />
				</Stack>

				<Menu
					anchorEl={anchor}
					open={Boolean(anchor)}
					onClose={() => setAnchor(null)}
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					transformOrigin={{ vertical: "top", horizontal: "right" }}
					slotProps={{
						paper: {
							sx: {
								mt: 1,
								minWidth: 200,
								borderRadius: "12px",
								border: "1px solid",
								borderColor: "divider",
								boxShadow: "0 24px 48px -16px rgba(15, 30, 46, 0.18)",
							},
						},
					}}
				>
					<MenuItem
						component={Link}
						href="/dashboard/change-password"
						onClick={() => setAnchor(null)}
						sx={{ fontSize: 13 }}
					>
						Change password
					</MenuItem>
					<MenuItem
						component={Link}
						href="/"
						onClick={() => setAnchor(null)}
						sx={{ fontSize: 13 }}
					>
						Back to website
					</MenuItem>
					<MenuItem
						onClick={handleLogout}
						sx={{ fontSize: 13, color: SHELL.urgent }}
					>
						Sign out
					</MenuItem>
				</Menu>
			</Stack>
		</Box>
	)
}

export default Topbar
