"use client"

import { Box, Stack, Typography } from "@mui/material"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import { useState } from "react"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"

type User = {
	initials: string
	variant: AvatarVariant
	name: string
	email: string
	role: "Patient" | "Doctor"
	joined: string
	lastActive: string
	status: "active" | "cancelled" | "inprogress"
	statusLabel?: string
	action: "default" | "reinstate"
}

const users: User[] = [
	{
		initials: "FR",
		variant: "teal",
		name: "Farzana Rahman",
		email: "farzana.r@email.com",
		role: "Patient",
		joined: "Mar 2024",
		lastActive: "Today",
		status: "active",
		action: "default",
	},
	{
		initials: "AR",
		variant: "teal",
		name: "Dr. Asma Rahman",
		email: "dr.asma@medicare.app",
		role: "Doctor",
		joined: "Feb 2025",
		lastActive: "Today",
		status: "active",
		action: "default",
	},
	{
		initials: "RU",
		variant: "blue",
		name: "Rahim Uddin",
		email: "rahim.u@email.com",
		role: "Patient",
		joined: "Jan 2025",
		lastActive: "2 days ago",
		status: "active",
		action: "default",
	},
	{
		initials: "SP",
		variant: "purple",
		name: "Sumon Pal",
		email: "sumon.p@email.com",
		role: "Patient",
		joined: "Dec 2024",
		lastActive: "1 month ago",
		status: "cancelled",
		statusLabel: "Blocked",
		action: "reinstate",
	},
	{
		initials: "RN",
		variant: "orange",
		name: "Dr. Rumana Nasir",
		email: "r.nasir@medicare.app",
		role: "Doctor",
		joined: "May 2023",
		lastActive: "2 weeks ago",
		status: "cancelled",
		statusLabel: "Suspended",
		action: "reinstate",
	},
	{
		initials: "MA",
		variant: "orange",
		name: "Mahmuda Akter",
		email: "m.akter@email.com",
		role: "Patient",
		joined: "Apr 2026",
		lastActive: "5 hours ago",
		status: "inprogress",
		statusLabel: "Needs password",
		action: "default",
	},
]

const filterPills = [
	{ label: "All", count: "18,642" },
	{ label: "Patients", count: "18,402" },
	{ label: "Doctors", count: "240" },
	{ label: "Blocked", count: "23" },
]

const headers = ["User", "Role", "Joined", "Last active", "Status", "Actions"]

const cellSx = (last: boolean) => ({
	p: "16px 20px",
	fontSize: 14,
	color: "text.primary",
	borderBottom: last ? "none" : `1px solid ${SHELL.dividerSoft}`,
	verticalAlign: "middle" as const,
})

const ActionLink = ({
	children,
	danger,
	primary,
}: {
	children: React.ReactNode
	danger?: boolean
	primary?: boolean
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

const UsersPage = () => {
	const [activePill, setActivePill] = useState(0)

	return (
		<>
			<PageHead
				title="Users"
				subtitle="Manage account status across patients and doctors — active, blocked, or deleted."
			/>

			{/* Filter pills */}
			<Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", mb: 2 }}>
				{filterPills.map((p, i) => {
					const on = activePill === i
					return (
						<Stack
							key={p.label}
							direction="row"
							onClick={() => setActivePill(i)}
							sx={{
								alignItems: "center",
								gap: 1,
								px: 1.75,
								py: "7px",
								borderRadius: 999,
								fontSize: 13,
								fontWeight: 500,
								cursor: "pointer",
								border: "1px solid",
								borderColor: on ? "text.primary" : "divider",
								bgcolor: on ? "text.primary" : "#fff",
								color: on ? "#fff" : "text.secondary",
								"&:hover": { borderColor: "text.primary" },
							}}
						>
							<Box component="span">{p.label}</Box>
							<Box
								component="span"
								sx={{
									fontFamily: MONO,
									fontSize: 11,
									opacity: 0.7,
								}}
							>
								{p.count}
							</Box>
						</Stack>
					)
				})}
			</Stack>

			{/* Table card */}
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
							placeholder="Search by name or email…"
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
					{["Role: All", "Status: All"].map((label) => (
						<Stack
							key={label}
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
							<Box component="span">{label}</Box>
							<KeyboardArrowDownRoundedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
						</Stack>
					))}
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
											...(i === 0 ? { width: "28%" } : {}),
										}}
									>
										{h}
									</Box>
								))}
							</Box>
						</Box>
						<Box component="tbody">
							{users.map((u, i) => {
								const isLast = i === users.length - 1
								return (
									<Box
										key={u.email}
										component="tr"
										sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
									>
										<Box component="td" sx={cellSx(isLast)}>
											<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
												<AvatarGradient initials={u.initials} variant={u.variant} size={36} />
												<Box>
													<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
														{u.name}
													</Typography>
													<Typography sx={{ fontSize: 12, color: "text.secondary", mt: "1px" }}>
														{u.email}
													</Typography>
												</Box>
											</Stack>
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											<StatusBadge
												kind={u.role === "Doctor" ? "teal" : "neutral"}
												label={u.role}
												withDot={false}
											/>
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											{u.joined}
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											{u.lastActive}
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											<StatusBadge kind={u.status} label={u.statusLabel} />
										</Box>
										<Box
											component="td"
											sx={{ ...cellSx(isLast), textAlign: "right" }}
										>
											<Stack direction="row" sx={{ gap: 0.75, justifyContent: "flex-end" }}>
												{u.action === "reinstate" ? (
													<>
														<ActionLink primary>Reinstate</ActionLink>
														<ActionLink danger>Delete</ActionLink>
													</>
												) : (
													<>
														<ActionLink>View</ActionLink>
														<ActionLink danger>Block</ActionLink>
													</>
												)}
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
					<Box>Showing 1 — 6 of 18,642 users</Box>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{[
							{ label: "‹", disabled: true },
							{ label: "1", active: true },
							{ label: "2" },
							{ label: "3" },
							{ label: "…" },
							{ label: "2,107" },
							{ label: "›" },
						].map((p, i) => (
							<Box
								key={i}
								component="button"
								disabled={p.disabled}
								sx={{
									minWidth: 30,
									height: 30,
									px: 1,
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
		</>
	)
}

export default UsersPage
