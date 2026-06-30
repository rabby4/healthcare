/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
	useGetMYProfileQuery,
	useUpdateMYProfileMutation,
} from "@/redux/api/myProfileApi"
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi"
import { useUpdateDoctorMutation } from "@/redux/api/doctorApi"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import {
	Avatar,
	Box,
	Button,
	Chip,
	CircularProgress,
	InputAdornment,
	Skeleton,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined"
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined"

// ── helpers ────────────────────────────────────────────────────────────
const initialsOf = (name?: string) => {
	if (!name) return "DR"
	const parts = name
		.replace(/^dr\.?\s*/i, "")
		.trim()
		.split(/\s+/)
		.filter(Boolean)
	if (parts.length === 0) return "DR"
	return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

type ScalarForm = {
	name: string
	gender: "MALE" | "FEMALE"
	experience: string
	contactNumber: string
	currentWorkingPlace: string
	address: string
	qualification: string
	appointmentFee: string
}

const EMPTY_FORM: ScalarForm = {
	name: "",
	gender: "MALE",
	experience: "",
	contactNumber: "",
	currentWorkingPlace: "",
	address: "",
	qualification: "",
	appointmentFee: "",
}

// ── shared style atoms ─────────────────────────────────────────────────
const cardSx = {
	bgcolor: "#fff",
	border: "1px solid",
	borderColor: "divider",
	borderRadius: "22px",
	p: 3,
}

const cardHeadSx = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 1.5,
	mb: 2.25,
}

const labelSx = {
	display: "block",
	fontSize: 12,
	fontWeight: 600,
	color: "text.secondary",
	mb: 0.75,
}

const fieldProps = {
	fullWidth: true,
	size: "small" as const,
	slotProps: {
		input: { sx: { borderRadius: "10px", fontSize: 14, bgcolor: "#fff" } },
	},
}

const eyebrowSx = {
	fontFamily: MONO,
	fontSize: 11,
	color: "text.secondary",
	letterSpacing: "0.08em",
	textTransform: "uppercase" as const,
}

const DemoTag = () => (
	<Box
		component="span"
		sx={{
			ml: 1,
			px: 0.75,
			py: 0.25,
			borderRadius: "6px",
			fontSize: 10,
			fontWeight: 700,
			letterSpacing: "0.06em",
			textTransform: "uppercase",
			fontFamily: MONO,
			bgcolor: SHELL.warningBg,
			color: SHELL.warning,
		}}
	>
		Demo
	</Box>
)

const SectionCard = ({
	id,
	title,
	headRight,
	children,
}: {
	id?: string
	title: React.ReactNode
	headRight?: React.ReactNode
	children: React.ReactNode
}) => (
	<Box id={id} sx={cardSx}>
		<Box sx={cardHeadSx}>
			<Typography component="h3" sx={{ fontSize: 16, fontWeight: 600 }}>
				{title}
			</Typography>
			{headRight}
		</Box>
		{children}
	</Box>
)

const Field = ({
	label,
	help,
	...rest
}: {
	label: string
	help?: string
} & React.ComponentProps<typeof TextField>) => (
	<Box>
		<Box component="label" sx={labelSx}>
			{label}
		</Box>
		<TextField {...fieldProps} {...rest} />
		{help && (
			<Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.75 }}>
				{help}
			</Typography>
		)}
	</Box>
)

