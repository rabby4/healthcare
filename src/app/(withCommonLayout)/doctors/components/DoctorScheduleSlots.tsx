/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { getTimeIn12HourFormat } from "@/app/(withDashboardLayout)/dashboard/doctor/schedules/components/MultipleSelectFieldChip"
import { Eyebrow } from "@/components/ui/home/SectionHead"
import { useCreateAppointmentMutation } from "@/redux/api/appointmentApi"
import { useGetAllDoctorSchedulesQuery } from "@/redux/api/doctorScheduleApi"
import { useInitialPaymentMutation } from "@/redux/api/paymentApi"
import { IDoctorSchedule } from "@/types"
import { formatDate } from "@/utils/formatDate"
import {
	Box,
	Button,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useMemo, useState } from "react"
import { toast } from "sonner"
dayjs.extend(utc)

const DoctorScheduleSlots = ({ id }: { id: string }) => {
	const [scheduleId, setScheduleId] = useState("")

	// BUG FIX: backend filters by `doctorId`, NOT `id`. Passing `id` returned
	// every doctor's slots. Pass `doctorId` so we only get this doctor's slots.
	const { data, isLoading } = useGetAllDoctorSchedulesQuery(
		{ doctorId: id },
		{ skip: !id }
	)

	const doctorSchedules: IDoctorSchedule[] = data?.doctorSchedules ?? []

	// The backend date filter is inert, so filter client-side: keep only slots
	// that are NOT booked and whose start time is now or in the future.
	const groupedByDay = useMemo(() => {
		const now = dayjs()
		const available = doctorSchedules
			.filter(
				(ds) =>
					!ds.isBooked &&
					ds?.schedule?.startDateTime &&
					!dayjs(ds.schedule.startDateTime).isBefore(now)
			)
			.sort((a, b) =>
				dayjs(a.schedule.startDateTime).diff(dayjs(b.schedule.startDateTime))
			)

		const groups: { date: string; slots: IDoctorSchedule[] }[] = []
		for (const slot of available) {
			const dateKey = formatDate(slot.schedule.startDateTime)
			const existing = groups.find((g) => g.date === dateKey)
			if (existing) existing.slots.push(slot)
			else groups.push({ date: dateKey, slots: [slot] })
		}
		return groups
	}, [doctorSchedules])

	const hasSlots = groupedByDay.length > 0

	const [createAppointment, { isLoading: isCreating }] =
		useCreateAppointmentMutation()
	const [initialPayment, { isLoading: isPaying }] = useInitialPaymentMutation()

	const isBooking = isCreating || isPaying

	const handleBookAppointment = async () => {
		if (!id || !scheduleId) return
		try {
			const appt = await createAppointment({
				doctorId: id,
				scheduleId,
			}).unwrap()

			const pay = await initialPayment(appt.id).unwrap()
			const url = pay?.paymentUrl
			if (url) {
				window.location.href = url
			} else {
				toast.success("Appointment booked")
			}
		} catch (err: any) {
			toast.error(
				err?.data?.message ||
					err?.message ||
					"Could not book — please try again"
			)
		}
	}

	const dayLabel = (dateKey: string) =>
		dayjs(dateKey).format("dddd, MMM D")

	return (
		<Box>
			<Eyebrow>Availability</Eyebrow>
			<Typography variant="h4" sx={{ color: "text.primary", mb: 1 }}>
				Book an appointment
			</Typography>
			<Typography sx={{ color: "text.secondary", mb: 4, maxWidth: 560 }}>
				Pick an open time slot below and confirm to proceed to secure payment.
			</Typography>

			<Box
				sx={{
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "22px",
					p: { xs: 2.5, md: 4 },
				}}
			>
				{isLoading ? (
					<Stack sx={{ gap: 2 }}>
						<Skeleton variant="text" width={160} height={28} />
						<Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5 }}>
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton
									key={i}
									variant="rounded"
									width={150}
									height={42}
									sx={{ borderRadius: "999px" }}
								/>
							))}
						</Stack>
						<Typography sx={{ color: "text.secondary", mt: 1 }}>
							Loading slots…
						</Typography>
					</Stack>
				) : hasSlots ? (
					<Stack sx={{ gap: 4 }}>
						{groupedByDay.map((group) => (
							<Box key={group.date}>
								<Typography
									sx={{
										fontWeight: 700,
										color: "text.primary",
										mb: 1.75,
										fontSize: 16,
									}}
								>
									{dayLabel(group.date)}
								</Typography>
								<Stack
									direction="row"
									sx={{ flexWrap: "wrap", gap: 1.25 }}
								>
									{group.slots.map((ds) => {
										const selected = ds.scheduleId === scheduleId
										const formattedTimeSlot = `${getTimeIn12HourFormat(
											ds.schedule.startDateTime
										)} - ${getTimeIn12HourFormat(
											ds.schedule.endDateTime
										)}`
										return (
											<Button
												key={ds.scheduleId}
												onClick={() => setScheduleId(ds.scheduleId)}
												variant={selected ? "contained" : "outlined"}
												sx={
													selected
														? {
																bgcolor: "primary.main",
																color: "#fff",
																"&:hover": { bgcolor: "primary.dark" },
														  }
														: {
																borderColor: "divider",
																color: "text.primary",
																"&:hover": {
																	borderColor: "primary.main",
																	bgcolor: "primary.light",
																},
														  }
												}
											>
												{formattedTimeSlot}
											</Button>
										)
									})}
								</Stack>
							</Box>
						))}
					</Stack>
				) : (
					<Box sx={{ textAlign: "center", py: { xs: 3, md: 5 } }}>
						<Typography
							sx={{ fontWeight: 700, color: "text.primary", fontSize: 17 }}
						>
							No available slots right now
						</Typography>
						<Typography sx={{ color: "text.secondary", mt: 0.75 }}>
							Check back soon — new schedules are added regularly.
						</Typography>
					</Box>
				)}
			</Box>

			{hasSlots && (
				<Stack sx={{ mt: 3, alignItems: { xs: "stretch", sm: "flex-start" } }}>
					<Button
						onClick={handleBookAppointment}
						disabled={!scheduleId || isBooking}
						sx={{
							bgcolor: "primary.main",
							color: "#fff",
							py: "12px",
							px: 4,
							"&:hover": { bgcolor: "primary.dark" },
							// Disabled: drop the teal so the muted text stays readable.
							"&.Mui-disabled": { bgcolor: "#F4F6F8", color: "text.disabled" },
						}}
					>
						{isBooking ? "Booking…" : "Book appointment"}
					</Button>
				</Stack>
			)}
		</Box>
	)
}

export default DoctorScheduleSlots
