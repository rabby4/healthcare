"use client"
import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi"
import { Box, IconButton } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import VideocamIcon from "@mui/icons-material/Videocam"
import Link from "next/link"
import { getTimeIn12HourFormat } from "../../doctor/schedules/components/MultipleSelectFieldChip"
import { formatDate } from "@/utils/formatDate"
import ProChips from "@/components/shared/ProChip/ProChips"

const PatientAppointmentsPage = () => {
	const { data, isLoading } = useGetMyAppointmentsQuery({})
	const appointments = data?.appointments
	// const meta = data?.meta

	const columns: GridColDef[] = [
		{
			field: "name",
			headerName: "Doctor Name",
			flex: 1,
			renderCell: ({ row }) => {
				return row.doctor.name
			},
		},
		{
			field: "appointmentDate",
			headerName: "Appointment Date",
			headerAlign: "center",
			align: "center",
			flex: 1,
			renderCell: ({ row }) => {
				return formatDate(row.schedule.startDateTime)
			},
		},
		{
			field: "appointmentTime",
			headerName: "Appointment Time",
			headerAlign: "center",
			align: "center",
			flex: 1,
			renderCell: ({ row }) => {
				return getTimeIn12HourFormat(row.schedule.startDateTime)
			},
		},

		{
			field: "paymentStatus",
			headerName: "Payment Status",
			flex: 1,
			headerAlign: "center",
			align: "center",
			renderCell: ({ row }) => {
				return row.paymentStatus === "PAID" ? (
					<ProChips label={row.paymentStatus} type="success" />
				) : (
					<ProChips label={row.paymentStatus} type="error" />
				)
			},
		},
		{
			field: "action",
			headerName: "Join",
			flex: 1,
			headerAlign: "center",
			align: "center",
			renderCell: ({ row }) => {
				return (
					<IconButton
						component={Link}
						href={`/video?videoCallingId=${row?.videoCallingId}`}
						disabled={row.paymentStatus === "UNPAID"}
					>
						<VideocamIcon
							sx={{
								color: row.paymentStatus === "PAID" ? "primary.main" : "",
							}}
						/>
					</IconButton>
				)
			},
		},
	]

	return (
		<Box>
			{!isLoading ? (
				<Box my={2}>
					<DataGrid
						rows={appointments ?? []}
						columns={columns}
						loading={isLoading}
					/>
				</Box>
			) : (
				<h1>Loading.....</h1>
			)}
		</Box>
	)
}

export default PatientAppointmentsPage
