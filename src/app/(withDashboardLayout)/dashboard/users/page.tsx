"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box, Stack, Typography } from "@mui/material"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import { useState } from "react"
import { toast } from "sonner"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"
import {
	useChangeUserStatusMutation,
	useGetAllUsersQuery,
} from "@/redux/api/userApi"
import useUserInfo from "@/hooks/useUserInfo"

const filterPills: { label: string; arg: Record<string, any> }[] = [
	{ label: "All", arg: {} },
	{ label: "Patients", arg: { role: "PATIENT" } },
	{ label: "Doctors", arg: { role: "DOCTOR" } },
	{ label: "Blocked", arg: { status: "BLOCKED" } },
]

const headers = ["User", "Role", "Joined", "Status", "Actions"]

const AVATAR_VARIANTS: AvatarVariant[] = ["teal", "blue", "purple", "orange", "green"]

const getInitials = (name: string) => {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return "?"
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const getVariant = (seed: string): AvatarVariant => {
	let hash = 0
	for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
	return AVATAR_VARIANTS[hash % AVATAR_VARIANTS.length]
}

const formatJoined = (iso?: string) => {
	if (!iso) return "—"
	const d = new Date(iso)
	if (isNaN(d.getTime())) return "—"
	return d.toLocaleDateString(undefined, { month: "short", year: "numeric" })
}

const roleBadge = (role: string): { kind: "teal" | "purple" | "neutral"; label: string } => {
	switch (role) {
		case "DOCTOR":
			return { kind: "teal", label: "Doctor" }
		case "SUPER_ADMIN":
			return { kind: "purple", label: "Super Admin" }
		case "ADMIN":
			return { kind: "purple", label: "Admin" }
		case "PATIENT":
			return { kind: "neutral", label: "Patient" }
		default:
			return { kind: "neutral", label: role || "—" }
	}
}

const statusBadge = (status: string): { kind: "active" | "cancelled"; label: string } => {
	switch (status) {
		case "ACTIVE":
			return { kind: "active", label: "Active" }
		case "BLOCKED":
			return { kind: "cancelled", label: "Blocked" }
		case "DELETED":
			return { kind: "cancelled", label: "Deleted" }
		default:
			return { kind: "cancelled", label: status || "—" }
	}
}

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
	disabled,
	onClick,
}: {
	children: React.ReactNode
	danger?: boolean
	primary?: boolean
	disabled?: boolean
	onClick?: () => void
}) => (
	<Box
		component="button"
		disabled={disabled}
		onClick={onClick}
		sx={{
			fontSize: 12,
			fontWeight: 600,
			px: 1,
			py: 0.5,
			borderRadius: "6px",
			border: "none",
			bgcolor: "transparent",
			cursor: disabled ? "not-allowed" : "pointer",
			opacity: disabled ? 0.5 : 1,
			color: danger ? SHELL.urgent : primary ? "primary.main" : "text.secondary",
			"&:hover": { bgcolor: SHELL.bgSoft, color: danger ? SHELL.urgent : "text.primary" },
		}}
	>
		{children}
	</Box>
)

const MessageRow = ({ children }: { children: React.ReactNode }) => (
	<Box component="tr">
		<Box
			component="td"
			colSpan={headers.length}
			sx={{
				p: "40px 20px",
				textAlign: "center",
				fontSize: 13,
				color: "text.secondary",
			}}
		>
			{children}
		</Box>
	</Box>
)

