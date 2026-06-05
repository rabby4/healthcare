/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
	useGetMYProfileQuery,
	useUpdateMYProfileMutation,
} from "@/redux/api/myProfileApi"
import {
	useGetPatientQuery,
	useUpdatePatientMutation,
} from "@/redux/api/patientApi"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	InputAdornment,
	Link as MuiLink,
	MenuItem,
	Skeleton,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import AddLinkIcon from "@mui/icons-material/AddLink"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import NextLink from "next/link"

// ── helpers ────────────────────────────────────────────────────────────
const initialsOf = (name?: string) => {
	if (!name) return "PT"
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return "PT"
	return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

const BLOOD_GROUPS = [
	{ value: "A_POSITIVE", label: "A+" },
	{ value: "A_NEGATIVE", label: "A-" },
	{ value: "B_POSITIVE", label: "B+" },
	{ value: "B_NEGATIVE", label: "B-" },
	{ value: "AB_POSITIVE", label: "AB+" },
	{ value: "AB_NEGATIVE", label: "AB-" },
	{ value: "O_POSITIVE", label: "O+" },
	{ value: "O_NEGATIVE", label: "O-" },
] as const

// Health form shape — mirrors patientHealthData columns.
type HealthForm = {
	dateOfBirth: string
	gender: "" | "MALE" | "FEMALE"
	bloodGroup: string
	pregnancyStatus: "" | "yes" | "no"
	height: string
	weight: string
	maritalStatus: "" | "MARRIED" | "UNMARRIED"
	hasAllergies: boolean
	hasDiabetes: boolean
	smokingStatus: boolean
	recentAnxiety: boolean
	recentDepression: boolean
	hasPastSurgeries: boolean
	dietaryPreferences: string
	immunizationStatus: string
	mentalHealthHistory: string
}

const EMPTY_HEALTH: HealthForm = {
	dateOfBirth: "",
	gender: "",
	bloodGroup: "",
	pregnancyStatus: "",
	height: "",
	weight: "",
	maritalStatus: "",
	hasAllergies: false,
	hasDiabetes: false,
	smokingStatus: false,
	recentAnxiety: false,
	recentDepression: false,
	hasPastSurgeries: false,
	dietaryPreferences: "",
	immunizationStatus: "",
	mentalHealthHistory: "",
}

const seedHealth = (h: any): HealthForm => ({
	dateOfBirth: h?.dateOfBirth ? String(h.dateOfBirth).slice(0, 10) : "",
	gender: h?.gender === "FEMALE" ? "FEMALE" : h?.gender === "MALE" ? "MALE" : "",
	bloodGroup: h?.bloodGroup ?? "",
	pregnancyStatus:
		h?.pregnancyStatus === true ? "yes" : h?.pregnancyStatus === false ? "no" : "",
	height: h?.height != null ? String(h.height) : "",
	weight: h?.weight != null ? String(h.weight) : "",
	maritalStatus:
		h?.maritalStatus === "MARRIED"
			? "MARRIED"
			: h?.maritalStatus === "UNMARRIED"
				? "UNMARRIED"
				: "",
	hasAllergies: Boolean(h?.hasAllergies),
	hasDiabetes: Boolean(h?.hasDiabetes),
	smokingStatus: Boolean(h?.smokingStatus),
	recentAnxiety: Boolean(h?.recentAnxiety),
	recentDepression: Boolean(h?.recentDepression),
	hasPastSurgeries: Boolean(h?.hasPastSurgeries),
	dietaryPreferences: h?.dietaryPreferences ?? "",
	immunizationStatus: h?.immunizationStatus ?? "",
	mentalHealthHistory: h?.mentalHealthHistory ?? "",
})

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

const gridSx = {
	display: "grid",
	gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
	gap: "18px 24px",
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

// Segmented radio-style toggle.
const Segmented = <T extends string>({
	value,
	options,
	onChange,
}: {
	value: T | ""
	options: { value: T; label: string }[]
	onChange: (v: T) => void
}) => (
	<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
		{options.map((opt) => {
			const on = value === opt.value
			return (
				<Box
					key={opt.value}
					onClick={() => onChange(opt.value)}
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
					{opt.label}
				</Box>
			)
		})}
	</Stack>
)

const PatientProfilePage = () => {
	// Account scalars (name/email/phone/photo + Patient.id).
	const { data: account, isLoading: accountLoading } =
		useGetMYProfileQuery(undefined)
	const profileId: string | undefined = account?.id

	// Full patient record (health data + reports).
	const {
		data: patient,
		isLoading: patientLoading,
		isError: patientError,
	} = useGetPatientQuery(profileId as string, { skip: !profileId })

	const [updateMYProfile, { isLoading: savingAccount }] =
		useUpdateMYProfileMutation()
	const [updatePatient, { isLoading: savingPatient }] =
		useUpdatePatientMutation()

	// ── Personal info (account) state ─────────────────────────────────
	const [name, setName] = useState("")
	const [contactNumber, setContactNumber] = useState("")
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!account) return
		setName(account.name ?? "")
		setContactNumber(account.contactNumber ?? "")
	}, [account])

	// ── Health data state ─────────────────────────────────────────────
	const [health, setHealth] = useState<HealthForm>(EMPTY_HEALTH)
	const seededHealth = useMemo(
		() => (patient ? seedHealth(patient.patientHealthData) : EMPTY_HEALTH),
		[patient]
	)
	useEffect(() => {
		setHealth(seededHealth)
	}, [seededHealth])

	const setH = <K extends keyof HealthForm>(key: K, value: HealthForm[K]) =>
		setHealth((prev) => ({ ...prev, [key]: value }))

	// ── Add-report form state ─────────────────────────────────────────
	const [reportName, setReportName] = useState("")
	const [reportLink, setReportLink] = useState("")

	const onPickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setAvatarFile(file)
		setAvatarPreview(URL.createObjectURL(file))
	}

	// ── Dirty tracking ────────────────────────────────────────────────
	const personalDirty = account
		? name !== (account.name ?? "") ||
			contactNumber !== (account.contactNumber ?? "") ||
			Boolean(avatarFile)
		: false

	const healthDirty = useMemo(
		() => JSON.stringify(health) !== JSON.stringify(seededHealth),
		[health, seededHealth]
	)

	const isDirty = personalDirty || healthDirty
	const saving = savingAccount || savingPatient

	// ── Save / Cancel ─────────────────────────────────────────────────
	const resetForm = () => {
		if (account) {
			setName(account.name ?? "")
			setContactNumber(account.contactNumber ?? "")
		}
		setAvatarFile(null)
		setAvatarPreview(null)
		if (fileInputRef.current) fileInputRef.current.value = ""
		setHealth(seededHealth)
	}

	const handleSave = async () => {
		if (!profileId) return
		if (!name.trim()) {
			toast.error("Name is required.")
			return
		}

		try {
			// 1) Personal info (scalars + optional avatar) via update-my-profile.
			//    NEVER send address.
			if (personalDirty) {
				const fd = new FormData()
				fd.append(
					"data",
					JSON.stringify({
						name: name.trim(),
						contactNumber: contactNumber.trim(),
					})
				)
				if (avatarFile) fd.append("file", avatarFile)
				await updateMYProfile(fd).unwrap()
			}

			// 2) Health data via updatePatient (backend upserts patientHealthData).
			if (healthDirty) {
				const patientHealthData: Record<string, any> = {
					hasAllergies: health.hasAllergies,
					hasDiabetes: health.hasDiabetes,
					smokingStatus: health.smokingStatus,
					recentAnxiety: health.recentAnxiety,
					recentDepression: health.recentDepression,
					hasPastSurgeries: health.hasPastSurgeries,
				}
				if (health.dateOfBirth) patientHealthData.dateOfBirth = health.dateOfBirth
				if (health.gender) patientHealthData.gender = health.gender
				if (health.bloodGroup) patientHealthData.bloodGroup = health.bloodGroup
				if (health.maritalStatus)
					patientHealthData.maritalStatus = health.maritalStatus
				if (health.pregnancyStatus)
					patientHealthData.pregnancyStatus = health.pregnancyStatus === "yes"
				if (health.height.trim()) patientHealthData.height = health.height.trim()
				if (health.weight.trim()) patientHealthData.weight = health.weight.trim()
				if (health.dietaryPreferences.trim())
					patientHealthData.dietaryPreferences = health.dietaryPreferences.trim()
				if (health.immunizationStatus.trim())
					patientHealthData.immunizationStatus =
						health.immunizationStatus.trim()
				if (health.mentalHealthHistory.trim())
					patientHealthData.mentalHealthHistory =
						health.mentalHealthHistory.trim()

				await updatePatient({
					id: profileId,
					body: { patientHealthData },
				}).unwrap()
			}

			setAvatarFile(null)
			setAvatarPreview(null)
			if (fileInputRef.current) fileInputRef.current.value = ""
			toast.success("Profile updated")
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const handleAddReport = async () => {
		if (!profileId) return
		if (!reportName.trim() || !reportLink.trim()) {
			toast.error("Both report name and link are required.")
			return
		}
		try {
			await updatePatient({
				id: profileId,
				body: {
					medicalReport: {
						reportName: reportName.trim(),
						reportLink: reportLink.trim(),
					},
				},
			}).unwrap()
			toast.success("Report added")
			setReportName("")
			setReportLink("")
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	// ── loading skeleton ──────────────────────────────────────────────
	if (accountLoading || patientLoading) {
		return (
			<Box>
				<Skeleton variant="text" width={240} height={42} />
				<Skeleton variant="text" width={420} height={24} sx={{ mb: 3 }} />
				<Stack spacing={3} sx={{ maxWidth: 880 }}>
					{[0, 1, 2, 3].map((i) => (
						<Skeleton
							key={i}
							variant="rounded"
							height={200}
							sx={{ borderRadius: "22px" }}
						/>
					))}
				</Stack>
			</Box>
		)
	}

	const initials = initialsOf(account?.name)
	const avatarSrc = avatarPreview || account?.profilePhoto || undefined
	const reports: any[] = Array.isArray(patient?.medicalReport)
		? patient.medicalReport
		: []

	const checkboxItems: { key: keyof HealthForm; label: string }[] = [
		{ key: "hasAllergies", label: "Allergies" },
		{ key: "hasDiabetes", label: "Diabetes" },
		{ key: "smokingStatus", label: "Smoker" },
		{ key: "recentAnxiety", label: "Anxiety disorder" },
		{ key: "recentDepression", label: "Depression" },
		{ key: "hasPastSurgeries", label: "Past surgeries" },
	]

	return (
		<Box>
			<PageHead
				title="Profile & health"
				subtitle="Your information helps doctors give you better care. We keep it private and encrypted."
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
								"&.Mui-disabled": {
									bgcolor: SHELL.bgSoft,
									color: "text.disabled",
								},
							}}
						>
							{saving ? "Saving…" : isDirty ? "Save changes" : "Saved"}
						</Button>
					</>
				}
			/>

			{patientError && (
				<Box
					sx={{
						p: "14px 18px",
						borderRadius: "16px",
						bgcolor: SHELL.dangerBg,
						border: "1px solid #F2C7BC",
						color: SHELL.urgent,
						fontSize: 14,
						mb: 3,
					}}
				>
					We couldn&apos;t load your health record. Some sections may be empty —
					try refreshing the page.
				</Box>
			)}

			<Stack spacing={3} sx={{ maxWidth: 880 }}>
				{/* ── 1. Personal information ───────────────────────────── */}
				<SectionCard
					id="personal"
					title="Personal information"
					headRight={
						<Box sx={eyebrowSx}>
							Patient ID — {account?.id?.slice(0, 8) ?? "—"}
						</Box>
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
								background: "linear-gradient(135deg, #0E7C7B, #16A085)",
							}}
						>
							{initials}
						</Avatar>
						<Box sx={{ flex: 1 }}>
							<Typography sx={{ fontSize: 16, fontWeight: 600 }}>
								Profile photo
							</Typography>
							<Typography
								sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
							>
								PNG or JPG, square aspect, up to 5 MB.
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
											if (fileInputRef.current) fileInputRef.current.value = ""
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

					<Box sx={gridSx}>
						<Field
							label="Full name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Your full name"
						/>
						<Field
							label="Email"
							value={account?.email ?? ""}
							help="Email is your login — contact support to change."
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
							label="Phone"
							value={contactNumber}
							onChange={(e) => setContactNumber(e.target.value)}
							placeholder="+880 1XXX XXX XXX"
						/>
						<Box>
							<Box component="label" sx={labelSx}>
								Marital status
							</Box>
							<Segmented
								value={health.maritalStatus}
								onChange={(v) => setH("maritalStatus", v)}
								options={[
									{ value: "MARRIED", label: "Married" },
									{ value: "UNMARRIED", label: "Unmarried" },
								]}
							/>
						</Box>
					</Box>
				</SectionCard>

				{/* ── 2. Health data ────────────────────────────────────── */}
				<SectionCard
					id="health"
					title="Health data"
					headRight={
						<StatusBadge kind="teal" label="Visible to your doctor" />
					}
				>
					<Box sx={gridSx}>
						<Field
							label="Date of birth"
							type="date"
							value={health.dateOfBirth}
							onChange={(e) => setH("dateOfBirth", e.target.value)}
							slotProps={{
								inputLabel: { shrink: true },
								input: {
									sx: { borderRadius: "10px", fontSize: 14, bgcolor: "#fff" },
								},
							}}
						/>
						<Box>
							<Box component="label" sx={labelSx}>
								Gender
							</Box>
							<Segmented
								value={health.gender}
								onChange={(v) => setH("gender", v)}
								options={[
									{ value: "FEMALE", label: "Female" },
									{ value: "MALE", label: "Male" },
								]}
							/>
						</Box>
						<Box>
							<Box component="label" sx={labelSx}>
								Blood group
							</Box>
							<TextField
								{...fieldProps}
								select
								value={health.bloodGroup}
								onChange={(e) => setH("bloodGroup", e.target.value)}
							>
								<MenuItem value="">
									<em>Not set</em>
								</MenuItem>
								{BLOOD_GROUPS.map((bg) => (
									<MenuItem key={bg.value} value={bg.value}>
										{bg.label}
									</MenuItem>
								))}
							</TextField>
						</Box>
						<Box>
							<Box component="label" sx={labelSx}>
								Pregnancy status
							</Box>
							<Segmented
								value={health.pregnancyStatus}
								onChange={(v) => setH("pregnancyStatus", v)}
								options={[
									{ value: "yes", label: "Yes" },
									{ value: "no", label: "No" },
								]}
							/>
						</Box>
						<Field
							label="Height"
							value={health.height}
							onChange={(e) => setH("height", e.target.value)}
							placeholder="162"
							slotProps={{
								input: {
									sx: { borderRadius: "10px", fontSize: 14, bgcolor: "#fff" },
									endAdornment: (
										<InputAdornment position="end">cm</InputAdornment>
									),
								},
							}}
						/>
						<Field
							label="Weight"
							value={health.weight}
							onChange={(e) => setH("weight", e.target.value)}
							placeholder="58"
							slotProps={{
								input: {
									sx: { borderRadius: "10px", fontSize: 14, bgcolor: "#fff" },
									endAdornment: (
										<InputAdornment position="end">kg</InputAdornment>
									),
								},
							}}
						/>
					</Box>
				</SectionCard>

				{/* ── 3. Conditions & lifestyle ─────────────────────────── */}
				<SectionCard id="flags" title="Conditions & lifestyle">
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
							gap: 1,
						}}
					>
						{checkboxItems.map((item) => {
							const on = Boolean(health[item.key])
							return (
								<FormControlLabel
									key={item.key}
									control={
										<Checkbox
											checked={on}
											onChange={(e) =>
												setH(item.key, e.target.checked as any)
											}
											sx={{ color: "#0E7C7B", "&.Mui-checked": { color: "#0E7C7B" } }}
										/>
									}
									label={item.label}
									sx={{
										m: 0,
										px: 1.5,
										py: 0.5,
										borderRadius: "10px",
										border: "1px solid",
										borderColor: on ? "#0E7C7B" : "divider",
										bgcolor: on ? "#E6F2F1" : "#fff",
										transition: "all 120ms",
										"& .MuiFormControlLabel-label": {
											fontSize: 13,
											fontWeight: on ? 600 : 500,
											color: on ? "#0E7C7B" : "text.primary",
										},
									}}
								/>
							)
						})}
					</Box>
					<Typography sx={{ fontSize: 11, color: "text.secondary", mt: 2 }}>
						Hypertension, Asthma, Heart disease and a free-text allergy detail
						aren&apos;t stored separately yet.
						<DemoTag />
					</Typography>
				</SectionCard>

				{/* ── 4. Dietary & mental health ────────────────────────── */}
				<SectionCard
					id="diet"
					title="Dietary preferences & mental health"
				>
					<Stack spacing={2.5}>
						<Field
							label="Dietary preferences"
							value={health.dietaryPreferences}
							onChange={(e) => setH("dietaryPreferences", e.target.value)}
							placeholder="e.g. Vegetarian, no pork, halal"
						/>
						<Field
							label="Immunization status"
							value={health.immunizationStatus}
							onChange={(e) => setH("immunizationStatus", e.target.value)}
							placeholder="e.g. COVID — 3 doses, Hepatitis B, Tetanus (2024)"
						/>
						<Box>
							<Box component="label" sx={labelSx}>
								Mental health history
							</Box>
							<TextField
								{...fieldProps}
								multiline
								minRows={3}
								value={health.mentalHealthHistory}
								onChange={(e) =>
									setH("mentalHealthHistory", e.target.value)
								}
								placeholder="Optional — only share what you're comfortable with."
							/>
						</Box>
					</Stack>
				</SectionCard>

				{/* ── 5. Medical reports ────────────────────────────────── */}
				<SectionCard id="reports" title="Medical reports">
					{reports.length === 0 ? (
						<Box
							sx={{
								p: 3,
								textAlign: "center",
								bgcolor: SHELL.bgSoft,
								borderRadius: "14px",
								color: "text.secondary",
							}}
						>
							<DescriptionOutlinedIcon
								sx={{ fontSize: 28, opacity: 0.5, mb: 1 }}
							/>
							<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
								No reports yet
							</Typography>
							<Typography sx={{ fontSize: 12, mt: 0.5 }}>
								Add a report by link below — your doctor can view it during
								consultations.
							</Typography>
						</Box>
					) : (
						<Stack spacing={1}>
							{reports.map((r, i) => (
								<Box
									key={`${r?.reportName ?? "report"}-${i}`}
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1.75,
										p: 1.75,
										bgcolor: SHELL.bgSoft,
										borderRadius: "12px",
									}}
								>
									<Box
										sx={{
											width: 36,
											height: 44,
											borderRadius: "6px",
											bgcolor: "#fff",
											border: "1px solid",
											borderColor: "divider",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
											color: SHELL.urgent,
										}}
									>
										<DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
									</Box>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography
											sx={{
												fontSize: 13,
												fontWeight: 600,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{r?.reportName || "Untitled report"}
										</Typography>
										<Typography
											sx={{
												fontSize: 11,
												color: "text.secondary",
												mt: 0.25,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{r?.reportLink}
										</Typography>
									</Box>
									{r?.reportLink && (
										<MuiLink
											href={r.reportLink}
											target="_blank"
											rel="noopener noreferrer"
											sx={{
												display: "inline-flex",
												alignItems: "center",
												gap: 0.5,
												fontSize: 12,
												fontWeight: 600,
												color: "#0E7C7B",
												textDecoration: "none",
												flexShrink: 0,
											}}
										>
											View <OpenInNewIcon sx={{ fontSize: 14 }} />
										</MuiLink>
									)}
								</Box>
							))}
						</Stack>
					)}

					{/* Add report by link — the only real (no-file) flow. */}
					<Box
						sx={{
							mt: 2.5,
							p: 2.25,
							border: "1px solid",
							borderColor: "divider",
							borderRadius: "14px",
						}}
					>
						<Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
							Add report by link
						</Typography>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: { xs: "1fr", sm: "1fr 1.4fr auto" },
								gap: 1.5,
								alignItems: "end",
							}}
						>
							<Field
								label="Report name"
								value={reportName}
								onChange={(e) => setReportName(e.target.value)}
								placeholder="Lipid profile — Apr 2026"
							/>
							<Field
								label="Report link (URL)"
								value={reportLink}
								onChange={(e) => setReportLink(e.target.value)}
								placeholder="https://…"
							/>
							<Button
								variant="contained"
								onClick={handleAddReport}
								disabled={
									savingPatient ||
									!reportName.trim() ||
									!reportLink.trim()
								}
								startIcon={
									savingPatient ? (
										<CircularProgress size={16} color="inherit" />
									) : (
										<AddLinkIcon sx={{ fontSize: 18 }} />
									)
								}
								sx={{
									textTransform: "none",
									borderRadius: "10px",
									bgcolor: "#0E7C7B",
									height: 40,
									"&:hover": { bgcolor: "#0a6968" },
									"&.Mui-disabled": {
										bgcolor: SHELL.bgSoft,
										color: "text.disabled",
									},
								}}
							>
								Add
							</Button>
						</Box>
						<Typography sx={{ fontSize: 11, color: "text.secondary", mt: 1.5 }}>
							Direct file upload, download and delete aren&apos;t wired yet —
							paste a hosted link instead.
							<DemoTag />
						</Typography>
					</Box>
				</SectionCard>

				{/* ── 6. Security ───────────────────────────────────────── */}
				<SectionCard id="security" title="Security">
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 2,
							py: 1.75,
							borderBottom: "1px solid",
							borderColor: "divider",
						}}
					>
						<Box>
							<Typography sx={{ fontSize: 14, fontWeight: 600 }}>
								Password
							</Typography>
							<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
								Update your account password regularly to stay secure.
							</Typography>
						</Box>
						<Button
							component={NextLink}
							href="/dashboard/change-password"
							variant="outlined"
							size="small"
							startIcon={<LockOutlinedIcon sx={{ fontSize: 16 }} />}
							sx={{
								textTransform: "none",
								borderRadius: "8px",
								borderColor: "divider",
								color: "text.primary",
								flexShrink: 0,
							}}
						>
							Change password
						</Button>
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 2,
							py: 1.75,
						}}
					>
						<Box>
							<Typography sx={{ fontSize: 14, fontWeight: 600 }}>
								Two-factor authentication
								<DemoTag />
							</Typography>
							<Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
								Add an extra step at login. Not yet available.
							</Typography>
						</Box>
						<Button
							variant="outlined"
							size="small"
							disabled
							sx={{
								textTransform: "none",
								borderRadius: "8px",
								borderColor: "divider",
								flexShrink: 0,
							}}
						>
							Enable
						</Button>
					</Box>
				</SectionCard>
			</Stack>
		</Box>
	)
}

export default PatientProfilePage
