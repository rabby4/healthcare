/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import {
	useCreateDoctorMutation,
	useUpdateDoctorMutation,
} from "@/redux/api/doctorApi"
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi"
import { IDoctor, ISpecialty } from "@/types"

type Props = {
	open: boolean
	onClose: () => void
	doctor?: IDoctor
}

type Gender = "MALE" | "FEMALE"

const genders: Gender[] = ["FEMALE", "MALE"]

type FormState = {
	name: string
	email: string
	password: string
	contactNumber: string
	address: string
	registrationNumber: string
	experience: string
	appointmentFee: string
	qualification: string
	currentWorkingPlace: string
}

const emptyForm: FormState = {
	name: "",
	email: "",
	password: "",
	contactNumber: "",
	address: "",
	registrationNumber: "",
	experience: "",
	appointmentFee: "",
	qualification: "",
	currentWorkingPlace: "",
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
	<Typography
		sx={{
			fontSize: 12,
			fontWeight: 600,
			color: "text.secondary",
			mb: 0.75,
			letterSpacing: "0.01em",
		}}
	>
		{children}
	</Typography>
)

const inputSx = {
	"& .MuiOutlinedInput-root": {
		borderRadius: "10px",
		bgcolor: "#fff",
		fontSize: 14,
		"& fieldset": { borderColor: "divider" },
		"&:hover fieldset": { borderColor: "text.secondary" },
		"&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: "1px" },
	},
	"& .MuiOutlinedInput-input": {
		py: 1.25,
	},
}

