/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Box, Button, IconButton, Stack } from "@mui/material"
import React, { useEffect, useState } from "react"
import ScheduleModal from "./components/ScheduleModal"
import { useGetAllSchedulesQuery } from "@/redux/api/scheduleApi"
import { formatDate } from "@/utils/formatDate"
import dayjs from "dayjs"
import { DataGrid, GridColDef, GridDeleteIcon } from "@mui/x-data-grid"
import BorderColorIcon from "@mui/icons-material/BorderColor"

const SchedulesPage = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [allSchedule, setAllSchedule] = useState<any>([])
	const { data, isLoading } = useGetAllSchedulesQuery({})

	const schedules = data?.schedule

	console.log(schedules)

	useEffect(() => {
		const updateData = schedules?.map((schedule: any) => {
			return {
				id: schedule?.id,
				startDate: formatDate(schedule.startDateTime),
				endDate: formatDate(schedule.endDateTime),
				startTime: dayjs(schedule?.startDateTime).format("hh:mm a"),
				endTime: dayjs(schedule?.endDateTime).format("hh:mm a"),
			}
		})
		setAllSchedule(updateData)
	}, [schedules])

	const columns: GridColDef[] = [
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
			<Stack
				direction={"row"}
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				<Button onClick={() => setIsModalOpen(true)}>Create Specialty</Button>
				<ScheduleModal open={isModalOpen} setOpen={setIsModalOpen} />
			</Stack>
			{!isLoading ? (
				<Box my={2}>
					<DataGrid rows={allSchedule ?? []} columns={columns} />
				</Box>
			) : (
				<h1>Loading.....</h1>
			)}
		</Box>
	)
}

export default SchedulesPage
