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
	Rating,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/Close"
import StarRoundedIcon from "@mui/icons-material/Star"
import StarBorderRoundedIcon from "@mui/icons-material/StarBorder"
import { toast } from "sonner"

import { useCreateReviewMutation } from "@/redux/api/reviewApi"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"

type Props = {
	open: boolean
	onClose: () => void
	appointmentId: string
	doctorName?: string
	onReviewed?: (appointmentId: string) => void
}

const ReviewModal = ({ open, onClose, appointmentId, doctorName, onReviewed }: Props) => {
	const [rating, setRating] = useState<number | null>(5)
	const [comment, setComment] = useState("")
	const [createReview, { isLoading }] = useCreateReviewMutation()

	const reset = () => {
		setRating(5)
		setComment("")
	}

	const handleClose = () => {
		if (isLoading) return
		reset()
		onClose()
	}

	const handleSubmit = async () => {
		if (!rating || rating < 1) {
			toast.error("Please pick a rating from 1 to 5")
			return
		}
		try {
			await createReview({
				appointmentId,
				rating,
				comment: comment.trim() ? comment.trim() : undefined,
			}).unwrap()
			toast.success("Thanks! Your review has been posted")
			onReviewed?.(appointmentId)
			reset()
			onClose()
		} catch (err: any) {
			const msg = err?.data?.message || err?.message || ""
			// Backend surfaces a duplicate review as a raw Prisma P2002 unique error.
			if (
				/P2002/i.test(msg) ||
				/unique/i.test(msg) ||
				/already/i.test(msg)
			) {
				toast.error("You already reviewed this appointment")
				onReviewed?.(appointmentId)
				reset()
				onClose()
				return
			}
			toast.error(msg || "Something went wrong")
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="xs"
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
						Leave a review
					</Typography>
					{doctorName && (
						<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
							For {doctorName}
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
							Your rating *
						</Typography>
						<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
							<Rating
								value={rating}
								onChange={(_e, v) => setRating(v)}
								max={5}
								size="large"
								icon={<StarRoundedIcon fontSize="inherit" sx={{ color: SHELL.star }} />}
								emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
							/>
							<Typography
								sx={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: "text.secondary" }}
							>
								{rating ? `${rating}.0` : "—"}
							</Typography>
						</Stack>
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
							Comment (optional)
						</Typography>
						<TextField
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="Share how the consultation went…"
							multiline
							minRows={4}
							fullWidth
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
								"&:hover": { borderColor: "text.primary", bgcolor: "#F4F6F8" },
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={isLoading || !rating}
							variant="contained"
							sx={{
								textTransform: "none",
								borderRadius: "10px",
								boxShadow: "none",
								"&:hover": { boxShadow: "none" },
							}}
						>
							{isLoading ? "Posting…" : "Post review"}
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	)
}

export default ReviewModal
