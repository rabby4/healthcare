/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useState } from "react"
import DoctorScheduleModal from "./components/DoctorScheduleModal"
import { Box, Button, IconButton, Pagination } from "@mui/material"
import { DataGrid, GridColDef, GridDeleteIcon } from "@mui/x-data-grid"
import { useGetAllDoctorSchedulesQuery } from "@/redux/api/doctorScheduleApi"
import { formatDate } from "@/utils/formatDate"
import dayjs from "dayjs"
import BorderColorIcon from "@mui/icons-material/BorderColor"

const DoctorSchedulePage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const query: Record<string, any> = {}

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(4)

	query["page"] = page
	query["limit"] = limit

	const [allSchedule, setAllSchedule] = useState<any>([])
	const { data, isLoading } = useGetAllDoctorSchedulesQuery({ ...query })
	const schedules = data?.doctorSchedules
	const meta = data?.meta

	let pageCount: number

	if (meta?.total) {
		pageCount = Math.ceil(meta?.total / limit)
	}

	const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value)
	}

	useEffect(() => {
		const updateData = schedules?.map((schedule: any) => {
			return {
				id: schedule?.scheduleId,
				startDate: formatDate(schedule?.schedule?.startDateTime),
				endDate: formatDate(schedule?.schedule?.endDateTime),
				startTime: dayjs(schedule?.schedule?.startDateTime).format("hh:mm a"),
				endTime: dayjs(schedule?.schedule?.endDateTime).format("hh:mm a"),
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
			<Button onClick={() => setIsModalOpen(true)}>
				Create Doctor Schedule
			</Button>
			<DoctorScheduleModal open={isModalOpen} setOpen={setIsModalOpen} />
			<Box>
				{!isLoading ? (
					<Box my={2}>
						<DataGrid
							rows={allSchedule ?? []}
							columns={columns}
							slots={{
								footer: () => {
									return (
										<Box
											sx={{
												mb: 2,
												borderTop: "1px solid #ccc",
												pt: 2,
												display: "flex",
												justifyContent: "flex-end",
											}}
										>
											<Pagination
												count={pageCount}
												page={page}
												onChange={handleChange}
												color="primary"
											/>
										</Box>
									)
								},
							}}
						/>
					</Box>
				) : (
					<h1>Loading.....</h1>
				)}
			</Box>
		</Box>
	)
}

export default DoctorSchedulePage
