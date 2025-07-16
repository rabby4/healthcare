/* eslint-disable @typescript-eslint/no-explicit-any */
import ProDatePicker from "@/components/form/ProDatePicker"
import ProForm from "@/components/form/ProForm"
import ProTimePicker from "@/components/form/ProTimePicker"
import ProModal from "@/components/shared/ProModal/ProModal"
import { useCreateScheduleMutation } from "@/redux/api/scheduleApi"
import { formatDate } from "@/utils/formatDate"
import { formatTime } from "@/utils/formatTime"
import { Button, Grid } from "@mui/material"
import { FieldValues } from "react-hook-form"
import { toast } from "sonner"

type TProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ScheduleModal = ({ open, setOpen }: TProps) => {
	const [createSchedule] = useCreateScheduleMutation()

	const handleFormSubmit = async (values: FieldValues) => {
		values.startDate = formatDate(values.startDate)
		values.endDate = formatDate(values.endDate)
		values.startTime = formatTime(values.startTime)
		values.endTime = formatTime(values.endTime)

		try {
			const res = await createSchedule(values)
			if (res.data.length) {
				toast.success("Schedule created successfully!!!")
				setOpen(false)
			}
			console.log(res)
		} catch (error: any) {
			console.log(error.message)
		}
	}

	return (
		<ProModal open={open} setOpen={setOpen} title="Create Schedule">
			<ProForm onSubmit={handleFormSubmit}>
				<Grid container spacing={3} sx={{ my: 3 }}>
					<Grid size={{ md: 6 }}>
						<ProDatePicker name="startDate" label="Start Date" />
					</Grid>
					<Grid size={{ md: 6 }}>
						<ProDatePicker name="endDate" label="End Date" />
					</Grid>
					<Grid size={{ md: 6 }}>
						<ProTimePicker name="startTime" label="Start Time" />
					</Grid>
					<Grid size={{ md: 6 }}>
						<ProTimePicker name="endTime" label="End Time" />
					</Grid>
				</Grid>
				<Button type="submit">Create Schedule</Button>
			</ProForm>
		</ProModal>
	)
}

export default ScheduleModal
