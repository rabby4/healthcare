/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useMemo } from "react"
import {
	Box,
	Chip,
	CircularProgress,
	IconButton,
	Pagination,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import dayjs from "dayjs"
import { toast } from "sonner"
import { useGetMYProfileQuery } from "@/redux/api/myProfileApi"
import {
	useGetAllDoctorSchedulesQuery,
	useDeleteDoctorScheduleMutation,
} from "@/redux/api/doctorScheduleApi"
import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import { useConfirm } from "@/components/dashboard/shell/useConfirm"
import ClaimAvailabilityCard from "./components/ClaimAvailabilityCard"

const TEAL = "#0E7C7B"
const INK = "#0F1E2E"

const LegendItem = ({ swatch, label }: { swatch: React.ReactNode; label: string }) => (
	<Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
		{swatch}
		<Typography sx={{ fontSize: 12, color: "text.secondary" }}>{label}</Typography>
	</Stack>
)

const DoctorSchedulePage = () => {
	const startDate = useMemo(
		() => dayjs().startOf("day").toISOString(),
		[]
	)
	const endDate = useMemo(
		() => dayjs().add(14, "day").endOf("day").toISOString(),
		[]
	)

	const [page, setPage] = React.useState(1)
	const limit = 200

	const { data: profile, isLoading: profileLoading } =
		useGetMYProfileQuery(undefined)
	const doctorId = profile?.id

	const { data, isLoading, isError, isFetching } =
		useGetAllDoctorSchedulesQuery(
			{ doctorId, page, limit },
			{ skip: !doctorId }
		)

	const [deleteDoctorSchedule] = useDeleteDoctorScheduleMutation()
	const { confirm, ConfirmDialog } = useConfirm()

	const doctorSchedules: any[] = data?.doctorSchedules ?? []
	const meta = data?.meta

	const total = meta?.total ?? doctorSchedules.length
	const bookedCount = doctorSchedules.filter((s) => s.isBooked).length
	const openCount = doctorSchedules.filter((s) => !s.isBooked).length
	const pageCount = meta?.total ? Math.ceil(meta.total / limit) : 1

	// Group claimed slots by day
	const grouped = useMemo(() => {
		const map = new Map<string, any[]>()
		for (const s of doctorSchedules) {
			const start = s?.schedule?.startDateTime
			if (!start) continue
			const key = dayjs(start).format("YYYY-MM-DD")
			if (!map.has(key)) map.set(key, [])
			map.get(key)!.push(s)
		}
		return Array.from(map.entries())
			.sort(([a], [b]) => (a < b ? -1 : 1))
			.map(([key, list]) => ({
				key,
				label: dayjs(key).format("ddd, DD MMM"),
				isToday: dayjs(key).isSame(dayjs(), "day"),
				list: list.sort(
					(a, b) =>
						dayjs(a.schedule.startDateTime).valueOf() -
						dayjs(b.schedule.startDateTime).valueOf()
				),
			}))
	}, [doctorSchedules])

	const handleDelete = async (scheduleId: string) => {
		const ok = await confirm({
			title: "Remove this open slot?",
			message: "Patients will no longer see it as available.",
			confirmLabel: "Remove slot",
			danger: true,
		})
		if (!ok) return
		try {
			await deleteDoctorSchedule(scheduleId).unwrap()
			toast.success("Slot removed")
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const loading = profileLoading || isLoading || (isFetching && !data)

	return (
		<Box>
			<PageHead
				title="My schedules"
				subtitle="Claim admin-published consultation slots. Booked slots are locked, patients see them as unavailable until the appointment is done."
			/>

			{/* Claim availability feature card */}
			<ClaimAvailabilityCard startDate={startDate} endDate={endDate} />

			{/* Stat strip */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
					gap: 2,
					mb: 3,
				}}
			>
				<Stat
					label="My slots"
					value={loading ? "—" : total}
					deltaLabel="next 14 days"
					deltaTrend="neutral"
				/>
				<Stat
					label="Booked"
					value={loading ? "—" : bookedCount}
					delta={
						!loading && total > 0
							? `${Math.round((bookedCount / total) * 100)}%`
							: undefined
					}
					deltaLabel="utilization"
					deltaTrend="up"
				/>
				<Stat
					label="Open"
					value={loading ? "—" : openCount}
					deltaLabel="awaiting patients"
					deltaTrend="neutral"
				/>
				<Stat
					label="Earnings projected"
					value="—"
					deltaLabel="not available"
					deltaTrend="neutral"
				/>
			</Box>

			{/* Claimed slots card */}
			<Box
				sx={{
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "22px",
					overflow: "hidden",
				}}
			>
				{/* Toolbar / legend */}
				<Stack
					direction={{ xs: "column", sm: "row" }}
					sx={{
						p: "16px 20px",
						borderBottom: "1px solid",
						borderColor: "divider",
						gap: 2,
						alignItems: { sm: "center" },
						justifyContent: "space-between",
					}}
				>
					<Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>
						My claimed slots
					</Typography>
					<Stack direction="row" sx={{ gap: 2.25, alignItems: "center", flexWrap: "wrap" }}>
						<LegendItem
							label="Open"
							swatch={
								<Box
									sx={{
										width: 14,
										height: 14,
										borderRadius: "4px",
										bgcolor: "rgba(14,124,123,0.18)",
										borderLeft: `3px solid ${TEAL}`,
									}}
								/>
							}
						/>
						<LegendItem
							label="Booked"
							swatch={
								<Box sx={{ width: 14, height: 14, borderRadius: "4px", bgcolor: INK }} />
							}
						/>
					</Stack>
				</Stack>

				{/* Body */}
				<Box sx={{ p: { xs: 2, md: 3 } }}>
					{loading ? (
						<Stack spacing={2}>
							{[0, 1, 2].map((i) => (
								<Box key={i}>
									<Skeleton width={120} height={18} sx={{ mb: 1 }} />
									<Stack direction="row" spacing={1}>
										{[0, 1, 2, 3].map((j) => (
											<Skeleton
												key={j}
												variant="rounded"
												width={90}
												height={34}
											/>
										))}
									</Stack>
								</Box>
							))}
						</Stack>
					) : isError ? (
						<Box sx={{ textAlign: "center", py: 6 }}>
							<Typography sx={{ color: SHELL.urgent, fontSize: 14, fontWeight: 600 }}>
								Could not load your schedules.
							</Typography>
							<Typography sx={{ color: "text.secondary", fontSize: 13, mt: 0.5 }}>
								Please refresh the page or try again later.
							</Typography>
						</Box>
					) : grouped.length === 0 ? (
						<Box sx={{ textAlign: "center", py: 7 }}>
							<Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>
								You have not claimed any slots yet.
							</Typography>
							<Typography sx={{ color: "text.secondary", fontSize: 14, mt: 0.75 }}>
								Claim some above from the open slots published by admin.
							</Typography>
						</Box>
					) : (
						<Stack spacing={3}>
							{grouped.map((day) => (
								<Box key={day.key}>
									<Stack
										direction="row"
										sx={{ alignItems: "center", gap: 1, mb: 1.25 }}
									>
										<Typography
											sx={{
												fontFamily: MONO,
												fontSize: 11,
												letterSpacing: "0.08em",
												textTransform: "uppercase",
												color: day.isToday ? TEAL : "text.secondary",
												fontWeight: 600,
											}}
										>
											{day.label}
										</Typography>
										{day.isToday && (
											<Box
												component="span"
												sx={{
													fontFamily: MONO,
													fontSize: 10,
													px: 0.75,
													py: 0.25,
													borderRadius: "6px",
													bgcolor: "rgba(14,124,123,0.1)",
													color: TEAL,
												}}
											>
												TODAY
											</Box>
										)}
										<Typography sx={{ fontSize: 11, color: "text.disabled" }}>
											· {day.list.length} slot{day.list.length === 1 ? "" : "s"}
										</Typography>
									</Stack>

									<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
										{day.list.map((s) => {
											const time = dayjs(s.schedule.startDateTime).format("hh:mm A")
											if (s.isBooked) {
												return (
													<Chip
														key={s.scheduleId}
														icon={<LockOutlinedIcon sx={{ fontSize: 14 }} />}
														label={time}
														sx={{
															fontFamily: MONO,
															fontSize: 12,
															borderRadius: "8px",
															bgcolor: INK,
															color: "#fff",
															"& .MuiChip-icon": { color: "rgba(255,255,255,0.7)" },
														}}
													/>
												)
											}
											return (
												<Chip
													key={s.scheduleId}
													label={time}
													onDelete={() => handleDelete(s.scheduleId)}
													deleteIcon={
														<CloseIcon sx={{ fontSize: 16 }} aria-label="delete slot" />
													}
													sx={{
														fontFamily: MONO,
														fontSize: 12,
														borderRadius: "8px",
														bgcolor: "rgba(14,124,123,0.08)",
														color: TEAL,
														border: `1px solid rgba(14,124,123,0.25)`,
														"& .MuiChip-deleteIcon": {
															color: TEAL,
															"&:hover": { color: SHELL.urgent },
														},
													}}
												/>
											)
										})}
									</Box>
								</Box>
							))}
						</Stack>
					)}
				</Box>

				{/* Footer / pagination */}
				{!loading && !isError && grouped.length > 0 && (
					<Stack
						direction="row"
						sx={{
							p: "16px 20px",
							borderTop: "1px solid",
							borderColor: "divider",
							alignItems: "center",
							justifyContent: "space-between",
							flexWrap: "wrap",
							gap: 1,
						}}
					>
						<Typography sx={{ fontSize: 13, color: "text.secondary" }}>
							Showing{" "}
							<Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
								{doctorSchedules.length}
							</Box>{" "}
							claimed slot{doctorSchedules.length === 1 ? "" : "s"}
							{isFetching && (
								<CircularProgress size={12} sx={{ ml: 1, color: TEAL }} />
							)}
						</Typography>
						{pageCount > 1 && (
							<Pagination
								count={pageCount}
								page={page}
								onChange={(_e, v) => setPage(v)}
								color="primary"
								size="small"
							/>
						)}
					</Stack>
				)}
			</Box>
			{ConfirmDialog}
		</Box>
	)
}

export default DoctorSchedulePage
