/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
	useDeleteAdminMutation,
	useGetAllAdminsQuery,
	useSoftDeleteAdminMutation,
	type IAdmin,
} from "@/redux/api/adminApi"
import { getUserInfo } from "@/services/auth.services"
import { toast } from "sonner"
import InviteAdminModal from "./InviteAdminModal"

const AVATAR_VARIANTS: AvatarVariant[] = ["teal", "blue", "purple", "orange", "green"]

const getInitials = (name: string) => {
	const parts = (name || "").trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return "?"
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const variantFor = (seed: string) => {
	let sum = 0
	for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i)
	return AVATAR_VARIANTS[sum % AVATAR_VARIANTS.length]
}

const formatDate = (value?: string) => {
	if (!value) return "—"
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return "—"
	return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

const headers = ["Admin", "Role", "Contact", "Added", "Status", "Actions"]

const ActionLink = ({
	children,
	primary,
	danger,
	onClick,
	disabled,
}: {
	children: React.ReactNode
	primary?: boolean
	danger?: boolean
	onClick?: () => void
	disabled?: boolean
}) => (
	<Box
		component="button"
		onClick={onClick}
		disabled={disabled}
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

const cellSx = (last: boolean) => ({
	p: "16px 20px",
	fontSize: 14,
	color: "text.primary",
	borderBottom: last ? "none" : `1px solid ${SHELL.dividerSoft}`,
	verticalAlign: "middle" as const,
})

const messageRow = (text: string, color?: string) => (
	<Box component="tr">
		<Box
			component="td"
			colSpan={headers.length}
			sx={{
				p: "32px 20px",
				textAlign: "center",
				fontSize: 13,
				color: color ?? "text.secondary",
			}}
		>
			{text}
		</Box>
	</Box>
)

const AdminsPage = () => {
	const [inviteOpen, setInviteOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState("")
	const [page, setPage] = useState(1)
	const limit = 10

	const { data, isLoading, isError } = useGetAllAdminsQuery({
		searchTerm: searchTerm || undefined,
		page,
		limit,
	})
	const admins: IAdmin[] = data?.admins ?? []
	const meta = data?.meta

	const [softDelete, { isLoading: isRevoking }] = useSoftDeleteAdminMutation()
	const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation()

	const userInfo = getUserInfo()
	const currentEmail = userInfo?.email
	// Only super admins may create or revoke admin accounts (the backend enforces
	// the create restriction too).
	const isSuperAdmin = userInfo?.role === "super_admin"
	const mutating = isRevoking || isDeleting

	const handleRevoke = async (id: string) => {
		if (!window.confirm("Are you sure you want to revoke this admin?")) return
		try {
			await softDelete(id).unwrap()
			toast.success("Admin revoked")
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to permanently delete this admin?")) return
		try {
			await deleteAdmin(id).unwrap()
			toast.success("Admin deleted")
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const total = meta?.total ?? admins.length
	const metaPage = meta?.page ?? page
	const metaLimit = meta?.limit ?? limit
	const from = total === 0 ? 0 : (metaPage - 1) * metaLimit + 1
	const to = total === 0 ? 0 : Math.min(metaPage * metaLimit, total)
	const totalPages = metaLimit > 0 ? Math.max(1, Math.ceil(total / metaLimit)) : 1

	return (
		<>
			<PageHead
				title="Admin management"
				subtitle="Only super admins can create or revoke admin accounts."
				actions={
					isSuperAdmin ? (
						<Button onClick={() => setInviteOpen(true)}>+ Invite admin</Button>
					) : undefined
				}
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
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm((e.target as HTMLInputElement).value)
								setPage(1)
							}}
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
							{isLoading
								? messageRow("Loading…")
								: isError
									? messageRow("Failed to load admins. Please try again.", SHELL.urgent)
									: admins.length === 0
										? messageRow("No admins yet. Invite one")
										: admins.map((a, i) => {
												const isLast = i === admins.length - 1
												const isYou = !!currentEmail && a.email === currentEmail
												return (
													<Box
														key={a.id}
														component="tr"
														sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
													>
														<Box component="td" sx={cellSx(isLast)}>
															<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
																<AvatarGradient
																	initials={getInitials(a.name)}
																	variant={variantFor(a.email || a.id)}
																	size={36}
																/>
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
															<StatusBadge kind="teal" label="Admin" withDot={false} />
														</Box>
														<Box
															component="td"
															sx={{
																...cellSx(isLast),
																color: a.contactNumber ? "text.primary" : "text.secondary",
															}}
														>
															{a.contactNumber || "—"}
														</Box>
														<Box component="td" sx={cellSx(isLast)}>
															{formatDate(a.createdAt)}
														</Box>
														<Box component="td" sx={cellSx(isLast)}>
															<StatusBadge kind="active" label="Active" />
														</Box>
														<Box
															component="td"
															sx={{
																...cellSx(isLast),
																textAlign: "right",
															}}
														>
															{isYou ? (
																<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
																	That&apos;s you
																</Typography>
															) : !isSuperAdmin ? (
																<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
																	—
																</Typography>
															) : (
																<Stack
																	direction="row"
																	sx={{ gap: 0.75, justifyContent: "flex-end" }}
																>
																	<ActionLink
																		danger
																		disabled={mutating}
																		onClick={() => handleRevoke(a.id)}
																	>
																		Revoke
																	</ActionLink>
																	<ActionLink
																		danger
																		disabled={mutating}
																		onClick={() => handleDelete(a.id)}
																	>
																		Delete
																	</ActionLink>
																</Stack>
															)}
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
					<Box>
						{total === 0
							? "No admins"
							: `Showing ${from} to ${to} of ${total} admins`}
					</Box>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{[
							{
								label: "‹",
								disabled: metaPage <= 1,
								onClick: () => setPage((p) => Math.max(1, p - 1)),
							},
							{ label: String(metaPage), active: true },
							{
								label: "›",
								disabled: metaPage >= totalPages,
								onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							},
						].map((p, i) => (
							<Box
								key={i}
								component="button"
								disabled={p.disabled}
								onClick={p.onClick}
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

			{isSuperAdmin && (
				<InviteAdminModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
			)}
		</>
	)
}

export default AdminsPage
