"use client"

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { useState } from "react"

import { SHELL } from "@/components/dashboard/shell/tokens"

type Props = {
	open: boolean
	onClose: () => void
}

const InviteAdminModal = ({ open, onClose }: Props) => {
	const [role, setRole] = useState<"admin" | "super">("admin")

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
			slotProps={{
				paper: {
					sx: {
						borderRadius: "22px",
						boxShadow: "0 40px 80px -20px rgba(15, 30, 46, 0.35)",
						overflow: "hidden",
					},
				},
			}}
		>
			<DialogTitle
				sx={{
					p: 3,
					pb: 0,
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: 2,
				}}
			>
				<Box>
					<Typography sx={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>
						Invite an admin
					</Typography>
					<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
						They&apos;ll get an email invite and set their password on first login.
					</Typography>
				</Box>
				<IconButton
					onClick={onClose}
					size="small"
					sx={{ color: "text.secondary", "&:hover": { color: "text.primary", bgcolor: SHELL.bgSoft } }}
				>
					<CloseRoundedIcon fontSize="small" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ p: 3 }}>
				<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.25 }}>
					<Box>
						<Typography
							sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75 }}
						>
							Full name
						</Typography>
						<TextField placeholder="Full name" fullWidth size="small" />
					</Box>
					<Box>
						<Typography
							sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75 }}
						>
							Email
						</Typography>
						<TextField placeholder="name@medicare.app" fullWidth size="small" />
					</Box>
				</Box>

				<Typography
					sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mt: 2.25, mb: 1 }}
				>
					Role
				</Typography>
				<Stack direction="row" sx={{ gap: 1 }}>
					{[
						{ key: "admin", label: "Admin" },
						{ key: "super", label: "Super Admin" },
					].map((r) => {
						const on = role === r.key
						return (
							<Box
								key={r.key}
								onClick={() => setRole(r.key as "admin" | "super")}
								sx={{
									flex: 1,
									justifyContent: "center",
									textAlign: "center",
									py: 1.25,
									borderRadius: "8px",
									border: "1px solid",
									borderColor: on ? "primary.main" : "divider",
									bgcolor: on ? "primary.light" : "#fff",
									color: on ? "primary.main" : "text.primary",
									fontWeight: on ? 600 : 500,
									fontSize: 13,
									cursor: "pointer",
									transition: "all 140ms",
									"&:hover": { borderColor: on ? "primary.main" : "text.primary" },
								}}
							>
								{r.label}
							</Box>
						)
					})}
				</Stack>

				<Stack
					direction="row"
					sx={{
						mt: 2.5,
						gap: 1.5,
						p: 2,
						borderRadius: "16px",
						bgcolor: "#E6F0FA",
						border: "1px solid #C4D8EC",
						color: "#1E4D7F",
					}}
				>
					<Box
						sx={{
							width: 32,
							height: 32,
							borderRadius: "10px",
							bgcolor: "rgba(42, 111, 181, 0.15)",
							color: SHELL.info,
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<InfoOutlinedIcon sx={{ fontSize: 16 }} />
					</Box>
					<Box>
						<Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1E4D7F" }}>
							Admins can manage the catalog & users
						</Typography>
						<Typography sx={{ fontSize: 12, mt: 0.5, color: "#1E4D7F" }}>
							Super Admins additionally manage other admins. Promote later anytime.
						</Typography>
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions
				sx={{ p: 2, px: 3, bgcolor: SHELL.bgSoft, borderTop: "1px solid", borderColor: "divider", gap: 1.25 }}
			>
				<Button
					onClick={onClose}
					variant="outlined"
					sx={{
						bgcolor: "#fff",
						color: "text.primary",
						borderColor: "divider",
						"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
					}}
				>
					Cancel
				</Button>
				<Button onClick={onClose}>Send invite</Button>
			</DialogActions>
		</Dialog>
	)
}

export default InviteAdminModal
