/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Box, Button, IconButton, Stack, TextField } from "@mui/material"
import SpecialistModal from "./components/SpecialistModal"
import { useState } from "react"
import {
	useDeleteSpecialtyMutation,
	useGetAllSpecialtiesQuery,
} from "@/redux/api/specialtiesApi"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import Image from "next/image"
import { GridDeleteIcon } from "@mui/x-data-grid"
import { toast } from "sonner"

const SpecialtiesPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { data, isLoading } = useGetAllSpecialtiesQuery({})
	const [deleteSpecialty] = useDeleteSpecialtyMutation()

	const handleDelete = async (id: string) => {
		try {
			const res = await deleteSpecialty(id).unwrap()
			if (res.id) {
				toast.success("Specialty deleted successfully!!!")
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	const columns: GridColDef[] = [
		{ field: "title", headerName: "Title", width: 400 },
		{
			field: "icon",
			headerName: "Icon",
			flex: 1,
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
			flex: 1,
			headerAlign: "left",
			align: "center",
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
					<DataGrid rows={data} columns={columns} hideFooter />
				</Box>
			) : (
				<h1>Loading...</h1>
			)}
		</Box>
	)
}

export default SpecialtiesPage
