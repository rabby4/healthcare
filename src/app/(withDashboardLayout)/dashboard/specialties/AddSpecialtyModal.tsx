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
	TextField,
	Typography,
} from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import { useCreateSpecialtyMutation } from "@/redux/api/specialtiesApi"

type Props = {
	open: boolean
	onClose: () => void
}

const FieldLabel = ({ children, sx }: { children: React.ReactNode; sx?: object }) => (
	<Typography
		sx={{
			fontSize: 12,
			fontWeight: 600,
			color: "text.secondary",
			mb: 0.75,
			...(sx || {}),
		}}
	>
		{children}
	</Typography>
)

const AddSpecialtyModal = ({ open, onClose }: Props) => {
	const [title, setTitle] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [preview, setPreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [createSpecialty, { isLoading }] = useCreateSpecialtyMutation()

	const reset = () => {
		setTitle("")
		setFile(null)
		setPreview(null)
		if (fileInputRef.current) fileInputRef.current.value = ""
	}

	const handleClose = () => {
		reset()
		onClose()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const picked = e.target.files?.[0]
		if (!picked) return
		setFile(picked)
		setPreview(URL.createObjectURL(picked))
	}

	const handleSubmit = async () => {
		if (!title.trim() || !file) return
		try {
			const payload = { title: title.trim() }
			const fd = new FormData()
			fd.append("data", JSON.stringify(payload))
			fd.append("file", file)
			await createSpecialty(fd).unwrap()
			toast.success("Specialty added")
			reset()
			onClose()
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const disabled = isLoading || !title.trim() || !file

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
						Add a specialty
					</Typography>
					<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
						Upload an icon and give it a clear, patient-friendly name.
					</Typography>
				</Box>
				<IconButton
					onClick={handleClose}
					size="small"
					sx={{
						color: "text.secondary",
						"&:hover": { color: "text.primary", bgcolor: SHELL.bgSoft },
					}}
				>
					<CloseRoundedIcon fontSize="small" />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ p: 3 }}>
				<FieldLabel>Specialty name</FieldLabel>
				<TextField
					placeholder="e.g. Endocrinology"
					fullWidth
					size="small"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<FieldLabel sx={{ mt: 2, mb: 1 }}>Icon</FieldLabel>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					hidden
					onChange={handleFileChange}
				/>

				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					{/* Preview */}
					<Box
						sx={{
							width: 56,
							height: 56,
							flexShrink: 0,
							borderRadius: "14px",
							border: "1px solid",
							borderColor: preview ? "primary.main" : "divider",
							bgcolor: preview ? "primary.light" : "#fff",
							color: "text.secondary",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							overflow: "hidden",
						}}
					>
						{preview ? (
							<Box
								component="img"
								src={preview}
								alt="icon preview"
								sx={{ width: 36, height: 36, objectFit: "contain" }}
							/>
						) : (
							<CloudUploadOutlinedIcon sx={{ fontSize: 22 }} />
						)}
					</Box>

					<Box sx={{ minWidth: 0 }}>
						<Button
							onClick={() => fileInputRef.current?.click()}
							variant="outlined"
							size="small"
							startIcon={<CloudUploadOutlinedIcon sx={{ fontSize: 18 }} />}
							sx={{
								bgcolor: "#fff",
								color: "text.primary",
								borderColor: "divider",
								"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
							}}
						>
							{file ? "Change icon" : "Upload icon"}
						</Button>
						<Typography
							sx={{
								mt: 0.75,
								fontSize: 11,
								color: "text.secondary",
								fontFamily: MONO,
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
								maxWidth: 260,
							}}
						>
							{file ? file.name : "SVG/PNG · Recommended 48×48"}
						</Typography>
					</Box>
				</Box>
			</DialogContent>

			<DialogActions
				sx={{
					p: 2,
					px: 3,
					bgcolor: SHELL.bgSoft,
					borderTop: "1px solid",
					borderColor: "divider",
					gap: 1.25,
				}}
			>
				<Button
					onClick={handleClose}
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
				<Button onClick={handleSubmit} disabled={disabled}>
					{isLoading ? "Adding…" : "Add specialty"}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default AddSpecialtyModal
