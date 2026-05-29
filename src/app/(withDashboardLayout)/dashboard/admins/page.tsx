"use client"

import {
	Box,
	Button,
	Stack,
	Typography,
} from "@mui/material"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import { useState } from "react"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"
import InviteAdminModal from "./InviteAdminModal"

type Admin = {
	initials: string
	variant: AvatarVariant
	name: string
	email: string
	role: "super" | "admin"
	addedBy: string
	lastActive: string
	status: "active" | "invited" | "revoked"
}

const admins: Admin[] = [
	{
		initials: "SA",
		variant: "purple",
		name: "Kamrul Hasan",
		email: "k.hasan@medicare.app",
		role: "super",
		addedBy: "System",
		lastActive: "Now",
		status: "active",
	},
	{
		initials: "AD",
		variant: "blue",
		name: "Anika Das",
		email: "a.das@medicare.app",
		role: "admin",
		addedBy: "Kamrul Hasan",
		lastActive: "12 min ago",
		status: "active",
	},
	{
		initials: "MR",
		variant: "blue",
		name: "Masud Rana",
		email: "m.rana@medicare.app",
		role: "admin",
		addedBy: "Kamrul Hasan",
		lastActive: "2 hours ago",
		status: "active",
	},
	{
		initials: "JK",
		variant: "orange",
		name: "Jamila Karim",
		email: "j.karim@medicare.app",
		role: "admin",
		addedBy: "Kamrul Hasan",
		lastActive: "—",
		status: "invited",
	},
	{
		initials: "SB",
		variant: "green",
		name: "Sabbir Bhuiyan",
		email: "s.bhuiyan@medicare.app",
		role: "admin",
		addedBy: "Kamrul Hasan",
		lastActive: "3 weeks ago",
		status: "revoked",
	},
]

const headers = ["Admin", "Role", "Added by", "Last active", "Status", "Actions"]

const renderActions = (status: Admin["status"], isYou: boolean) => {
	if (isYou) {
		return (
			<Typography sx={{ fontSize: 12, color: "text.secondary" }}>That&apos;s you</Typography>
		)
	}
	if (status === "active") {
		return (
			<>
				<ActionLink primary>Promote</ActionLink>
				<ActionLink danger>Revoke</ActionLink>
			</>
		)
	}
	if (status === "invited") {
		return (
			<>
				<ActionLink primary>Resend invite</ActionLink>
				<ActionLink danger>Cancel</ActionLink>
			</>
		)
	}
	return <ActionLink primary>Reinstate</ActionLink>
}

const ActionLink = ({
	children,
	primary,
	danger,
}: {
	children: React.ReactNode
	primary?: boolean
	danger?: boolean
}) => (
	<Box
		component="button"
		sx={{
			fontSize: 12,
			fontWeight: 600,
			px: 1,
			py: 0.5,
			borderRadius: "6px",
			border: "none",
			bgcolor: "transparent",
			cursor: "pointer",
			color: danger ? SHELL.urgent : primary ? "primary.main" : "text.secondary",
			"&:hover": { bgcolor: SHELL.bgSoft, color: danger ? SHELL.urgent : "text.primary" },
		}}
	>
		{children}
	</Box>
)

const cellSx = (last: boolean) => ({
	p: "16px 20px",
	fontSize: 14,
	color: "text.primary",
	borderBottom: last ? "none" : `1px solid ${SHELL.dividerSoft}`,
	verticalAlign: "middle" as const,
})

