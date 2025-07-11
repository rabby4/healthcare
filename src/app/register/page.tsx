/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import assets from "@/assets"
import ProForm from "@/components/form/ProForm"
import ProInput from "@/components/form/ProInput"
import { registerPatient } from "@/services/actions/registerPatient"
import { userLogin } from "@/services/actions/userLogin"
import { storeUserInfo } from "@/services/auth.services"
import { modifyPayload } from "@/utils/modifyPayload"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FieldValues } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export const patientValidationSchema = z.object({
	name: z.string().min(1, "Please enter your full name!"),
	email: z.string().email("Please provide a valid email address"),
	contactNumber: z
		.string()
		.regex(/^\d{11}$/, "Please provide a valid phone number"),
	address: z.string().min(1, "Please enter your address"),
})

export const validationSchema = z.object({
	password: z.string().min(6, "Password must be at least 6 characters!"),
	patient: patientValidationSchema,
})

export const defaultValues = {
	password: "",
	patient: {
		name: "",
		email: "",
		contactNumber: "",
		address: "",
	},
}

const RegisterPage = () => {
	const router = useRouter()

	const handleRegister = async (values: FieldValues) => {
		const data = modifyPayload(values)
		try {
			const res = await registerPatient(data)
			if (res?.data?.id) {
				toast.success(res?.message)
				const result = await userLogin({
					password: values.password,
					email: values.patient.email,
				})

				if (result.data.accessToken) {
					storeUserInfo({ accessToken: result.data.accessToken })
					router.push("/")
				}
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	return (
		<Container>
			<Stack
				sx={{ justifyContent: "center", alignItems: "center", height: "100vh" }}
			>
				<Box
					sx={{
						maxWidth: 600,
						width: "100%",
						boxShadow: 1,
						borderRadius: 1,
						p: 4,
						textAlign: "center",
					}}
				>
					<Stack sx={{ justifyContent: "center", alignItems: "center" }}>
						<Box>
							<Image src={assets.svgs.logo} width={50} height={50} alt="logo" />
						</Box>
						<Box>
							<Typography variant="h5" fontWeight={700}>
								Patient Register
							</Typography>
						</Box>
					</Stack>
					<Box>
						<ProForm
							onSubmit={handleRegister}
							resolver={zodResolver(validationSchema)}
							defaultValues={defaultValues}
						>
							<Grid container spacing={3} my={2}>
								<Grid size={{ md: 12 }}>
									<ProInput label="Name" fullWidth name="patient.name" />
								</Grid>
								<Grid size={{ md: 6 }}>
									<ProInput
										label="Email"
										type="Email"
										fullWidth
										name="patient.email"
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<ProInput
										label="Password"
										type="password"
										fullWidth
										name="password"
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<ProInput
										label="Contact Number"
										type="tel"
										fullWidth
										name="patient.contactNumber"
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<ProInput
										label="Address"
										type="text"
										fullWidth
										name="patient.address"
									/>
								</Grid>
							</Grid>
							<Button type="submit" fullWidth sx={{ my: 2 }}>
								Register
							</Button>
							<Typography component="p">
								Do you already have an account?{" "}
								<Link href={"/login"} className="text-blue-500">
									Login
								</Link>
							</Typography>
						</ProForm>
					</Box>
				</Box>
			</Stack>
		</Container>
	)
}

export default RegisterPage
