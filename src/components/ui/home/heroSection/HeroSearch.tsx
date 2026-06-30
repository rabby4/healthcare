"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Button, MenuItem, Select, Typography } from "@mui/material"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi"
import { ISpecialty } from "@/types"

// Real, dynamic hero search: pick a specialty (loaded from the API) and jump to
// the doctor directory pre-filtered. The /doctors page reads `?specialties=`.
const HeroSearch = () => {
	const router = useRouter()
	const { data, isLoading } = useGetAllSpecialtiesQuery(undefined)
	const specialties = (data as ISpecialty[] | undefined) ?? []
	const [specialty, setSpecialty] = useState("")

	const onSearch = () => {
		router.push(
			specialty
				? `/doctors?specialties=${encodeURIComponent(specialty)}`
				: "/doctors"
		)
	}

	return (
		<Box
			sx={{
				mt: 4.5,
				bgcolor: "#fff",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "20px",
				p: 1,
				display: "grid",
				gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
				gap: 0.5,
				maxWidth: 580,
				boxShadow: "0 24px 48px -16px rgba(15, 30, 46, 0.12)",
			}}
		>
			<Box sx={{ px: 2, py: 1 }}>
				<Typography
					sx={{
						fontSize: 11,
						color: "secondary.main",
						letterSpacing: "0.06em",
						textTransform: "uppercase",
						fontWeight: 500,
					}}
				>
					Specialty
				</Typography>
				<Select
					value={specialty}
					onChange={(e) => setSpecialty(e.target.value)}
					displayEmpty
					variant="standard"
					IconComponent={KeyboardArrowDownRoundedIcon}
					renderValue={(val) => (val ? String(val) : "All specialties")}
					sx={{
						mt: 0.25,
						width: "100%",
						fontSize: 14,
						fontWeight: 500,
						color: "text.primary",
						"&:before, &:after": { display: "none" },
						"& .MuiSelect-select": {
							p: 0,
							pr: "24px !important",
							bgcolor: "transparent",
						},
						"& .MuiSelect-icon": { color: "secondary.main" },
					}}
					MenuProps={{
						slotProps: {
							paper: {
								sx: { maxHeight: 320, borderRadius: "12px", mt: 1 },
							},
						},
					}}
				>
					<MenuItem value="">All specialties</MenuItem>
					{specialties.map((s) => (
						<MenuItem key={s.id} value={s.title}>
							{s.title}
						</MenuItem>
					))}
				</Select>
			</Box>
			<Button
				onClick={onSearch}
				disabled={isLoading}
				startIcon={<SearchRoundedIcon />}
				sx={{ borderRadius: "14px", px: 3 }}
			>
				Search
			</Button>
		</Box>
	)
}

export default HeroSearch
