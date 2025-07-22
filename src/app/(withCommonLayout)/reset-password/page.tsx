/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import LockResetIcon from "@mui/icons-material/LockReset"
import ProForm from "@/components/form/ProForm"
import ProInput from "@/components/form/ProInput"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useResetPasswordMutation } from "@/redux/api/authApi"
import { useEffect } from "react"
import { authKey } from "@/constants/authKey"
import { FieldValues } from "react-hook-form"
import { toast } from "sonner"
import { deleteCookies } from "@/services/actions/deleteCookies"

const validationSchema = z.object({
	password: z.string().min(6, "Must be at least 6 characters long"),
})

const ResetPassword = () => {
	const searchParams = useSearchParams()
	const id = searchParams.get("id")
	const token = searchParams.get("token")

	const router = useRouter()

	const [resetPassword] = useResetPasswordMutation()

	useEffect(() => {
		if (!token) return
		localStorage.setItem(authKey, token)
	}, [token])

	const onSubmit = async (values: FieldValues) => {
		const updatedData = { ...values, id }
		console.log(updatedData)

		try {
			const res = await resetPassword(updatedData)

			if ("data" in res && res.data.status === 200) {
				toast.success("Password Reset Successful")
				localStorage.removeItem(authKey)
				deleteCookies([authKey, "refreshToken"])
				router.push("/login")
			} else {
				throw new Error("Something Went Wrong, Try Again")
			}
		} catch (error) {
			toast.success("Something Went Wrong, Try Again")
		}
	}

	return (
		<Box
			sx={{
				px: 4,
				py: 2,
				maxWidth: 600,
				width: "100%",
				boxShadow: 1,
				borderRadius: 1,
				mx: "auto",
				mt: { xs: 2, md: 10 },
			}}
		>
			<Stack alignItems="center" justifyContent="center">
				<Box
					sx={{
						"& svg": {
							width: 100,
							height: 100,
						},
					}}
				>
					<LockResetIcon sx={{ color: "primary.main" }} />
				</Box>
				<Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
					Reset password
				</Typography>
			</Stack>
			<ProForm
				onSubmit={onSubmit}
				defaultValues={{ password: "" }}
				resolver={zodResolver(validationSchema)}
			>
				<Grid>
					<Grid size={{ xs: 12, sm: 12, md: 6 }}>
						<ProInput
							name="password"
							type="password"
							label="New Password"
							sx={{ mb: 2 }}
							fullWidth
						/>
					</Grid>
				</Grid>

				<Button type="submit" sx={{ width: "100%", my: 2 }}>
					Reset Password
				</Button>
			</ProForm>
		</Box>
	)
}

export default ResetPassword
