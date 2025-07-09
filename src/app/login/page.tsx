/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import assets from "@/assets"
import ProForm from "@/components/form/ProForm"
import ProInput from "@/components/form/ProInput"
import { userLogin } from "@/services/actions/userLogin"
import { storeUserInfo } from "@/services/auth.services"
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { FieldValues } from "react-hook-form"
import { toast } from "sonner"

const LoginPage = () => {
	const router = useRouter()

	const handleLogin = async (values: FieldValues) => {
		try {
			const res = await userLogin(values)
			if (res.data.accessToken) {
				toast.success(res.message)
				storeUserInfo({ accessToken: res.data.accessToken })
				router.push("/")
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	return (
		<Container>
			<Stack
				sx={{ height: "100vh", justifyContent: "center", alignItems: "center" }}
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
								Login Health Care
							</Typography>
						</Box>
					</Stack>
					<Box>
						<ProForm onSubmit={handleLogin}>
							<Grid container spacing={3} my={2}>
								<Grid size={{ md: 6 }}>
									<ProInput
										name="email"
										label="Email"
										type="email"
										fullWidth
										required={true}
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<ProInput
										name="password"
										label="Password"
										type="password"
										fullWidth
										required={true}
									/>
								</Grid>
							</Grid>
							<Typography component="p" textAlign={"right"}>
								<Link href={"/"}>Forget Password?</Link>
							</Typography>
							<Button type="submit" fullWidth sx={{ my: 2 }}>
								Login
							</Button>
							<Typography component="p">
								Don&apos;t have an account?{" "}
								<Link href={"/register"} className="text-blue-500">
									Register
								</Link>
							</Typography>
						</ProForm>
					</Box>
				</Box>
			</Stack>
		</Container>
	)
}

export default LoginPage
