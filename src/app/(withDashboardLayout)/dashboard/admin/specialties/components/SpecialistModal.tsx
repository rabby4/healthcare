import ProFileUploader from "@/components/form/ProFileUploader"
import ProForm from "@/components/form/ProForm"
import ProInput from "@/components/form/ProInput"
import ProModal from "@/components/shared/ProModal/ProModal"
import { Button, Grid } from "@mui/material"
import { FieldValues } from "react-hook-form"

type TProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SpecialistModal = ({ open, setOpen }: TProps) => {
	const handleFormSubmit = (values: FieldValues) => {
		console.log(values)
	}
	return (
		<ProModal open={open} setOpen={setOpen} title={"Create a new Specialty"}>
			<ProForm onSubmit={handleFormSubmit}>
				<Grid container spacing={2}>
					<Grid size={{ md: 6 }}>
						<ProInput name="title" label="Title" />
					</Grid>
					<Grid size={{ md: 6 }}>
						<ProFileUploader name="file" label="Upload File" />
					</Grid>
				</Grid>
				<Button sx={{ mt: 2 }} type={"submit"}>
					Create
				</Button>
			</ProForm>
		</ProModal>
	)
}

export default SpecialistModal
