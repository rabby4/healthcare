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
	Typography,
} from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import dayjs from "dayjs"
import { FieldValues, FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import ProDatePicker from "@/components/form/ProDatePicker"
import ProTimePicker from "@/components/form/ProTimePicker"
import { SHELL } from "@/components/dashboard/shell/tokens"
import { useCreateScheduleMutation } from "@/redux/api/scheduleApi"

type Props = {
	open: boolean
	onClose: () => void
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
	<Typography
		sx={{
			fontSize: 12,
			fontWeight: 600,
			color: "text.secondary",
			mb: 0.75,
		}}
	>
		{children}
	</Typography>
)

const defaultValues = {
	startDate: dayjs(),
	endDate: dayjs().add(7, "day"),
	startTime: dayjs().hour(9).minute(0).second(0),
	endTime: dayjs().hour(18).minute(0).second(0),
}

const GenerateSlotsModal = ({ open, onClose }: Props) => {
	const methods = useForm({ defaultValues })
	const { handleSubmit, watch, reset } = methods

	const [createSchedule, { isLoading }] = useCreateScheduleMutation()

	// Live "will create N slots" estimate from the picker values.
	const values = watch()
	const start = dayjs(values.startDate)
	const end = dayjs(values.endDate)
	const sTime = dayjs(values.startTime)
	const eTime = dayjs(values.endTime)

	const startMin = sTime.isValid() ? sTime.hour() * 60 + sTime.minute() : NaN
	const endMin = eTime.isValid() ? eTime.hour() * 60 + eTime.minute() : NaN
	const slotsPerDay =
		Number.isNaN(startMin) || Number.isNaN(endMin) || endMin <= startMin
			? 0
			: Math.floor((endMin - startMin) / 30)
	const dayCount =
		start.isValid() && end.isValid() && !end.isBefore(start, "day")
			? end.diff(start, "day") + 1
			: 0
	const totalSlots = dayCount * slotsPerDay

	const onSubmit = async (data: FieldValues) => {
		const payload = {
			startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
			endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
			startTime: dayjs(data.startTime).format("HH:mm"),
			endTime: dayjs(data.endTime).format("HH:mm"),
		}
		try {
			await createSchedule(payload).unwrap()
			toast.success("Slots generated")
			reset(defaultValues)
			onClose()
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

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
			<FormProvider {...methods}>
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
							Generate schedule slots
						</Typography>
						<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
							Creates 30-minute bookable slots over a date and time range.
						</Typography>
					</Box>
					<IconButton
						onClick={onClose}
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
					{/* 2-col grid */}
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
							gap: 2.25,
						}}
					>
						<Box>
							<FieldLabel>Start date</FieldLabel>
							<ProDatePicker name="startDate" fullWidth />
						</Box>
						<Box>
							<FieldLabel>End date</FieldLabel>
							<ProDatePicker name="endDate" fullWidth />
						</Box>
						<Box>
							<FieldLabel>Start time</FieldLabel>
							<ProTimePicker name="startTime" fullWidth />
						</Box>
						<Box>
							<FieldLabel>End time</FieldLabel>
							<ProTimePicker name="endTime" fullWidth />
						</Box>
					</Box>

					{/* Info banner */}
					<Stack
						direction="row"
						sx={{
							mt: 2.75,
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
								This will create {totalSlots} slots
							</Typography>
							<Typography sx={{ fontSize: 12, mt: 0.5, color: "#1E4D7F" }}>
								{slotsPerDay} slots/day × {dayCount}{" "}
								{dayCount === 1 ? "day" : "days"}. Existing slots in this range are kept.
							</Typography>
						</Box>
					</Stack>
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
					<Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
						{isLoading ? "Generating…" : `Generate ${totalSlots} slots`}
					</Button>
				</DialogActions>
			</FormProvider>
		</Dialog>
	)
}

export default GenerateSlotsModal
