"use client"

import { Box, Container, Skeleton, Stack, Typography } from "@mui/material"
import DoctorCard from "@/components/ui/doctor/DcotorCard"
import { useGetAllDoctorsQuery } from "@/redux/api/doctorApi"
import { IDoctor } from "@/types"
import { LinkArrow, SectionHead } from "../SectionHead"

// How many top-rated doctors to feature on the home page. The API defaults to
// ordering by averageRating (desc), so a plain page/limit request returns the
// highest-rated doctors first.
const FEATURED_LIMIT = 4

const gridSx = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
	gap: 2.5,
} as const

const SkeletonCard = () => (
	<Stack
		sx={{
			bgcolor: "#fff",
			border: "1px solid",
			borderColor: "divider",
			borderRadius: "22px",
			p: 3,
			gap: 2.5,
		}}
	>
		<Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
			<Skeleton variant="circular" width={64} height={64} />
			<Box sx={{ flex: 1 }}>
				<Skeleton variant="text" width="70%" height={26} />
				<Skeleton variant="text" width="50%" />
				<Skeleton variant="text" width="40%" />
			</Box>
		</Stack>
		<Stack direction="row" sx={{ gap: 0.75 }}>
			<Skeleton variant="rounded" width={80} height={24} />
			<Skeleton variant="rounded" width={64} height={24} />
		</Stack>
		<Skeleton variant="rectangular" height={1} />
		<Stack direction="row" sx={{ justifyContent: "space-between" }}>
			<Skeleton variant="text" width={90} height={32} />
			<Skeleton variant="rounded" width={170} height={36} />
		</Stack>
	</Stack>
)

const TopRatedDoctors = () => {
	const { data, isLoading, isError } = useGetAllDoctorsQuery({
		page: 1,
		limit: FEATURED_LIMIT,
	})
	const doctors: IDoctor[] = data?.doctors ?? []

	return (
		<Box component="section" id="doctors" sx={{ py: { xs: 9, md: 15 } }}>
			<Container>
				<SectionHead
					eyebrow="Top rated"
					title="Meet a few of our doctors."
					sub="Hand-picked, verified, and reviewed by thousands of patients."
					action={<LinkArrow href="/doctors">Browse all doctors →</LinkArrow>}
				/>

				{isLoading && (
					<Box sx={gridSx}>
						{Array.from({ length: FEATURED_LIMIT }).map((_, i) => (
							<SkeletonCard key={i} />
						))}
					</Box>
				)}

				{!isLoading && isError && (
					<Typography sx={{ color: "secondary.main", fontSize: 14 }}>
						We couldn&apos;t load doctors right now. Please try again later.
					</Typography>
				)}

				{!isLoading && !isError && doctors.length === 0 && (
					<Typography sx={{ color: "secondary.main", fontSize: 14 }}>
						No doctors available yet. Please check back soon.
					</Typography>
				)}

				{!isLoading && !isError && doctors.length > 0 && (
					<Box sx={gridSx}>
						{doctors.map((doctor) => (
							<DoctorCard key={doctor.id} doctor={doctor} />
						))}
					</Box>
				)}
			</Container>
		</Box>
	)
}

export default TopRatedDoctors
