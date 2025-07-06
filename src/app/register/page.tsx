/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import assets from "@/assets"
import { registerPatient } from "@/services/actions/registerPatient"
import { IPatientRegisterFromData } from "@/types"
import { modifyPayload } from "@/utils/modifyPayload"
import {
	Box,
	Button,
	Container,
	Grid,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

const RegisterPage = () => {
	const router = useRouter()
	const { register, handleSubmit } = useForm<IPatientRegisterFromData>()
	const onSubmit: SubmitHandler<IPatientRegisterFromData> = async (values) => {
		const data = modifyPayload(values)
		try {
			const res = await registerPatient(data)
			if (res?.data?.id) {
				toast.success(res?.message)
				router.push("/login")
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
						<form onSubmit={handleSubmit(onSubmit)}>
							<Grid container spacing={3} my={2}>
								<Grid size={{ md: 12 }}>
									<TextField
										label="Name"
										type="text"
										variant="outlined"
										size="small"
										fullWidth
										{...register("patient.name")}
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<TextField
										label="Email"
										type="email"
										variant="outlined"
										size="small"
										fullWidth
										{...register("patient.email")}
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<TextField
										label="Password"
										type="password"
										variant="outlined"
										size="small"
										fullWidth
										{...register("password")}
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<TextField
										label="Contact Number"
										type="tel"
										variant="outlined"
										size="small"
										fullWidth
										{...register("patient.contactNumber")}
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<TextField
										label="Address"
										type="text"
										variant="outlined"
										size="small"
										fullWidth
										{...register("patient.address")}
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
						</form>
					</Box>
				</Box>
			</Stack>
		</Container>
	)
}

export default RegisterPage
