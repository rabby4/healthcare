/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eyebrow, MONO } from "@/components/ui/home/SectionHead"
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded"
import {
	Box,
	Button,
	Chip,
	Container,
	Stack,
	Typography,
} from "@mui/material"
import Image from "next/image"
import DoctorScheduleSlots from "../components/DoctorScheduleSlots"

type PropTypes = {
	params: {
		id: string
	}
}

const GRADIENTS = [
	"linear-gradient(135deg, #0E7C7B, #16A085)",
	"linear-gradient(135deg, #2A6FB5, #4A90D9)",
	"linear-gradient(135deg, #7B4DA8, #A26CC8)",
	"linear-gradient(135deg, #C56A3F, #E59364)",
]

const getInitials = (name?: string) => {
	if (!name) return "DR"
	const cleaned = name.replace(/^dr\.?\s*/i, "").trim()
	const parts = cleaned.split(/\s+/).filter(Boolean)
	const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "")
	return letters.join("") || "DR"
}

const pickGradient = (seed?: string) => {
	const s = seed ?? ""
	let sum = 0
	for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i)
	return GRADIENTS[sum % GRADIENTS.length]
}

const StatCard = ({ label, value }: { label: string; value: string }) => (
	<Box
		sx={{
			flex: "1 1 0",
			minWidth: { xs: "calc(50% - 8px)", md: 0 },
			bgcolor: "#fff",
			border: "1px solid",
			borderColor: "divider",
			borderRadius: "22px",
			p: { xs: 2.25, md: 3 },
		}}
	>
		<Typography
			sx={{
				fontFamily: MONO,
				fontSize: 11,
				letterSpacing: "0.14em",
				textTransform: "uppercase",
				color: "primary.main",
				fontWeight: 500,
			}}
		>
			{label}
		</Typography>
		<Typography
			sx={{
				mt: 1,
				fontSize: { xs: 16, md: 18 },
				fontWeight: 700,
				color: "text.primary",
				lineHeight: 1.3,
				wordBreak: "break-word",
			}}
		>
			{value}
		</Typography>
	</Box>
)