const AdminsPage = () => {
	const [inviteOpen, setInviteOpen] = useState(false)

	return (
		<>
			<PageHead
				title="Admin management"
				subtitle="Only super admins can create, promote, or revoke admin accounts."
				actions={<Button onClick={() => setInviteOpen(true)}>+ Invite admin</Button>}
			/>

			<Box
				sx={{
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "22px",
					overflow: "hidden",
				}}
			>
				{/* Toolbar */}
				<Stack
					direction={{ xs: "column", md: "row" }}
					sx={{
						alignItems: { md: "center" },
						gap: 1.5,
						p: "16px 20px",
						borderBottom: "1px solid",
						borderColor: "divider",
						flexWrap: "wrap",
					}}
				>
					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							gap: 1,
							px: 1.75,
							py: 1,
							bgcolor: SHELL.bgSoft,
							borderRadius: "10px",
							border: "1px solid transparent",
							fontSize: 13,
							color: "text.secondary",
							flex: 1,
							minWidth: 220,
						}}
					>
						<SearchRoundedIcon sx={{ fontSize: 16 }} />
						<Box
							component="input"
							placeholder="Search admins…"
							sx={{
								flex: 1,
								bgcolor: "transparent",
								border: "none",
								outline: "none",
								fontSize: 13,
								color: "text.primary",
								"&::placeholder": { color: "text.secondary" },
							}}
						/>
					</Stack>
					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							gap: 1,
							px: 1.75,
							py: 1,
							bgcolor: "#fff",
							border: "1px solid",
							borderColor: "divider",
							borderRadius: "10px",
							fontSize: 13,
							color: "text.primary",
							cursor: "pointer",
							"&:hover": { borderColor: "text.primary" },
						}}
					>
						<Box component="span">Role: All</Box>
						<KeyboardArrowDownRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
					</Stack>
				</Stack>

				{/* Table */}
				<Box sx={{ overflowX: "auto" }}>
					<Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
						<Box component="thead">
							<Box component="tr">
								{headers.map((h, i) => (
									<Box
										key={h}
										component="th"
										sx={{
											textAlign: i === headers.length - 1 ? "right" : "left",
											fontSize: 11,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											color: "text.secondary",
											fontWeight: 500,
											p: "12px 20px",
											bgcolor: SHELL.bgSoft,
											borderBottom: "1px solid",
											borderColor: "divider",
											...(i === 0 ? { width: "30%" } : {}),
										}}
									>
										{h}
									</Box>
								))}
							</Box>
						</Box>
						<Box component="tbody">
							{admins.map((a, i) => {
								const isLast = i === admins.length - 1
								const isYou = a.role === "super" && a.name === "Kamrul Hasan"
								return (
									<Box
										key={a.email}
										component="tr"
										sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
									>
										<Box component="td" sx={cellSx(isLast)}>
											<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
												<AvatarGradient initials={a.initials} variant={a.variant} size={36} />
												<Box>
													<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
														{a.name}
													</Typography>
													<Typography sx={{ fontSize: 12, color: "text.secondary", mt: "1px" }}>
														{a.email}
													</Typography>
												</Box>
											</Stack>
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											<StatusBadge
												kind={a.role === "super" ? "purple" : "teal"}
												label={a.role === "super" ? "Super Admin" : "Admin"}
												withDot={false}
											/>
										</Box>
										<Box
											component="td"
											sx={{
												...cellSx(isLast),
												color: a.addedBy === "System" ? "text.secondary" : "text.primary",
											}}
										>
											{a.addedBy}
										</Box>
										<Box
											component="td"
											sx={{
												...cellSx(isLast),
												color: a.lastActive === "—" ? "text.secondary" : "text.primary",
											}}
										>
											{a.lastActive}
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											<StatusBadge kind={a.status} />
										</Box>
										<Box
											component="td"
											sx={{
												...cellSx(isLast),
												textAlign: "right",
											}}
										>
											<Stack
												direction="row"
												sx={{ gap: 0.75, justifyContent: "flex-end" }}
											>
												{renderActions(a.status, isYou)}
											</Stack>
										</Box>
									</Box>
								)
							})}
						</Box>
					</Box>
				</Box>

				{/* Pagination */}
				<Stack
					direction="row"
					sx={{
						alignItems: "center",
						justifyContent: "space-between",
						p: "14px 20px",
						borderTop: "1px solid",
						borderColor: "divider",
						fontSize: 12,
						color: "text.secondary",
					}}
				>
					<Box>Showing 1 — 5 of 6 admins</Box>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{[
							{ label: "‹", disabled: true },
							{ label: "1", active: true },
							{ label: "2" },
							{ label: "›" },
						].map((p, i) => (
							<Box
								key={i}
								component="button"
								disabled={p.disabled}
								sx={{
									width: 30,
									height: 30,
									borderRadius: "8px",
									border: "none",
									bgcolor: p.active ? "text.primary" : "transparent",
									color: p.active
										? "#fff"
										: p.disabled
											? "divider"
											: "text.secondary",
									fontSize: 12,
									fontFamily: MONO,
									cursor: p.disabled ? "not-allowed" : "pointer",
									fontVariantNumeric: "tabular-nums",
									"&:hover": {
										bgcolor: p.active
											? "text.primary"
											: p.disabled
												? "transparent"
												: SHELL.bgSoft,
										color: p.active ? "#fff" : p.disabled ? "divider" : "text.primary",
									},
								}}
							>
								{p.label}
							</Box>
						))}
					</Stack>
				</Stack>
			</Box>

			<InviteAdminModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
		</>
	)
}

export default AdminsPage
