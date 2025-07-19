/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useState } from "react"
import DoctorScheduleModal from "./components/DoctorScheduleModal"
import { Box, Button, IconButton } from "@mui/material"
import { DataGrid, GridColDef, GridDeleteIcon } from "@mui/x-data-grid"
import { useGetAllDoctorSchedulesQuery } from "@/redux/api/doctorScheduleApi"
import { formatDate } from "@/utils/formatDate"
import dayjs from "dayjs"
import BorderColorIcon from "@mui/icons-material/BorderColor"

const DoctorSchedulePage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [allSchedule, setAllSchedule] = useState<any>([])
	const { data, isLoading } = useGetAllDoctorSchedulesQuery({})
	const schedules = data?.doctorSchedules
	console.log(schedules)

	useEffect(() => {
		const updateData = schedules?.map((schedule: any, index: number) => {
			return {
				sl: index + 1,
				id: index + 1,
				startDate: formatDate(schedule?.schedule?.startDateTime),
				endDate: formatDate(schedule?.schedule?.endDateTime),
				startTime: dayjs(schedule?.schedule?.startDateTime).format("hh:mm a"),
				endTime: dayjs(schedule?.schedule?.endDateTime).format("hh:mm a"),
			}
		})
		setAllSchedule(updateData)
	}, [schedules])

	const columns: GridColDef[] = [
		{ field: "sl", headerName: "SL" },
		{ field: "startDate", headerName: "Start Date", flex: 1 },
		{ field: "endDate", headerName: "End Date", flex: 1 },
		{ field: "startTime", headerName: "Start Time", flex: 1 },
		{ field: "endTime", headerName: "End Time", flex: 1 },
		{
			field: "action",
			headerName: "Action",
			flex: 1,
			headerAlign: "center",
			align: "center",
			renderCell: () => {
				return (
					<Box>
						<IconButton aria-label="delete">
							<GridDeleteIcon color="error" />
						</IconButton>
						<IconButton aria-label="delete">
							<BorderColorIcon />
						</IconButton>
					</Box>
				)
			},
		},
	]

	return (
		<Box>
			<Button onClick={() => setIsModalOpen(true)}>
				Create Doctor Schedule
			</Button>
			<DoctorScheduleModal open={isModalOpen} setOpen={setIsModalOpen} />
			<Box>
				{!isLoading ? (
					<Box my={2}>
						<DataGrid rows={allSchedule ?? []} columns={columns} />
					</Box>
				) : (
					<h1>Loading.....</h1>
				)}
			</Box>
		</Box>
	)
}

export default DoctorSchedulePage
