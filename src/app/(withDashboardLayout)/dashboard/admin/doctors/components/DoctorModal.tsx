import ProForm from "@/components/form/ProForm"
import ProInput from "@/components/form/ProInput"
import ProSelectField from "@/components/form/ProSelectField"
import ProFullScreenModal from "@/components/shared/ProModal/ProFullScreenModal"
import { useCreateDoctorMutation } from "@/redux/api/doctorApi"
import { Gender } from "@/types"
import { modifyPayload } from "@/utils/modifyPayload"
import { Button, Grid } from "@mui/material"
import { FieldValues } from "react-hook-form"
import { toast } from "sonner"

type TProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DoctorModal = ({ open, setOpen }: TProps) => {
	const [createDoctor] = useCreateDoctorMutation()

	const handleFormSubmit = async (values: FieldValues) => {
		values.doctor.experience = Number(values.doctor.experience)
		values.doctor.appointmentFee = Number(values.doctor.appointmentFee)
		const data = modifyPayload(values)

		try {
			const res = await createDoctor(data).unwrap()
			if (res.id) {
				toast.success("Doctor created successfully!!!")
			}
		} catch (error) {
			console.log(error)
		}
	}

	const defaultValues = {
		password: "",
		doctor: {
			email: "",
			name: "",
			contactNumber: "",
			address: "",
			registrationNumber: "",
			gender: "",
			experience: 0,
			appointmentFee: 0,
			qualification: "",
			currentWorkingPlace: "",
			designation: "",
			profilePhoto: "",
		},
	}
	return (
		<ProFullScreenModal open={open} setOpen={setOpen} title="Create New Doctor">
			<ProForm onSubmit={handleFormSubmit} defaultValues={defaultValues}>
				<Grid container spacing={2} sx={{ my: 5 }}>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.name"
							label="Name"
							fullWidth
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.email"
							label="Email"
							type="email"
							fullWidth
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="password"
							label="Password"
							type="password"
							fullWidth
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.contactNumber"
							label="Contact Number"
							fullWidth
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.address"
							label="Address"
							fullWidth
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.registrationNumber"
							label="Registration Number"
							fullWidth
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.experience"
							label="Experience"
							type="number"
							fullWidth
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProSelectField
							items={Gender}
							name="doctor.gender"
							label="Gender"
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.appointmentFee"
							label="Appointment Fee"
							type="number"
							fullWidth
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.qualification"
							label="Qualification"
							fullWidth
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.currentWorkingPlace"
							label="Current Working Place"
							fullWidth={true}
							sx={{ mb: 2 }}
						/>
					</Grid>
					<Grid size={{ md: 4, sm: 12, xs: 12 }}>
						<ProInput
							name="doctor.designation"
							label="Designation"
							fullWidth={true}
							sx={{ mb: 2 }}
						/>
					</Grid>
				</Grid>
				<Button type="submit">Create</Button>
			</ProForm>
		</ProFullScreenModal>
	)
}

export default DoctorModal
