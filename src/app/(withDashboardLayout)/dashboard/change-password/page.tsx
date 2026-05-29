/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import { useChangePasswordMutation } from "@/redux/api/authApi"

type Requirement = { label: string; met: boolean }

const computeReqs = (pw: string): Requirement[] => [
	{ label: "At least 8 characters", met: pw.length >= 8 },
	{ label: "Upper and lowercase letters", met: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
	{ label: "At least one number", met: /\d/.test(pw) },
	{ label: "At least one symbol", met: /[^A-Za-z0-9]/.test(pw) },
]

const strengthOf = (pw: string) => {
	const score = computeReqs(pw).filter((r) => r.met).length
	const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"]
	const colors = [SHELL.urgent, SHELL.urgent, SHELL.warning, "#0E7C7B", SHELL.success]
	return {
		score,
		label: pw ? labels[score] : "",
		color: pw ? colors[score] : SHELL.bgSoft,
	}
}

type PasswordInputProps = {
	value: string
	onChange: (v: string) => void
	label: string
	placeholder?: string
	autoComplete?: string
}

const PasswordInput = ({
	value,
	onChange,
	label,
	placeholder,
	autoComplete,
}: PasswordInputProps) => {
	const [show, setShow] = useState(false)
	return (
		<Box>
			<Typography
				sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.75 }}
			>
				{label}
			</Typography>
			<TextField
				value={value}
				onChange={(e) => onChange(e.target.value)}
				type={show ? "text" : "password"}
				placeholder={placeholder}
				fullWidth
				size="small"
				autoComplete={autoComplete}
				slotProps={{
					input: {
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => setShow((s) => !s)}
									edge="end"
									size="small"
									tabIndex={-1}
								>
									{show ? (
										<VisibilityOffOutlinedIcon fontSize="small" />
									) : (
										<VisibilityOutlinedIcon fontSize="small" />
									)}
								</IconButton>
							</InputAdornment>
						),
					},
				}}
			/>
		</Box>
	)
}

