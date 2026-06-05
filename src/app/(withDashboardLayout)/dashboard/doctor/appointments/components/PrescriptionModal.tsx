/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/Close"
import { toast } from "sonner"

import { useCreatePrescriptionMutation } from "@/redux/api/prescriptionApi"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"

type Props = {
	open: boolean
	onClose: () => void
	appointmentId: string
	patientName?: string
}

const PrescriptionModal = ({ open, onClose, appointmentId, patientName }: Props) => {
	const [instructions, setInstructions] = useState("")
	const [followUpDate, setFollowUpDate] = useState("")
	const [createPrescription, { isLoading }] = useCreatePrescriptionMutation()

	const handleClose = () => {
		if (isLoading) return
		setInstructions("")
		setFollowUpDate("")
		onClose()
	}

	const handleSubmit = async () => {
		if (!instructions.trim()) {
			toast.error("Instructions are required")
			return
		}
		try {
			await createPrescription({
				appointmentId,
				instructions: instructions.trim(),
				followUpDate: followUpDate ? followUpDate : null,
			}).unwrap()
			toast.success("Prescription issued")
			setInstructions("")
			setFollowUpDate("")
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
			slotProps={{ paper: { sx: { borderRadius: "20px" } } }}
		>
			<DialogTitle
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					pb: 1,
				}}
			>
				<Box>
					<Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
						Write prescription
					</Typography>
					{patientName && (
						<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
							For {patientName}
						</Typography>
					)}
				</Box>
				<IconButton onClick={handleClose} size="small" disabled={isLoading}>
					<CloseRoundedIcon fontSize="small" />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Stack sx={{ gap: 2.25, pt: 1 }}>
					<Box>
						<Typography
							sx={{
								fontFamily: MONO,
								fontSize: 11,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								color: "text.secondary",
								mb: 0.75,
							}}
						>
							Instructions *
						</Typography>
						<TextField
							value={instructions}
							onChange={(e) => setInstructions(e.target.value)}
							placeholder="Medication, dosage, advice for the patient…"
							multiline
							minRows={5}
							fullWidth
							required
						/>
					</Box>
					<Box>
						<Typography
							sx={{
								fontFamily: MONO,
								fontSize: 11,
								letterSpacing: "0.06em",
								textTransform: "uppercase",
								color: "text.secondary",
								mb: 0.75,
							}}
						>
							Follow-up date (optional)
						</Typography>
						<TextField
							type="date"
							value={followUpDate}
							onChange={(e) => setFollowUpDate(e.target.value)}
							fullWidth
							slotProps={{ inputLabel: { shrink: true } }}
						/>
					</Box>
					<Stack direction="row" sx={{ gap: 1.25, justifyContent: "flex-end", mt: 0.5 }}>
						<Button
							onClick={handleClose}
							disabled={isLoading}
							variant="outlined"
							sx={{
								textTransform: "none",
								borderRadius: "10px",
								bgcolor: "#fff",
								color: "text.primary",
								borderColor: "divider",
								"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={isLoading || !instructions.trim()}
							variant="contained"
							sx={{
								textTransform: "none",
								borderRadius: "10px",
								boxShadow: "none",
								bgcolor: SHELL.success,
								color: "#fff",
								"&:hover": { bgcolor: SHELL.success, boxShadow: "none" },
								// Keep the text readable when disabled (no dark text on green).
								"&.Mui-disabled": { bgcolor: SHELL.bgSoft, color: "text.disabled" },
							}}
						>
							{isLoading ? "Issuing…" : "Issue prescription"}
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	)
}

export default PrescriptionModal