const DoctorProfilePage = () => {
	const { data: profile, isLoading } = useGetMYProfileQuery(undefined)
	const { data: specialtiesData } = useGetAllSpecialtiesQuery(undefined)
	const allSpecialties: any[] = Array.isArray(specialtiesData)
		? specialtiesData
		: []

	const [updateMYProfile, { isLoading: savingScalar }] =
		useUpdateMYProfileMutation()
	const [updateDoctor, { isLoading: savingSpecialties }] =
		useUpdateDoctorMutation()
	const saving = savingScalar || savingSpecialties

	const [form, setForm] = useState<ScalarForm>(EMPTY_FORM)
	const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
	const [originalSpecialties, setOriginalSpecialties] = useState<string[]>([])
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Seed controlled state once the profile arrives
	useEffect(() => {
		if (!profile) return
		setForm({
			name: profile.name ?? "",
			gender: profile.gender === "FEMALE" ? "FEMALE" : "MALE",
			experience:
				profile.experience !== undefined && profile.experience !== null
					? String(profile.experience)
					: "",
			contactNumber: profile.contactNumber ?? "",
			currentWorkingPlace: profile.currentWorkingPlace ?? "",
			address: profile.address ?? "",
			qualification: profile.qualification ?? "",
			appointmentFee:
				profile.appointmentFee !== undefined &&
				profile.appointmentFee !== null
					? String(profile.appointmentFee)
					: "",
		})
		const ids: string[] = (profile.doctorSpecialties ?? [])
			.map((s: any) => s?.specialtiesId)
			.filter(Boolean)
		setSelectedSpecialties(ids)
		setOriginalSpecialties(ids)
	}, [profile])

	const setField = (key: keyof ScalarForm, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }))

	const onPickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setAvatarFile(file)
		setAvatarPreview(URL.createObjectURL(file))
	}

	const toggleSpecialty = (id: string) =>
		setSelectedSpecialties((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		)

	const resetForm = () => {
		if (!profile) return
		setAvatarFile(null)
		setAvatarPreview(null)
		setForm({
			name: profile.name ?? "",
			gender: profile.gender === "FEMALE" ? "FEMALE" : "MALE",
			experience:
				profile.experience !== undefined && profile.experience !== null
					? String(profile.experience)
					: "",
			contactNumber: profile.contactNumber ?? "",
			currentWorkingPlace: profile.currentWorkingPlace ?? "",
			address: profile.address ?? "",
			qualification: profile.qualification ?? "",
			appointmentFee:
				profile.appointmentFee !== undefined &&
				profile.appointmentFee !== null
					? String(profile.appointmentFee)
					: "",
		})
		setSelectedSpecialties(originalSpecialties)
	}

	const handleSave = async () => {
		if (!profile) return

		// Client-side validation (the backend has no zod on this route).
		if (!form.name.trim()) {
			toast.error("Name is required.")
			return
		}
		const feeNum = Number(form.appointmentFee)
		if (!form.appointmentFee.trim() || Number.isNaN(feeNum) || feeNum <= 0) {
			toast.error("Consultation fee must be a number greater than 0.")
			return
		}
		const expNum = Number(form.experience)
		if (form.experience.trim() && (Number.isNaN(expNum) || expNum < 0)) {
			toast.error("Experience must be a valid number of years.")
			return
		}

		// 1) scalar fields (+ optional avatar) via update-my-profile
		const payload = {
			name: form.name.trim(),
			gender: form.gender,
			experience: expNum || 0,
			contactNumber: form.contactNumber,
			currentWorkingPlace: form.currentWorkingPlace,
			address: form.address,
			qualification: form.qualification,
			appointmentFee: feeNum,
		}
		const fd = new FormData()
		fd.append("data", JSON.stringify(payload))
		if (avatarFile) fd.append("file", avatarFile)

		// 2) specialties diff via updateDoctor
		const added = selectedSpecialties.filter(
			(id) => !originalSpecialties.includes(id)
		)
		const removed = originalSpecialties.filter(
			(id) => !selectedSpecialties.includes(id)
		)
		const specialtiesBody = [
			...added.map((specialtiesId) => ({ specialtiesId, isDeleted: false })),
			...removed.map((specialtiesId) => ({ specialtiesId, isDeleted: true })),
		]

		try {
			await updateMYProfile(fd).unwrap()
			if (specialtiesBody.length > 0) {
				await updateDoctor({
					id: profile.id,
					body: { specialties: specialtiesBody },
				}).unwrap()
				setOriginalSpecialties(selectedSpecialties)
			}
			setAvatarFile(null)
			setAvatarPreview(null)
			toast.success("Profile updated")
		} catch (err: any) {
			toast.error(
				err?.data?.message || err?.message || "Something went wrong"
			)
		}
	}

	// ── loading skeleton ──────────────────────────────────────────────
	if (isLoading) {
		return (
			<Box>
				<Skeleton variant="text" width={220} height={42} />
				<Skeleton variant="text" width={360} height={24} sx={{ mb: 3 }} />
				<Stack spacing={3}>
					{[0, 1, 2].map((i) => (
						<Skeleton
							key={i}
							variant="rounded"
							height={220}
							sx={{ borderRadius: "22px" }}
						/>
					))}
				</Stack>
			</Box>
		)
	}

	const initials = initialsOf(profile?.name)
	const avatarSrc = avatarPreview || profile?.profilePhoto || undefined

	// Dirty-tracking: scalar fields vs seeded, avatar picked, or specialties changed.
	const scalarDirty = profile
		? form.name !== (profile.name ?? "") ||
			form.gender !== (profile.gender === "FEMALE" ? "FEMALE" : "MALE") ||
			form.experience !==
				(profile.experience != null ? String(profile.experience) : "") ||
			form.contactNumber !== (profile.contactNumber ?? "") ||
			form.currentWorkingPlace !== (profile.currentWorkingPlace ?? "") ||
			form.address !== (profile.address ?? "") ||
			form.qualification !== (profile.qualification ?? "") ||
			form.appointmentFee !==
				(profile.appointmentFee != null ? String(profile.appointmentFee) : "")
		: false
	const specialtiesDirty =
		selectedSpecialties.length !== originalSpecialties.length ||
		selectedSpecialties.some((id) => !originalSpecialties.includes(id))
	const isDirty = scalarDirty || specialtiesDirty || Boolean(avatarFile)

	const GenderToggle = () => (
		<Stack direction="row" spacing={1}>
			{(["FEMALE", "MALE"] as const).map((g) => {
				const on = form.gender === g
				return (
					<Box
						key={g}
						onClick={() => setField("gender", g)}
						sx={{
							px: 1.5,
							py: 1,
							borderRadius: "8px",
							border: "1px solid",
							borderColor: on ? "#0E7C7B" : "divider",
							bgcolor: on ? "#E6F2F1" : "#fff",
							color: on ? "#0E7C7B" : "text.primary",
							fontSize: 13,
							fontWeight: on ? 600 : 500,
							cursor: "pointer",
							userSelect: "none",
							transition: "all 120ms",
						}}
					>
						{g === "FEMALE" ? "Female" : "Male"}
					</Box>
				)
			})}
		</Stack>
	)

	return (
		<Box>
			<PageHead
				title="My profile"
				subtitle="This is what patients see when they open your card. Keep it sharp."
				actions={
					<>
						<Button
							variant="outlined"
							onClick={resetForm}
							disabled={saving || !isDirty}
							sx={{
								textTransform: "none",
								borderRadius: "10px",
								borderColor: "divider",
								color: "text.primary",
							}}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							onClick={handleSave}
							disabled={saving || !isDirty}
							startIcon={
								saving ? (
									<CircularProgress size={16} color="inherit" />
								) : undefined
							}
							sx={{
								textTransform: "none",
								borderRadius: "10px",
								bgcolor: "#0E7C7B",
								"&:hover": { bgcolor: "#0a6968" },
								"&.Mui-disabled": { bgcolor: SHELL.bgSoft, color: "text.disabled" },
							}}
						>
							{saving ? "Saving…" : isDirty ? "Save changes" : "Saved"}
						</Button>
					</>
				}
			/>

			{/* Verification banner — DEMO (no backend verification data) */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1.75,
					p: "14px 18px",
					borderRadius: "16px",
					bgcolor: SHELL.infoBg,
					border: "1px solid #C4D8EC",
					mb: 3,
				}}
			>
				<Box
					sx={{
						width: 32,
						height: 32,
						borderRadius: "10px",
						bgcolor: "rgba(42, 111, 181, 0.15)",
						color: SHELL.info,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
					}}
				>
					<VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />
				</Box>
				<Box sx={{ color: "#1E4D7F" }}>
					<Box sx={{ fontWeight: 600, color: "text.primary" }}>
						Verified BMDC-registered specialist
						<DemoTag />
					</Box>
					<Box sx={{ fontSize: 13 }}>
						Verification status and certificate are illustrative, not live.
					</Box>
				</Box>
			</Box>

			<Stack spacing={3} sx={{ maxWidth: 880 }}>
				{/* ── Identity & photo ─────────────────────────────────── */}
				<SectionCard
					id="identity"
					title="Identity & photo"
					headRight={
						<Box sx={eyebrowSx}>Doctor ID · {profile?.id?.slice(0, 8)}</Box>
					}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 2.5,
							p: 2.25,
							bgcolor: SHELL.bgSoft,
							borderRadius: "16px",
							mb: 3,
						}}
					>
						<Avatar
							src={avatarSrc}
							sx={{
								width: 80,
								height: 80,
								fontSize: 28,
								fontWeight: 600,
								background:
									"linear-gradient(135deg, #0E7C7B, #16A085)",
							}}
						>
							{initials}
						</Avatar>
						<Box sx={{ flex: 1 }}>
							<Typography sx={{ fontSize: 16, fontWeight: 600 }}>
								Professional photo
							</Typography>
							<Typography
								sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
							>
								Square, well-lit, head-and-shoulders. Patients trust
								profiles with real photos.
							</Typography>
							<Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
								<Button
									variant="outlined"
									size="small"
									startIcon={<CloudUploadOutlinedIcon sx={{ fontSize: 16 }} />}
									onClick={() => fileInputRef.current?.click()}
									sx={{
										textTransform: "none",
										borderRadius: "8px",
										borderColor: "divider",
										color: "text.primary",
									}}
								>
									Upload new
								</Button>
								{(avatarFile || avatarPreview) && (
									<Button
										variant="text"
										size="small"
										onClick={() => {
											setAvatarFile(null)
											setAvatarPreview(null)
											if (fileInputRef.current)
												fileInputRef.current.value = ""
										}}
										sx={{
											textTransform: "none",
											borderRadius: "8px",
											color: SHELL.urgent,
										}}
									>
										Remove
									</Button>
								)}
							</Stack>
							{avatarFile && (
								<Typography
									sx={{
										fontSize: 11,
										color: SHELL.success,
										mt: 1,
										fontFamily: MONO,
									}}
								>
									{avatarFile.name} ready to upload
								</Typography>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								hidden
								onChange={onPickAvatar}
							/>
						</Box>
					</Box>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
							gap: "18px 24px",
						}}
					>
						<Field
							label="Full name (with title)"
							value={form.name}
							onChange={(e) => setField("name", e.target.value)}
							placeholder="Dr. Jane Doe"
						/>
						<Box>
							<Box component="label" sx={labelSx}>
								Gender
							</Box>
							<GenderToggle />
						</Box>
						<Field
							label="Years of experience"
							type="number"
							value={form.experience}
							onChange={(e) => setField("experience", e.target.value)}
						/>
					</Box>
				</SectionCard>

				{/* ── Contact ──────────────────────────────────────────── */}
				<SectionCard id="contact" title="Contact">
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
							gap: "18px 24px",
						}}
					>
						<Field
							label="Email"
							value={profile?.email ?? ""}
							help="Email is your login. Contact admin to change."
							slotProps={{
								input: {
									readOnly: true,
									sx: {
										borderRadius: "10px",
										fontSize: 14,
										bgcolor: SHELL.bgSoft,
									},
								},
							}}
						/>
						<Field
							label="Phone (for patients)"
							value={form.contactNumber}
							onChange={(e) =>
								setField("contactNumber", e.target.value)
							}
							placeholder="+880 1XXX XXX XXX"
						/>
						<Box sx={{ gridColumn: { sm: "span 2" } }}>
							<Field
								label="Current workplace"
								value={form.currentWorkingPlace}
								onChange={(e) =>
									setField("currentWorkingPlace", e.target.value)
								}
								placeholder="Hospital · Department, City"
							/>
						</Box>
						<Box sx={{ gridColumn: { sm: "span 2" } }}>
							<Field
								label="Address"
								value={form.address}
								onChange={(e) => setField("address", e.target.value)}
							/>
						</Box>
					</Box>
				</SectionCard>

				{/* ── Credentials ──────────────────────────────────────── */}
				<SectionCard id="credentials" title="Credentials">
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
							gap: "18px 24px",
							mb: 2.5,
						}}
					>
						<Field
							label="BMDC Registration No."
							value={profile?.registrationNumber ?? "—"}
							slotProps={{
								input: {
									readOnly: true,
									sx: {
										borderRadius: "10px",
										fontSize: 14,
										bgcolor: SHELL.bgSoft,
									},
								},
							}}
						/>
						<Box>
							<Box component="label" sx={labelSx}>
								NID <DemoTag />
							</Box>
							<TextField
								{...fieldProps}
								value="•••• •••• ••••"
								slotProps={{
									input: {
										readOnly: true,
										sx: {
											borderRadius: "10px",
											fontSize: 14,
											bgcolor: SHELL.bgSoft,
										},
									},
								}}
							/>
						</Box>
					</Box>

					<Box>
						<Box component="label" sx={labelSx}>
							Qualification
						</Box>
						<TextField
							{...fieldProps}
							multiline
							minRows={2}
							value={form.qualification}
							onChange={(e) =>
								setField("qualification", e.target.value)
							}
							placeholder="e.g. MBBS, FCPS (Cardiology)"
						/>
						<Typography
							sx={{ fontSize: 11, color: "text.secondary", mt: 0.75 }}
						>
							Stored as a single qualification summary. The verified
							multi-certificate list is illustrative, not live.
						</Typography>
					</Box>
				</SectionCard>

				{/* ── Specialties & bio ────────────────────────────────── */}
				<SectionCard id="specialties" title="Specialties & bio">
					<Box component="label" sx={labelSx}>
						Specialties
					</Box>
					{allSpecialties.length === 0 ? (
						<Typography
							sx={{ fontSize: 13, color: "text.secondary", mb: 2.5 }}
						>
							No specialties available to choose from.
						</Typography>
					) : (
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 0.75,
								mb: 2.5,
							}}
						>
							{allSpecialties.map((sp) => {
								const on = selectedSpecialties.includes(sp.id)
								return (
									<Chip
										key={sp.id}
										label={sp.title}
										onClick={() => toggleSpecialty(sp.id)}
										variant={on ? "filled" : "outlined"}
										sx={{
											borderRadius: "999px",
											fontWeight: on ? 600 : 500,
											fontSize: 12,
											bgcolor: on ? "#E6F2F1" : SHELL.bgSoft,
											color: on ? "#0E7C7B" : "text.secondary",
											border: on
												? "1px solid #0E7C7B"
												: "1px solid transparent",
											"&:hover": {
												bgcolor: on ? "#d9ecea" : SHELL.bgSoft2,
											},
										}}
									/>
								)
							})}
						</Box>
					)}

					<Box component="label" sx={labelSx}>
						Languages spoken <DemoTag />
					</Box>
					<Box
						sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2.5 }}
					>
						{["Bangla", "English", "Hindi"].map((l) => (
							<Chip
								key={l}
								label={l}
								size="small"
								sx={{
									borderRadius: "999px",
									fontSize: 12,
									bgcolor: SHELL.bgSoft,
									color: "text.secondary",
								}}
							/>
						))}
					</Box>

					<Box component="label" sx={labelSx}>
						Short bio <DemoTag />
					</Box>
					<TextField
						{...fieldProps}
						multiline
						minRows={3}
						disabled
						value=""
						placeholder="A short public bio will appear here once supported by the backend."
					/>
				</SectionCard>

				{/* ── Fees & payouts ───────────────────────────────────── */}
				<SectionCard
					id="fees"
					title={
						<>
							Fees & payouts
						</>
					}
				>
					<Box sx={{ maxWidth: 420 }}>
						<Box component="label" sx={labelSx}>
							Consultation fee per slot
						</Box>
						<TextField
							{...fieldProps}
							type="number"
							value={form.appointmentFee}
							onChange={(e) =>
								setField("appointmentFee", e.target.value)
							}
							slotProps={{
								input: {
									sx: {
										borderRadius: "10px",
										fontSize: 14,
										bgcolor: "#fff",
									},
									startAdornment: (
										<InputAdornment position="start">৳</InputAdornment>
									),
								},
							}}
						/>
						<Typography
							sx={{ fontSize: 11, color: "text.secondary", mt: 0.75 }}
						>
							Patients see this amount on your card.
						</Typography>
					</Box>

					{/* Payout extras — DEMO (no backend) */}
					<Box
						sx={{
							mt: 3,
							p: 2.25,
							bgcolor: SHELL.bgSoft,
							borderRadius: "14px",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexWrap: "wrap",
							gap: 2,
						}}
					>
						<Box>
							<Box sx={eyebrowSx}>
								Pending payout <DemoTag />
							</Box>
							<Typography
								sx={{
									fontSize: 26,
									fontWeight: 600,
									mt: 0.75,
									fontVariantNumeric: "tabular-nums",
									color: "text.secondary",
								}}
							>
								৳ ——
							</Typography>
							<Typography
								sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
							>
								Payout method, schedule, TIN and balances are not yet
								wired to the backend.
							</Typography>
						</Box>
						<StatusBadge kind="neutral" label="Illustrative" withDot={false} />
					</Box>
				</SectionCard>
			</Stack>
		</Box>
	)
}

export default DoctorProfilePage