const ChangePasswordPage = () => {
	const router = useRouter()
	const [currentPw, setCurrentPw] = useState("")
	const [newPw, setNewPw] = useState("")
	const [confirmPw, setConfirmPw] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [changePassword, { isLoading }] = useChangePasswordMutation()

	const reqs = useMemo(() => computeReqs(newPw), [newPw])
	const strength = useMemo(() => strengthOf(newPw), [newPw])
	const allReqsMet = reqs.every((r) => r.met)
	const matches = confirmPw.length > 0 && newPw === confirmPw

	const canSubmit = currentPw.length >= 6 && allReqsMet && matches && !isLoading

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		if (!canSubmit) return
		try {
			const res = await changePassword({
				oldPassword: currentPw,
				newPassword: newPw,
			}).unwrap()
			toast.success(res?.message ?? "Password updated")
			setCurrentPw("")
			setNewPw("")
			setConfirmPw("")
			router.push("/dashboard")
		} catch (err: any) {
			setError(
				err?.message ??
					err?.data?.message ??
					"Could not update password. Please try again."
			)
		}
	}

	return (
		<Box sx={{ display: "flex", justifyContent: "center", py: { xs: 1, md: 3 } }}>
			<Box
				sx={{
					width: "100%",
					maxWidth: 480,
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "22px",
					p: { xs: 4, md: 5 },
					boxShadow: "0 24px 48px -16px rgba(15, 30, 46, 0.06)",
				}}
			>
				<Box
					sx={{
						width: 48,
						height: 48,
						borderRadius: "14px",
						bgcolor: "primary.light",
						color: "primary.main",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						mb: 3,
					}}
				>
					<LockOutlinedIcon sx={{ fontSize: 22 }} />
				</Box>

				<Typography
					component="h1"
					sx={{
						fontSize: { xs: 24, md: 28 },
						fontWeight: 600,
						letterSpacing: "-0.025em",
						color: "text.primary",
						lineHeight: 1.2,
					}}
				>
					Change your password
				</Typography>
				<Typography
					sx={{ mt: 1, color: "text.secondary", fontSize: 14, lineHeight: 1.55 }}
				>
					Pick something memorable but unique to Medicare. We&apos;ll log you out of
					other devices when you save.
				</Typography>

				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3.5 }} noValidate>
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
						<PasswordInput
							value={currentPw}
							onChange={setCurrentPw}
							label="Current password"
							placeholder="Enter current password"
							autoComplete="current-password"
						/>

						<Box>
							<PasswordInput
								value={newPw}
								onChange={setNewPw}
								label="New password"
								placeholder="At least 8 characters"
								autoComplete="new-password"
							/>
							<Stack
								direction="row"
								sx={{ alignItems: "center", gap: 1, mt: 0.75 }}
							>
								<Stack
									direction="row"
									sx={{
										flex: 1,
										height: 4,
										borderRadius: "2px",
										gap: "2px",
										bgcolor: "divider",
										overflow: "hidden",
									}}
								>
									{[0, 1, 2, 3].map((i) => (
										<Box
											key={i}
											sx={{
												flex: 1,
												borderRadius: "2px",
												bgcolor: i < strength.score ? strength.color : "divider",
											}}
										/>
									))}
								</Stack>
								{strength.label && (
									<Typography
										sx={{
											fontFamily: MONO,
											fontSize: 11,
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											color: strength.score >= 4 ? "#0E7C7B" : "text.secondary",
										}}
									>
										{strength.label}
									</Typography>
								)}
							</Stack>
						</Box>

						<Box>
							<PasswordInput
								value={confirmPw}
								onChange={setConfirmPw}
								label="Confirm new password"
								placeholder="Re-enter new password"
								autoComplete="new-password"
							/>
							{confirmPw.length > 0 && (
								<Stack
									direction="row"
									sx={{
										alignItems: "center",
										gap: 0.75,
										mt: 0.75,
										fontSize: 12,
										color: matches ? SHELL.success : SHELL.urgent,
									}}
								>
									{matches && <CheckRoundedIcon sx={{ fontSize: 14 }} />}
									<Box component="span">
										{matches ? "Passwords match" : "Passwords don't match"}
									</Box>
								</Stack>
							)}
						</Box>
					</Stack>

					<Stack component="ul" sx={{ listStyle: "none", p: 0, mt: 2.25, gap: 1 }}>
						{reqs.map((r) => (
							<Stack
								key={r.label}
								component="li"
								direction="row"
								sx={{
									alignItems: "center",
									gap: 1.25,
									fontSize: 13,
									color: r.met ? SHELL.success : "text.secondary",
								}}
							>
								<Box
									sx={{
										width: 16,
										height: 16,
										borderRadius: "50%",
										border: "1.5px solid",
										borderColor: r.met ? SHELL.success : "divider",
										bgcolor: r.met ? SHELL.success : "transparent",
										color: "#fff",
										display: "inline-flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
									}}
								>
									{r.met && <CheckRoundedIcon sx={{ fontSize: 10 }} />}
								</Box>
								<Box component="span">{r.label}</Box>
							</Stack>
						))}
					</Stack>

					<Stack direction="row" sx={{ gap: 1.25, mt: 3.5 }}>
						<Button
							type="button"
							variant="outlined"
							onClick={() => router.push("/dashboard")}
							sx={{
								flex: 1,
								bgcolor: "#fff",
								color: "text.primary",
								borderColor: "divider",
								py: 1.5,
								fontSize: 14,
								"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
							}}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!canSubmit}
							sx={{ flex: 2, py: 1.5, fontSize: 14 }}
						>
							{isLoading ? "Updating…" : "Update password"}
						</Button>
					</Stack>

					<Typography
						sx={{
							mt: 2.5,
							textAlign: "center",
							fontSize: 12,
							color: "text.secondary",
						}}
					>
						Can&apos;t remember your current password?{" "}
						<Typography
							component={Link}
							href="/forgot-password"
							sx={{
								fontSize: 12,
								color: "primary.main",
								fontWeight: 600,
								textDecoration: "none",
								"&:hover": { textDecoration: "underline" },
							}}
						>
							Reset via email →
						</Typography>
					</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default ChangePasswordPage
