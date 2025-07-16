/* eslint-disable @typescript-eslint/no-explicit-any */
import ProDatePicker from "@/components/form/ProDatePicker"
import ProForm from "@/components/form/ProForm"
import ProModal from "@/components/shared/ProModal/ProModal"
import { Button, Grid } from "@mui/material"
import { FieldValues } from "react-hook-form"

type TProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ScheduleModal = ({ open, setOpen }: TProps) => {
	const handleFormSubmit = async (values: FieldValues) => {
		try {
			console.log(values)
		} catch (error: any) {
			console.log(error.message)
		}
	}

	return (
		<ProModal open={open} setOpen={setOpen} title="Create Schedule">
			<ProForm onSubmit={handleFormSubmit}>
				<Grid>
					<Grid size={{ md: 12 }}>
						<ProDatePicker name="startDate" sx={{ my: 2 }} label="Start Date" />
					</Grid>
				</Grid>
				<Button type="submit">Create Schedule</Button>
			</ProForm>
		</ProModal>
	)
}

export default ScheduleModal
