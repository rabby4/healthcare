/* eslint-disable @typescript-eslint/no-explicit-any */
import ProModal from "@/components/shared/ProModal/ProModal"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"
import { useState } from "react"
import { useGetAllSchedulesQuery } from "@/redux/api/scheduleApi"
import MultipleSelectFieldChip from "./MultipleSelectFieldChip"
import { Button, Stack } from "@mui/material"
import { useCreateDoctorScheduleMutation } from "@/redux/api/doctorScheduleApi"

type TProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DoctorScheduleModal = ({ open, setOpen }: TProps) => {
	const [selectedDate, setSelectedDate] = useState(dayjs(new Date()))
	const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([])
	const [createDoctorSchedule, { isLoading }] =
		useCreateDoctorScheduleMutation()

	const query: Record<string, any> = {}

	if (!!selectedDate) {
		query["startDate"] = dayjs(selectedDate)
			.hour(0)
			.minute(0)
			.millisecond(0)
			.toISOString()
		query["endDate"] = dayjs(selectedDate)
			.hour(23)
			.minute(59)
			.millisecond(999)
			.toISOString()
	}

	const { data } = useGetAllSchedulesQuery(query)
	const schedules = data?.schedule

	const onSubmit = async () => {
		try {
			const res = await createDoctorSchedule({
				scheduleIds: selectedScheduleIds,
			})
			setOpen(false)
			console.log(res)
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}

	return (
		<ProModal open={open} setOpen={setOpen} title="Create Doctor Schedule">
			<Stack spacing={2} sx={{ width: "100%" }}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker
						label="Controlled picker"
						value={dayjs(selectedDate)}
						onChange={(newValue) => setSelectedDate(dayjs(newValue))}
					/>
				</LocalizationProvider>
				<MultipleSelectFieldChip
					schedules={schedules}
					selectedScheduleIds={selectedScheduleIds}
					setSelectedScheduleIds={setSelectedScheduleIds}
				/>
				<Button
					size="small"
					onClick={onSubmit}
					loading={isLoading}
					loadingIndicator="Loading…"
				>
					submit
				</Button>
			</Stack>
		</ProModal>
	)
}

export default DoctorScheduleModal