const DoctorFormModal = ({ open, onClose, doctor }: Props) => {
	const isEdit = Boolean(doctor)

	const [form, setForm] = useState<FormState>(emptyForm)
	const [gender, setGender] = useState<Gender>("FEMALE")
	const [selected, setSelected] = useState<string[]>([])
	const [file, setFile] = useState<File | null>(null)

	const { data: specialties = [], isLoading: specialtiesLoading } =
		useGetAllSpecialtiesQuery(undefined)
	const [createDoctor, { isLoading: isCreating }] = useCreateDoctorMutation()
	const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation()

	const isLoading = isCreating || isUpdating

	// Original specialty ids on the doctor (for diffing in edit mode)
	const originalSpecialtyIds: string[] =
		doctor?.doctorSpecialties
			?.map((ds) => ds.specialties?.id ?? ds.specialtiesId)
			.filter(Boolean) ?? []

	useEffect(() => {
		if (!open) return
		if (doctor) {
			setForm({
				name: doctor.name ?? "",
				email: doctor.email ?? "",
				password: "",
				contactNumber: doctor.contactNumber ?? "",
				address: doctor.address ?? "",
				registrationNumber: doctor.registrationNumber ?? "",
				experience:
					doctor.experience != null ? String(doctor.experience) : "",
				appointmentFee:
					doctor.appointmentFee != null ? String(doctor.appointmentFee) : "",
				qualification: doctor.qualification ?? "",
				currentWorkingPlace: doctor.currentWorkingPlace ?? "",
			})
			setGender(doctor.gender === "MALE" ? "MALE" : "FEMALE")
			setSelected(
				doctor.doctorSpecialties
					?.map((ds) => ds.specialties?.id ?? ds.specialtiesId)
					.filter(Boolean) ?? []
			)
		} else {
			setForm(emptyForm)
			setGender("FEMALE")
			setSelected([])
		}
		setFile(null)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, doctor?.id])

	const setField = (key: keyof FormState) => (value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }))

	const toggleSpecialty = (id: string) =>
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		)

	const handleClose = () => {
		if (isLoading) return
		onClose()
	}

	const validate = () => {
		if (!form.name.trim()) return "Full name is required"
		if (!form.email.trim()) return "Email is required"
		if (!isEdit && form.password.trim().length < 6)
			return "Password must be at least 6 characters"
		if (!form.registrationNumber.trim())
			return "Registration number is required"
		return null
	}

	const handleSubmit = async () => {
		const error = validate()
		if (error) {
			toast.error(error)
			return
		}

		try {
			if (isEdit && doctor) {
				// Diff specialties: newly selected -> add; removed -> isDeleted true
				const added = selected
					.filter((id) => !originalSpecialtyIds.includes(id))
					.map((specialtiesId) => ({ specialtiesId, isDeleted: false }))
				const removed = originalSpecialtyIds
					.filter((id) => !selected.includes(id))
					.map((specialtiesId) => ({ specialtiesId, isDeleted: true }))

				const body = {
					name: form.name,
					contactNumber: form.contactNumber,
					address: form.address,
					experience: Number(form.experience),
					appointmentFee: Number(form.appointmentFee),
					qualification: form.qualification,
					currentWorkingPlace: form.currentWorkingPlace,
					gender,
					specialties: [...added, ...removed],
				}

				await updateDoctor({ id: doctor.id, body }).unwrap()
				toast.success("Doctor updated")
			} else {
				const payload = {
					password: form.password,
					doctor: {
						name: form.name,
						email: form.email,
						contactNumber: form.contactNumber,
						address: form.address,
						registrationNumber: form.registrationNumber,
						experience: Number(form.experience),
						gender,
						appointmentFee: Number(form.appointmentFee),
						qualification: form.qualification,
						currentWorkingPlace: form.currentWorkingPlace,
					},
					specialties: selected,
				}
				const fd = new FormData()
				fd.append("data", JSON.stringify(payload))
				if (file) fd.append("file", file)

				await createDoctor(fd).unwrap()
				toast.success("Doctor created")
			}
			onClose()
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="md"
			slotProps={{
				paper: {
					sx: {
						borderRadius: "22px",
						boxShadow: "0 40px 80px -20px rgba(15, 30, 46, 0.35)",
						overflow: "hidden",
					},
				},
			}}
		>
			<DialogTitle
				sx={{
					p: 3,
					pb: 0,
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: 2,
				}}
			>
				<Box>
					<Typography
						sx={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}
					>
						{isEdit ? "Edit doctor" : "Add a doctor"}
					</Typography>
					<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
						{isEdit
							? "Update the doctor's profile and specialties."
							: "Set a temporary password they can change on first login."}
					</Typography>
				</Box>
				<IconButton
					onClick={handleClose}
					size="small"
					sx={{
						color: "text.secondary",
						"&:hover": { color: "text.primary", bgcolor: SHELL.bgSoft },
					}}
				>
					<CloseRoundedIcon fontSize="small" />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ p: 3 }}>
				{/* Profile photo upload row (create mode only — create supports file) */}
				{!isEdit && (
					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							gap: 2,
							mb: "22px",
						}}
					>
						<Box
							sx={{
								width: 80,
								height: 80,
								borderRadius: "16px",
								bgcolor: SHELL.bgSoft,
								color: "text.secondary",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 12,
								fontFamily: MONO,
								flexShrink: 0,
								overflow: "hidden",
							}}
						>
							{file ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={URL.createObjectURL(file)}
									alt="preview"
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
								/>
							) : (
								"IMG"
							)}
						</Box>
						<Box sx={{ flex: 1 }}>
							<Typography
								sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}
							>
								Profile photo
							</Typography>
							<Typography
								sx={{ fontSize: 12, color: "text.secondary", mt: "4px" }}
							>
								{file
									? file.name
									: "Uploaded to Cloudinary. Square, up to 5 MB."}
							</Typography>
							<Button
								component="label"
								variant="outlined"
								size="small"
								sx={{
									mt: 1.25,
									bgcolor: "#fff",
									color: "text.primary",
									borderColor: "divider",
									fontSize: 12,
									"&:hover": {
										borderColor: "text.primary",
										bgcolor: SHELL.bgSoft,
									},
								}}
							>
								Upload
								<input
									type="file"
									hidden
									accept="image/*"
									onChange={(e) => setFile(e.target.files?.[0] ?? null)}
								/>
							</Button>
						</Box>
					</Stack>
				)}

				{/* Form grid */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
						columnGap: 3,
						rowGap: "18px",
					}}
				>
					<Box>
						<FieldLabel>Full name</FieldLabel>
						<TextField
							placeholder="Dr. Full Name"
							fullWidth
							size="small"
							sx={inputSx}
							value={form.name}
							onChange={(e) => setField("name")(e.target.value)}
						/>
					</Box>
					<Box>
						<FieldLabel>Email (login)</FieldLabel>
						<TextField
							placeholder="name@medicare.app"
							type="email"
							fullWidth
							size="small"
							sx={inputSx}
							value={form.email}
							disabled={isEdit}
							onChange={(e) => setField("email")(e.target.value)}
						/>
					</Box>
					{!isEdit && (
						<Box>
							<FieldLabel>Password</FieldLabel>
							<TextField
								placeholder="Min. 6 characters"
								type="password"
								fullWidth
								size="small"
								sx={inputSx}
								value={form.password}
								onChange={(e) => setField("password")(e.target.value)}
							/>
						</Box>
					)}
					<Box>
						<FieldLabel>Contact</FieldLabel>
						<TextField
							placeholder="+880 1XXX XXX XXX"
							fullWidth
							size="small"
							sx={inputSx}
							value={form.contactNumber}
							onChange={(e) => setField("contactNumber")(e.target.value)}
						/>
					</Box>
					<Box>
						<FieldLabel>BMDC Registration No.</FieldLabel>
						<TextField
							placeholder="A-00000"
							fullWidth
							size="small"
							sx={inputSx}
							value={form.registrationNumber}
							disabled={isEdit}
							onChange={(e) => setField("registrationNumber")(e.target.value)}
						/>
					</Box>
					<Box>
						<FieldLabel>Gender</FieldLabel>
						<Stack direction="row" sx={{ gap: 1 }}>
							{genders.map((g) => {
								const on = gender === g
								return (
									<Box
										key={g}
										onClick={() => setGender(g)}
										sx={{
											flex: 1,
											textAlign: "center",
											py: 1.1,
											borderRadius: "8px",
											border: "1px solid",
											borderColor: on ? "primary.main" : "divider",
											bgcolor: on ? "primary.light" : "#fff",
											color: on ? "primary.main" : "text.primary",
											fontWeight: on ? 600 : 500,
											fontSize: 13,
											cursor: "pointer",
											transition: "all 140ms",
											textTransform: "capitalize",
											"&:hover": {
												borderColor: on ? "primary.main" : "text.primary",
											},
										}}
									>
										{g.toLowerCase()}
									</Box>
								)
							})}
						</Stack>
					</Box>
					<Box>
						<FieldLabel>Experience (yrs)</FieldLabel>
						<TextField
							type="number"
							placeholder="0"
							fullWidth
							size="small"
							sx={inputSx}
							value={form.experience}
							onChange={(e) => setField("experience")(e.target.value)}
						/>
					</Box>
					<Box>
						<FieldLabel>Appointment fee (৳)</FieldLabel>
						<TextField
							type="number"
							placeholder="1000"
							fullWidth
							size="small"
							sx={inputSx}
							value={form.appointmentFee}
							onChange={(e) => setField("appointmentFee")(e.target.value)}
						/>
					</Box>

					{/* Full-row fields */}
					<Box sx={{ gridColumn: { sm: "1 / -1" } }}>
						<FieldLabel>Address</FieldLabel>
						<TextField
							placeholder="Street, city"
							fullWidth
							size="small"
							sx={inputSx}
							value={form.address}
							onChange={(e) => setField("address")(e.target.value)}
						/>
					</Box>
					<Box sx={{ gridColumn: { sm: "1 / -1" } }}>
						<FieldLabel>Current workplace</FieldLabel>
						<TextField
							placeholder="Hospital / clinic name"
							fullWidth
							size="small"
							sx={inputSx}
							value={form.currentWorkingPlace}
							onChange={(e) => setField("currentWorkingPlace")(e.target.value)}
						/>
					</Box>

					{/* Specialties — selectable on both create and edit */}
					{(
						<Box sx={{ gridColumn: { sm: "1 / -1" } }}>
							<FieldLabel>Specialties</FieldLabel>
							<Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
								{specialtiesLoading ? (
									<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
										Loading specialties…
									</Typography>
								) : specialties.length === 0 ? (
									<Typography sx={{ fontSize: 12, color: "text.secondary" }}>
										No specialties available.
									</Typography>
								) : (
									specialties.map((s: ISpecialty) => {
										const on = selected.includes(s.id)
										return (
											<Box
												key={s.id}
												component="button"
												type="button"
												onClick={() => toggleSpecialty(s.id)}
												sx={{
													display: "inline-flex",
													alignItems: "center",
													gap: 0.75,
													px: 1.5,
													py: 0.75,
													borderRadius: 999,
													bgcolor: on ? "primary.light" : "transparent",
													color: on ? "primary.main" : "text.secondary",
													border: on ? "1px solid" : "1px dashed",
													borderColor: on ? "primary.main" : "divider",
													fontSize: 12,
													fontWeight: 600,
													cursor: "pointer",
													transition: "all 140ms",
													"&:hover": {
														borderColor: on ? "primary.main" : "text.primary",
														color: on ? "primary.main" : "text.primary",
													},
												}}
											>
												<Box component="span">{s.title}</Box>
												{on && <Box component="span">×</Box>}
											</Box>
										)
									})
								)}
							</Stack>
						</Box>
					)}

					<Box sx={{ gridColumn: { sm: "1 / -1" } }}>
						<FieldLabel>Qualification</FieldLabel>
						<TextField
							placeholder="MBBS, FCPS (Cardiology)…"
							fullWidth
							size="small"
							sx={inputSx}
							value={form.qualification}
							onChange={(e) => setField("qualification")(e.target.value)}
						/>
					</Box>
				</Box>
			</DialogContent>

			<DialogActions
				sx={{
					p: 2,
					px: 3,
					bgcolor: SHELL.bgSoft,
					borderTop: "1px solid",
					borderColor: "divider",
					gap: 1.25,
				}}
			>
				<Button
					onClick={handleClose}
					variant="outlined"
					disabled={isLoading}
					sx={{
						bgcolor: "#fff",
						color: "text.primary",
						borderColor: "divider",
						"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
					}}
				>
					Cancel
				</Button>
				<Button onClick={handleSubmit} disabled={isLoading}>
					{isLoading
						? "Saving…"
						: isEdit
							? "Save changes"
							: "Create doctor"}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default DoctorFormModal
