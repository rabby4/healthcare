/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { getTimeIn12HourFormat } from "@/app/(withDashboardLayout)/dashboard/doctor/schedules/components/MultipleSelectFieldChip"
import { useGetAllDoctorSchedulesQuery } from "@/redux/api/doctorScheduleApi"
import { IDoctorSchedule } from "@/types"
import { formatDate } from "@/utils/formatDate"

import { Box, Button, Stack, Typography } from "@mui/material"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useState } from "react"
dayjs.extend(utc)

const DoctorScheduleSlots = ({ id }: { id: string }) => {
	const [scheduleId, setScheduleId] = useState("")

	const query: Record<string, any> = {}

	query["doctorId"] = id

	query["startDateTime"] = dayjs(new Date())
		.utc()
		.hour(0)
		.minute(0)
		.second(0)
		.millisecond(0)
		.toISOString()

	query["endDateTime"] = dayjs(new Date())
		.utc()
		.hour(23)
		.minute(59)
		.second(59)
		.millisecond(999)
		.toISOString()

	const { data, isLoading } = useGetAllDoctorSchedulesQuery({ ...query })

	console.log(data)

	const doctorSchedules = data?.doctorSchedules

	console.log(doctorSchedules)

	const currentDate = new Date()
	const today = currentDate.toLocaleDateString("en-US", { weekday: "long" })

	const availableSlots = doctorSchedules?.filter(
		(doctor: IDoctorSchedule) => !doctor.isBooked
	)
	console.log(availableSlots)

	const handleBookAppointment = async () => {}

	return (
		<Box mb={5}>
			<Box sx={{ bgcolor: "white", p: 3, mt: 1 }}>
				<Typography variant="h4" mb={3} color="primary.main">
					Availability
				</Typography>
				<Typography variant="h6" fontSize={16}>
					<b>Today: {formatDate(currentDate.toISOString()) + " " + today}</b>
				</Typography>
				<Box sx={{ borderBottom: "2px dashed #d0d0d0", mt: 2, mb: 3 }} />
				<Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
					{availableSlots?.length ? (
						isLoading ? (
							"Loading..."
						) : (
							availableSlots?.map((doctorSchedule: IDoctorSchedule) => {
								const formattedTimeSlot = `${getTimeIn12HourFormat(
									doctorSchedule?.schedule?.startDateTime
								)} - ${getTimeIn12HourFormat(
									doctorSchedule?.schedule?.endDateTime
								)}`

								return (
									<Button
										key={doctorSchedule?.scheduleId}
										color="primary"
										onClick={() => setScheduleId(doctorSchedule?.scheduleId)}
										variant={`${
											doctorSchedule?.scheduleId === scheduleId
												? "contained"
												: "outlined"
										}`}
									>
										{formattedTimeSlot}
									</Button>
								)
							})
						)
					) : (
						<span style={{ color: "red" }}>
							No Schedule is Available Today!
						</span>
					)}
				</Stack>
			</Box>

			<Button
				onClick={handleBookAppointment}
				sx={{ display: "block", mx: "auto" }}
			>
				Book Appointment Now
			</Button>
		</Box>
	)
}

export default DoctorScheduleSlots