const UsersPage = () => {
	const [activePill, setActivePill] = useState(0)
	const [searchTerm, setSearchTerm] = useState("")

	const queryArg: Record<string, any> = { ...filterPills[activePill].arg }
	if (searchTerm.trim()) queryArg.searchTerm = searchTerm.trim()

	const { data, isLoading, isError } = useGetAllUsersQuery(queryArg)
	const [changeStatus, { isLoading: isChanging }] = useChangeUserStatusMutation()

	// Viewer identity (role is lowercased by getUserInfo: "super_admin" | "admin").
	const viewer = useUserInfo()
	const isSuperAdminViewer = viewer?.role === "super_admin"
	const viewerEmail = viewer?.email

	const allUsers: any[] = data?.users ?? []
	// Only a super admin may see super-admin accounts at all. Admins never see
	// the super admin's profile, email, or any of its information.
	const users: any[] = isSuperAdminViewer
		? allUsers
		: allUsers.filter((u) => u.role !== "SUPER_ADMIN")
	const meta = data?.meta as { total?: number; page?: number; limit?: number } | undefined

	const handleStatus = async (id: string, status: string) => {
		if (status === "DELETED" || status === "BLOCKED") {
			if (!window.confirm("Are you sure?")) return
		}
		try {
			await changeStatus({ id, body: { status } }).unwrap()
			toast.success("User status updated")
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const total = meta?.total ?? users.length
	const page = meta?.page ?? 1
	const limit = meta?.limit ?? users.length
	const startIdx = users.length === 0 ? 0 : (page - 1) * limit + 1
	const endIdx = users.length === 0 ? 0 : startIdx + users.length - 1

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
							placeholder="Search by email…"
							value={searchTerm}
							onChange={(e: any) => setSearchTerm(e.target.value)}
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
							{isLoading ? (
								<MessageRow>Loading users…</MessageRow>
							) : isError ? (
								<MessageRow>Failed to load users. Please try again.</MessageRow>
							) : users.length === 0 ? (
								<MessageRow>No users found.</MessageRow>
							) : (
								users.map((u, i) => {
									const isLast = i === users.length - 1
									const name =
										u.Admin?.name ?? u.Doctor?.name ?? u.Patient?.name ?? u.email
									const rb = roleBadge(u.role)
									const sb = statusBadge(u.status)
									const isActive = u.status === "ACTIVE"
									// Super admins are protected — never blockable/deletable by anyone.
									const isSuperAdminRow = u.role === "SUPER_ADMIN"
									return (
										<Box
											key={u.id}
											component="tr"
											sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
										>
											<Box component="td" sx={cellSx(isLast)}>
												<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
													<AvatarGradient
														initials={getInitials(name)}
														variant={getVariant(u.email || u.id || name)}
														size={36}
													/>
													<Box>
														<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
															{name}
														</Typography>
														<Typography sx={{ fontSize: 12, color: "text.secondary", mt: "1px" }}>
															{u.email}
														</Typography>
													</Box>
												</Stack>
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												<StatusBadge kind={rb.kind} label={rb.label} withDot={false} />
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												{formatJoined(u.createdAt)}
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												<Stack direction="row" sx={{ alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
													<StatusBadge kind={sb.kind} label={sb.label} />
													{u.needPasswordChange && isActive && (
														<StatusBadge kind="inprogress" label="Needs password" />
													)}
												</Stack>
											</Box>
											<Box
												component="td"
												sx={{ ...cellSx(isLast), textAlign: "right" }}
											>
												<Stack direction="row" sx={{ gap: 0.75, justifyContent: "flex-end", alignItems: "center" }}>
													{isSuperAdminRow ? (
														<Stack direction="row" sx={{ alignItems: "center", gap: 0.5, color: "text.secondary" }}>
															<LockOutlinedIcon sx={{ fontSize: 14 }} />
															<Typography sx={{ fontSize: 12, fontWeight: 600 }}>
																Protected
															</Typography>
														</Stack>
													) : (
														<>
															<ActionLink>View</ActionLink>
															{isActive ? (
																<ActionLink
																	danger
																	disabled={isChanging}
																	onClick={() => handleStatus(u.id, "BLOCKED")}
																>
																	Block
																</ActionLink>
															) : (
																<ActionLink
																	primary
																	disabled={isChanging}
																	onClick={() => handleStatus(u.id, "ACTIVE")}
																>
																	Reinstate
																</ActionLink>
															)}
															<ActionLink
																danger
																disabled={isChanging}
																onClick={() => handleStatus(u.id, "DELETED")}
															>
																Delete
															</ActionLink>
														</>
													)}
												</Stack>
											</Box>
										</Box>
									)
								})
							)}
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
					<Box>
						Showing {startIdx} — {endIdx} of {total} users
					</Box>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{[
							{ label: "‹", disabled: true },
							{ label: "1", active: true },
							{ label: "›", disabled: true },
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
