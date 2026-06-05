/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Box, Button, IconButton, Menu, MenuItem, Skeleton, Typography } from "@mui/material"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import { useState } from "react"
import { toast } from "sonner"

import PageHead from "@/components/dashboard/shell/PageHead"
import { SHELL } from "@/components/dashboard/shell/tokens"
import {
	useDeleteSpecialtyMutation,
	useGetAllSpecialtiesQuery,
} from "@/redux/api/specialtiesApi"
import AddSpecialtyModal from "./AddSpecialtyModal"

type ISpecialty = {
	id: string
	title: string
	icon: string
}

const GRID_SX = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
	gap: 2,
} as const

const SpecialtiesPage = () => {
	const [addOpen, setAddOpen] = useState(false)
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
	const [activeId, setActiveId] = useState<string | null>(null)

	const { data, isLoading, isError } = useGetAllSpecialtiesQuery(undefined)
	const specialties: ISpecialty[] = (data as ISpecialty[]) ?? []

	const [deleteSpecialty] = useDeleteSpecialtyMutation()

	const openMenu = (e: React.MouseEvent<HTMLElement>, id: string) => {
		setMenuAnchor(e.currentTarget)
		setActiveId(id)
	}
	const closeMenu = () => {
		setMenuAnchor(null)
		setActiveId(null)
	}

	const handleDelete = async () => {
		const id = activeId
		closeMenu()
		if (!id) return
		if (!window.confirm("Are you sure?")) return
		try {
			await deleteSpecialty(id).unwrap()
			toast.success("Specialty deleted")
		} catch {
			toast.error("Cannot delete — specialty is in use by a doctor")
		}
	}

	const subtitle = isLoading
		? "Loading specialties…"
		: `${specialties.length} specialties · Each has an icon patients see when browsing.`

	return (
		<>
			<PageHead
				title="Specialties"
				subtitle={subtitle}
				actions={<Button onClick={() => setAddOpen(true)}>+ Add specialty</Button>}
			/>

			{isError ? (
				<Typography sx={{ fontSize: 14, color: SHELL.urgent, py: 4 }}>
					Failed to load specialties. Please try again.
				</Typography>
			) : (
				<Box sx={GRID_SX}>
					{/* Add specialty (dashed) card */}
					<Box
						onClick={() => setAddOpen(true)}
						sx={{
							minHeight: 168,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 1,
							p: "22px",
							border: "1.5px dashed",
							borderColor: "divider",
							borderRadius: "22px",
							color: "text.secondary",
							cursor: "pointer",
							transition: "all 160ms ease",
							bgcolor: "transparent",
							"&:hover": {
								borderColor: "primary.main",
								bgcolor: SHELL.tealTint2,
								color: "primary.main",
							},
						}}
					>
						<AddRoundedIcon sx={{ fontSize: 28 }} />
						<Typography sx={{ fontSize: 13, fontWeight: 600 }}>Add specialty</Typography>
					</Box>

					{isLoading
						? Array.from({ length: 6 }).map((_, i) => (
								<Box
									key={i}
									sx={{
										minHeight: 168,
										bgcolor: "#fff",
										border: "1px solid",
										borderColor: "divider",
										borderRadius: "22px",
										p: "22px",
									}}
								>
									<Skeleton
										variant="rounded"
										width={48}
										height={48}
										sx={{ borderRadius: "14px", mb: 1.75 }}
									/>
									<Skeleton variant="text" width="70%" height={24} />
								</Box>
						  ))
						: specialties.map((s) => (
								<Box
									key={s.id}
									sx={{
										position: "relative",
										bgcolor: "#fff",
										border: "1px solid",
										borderColor: "divider",
										borderRadius: "22px",
										p: "22px",
										minHeight: 168,
										transition: "all 160ms ease",
										"&:hover": {
											borderColor: "primary.main",
											boxShadow: "0 10px 28px -16px rgba(14, 124, 123, 0.35)",
										},
									}}
								>
									<IconButton
										size="small"
										onClick={(e) => openMenu(e, s.id)}
										sx={{
											position: "absolute",
											top: 16,
											right: 16,
											width: 28,
											height: 28,
											borderRadius: "8px",
											color: "text.secondary",
											"&:hover": { bgcolor: SHELL.bgSoft, color: "text.primary" },
										}}
									>
										<MoreHorizRoundedIcon sx={{ fontSize: 16 }} />
									</IconButton>

									<Box
										sx={{
											width: 48,
											height: 48,
											borderRadius: "14px",
											bgcolor: "primary.light",
											color: "primary.main",
											display: "inline-flex",
											alignItems: "center",
											justifyContent: "center",
											mb: 1.75,
											overflow: "hidden",
										}}
									>
										<Box
											component="img"
											src={s.icon}
											alt={s.title}
											sx={{ width: 32, height: 32, objectFit: "contain" }}
										/>
									</Box>

									<Typography
										sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}
									>
										{s.title}
									</Typography>
								</Box>
						  ))}
				</Box>
			)}

			<Menu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={closeMenu}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<MenuItem onClick={handleDelete} sx={{ color: SHELL.urgent, fontSize: 13, gap: 1 }}>
					<DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
					Delete
				</MenuItem>
			</Menu>

			<AddSpecialtyModal open={addOpen} onClose={() => setAddOpen(false)} />
		</>
	)
}

export default SpecialtiesPage
