/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Typography,
} from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/Close"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"

import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import { formatDate } from "@/utils/formatDate"

type Props = {
	open: boolean
	onClose: () => void
	prescription: any | null
	doctorName?: string
}

const Label = ({ children }: { children: React.ReactNode }) => (
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
		{children}
	</Typography>
)

const ViewRxDialog = ({ open, onClose, prescription, doctorName }: Props) => {
	const instructions = prescription?.instructions
	const followUp = prescription?.followUpDate

	return (
		<Dialog
			open={open}
			onClose={onClose}
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
				<Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
					<Box
						sx={{
							width: 36,
							height: 36,
							borderRadius: "10px",
							bgcolor: SHELL.successBg,
							color: SHELL.success,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
					</Box>
					<Box>
						<Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
							Prescription
						</Typography>
						{doctorName && (
							<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
								Issued by {doctorName}
							</Typography>
						)}
					</Box>
				</Stack>
				<IconButton onClick={onClose} size="small">
					<CloseRoundedIcon fontSize="small" />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Stack sx={{ gap: 2.25, pt: 1 }}>
					<Box>
						<Label>Instructions</Label>
						<Box
							sx={{
								p: 2,
								borderRadius: "12px",
								bgcolor: SHELL.bgSoft,
								border: "1px solid",
								borderColor: "divider",
							}}
						>
							<Typography
								sx={{
									fontSize: 14,
									lineHeight: 1.65,
									color: "text.primary",
									whiteSpace: "pre-wrap",
								}}
							>
								{instructions?.trim() || "No instructions were recorded for this prescription."}
							</Typography>
						</Box>
					</Box>
					<Box>
						<Label>Follow-up</Label>
						<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
							{followUp ? formatDate(followUp) : "No follow-up scheduled"}
						</Typography>
					</Box>
				</Stack>
			</DialogContent>
		</Dialog>
	)
}

export default ViewRxDialog
