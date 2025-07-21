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
import React, { useState } from "react"
import { FieldValues } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export const validationSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
})

const LoginPage = () => {
	const router = useRouter()
	const [error, setError] = useState()

	const handleLogin = async (values: FieldValues) => {
		try {
			const res = await userLogin(values)
			if (res.data.accessToken) {
				toast.success(res.message)
				storeUserInfo({ accessToken: res.data.accessToken })
				// router.push("/dashboard")
			} else {
				setError(res.message)
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
					{error && (
						<Box>
							<Typography
								sx={{
									background: "red",
									padding: "1px",
									borderRadius: "2px",
									color: "white",
									marginTop: 2,
								}}
							>
								{error}
							</Typography>
						</Box>
					)}
					<Box>
						<ProForm
							onSubmit={handleLogin}
							resolver={zodResolver(validationSchema)}
							defaultValues={{ email: "", password: "" }}
						>
							<Grid container spacing={3} my={2}>
								<Grid size={{ md: 6 }}>
									<ProInput name="email" label="Email" type="email" fullWidth />
								</Grid>
								<Grid size={{ md: 6 }}>
									<ProInput
										name="password"
										label="Password"
										type="password"
										fullWidth
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
