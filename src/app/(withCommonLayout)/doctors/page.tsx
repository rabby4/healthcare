/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import DoctorCard from "@/components/ui/doctor/DcotorCard"
import { SectionHead } from "@/components/ui/home/SectionHead"
import { useGetAllDoctorsQuery } from "@/redux/api/doctorApi"
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi"
import { IDoctor, ISpecialty } from "@/types"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded"
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded"
import {
	Box,
	Container,
	InputAdornment,
	Pagination,
	Skeleton,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"

const LIMIT = 8

const gridSx = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
	gap: 2.5,
}

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

const FilterChip = ({
	label,
	active,
	onClick,
}: {
	label: string
	active: boolean
	onClick: () => void
}) => (
	<Box
		component="button"
		type="button"
		onClick={onClick}
		sx={{
			border: "1px solid",
			borderColor: active ? "primary.main" : "divider",
			bgcolor: active ? "primary.main" : "secondary.light",
			color: active ? "primary.contrastText" : "text.secondary",
			borderRadius: "999px",
			px: 2,
			py: 1,
			fontSize: 13,
			fontWeight: 600,
			cursor: "pointer",
			whiteSpace: "nowrap",
			transition: "all 160ms ease",
			"&:hover": {
				borderColor: "primary.main",
				color: active ? "primary.contrastText" : "primary.main",
			},
		}}
	>
		{label}
	</Box>
)

const DoctorsContent = () => {
	const searchParams = useSearchParams()
	const initialSpecialty = searchParams.get("specialties") || ""

	const [searchTerm, setSearchTerm] = useState("")
	const [specialties, setSpecialties] = useState(initialSpecialty)
	const [page, setPage] = useState(1)

	// Reset to first page whenever the active search / specialty filter changes.
	useEffect(() => {
		setPage(1)
	}, [searchTerm, specialties])

	const query = useMemo(() => {
		const q: Record<string, any> = { page, limit: LIMIT }
		if (searchTerm) q.searchTerm = searchTerm
		if (specialties) q.specialties = specialties
		return q
	}, [page, searchTerm, specialties])

	const { data, isLoading, isError } = useGetAllDoctorsQuery(query)
	const { data: specialtyList } = useGetAllSpecialtiesQuery(undefined)

	const doctors: IDoctor[] = data?.doctors ?? []
	const total: number = data?.meta?.total ?? 0
	const pageCount = Math.max(1, Math.ceil(total / LIMIT))

	const isFiltered = Boolean(searchTerm || specialties)

	return (
		<Box sx={{ py: { xs: 6, md: 10 } }}>
			<Container>
				<SectionHead
					eyebrow="Find a doctor"
					title="Browse our specialists."
					sub="Search verified doctors by name or specialty and book an appointment in minutes."
				/>

				{/* Search */}
				<TextField
					fullWidth
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search by doctor name, designation or workplace..."
					slotProps={{
						input: {
							startAdornment: (
								<InputAdornment position="start">
									<SearchRoundedIcon sx={{ color: "secondary.main" }} />
								</InputAdornment>
							),
							sx: { borderRadius: "999px", bgcolor: "#fff" },
						},
					}}
					sx={{ maxWidth: 560, mb: 3 }}
				/>

				{/* Specialty filter chips */}
				<Stack
					direction="row"
					sx={{
						gap: 1,
						flexWrap: "nowrap",
						overflowX: "auto",
						pb: 1,
						mb: 4,
						"&::-webkit-scrollbar": { height: 6 },
						"&::-webkit-scrollbar-thumb": {
							bgcolor: "divider",
							borderRadius: 999,
						},
					}}
				>
					<FilterChip
						label="All"
						active={specialties === ""}
						onClick={() => setSpecialties("")}
					/>
					{(specialtyList as ISpecialty[] | undefined)?.map((s) => (
						<FilterChip
							key={s.id}
							label={s.title}
							active={specialties === s.title}
							onClick={() => setSpecialties(s.title)}
						/>
					))}
				</Stack>

				{/* Count */}
				{!isLoading && !isError && (
					<Typography sx={{ color: "secondary.main", fontSize: 14, mb: 2.5 }}>
						{total} {total === 1 ? "doctor" : "doctors"}
						{specialties ? ` in ${specialties}` : ""}
					</Typography>
				)}

				{/* Loading */}
				{isLoading && (
					<Box sx={gridSx}>
						{Array.from({ length: LIMIT }).map((_, i) => (
							<SkeletonCard key={i} />
						))}
					</Box>
				)}

				{/* Error */}
				{isError && (
					<Stack
						sx={{
							alignItems: "center",
							textAlign: "center",
							gap: 1.5,
							py: 8,
							px: 3,
							bgcolor: "secondary.light",
							border: "1px solid",
							borderColor: "divider",
							borderRadius: "22px",
						}}
					>
						<ErrorOutlineRoundedIcon
							sx={{ fontSize: 44, color: "error.main" }}
						/>
						<Typography variant="h6" sx={{ color: "text.primary" }}>
							Something went wrong
						</Typography>
						<Typography sx={{ color: "secondary.main", maxWidth: 420 }}>
							We couldn&apos;t load the doctor directory right now. Please
							refresh the page or try again in a moment.
						</Typography>
					</Stack>
				)}

				{/* Empty */}
				{!isLoading && !isError && doctors.length === 0 && (
					<Stack
						sx={{
							alignItems: "center",
							textAlign: "center",
							gap: 1.5,
							py: 8,
							px: 3,
							bgcolor: "secondary.light",
							border: "1px solid",
							borderColor: "divider",
							borderRadius: "22px",
						}}
					>
						<SentimentDissatisfiedRoundedIcon
							sx={{ fontSize: 44, color: "secondary.main" }}
						/>
						<Typography variant="h6" sx={{ color: "text.primary" }}>
							No doctors found
						</Typography>
						<Typography sx={{ color: "secondary.main", maxWidth: 420 }}>
							{isFiltered
								? "No doctors match your current search and specialty filter. Try a different term or clear the filters."
								: "There are no doctors to show right now. Please check back later."}
						</Typography>
					</Stack>
				)}

				{/* Results */}
				{!isLoading && !isError && doctors.length > 0 && (
					<>
						<Box sx={gridSx}>
							{doctors.map((doctor) => (
								<DoctorCard key={doctor.id} doctor={doctor} />
							))}
						</Box>

						{pageCount > 1 && (
							<Stack sx={{ alignItems: "center", mt: 6 }}>
								<Pagination
									count={pageCount}
									page={page}
									onChange={(_, value) => setPage(value)}
									color="primary"
									shape="rounded"
								/>
							</Stack>
						)}
					</>
				)}
			</Container>
		</Box>
	)
}

const DoctorsFallback = () => (
	<Box sx={{ py: { xs: 6, md: 10 } }}>
		<Container>
			<SectionHead
				eyebrow="Find a doctor"
				title="Browse our specialists."
				sub="Search verified doctors by name or specialty and book an appointment in minutes."
			/>
			<Box sx={gridSx}>
				{Array.from({ length: LIMIT }).map((_, i) => (
					<SkeletonCard key={i} />
				))}
			</Box>
		</Container>
	</Box>
)

const DoctorsPage = () => (
	<Suspense fallback={<DoctorsFallback />}>
		<DoctorsContent />
	</Suspense>
)

export default DoctorsPage
