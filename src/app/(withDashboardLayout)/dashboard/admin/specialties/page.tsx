"use client"
import { Box, Button, IconButton, Stack, TextField } from "@mui/material"
import SpecialistModal from "./components/SpecialistModal"
import { useState } from "react"
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import Image from "next/image"
import { GridDeleteIcon } from "@mui/x-data-grid"

const SpecialtiesPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { data, isLoading } = useGetAllSpecialtiesQuery({})
	const handleDelete = (id: string) => {
		console.log(id)
	}

	const columns: GridColDef[] = [
		{ field: "title", headerName: "Title", width: 300 },
		{
			field: "icon",
			headerName: "Icon",
			width: 300,
			renderCell: ({ row }) => {
				return (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "start",
							height: "100%",
						}}
					>
						<Image src={row?.icon} width={30} height={30} alt="icon" />
					</Box>
				)
			},
		},
		{
			field: "action",
			headerName: "Actions",
			width: 300,
			renderCell: ({ row }) => {
				return (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "start",
							height: "100%",
						}}
					>
						<IconButton
							onClick={() => handleDelete(row.id)}
							aria-label="delete"
							color="error"
						>
							<GridDeleteIcon />
						</IconButton>
					</Box>
				)
			},
		},
	]

	return (
		<Box>
			<Stack
				direction={"row"}
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				<Button onClick={() => setIsModalOpen(true)}>Create Specialty</Button>
				<SpecialistModal open={isModalOpen} setOpen={setIsModalOpen} />
				<TextField size="small" placeholder="Search Specialist" />
			</Stack>
			{!isLoading ? (
				<Box>
					<h1>All specialties</h1>
					<DataGrid
						rows={data}
						columns={columns}
						sx={{ border: 0 }}
						hideFooter
					/>
				</Box>
			) : (
				<h1>Loading...</h1>
			)}
		</Box>
	)
}

export default SpecialtiesPage
