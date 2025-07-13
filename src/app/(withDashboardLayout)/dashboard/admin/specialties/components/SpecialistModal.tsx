/* eslint-disable @typescript-eslint/no-explicit-any */
import ProFileUploader from "@/components/form/ProFileUploader"
import ProForm from "@/components/form/ProForm"
import ProInput from "@/components/form/ProInput"
import ProModal from "@/components/shared/ProModal/ProModal"
import { useCreateSpecialtyMutation } from "@/redux/api/specialtiesApi"
import { modifyPayload } from "@/utils/modifyPayload"
import { Button, Grid } from "@mui/material"
import { FieldValues } from "react-hook-form"
import { toast } from "sonner"

type TProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SpecialistModal = ({ open, setOpen }: TProps) => {
	const [createSpecialty] = useCreateSpecialtyMutation()

	const handleFormSubmit = async (values: FieldValues) => {
		const data = modifyPayload(values)

		try {
			const res = await createSpecialty(data).unwrap()
			if (res?.id) {
				toast.success("Specialty created successfully!")
				setOpen(false)
			}
		} catch (error: any) {
			console.log(error.message)
		}
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
