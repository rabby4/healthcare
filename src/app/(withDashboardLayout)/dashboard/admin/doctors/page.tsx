/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Box, Button, IconButton, Stack, TextField } from "@mui/material"
import React, { useState } from "react"
import DoctorModal from "./components/DoctorModal"
import {
	useDeleteDoctorMutation,
	useGetAllDoctorsQuery,
} from "@/redux/api/doctorApi"
import { DataGrid, GridColDef, GridDeleteIcon } from "@mui/x-data-grid"
import { useDebounced } from "@/redux/hooks"
import { toast } from "sonner"

const DoctorsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const query: Record<string, any> = {}
	const [searchTerm, setSearchTerm] = useState<string>("")

	const debounceTerm = useDebounced({
		searchQuery: searchTerm,
		delay: 600,
	})

	if (!!debounceTerm) {
		query["searchTerm"] = searchTerm
	}

	const { data, isLoading } = useGetAllDoctorsQuery({ ...query })
	const [deleteDoctor] = useDeleteDoctorMutation()

	const doctors = data?.doctors
	const meta = data?.meta

	const handleDelete = async (id: string) => {
		try {
			const res = await deleteDoctor(id).unwrap()
			if (res.id) {
				toast.success("Doctor deleted successfully!!!")
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	const columns: GridColDef[] = [
		{ field: "name", headerName: "Name", flex: 1 },
		{ field: "email", headerName: "Email", flex: 1 },
		{ field: "contactNumber", headerName: "Contact Number", flex: 1 },
		{ field: "gender", headerName: "Gender", flex: 1 },
		{ field: "appointmentFee", headerName: "Appointment Fee", flex: 1 },
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
				<Button onClick={() => setIsModalOpen(true)}>Create New Doctor</Button>
				<DoctorModal open={isModalOpen} setOpen={setIsModalOpen} />
				<TextField
					onChange={(e) => setSearchTerm(e.target.value)}
					size="small"
					placeholder="Search Doctor"
				/>
			</Stack>
			{!isLoading ? (
				<Box>
					<h1>All specialties</h1>
					<DataGrid rows={doctors} columns={columns} />
				</Box>
			) : (
				<h1>Loading...</h1>
			)}
		</Box>
	)
}

export default DoctorsPage