const DoctorsProfilePage = async ({ params }: PropTypes) => {
	const { id } = await params
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api/v1"}/doctor/${id}`
	)
	const { data: doctor } = await res.json()

	const specialties: string[] =
		doctor?.doctorSpecialties?.map((ds: any) => ds?.specialties?.title) ?? []

	const initials = getInitials(doctor?.name)
	const gradient = pickGradient(doctor?.name ?? doctor?.id)
	const rating = Number(doctor?.averageRating)
	const ratingLabel = rating > 0 ? rating.toFixed(1) : "New"

	return (
		<Container sx={{ py: { xs: 6, md: 9 } }}>
			{/* HERO CARD */}
			<Box
				sx={{
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "22px",
					p: { xs: 3, md: 4 },
				}}
			>
				<Stack
					direction={{ xs: "column", md: "row" }}
					sx={{ gap: { xs: 3, md: 4 }, alignItems: { md: "flex-start" } }}
				>
					{/* Photo / initials */}
					<Box
						sx={{
							width: { xs: "100%", sm: 200, md: 210 },
							height: { xs: 240, sm: 200, md: 210 },
							flexShrink: 0,
							borderRadius: "18px",
							overflow: "hidden",
							position: "relative",
							background: gradient,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{doctor?.profilePhoto ? (
							<Image
								src={doctor.profilePhoto}
								alt={doctor?.name ?? "Doctor"}
								fill
								sizes="210px"
								style={{ objectFit: "cover" }}
							/>
						) : (
							<Typography
								sx={{ color: "#fff", fontSize: 64, fontWeight: 600 }}
							>
								{initials}
							</Typography>
						)}
					</Box>

					{/* Details */}
					<Stack sx={{ flex: 1, gap: 1.5 }}>
						<Eyebrow>Doctor profile</Eyebrow>

						<Typography
							variant="h4"
							sx={{ color: "text.primary", lineHeight: 1.15 }}
						>
							{doctor?.name}
						</Typography>

						{doctor?.qualification && (
							<Typography sx={{ color: "text.secondary", fontSize: 16 }}>
								{doctor.qualification}
							</Typography>
						)}

						{specialties.length > 0 && (
							<Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
								{specialties.map((sp) => (
									<Chip
										key={sp}
										label={sp}
										sx={{
											bgcolor: "primary.light",
											color: "primary.dark",
											fontWeight: 600,
											fontSize: 12,
											borderRadius: "999px",
										}}
									/>
								))}
							</Stack>
						)}

						<Stack
							direction="row"
							sx={{
								alignItems: "center",
								gap: 2,
								flexWrap: "wrap",
								mt: 0.5,
							}}
						>
							<Stack
								direction="row"
								sx={{
									alignItems: "center",
									gap: 0.5,
									color: "text.primary",
									fontWeight: 700,
								}}
							>
								<StarRoundedIcon
									sx={{ fontSize: 20, color: "warning.main" }}
								/>
								<Typography sx={{ fontWeight: 700, color: "text.primary" }}>
									{ratingLabel}
								</Typography>
							</Stack>

							{doctor?.currentWorkingPlace && (
								<Stack
									direction="row"
									sx={{
										alignItems: "center",
										gap: 0.5,
										color: "text.secondary",
									}}
								>
									<PlaceRoundedIcon
										sx={{ fontSize: 18, color: "secondary.main" }}
									/>
									<Typography sx={{ fontSize: 14, color: "text.secondary" }}>
										Works at {doctor.currentWorkingPlace}
									</Typography>
								</Stack>
							)}
						</Stack>

						<Stack
							direction={{ xs: "column", sm: "row" }}
							sx={{
								alignItems: { sm: "center" },
								justifyContent: "space-between",
								gap: 2,
								mt: 1.5,
								pt: 2.5,
								borderTop: "1px solid",
								borderColor: "divider",
							}}
						>
							<Typography sx={{ fontSize: 13, color: "secondary.main" }}>
								<Box
									component="span"
									sx={{
										fontSize: 24,
										fontWeight: 700,
										color: "text.primary",
									}}
								>
									৳ {doctor?.appointmentFee}
								</Box>{" "}
								/ visit · incl. VAT
							</Typography>

							<Button
								href="#book"
								sx={{
									bgcolor: "primary.main",
									py: "11px",
									px: 3,
									"&:hover": { bgcolor: "primary.dark" },
								}}
							>
								Book appointment →
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Box>

			{/* STAT CARDS */}
			<Stack
				direction="row"
				sx={{ gap: 2, mt: 3, flexWrap: { xs: "wrap", md: "nowrap" } }}
			>
				<StatCard
					label="Experience"
					value={`${doctor?.experience ?? 0}+ yrs`}
				/>
				<StatCard
					label="Qualification"
					value={doctor?.qualification || "—"}
				/>
				<StatCard label="Avg. rating" value={ratingLabel} />
				<StatCard label="Contact" value={doctor?.contactNumber || "—"} />
			</Stack>

			{/* ABOUT */}
			<Box sx={{ mt: { xs: 5, md: 7 }, maxWidth: 760 }}>
				<Eyebrow>About</Eyebrow>
				<Typography
					sx={{
						mt: 0.5,
						fontSize: { xs: 15, md: 17 },
						lineHeight: 1.7,
						color: "text.secondary",
					}}
				>
					{doctor?.name} is a compassionate and dedicated{" "}
					{specialties[0] || "specialist"} committed to delivering
					high-quality, patient-centered care. With{" "}
					{doctor?.experience ?? 0}+ years of experience, they focus on
					accurate diagnosis, effective treatment, and advocating for your
					overall well-being.
				</Typography>
			</Box>

			{/* BOOKING */}
			<Box id="book" sx={{ mt: { xs: 5, md: 7 }, scrollMarginTop: "90px" }}>
				<DoctorScheduleSlots id={doctor?.id} />
			</Box>
		</Container>
	)
}

export default DoctorsProfilePage
