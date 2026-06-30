"use client"

import { Box, Container, Skeleton, Typography } from "@mui/material"
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded"
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi"
import { LinkArrow, MONO, SectionHead } from "../SectionHead"

// Specialties carry an optional doctor count from the API (`_count.doctorSpecialties`).
interface IHomeSpecialty {
	id: string
	title: string
	icon?: string
	_count?: { doctorSpecialties?: number }
}

const cardSx = {
	textDecoration: "none",
	bgcolor: "#fff",
	border: "1px solid",
	borderColor: "divider",
	borderRadius: "18px",
	p: "24px 20px",
	display: "flex",
	flexDirection: "column",
	gap: 2,
} as const

const gridSx = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
	gap: 1.75,
} as const

const SpecialtySkeleton = () => (
	<Box sx={{ ...cardSx, cursor: "default" }}>
		<Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: "12px" }} />
		<Box>
			<Skeleton variant="text" width="70%" height={24} />
			<Skeleton variant="text" width="45%" />
		</Box>
	</Box>
)

const Specialist = () => {
	const { data, isLoading, isError } = useGetAllSpecialtiesQuery(undefined)
	const specialties: IHomeSpecialty[] = (data as IHomeSpecialty[] | undefined) ?? []

	return (
		<Box component="section" id="specialties" sx={{ py: { xs: 9, md: 15 } }}>
			<Container>
				<SectionHead
					eyebrow="Specialties"
					title="Care for every part of you."
					sub="From primary care to highly specialized consultations."
					action={<LinkArrow href="/doctors">View all →</LinkArrow>}
				/>

				{isLoading && (
					<Box sx={gridSx}>
						{Array.from({ length: 8 }).map((_, i) => (
							<SpecialtySkeleton key={i} />
						))}
					</Box>
				)}

				{!isLoading && isError && (
					<Typography sx={{ color: "secondary.main", fontSize: 14 }}>
						We couldn&apos;t load specialties right now. Please try again later.
					</Typography>
				)}

				{!isLoading && !isError && specialties.length === 0 && (
					<Typography sx={{ color: "secondary.main", fontSize: 14 }}>
						No specialties available yet.
					</Typography>
				)}

				{!isLoading && !isError && specialties.length > 0 && (
					<Box sx={gridSx}>
						{specialties.map((s) => {
							const count = s._count?.doctorSpecialties ?? 0
							return (
								<Box
									key={s.id}
									component="a"
									href={`/doctors?specialties=${encodeURIComponent(s.title)}`}
									sx={{
										...cardSx,
										transition:
											"transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
										"&:hover": {
											transform: "translateY(-2px)",
											borderColor: "primary.main",
											boxShadow: "0 12px 24px -12px rgba(14, 124, 123, 0.2)",
										},
									}}
								>
									<Box
										sx={{
											width: 44,
											height: 44,
											borderRadius: "12px",
											bgcolor: "primary.light",
											color: "primary.main",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											overflow: "hidden",
										}}
									>
										{s.icon ? (
											<Box
												component="img"
												src={s.icon}
												alt={s.title}
												sx={{ width: 24, height: 24, objectFit: "contain" }}
											/>
										) : (
											<LocalHospitalRoundedIcon />
										)}
									</Box>
									<Box>
										<Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
											{s.title}
										</Typography>
										<Typography sx={{ fontFamily: MONO, fontSize: 12, color: "secondary.main", letterSpacing: "0.04em", mt: 0.25 }}>
											{count} {count === 1 ? "doctor" : "doctors"}
										</Typography>
									</Box>
								</Box>
							)
						})}
					</Box>
				)}
			</Container>
		</Box>
	)
}

export default Specialist
