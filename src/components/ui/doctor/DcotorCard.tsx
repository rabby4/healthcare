"use client"

import { IDoctor } from "@/types"
import { Avatar, Box, Button, Divider, Stack, Typography } from "@mui/material"
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import Link from "next/link"

const GRADIENTS = [
	"linear-gradient(135deg, #0E7C7B, #16A085)",
	"linear-gradient(135deg, #2A6FB5, #4A90D9)",
	"linear-gradient(135deg, #7B4DA8, #A26CC8)",
	"linear-gradient(135deg, #C56A3F, #E59364)",
]

const getInitials = (name?: string) => {
	if (!name) return "Dr"
	const cleaned = name.replace(/^Dr\.?\s*/i, "").trim()
	const parts = cleaned.split(/\s+/).filter(Boolean)
	if (parts.length === 0) return "Dr"
	const first = parts[0]?.[0] ?? ""
	const second = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : ""
	return (first + second).toUpperCase() || "Dr"
}

const pickGradient = (key: string) => {
	let hash = 0
	for (let i = 0; i < key.length; i++) {
		hash = (hash * 31 + key.charCodeAt(i)) >>> 0
	}
	return GRADIENTS[hash % GRADIENTS.length]
}

const DoctorCard = ({ doctor }: { doctor: IDoctor }) => {
	const initials = getInitials(doctor?.name)
	const gradient = pickGradient(doctor?.id || doctor?.name || "doctor")
	const rating = Number(doctor?.averageRating)
	const hasRating = !!doctor?.averageRating && rating > 0
	const specialtyTitles =
		doctor?.doctorSpecialties
			?.map((s) => s?.specialties?.title)
			.filter(Boolean) ?? []
	const detailHref = `/doctors/${doctor?.id}`

	return (
		<Stack
			sx={{
				bgcolor: "#fff",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "22px",
				p: 3,
				gap: 2.5,
				height: "100%",
				transition: "transform 200ms ease, box-shadow 200ms ease",
				"&:hover": {
					transform: "translateY(-3px)",
					boxShadow: "0 24px 40px -20px rgba(15, 30, 46, 0.18)",
				},
			}}
		>
			<Stack direction="row" sx={{ alignItems: "flex-start", gap: 2 }}>
				{doctor?.profilePhoto ? (
					<Avatar
						src={doctor.profilePhoto}
						alt={doctor?.name}
						sx={{ width: 64, height: 64, flexShrink: 0 }}
					/>
				) : (
					<Box
						sx={{
							width: 64,
							height: 64,
							borderRadius: "50%",
							background: gradient,
							color: "#fff",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 22,
							fontWeight: 600,
							flexShrink: 0,
						}}
					>
						{initials}
					</Box>
				)}
				<Box sx={{ minWidth: 0 }}>
					<Typography
						sx={{
							fontSize: 17,
							fontWeight: 700,
							color: "text.primary",
							letterSpacing: "-0.01em",
						}}
					>
						{doctor?.name}
					</Typography>
					<Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
						{doctor?.designation}
						{doctor?.qualification ? ` · ${doctor.qualification}` : ""}
					</Typography>
					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							gap: 1,
							mt: 1.25,
							color: "secondary.main",
							fontSize: 12,
							flexWrap: "wrap",
						}}
					>
						<Stack
							direction="row"
							sx={{
								alignItems: "center",
								gap: 0.5,
								color: "text.primary",
								fontWeight: 600,
							}}
						>
							<StarRoundedIcon
								sx={{ fontSize: 14, color: "warning.main" }}
							/>
							{hasRating ? rating.toFixed(1) : "New"}
						</Stack>
						{doctor?.experience ? (
							<>
								<Box
									sx={{
										width: 3,
										height: 3,
										borderRadius: "50%",
										bgcolor: "divider",
									}}
								/>
								<Typography sx={{ fontSize: 12, color: "secondary.main" }}>
									{doctor.experience}+ yrs
								</Typography>
							</>
						) : null}
						{doctor?.currentWorkingPlace ? (
							<>
								<Box
									sx={{
										width: 3,
										height: 3,
										borderRadius: "50%",
										bgcolor: "divider",
									}}
								/>
								<Typography
									noWrap
									sx={{
										fontSize: 12,
										color: "secondary.main",
										maxWidth: "20ch",
									}}
								>
									{doctor.currentWorkingPlace}
								</Typography>
							</>
						) : null}
					</Stack>
				</Box>
			</Stack>

			{specialtyTitles.length > 0 && (
				<Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
					{specialtyTitles.map((title: string, i: number) => (
						<Box
							key={`${title}-${i}`}
							sx={{
								fontSize: 11,
								letterSpacing: "0.04em",
								px: 1.25,
								py: 0.625,
								bgcolor: "secondary.light",
								color: "text.secondary",
								borderRadius: "999px",
								fontWeight: 500,
							}}
						>
							{title}
						</Box>
					))}
				</Stack>
			)}

			<Divider sx={{ borderColor: "divider", mt: "auto" }} />

			<Stack
				direction="row"
				sx={{ justifyContent: "space-between", alignItems: "center", gap: 1 }}
			>
				<Typography sx={{ fontSize: 12, color: "secondary.main" }}>
					<Box
						component="span"
						sx={{ fontSize: 20, fontWeight: 700, color: "text.primary" }}
					>
						৳ {doctor?.appointmentFee}
					</Box>{" "}
					/ visit
				</Typography>
				<Stack direction="row" sx={{ gap: 1 }}>
					<Button
						component={Link}
						href={detailHref}
						variant="outlined"
						sx={{
							py: "8px",
							px: 2,
							fontSize: 13,
							borderColor: "divider",
							color: "text.primary",
							"&:hover": {
								borderColor: "primary.main",
								bgcolor: "primary.light",
							},
						}}
					>
						View details
					</Button>
					<Button
						component={Link}
						href={detailHref}
						sx={{
							bgcolor: "text.primary",
							py: "8px",
							px: 2,
							fontSize: 13,
							"&:hover": { bgcolor: "primary.main" },
						}}
					>
						Book now
					</Button>
				</Stack>
			</Stack>
		</Stack>
	)
}

export default DoctorCard
