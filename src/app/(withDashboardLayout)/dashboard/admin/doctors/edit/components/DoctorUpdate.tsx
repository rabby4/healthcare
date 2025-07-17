"use client"
import ProForm from "@/components/form/ProForm"
import ProInput from "@/components/form/ProInput"
import ProSelectField from "@/components/form/ProSelectField"
import {
	useGetDoctorQuery,
	useUpdateDoctorMutation,
} from "@/redux/api/doctorApi"
import { Gender } from "@/types"
import { Box, Button, Grid, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { FieldValues } from "react-hook-form"
import { toast } from "sonner"

const DoctorUpdate = ({ doctorId }: { doctorId: string }) => {
	const { data, isLoading } = useGetDoctorQuery(doctorId)
	const [updateDoctor] = useUpdateDoctorMutation()
	const router = useRouter()

	const handleFormSubmit = async (values: FieldValues) => {
		values.experience = Number(values.experience)
		values.appointmentFee = Number(values.appointmentFee)
		values.id = doctorId
		console.log({ id: values.id, body: values })

		try {
			const res = await updateDoctor({ id: values.id, body: values }).unwrap()
			if (res?.id) {
				toast.success("Doctor update successfully!!!")
				router.push("/dashboard/admin/doctors")
			}
			console.log(values)
		} catch (error) {
			console.log(error)
		}
	}

	const defaultValues = {
		name: data?.name || "",
		contactNumber: data?.contactNumber || "",
		address: data?.address || "",
		registrationNumber: data?.registrationNumber || "",
		gender: data?.gender || "",
		experience: data?.experience || 0,
		appointmentFee: data?.appointmentFee || 0,
		qualification: data?.qualification || "",
		currentWorkingPlace: data?.currentWorkingPlace || "",
		designation: data?.designation || "",
	}

	return (
		<Box>
			<Typography component={"h4"} variant="h4">
				Update doctor info
			</Typography>
			{!isLoading ? (
				<ProForm onSubmit={handleFormSubmit} defaultValues={defaultValues}>
					<Grid container spacing={2} sx={{ my: 5 }}>
						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProInput name="name" label="Name" fullWidth sx={{ mb: 2 }} />
						</Grid>

						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProInput
								name="contactNumber"
								label="Contact Number"
								fullWidth
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProInput
								name="address"
								label="Address"
								fullWidth
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProInput
								name="registrationNumber"
								label="Registration Number"
								fullWidth
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProInput
								name="experience"
								label="Experience"
								type="number"
								fullWidth
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProSelectField
								items={Gender}
								name="gender"
								label="Gender"
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProInput
								name="appointmentFee"
								label="Appointment Fee"
								type="number"
								fullWidth
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProInput
								name="qualification"
								label="Qualification"
								fullWidth
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProInput
								name="currentWorkingPlace"
								label="Current Working Place"
								fullWidth={true}
								sx={{ mb: 2 }}
							/>
						</Grid>
						<Grid size={{ md: 4, sm: 12, xs: 12 }}>
							<ProInput
								name="designation"
								label="Designation"
								fullWidth={true}
								sx={{ mb: 2 }}
							/>
						</Grid>
					</Grid>
					<Button type="submit">Update</Button>
				</ProForm>
			) : (
				"loading..."
			)}
		</Box>
	)
}

export default DoctorUpdate
