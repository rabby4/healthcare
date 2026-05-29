/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, FieldValues, FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import AuthShell from "@/components/auth/AuthShell"
import PasswordField from "@/components/auth/PasswordField"
import { registerPatient } from "@/services/actions/registerPatient"
import { userLogin } from "@/services/actions/userLogin"
import { storeUserInfo } from "@/services/auth.services"
import { modifyPayload } from "@/utils/modifyPayload"

export const patientValidationSchema = z.object({
	name: z.string().min(1, "Please enter your full name"),
	email: z.string().email("Please provide a valid email address"),
	contactNumber: z
		.string()
		.regex(/^\d{11}$/, "Please provide a valid 11-digit phone number"),
	address: z.string().min(1, "Please enter your address"),
})

export const validationSchema = z.object({
	password: z.string().min(6, "Password must be at least 6 characters"),
	patient: patientValidationSchema,
})

const defaultValues = {
	password: "",
	patient: { name: "", email: "", contactNumber: "", address: "" },
}

const RegisterPage = () => {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const methods = useForm({
		resolver: zodResolver(validationSchema),
		defaultValues,
	})
	const { control, handleSubmit } = methods

	const onSubmit = async (values: FieldValues) => {
		setError(null)
		setLoading(true)
		try {
			const data = modifyPayload(values)
			const res = await registerPatient(data)
			if (res?.data?.id) {
				toast.success(res.message ?? "Account created")
				const result = await userLogin({
					password: values.password,
					email: values.patient.email,
				})
				if (result?.data?.accessToken) {
					storeUserInfo({ accessToken: result.data.accessToken })
				} else {
					router.push("/login")
				}
			} else {
				setError(res?.message ?? "Could not create your account. Please try again.")
			}
		} catch (e: any) {
			setError(e?.message ?? "Something went wrong. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<AuthShell
			title="Create your account"
			subtitle="Free for life. Book your first consultation in under two minutes."
			icon={<PersonAddRoundedIcon sx={{ fontSize: 22 }} />}
			switchPrompt="Already have an account?"
			switchHref="/login"
			switchLabel="Sign in"
			maxWidth={560}
		>
			<FormProvider {...methods}>
				<Box
					component="form"
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					sx={{ mt: 3.5 }}
				>
					{error && (
						<Box
							sx={{
								bgcolor: "rgba(217, 98, 74, 0.08)",
								border: "1px solid",
								borderColor: "rgba(217, 98, 74, 0.3)",
								color: "error.main",
								borderRadius: "10px",
								px: 2,
								py: 1.25,
								mb: 2.5,
								fontSize: 13,
							}}
						>
							{error}
						</Box>
					)}

					<Stack sx={{ gap: 2 }}>
						<Controller
							control={control}
							name="patient.name"
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Full name"
									fullWidth
									autoComplete="name"
									placeholder="Jane Doe"
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>

						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
								gap: 2,
							}}
						>
							<Controller
								control={control}
								name="patient.email"
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Email"
										type="email"
										fullWidth
										autoComplete="email"
										placeholder="you@example.com"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
							<PasswordField
								name="password"
								label="Password"
								placeholder="At least 6 characters"
							/>
						</Box>

						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
								gap: 2,
							}}
						>
							<Controller
								control={control}
								name="patient.contactNumber"
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Phone number"
										type="tel"
										fullWidth
										autoComplete="tel"
										placeholder="01XXXXXXXXX"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								control={control}
								name="patient.address"
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Address"
										fullWidth
										autoComplete="street-address"
										placeholder="Dhaka, Bangladesh"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
						</Box>
					</Stack>

					<Button
						type="submit"
						fullWidth
						disabled={loading}
						sx={{ mt: 3.5, py: 1.5, fontSize: 15 }}
					>
						{loading ? "Creating account…" : "Create account"}
					</Button>

					<Typography
						sx={{
							mt: 2.5,
							textAlign: "center",
							fontSize: 12,
							color: "text.secondary",
							lineHeight: 1.55,
						}}
					>
						By creating an account you agree to our{" "}
						<Box component="span" sx={{ color: "text.primary", fontWeight: 500 }}>
							Terms
						</Box>{" "}
						and{" "}
						<Box component="span" sx={{ color: "text.primary", fontWeight: 500 }}>
							Privacy Policy
						</Box>
						.
					</Typography>

					<Typography
						sx={{
							mt: 3,
							textAlign: "center",
							fontSize: 13,
							color: "text.secondary",
						}}
					>
						Already have an account?{" "}
						<Typography
							component={Link}
							href="/login"
							sx={{
								fontSize: 13,
								color: "primary.main",
								fontWeight: 600,
								textDecoration: "none",
								"&:hover": { textDecoration: "underline" },
							}}
						>
							Sign in →
						</Typography>
					</Typography>
				</Box>
			</FormProvider>
		</AuthShell>
	)
}

export default RegisterPage
