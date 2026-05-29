/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import LoginRoundedIcon from "@mui/icons-material/LoginRounded"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { Controller, FieldValues, FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import AuthShell from "@/components/auth/AuthShell"
import PasswordField from "@/components/auth/PasswordField"
import { storeUserInfo } from "@/services/auth.services"
import { userLogin } from "@/services/actions/userLogin"

export const validationSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
})

const LoginPage = () => {
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const methods = useForm({
		resolver: zodResolver(validationSchema),
		defaultValues: { email: "", password: "" },
	})
	const { control, handleSubmit } = methods

	const onSubmit = async (values: FieldValues) => {
		setError(null)
		setLoading(true)
		try {
			const res = await userLogin(values)
			if (res?.data?.accessToken) {
				toast.success(res.message ?? "Welcome back")
				storeUserInfo({ accessToken: res.data.accessToken })
			} else {
				setError(res?.message ?? "Login failed. Please check your credentials.")
			}
		} catch (e: any) {
			setError(e?.message ?? "Something went wrong. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<AuthShell
			title="Welcome back"
			subtitle="Sign in to manage your appointments, view prescriptions, and start a secure video consultation."
			icon={<LoginRoundedIcon sx={{ fontSize: 22 }} />}
			switchPrompt="New to Medicare?"
			switchHref="/register"
			switchLabel="Create account"
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
							name="email"
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
							placeholder="Enter your password"
						/>
					</Stack>

					<Box sx={{ mt: 1.25, textAlign: "right" }}>
						<Typography
							component={Link}
							href="/forgot-password"
							sx={{
								fontSize: 13,
								fontWeight: 500,
								color: "primary.main",
								textDecoration: "none",
								"&:hover": { textDecoration: "underline" },
							}}
						>
							Forgot password?
						</Typography>
					</Box>

					<Button
						type="submit"
						fullWidth
						disabled={loading}
						sx={{ mt: 3, py: 1.5, fontSize: 15 }}
					>
						{loading ? "Signing in…" : "Sign in"}
					</Button>

					<Typography
						sx={{
							mt: 3,
							textAlign: "center",
							fontSize: 13,
							color: "text.secondary",
						}}
					>
						Don&apos;t have an account?{" "}
						<Typography
							component={Link}
							href="/register"
							sx={{
								fontSize: 13,
								color: "primary.main",
								fontWeight: 600,
								textDecoration: "none",
								"&:hover": { textDecoration: "underline" },
							}}
						>
							Create one →
						</Typography>
					</Typography>
				</Box>
			</FormProvider>
		</AuthShell>
	)
}

export default LoginPage
