/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { toast } from "sonner"

import { SHELL } from "@/components/dashboard/shell/tokens"
import { useCreateAdminMutation } from "@/redux/api/adminApi"

type Props = {
	open: boolean
	onClose: () => void
}

const InviteAdminModal = ({ open, onClose }: Props) => {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [contactNumber, setContactNumber] = useState("")
	const [password, setPassword] = useState("")
	const [file, setFile] = useState<File | null>(null)

	const [createAdmin, { isLoading }] = useCreateAdminMutation()

	const resetFields = () => {
		setName("")
		setEmail("")
		setContactNumber("")
		setPassword("")
		setFile(null)
	}

	const handleClose = () => {
		if (isLoading) return
		resetFields()
		onClose()
	}

	const handleSubmit = async () => {
		if (!name.trim() || !email.trim() || !contactNumber.trim()) {
			toast.error("Name, email and contact number are required")
			return
		}
		if (password.length < 6) {
			toast.error("Password must be at least 6 characters")
			return
		}

		const payload = {
			password,
			admin: {
				name: name.trim(),
				email: email.trim(),
				contactNumber: contactNumber.trim(),
			},
		}

		const fd = new FormData()
		fd.append("data", JSON.stringify(payload))
		if (file) fd.append("file", file)

		try {
			await createAdmin(fd).unwrap()
			toast.success("Admin invited")
			resetFields()
			onClose()
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
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
						Create an admin account with a temporary password they can change later.
					</Typography>
				</Box>
				<IconButton
					onClick={handleClose}
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
						<TextField
							placeholder="Full name"
							fullWidth
							size="small"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</Box>
					<Box>
						<Typography
							sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75 }}
						>
							Email
						</Typography>
						<TextField
							placeholder="name@medicare.app"
							type="email"
							fullWidth
							size="small"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Box>
					<Box>
						<Typography
							sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75 }}
						>
							Contact number
						</Typography>
						<TextField
							placeholder="+8801XXXXXXXXX"
							fullWidth
							size="small"
							value={contactNumber}
							onChange={(e) => setContactNumber(e.target.value)}
						/>
					</Box>
					<Box>
						<Typography
							sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75 }}
						>
							Password
						</Typography>
						<TextField
							placeholder="Min 6 characters"
							type="password"
							fullWidth
							size="small"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Box>
				</Box>

				<Typography
					sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mt: 2.25, mb: 0.75 }}
				>
					Profile photo (optional)
				</Typography>
				<Box
					component="input"
					type="file"
					accept="image/*"
					onChange={(e) => {
						const target = e.target as HTMLInputElement
						setFile(target.files?.[0] ?? null)
					}}
					sx={{
						width: "100%",
						fontSize: 13,
						color: "text.secondary",
						"&::file-selector-button": {
							mr: 1.5,
							px: 1.5,
							py: 0.75,
							borderRadius: "8px",
							border: "1px solid",
							borderColor: "divider",
							bgcolor: "#fff",
							color: "text.primary",
							fontSize: 13,
							cursor: "pointer",
						},
					}}
				/>

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
							New accounts are created with the Admin role. Share the password securely.
						</Typography>
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions
				sx={{ p: 2, px: 3, bgcolor: SHELL.bgSoft, borderTop: "1px solid", borderColor: "divider", gap: 1.25 }}
			>
				<Button
					onClick={handleClose}
					variant="outlined"
					disabled={isLoading}
					sx={{
						bgcolor: "#fff",
						color: "text.primary",
						borderColor: "divider",
						"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
					}}
				>
					Cancel
				</Button>
				<Button onClick={handleSubmit} disabled={isLoading}>
					{isLoading ? "Inviting…" : "Send invite"}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default InviteAdminModal
