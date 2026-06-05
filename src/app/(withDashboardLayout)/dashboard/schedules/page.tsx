/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Box, Button, Stack, Typography } from "@mui/material"
import dayjs from "dayjs"
import { useState } from "react"
import { toast } from "sonner"

import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import { MONO, SHELL } from "@/components/dashboard/shell/tokens"
import {
	useDeleteScheduleMutation,
	useGetAllSchedulesQuery,
} from "@/redux/api/scheduleApi"
import GenerateSlotsModal from "./GenerateSlotsModal"

const headers = [
	{ label: "Date", align: "left" as const, width: "34%" },
	{ label: "Start", align: "left" as const },
	{ label: "End", align: "left" as const },
	{ label: "Actions", align: "right" as const },
]

const cellSx = (last: boolean) => ({
	p: "16px 20px",
	fontSize: 14,
	color: "text.primary",
	borderBottom: last ? "none" : `1px solid ${SHELL.dividerSoft}`,
	verticalAlign: "middle" as const,
})

const timeCellSx = (last: boolean) => ({
	...cellSx(last),
	fontFamily: MONO,
	fontVariantNumeric: "tabular-nums" as const,
})

const SchedulesPage = () => {
	const [modalOpen, setModalOpen] = useState(false)

	const openModal = () => setModalOpen(true)
	const closeModal = () => setModalOpen(false)

	// Default the list to the next 30 days. The backend filters on a DateTime
	// column, so the params MUST be full ISO datetimes (date-only 400s in Prisma).
	const startDate = dayjs().startOf("day").toISOString()
	const endDate = dayjs().add(30, "day").endOf("day").toISOString()

	const [page, setPage] = useState(1)
	const limit = 10

	const { data, isLoading, isError } = useGetAllSchedulesQuery({
		startDate,
		endDate,
		page,
		limit,
	})

	const slots: any[] = data?.schedule ?? []
	const meta = data?.meta

	const [deleteSchedule, { isLoading: isDeleting }] = useDeleteScheduleMutation()

	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure?")) return
		try {
			await deleteSchedule(id).unwrap()
			toast.success("Slot deleted")
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const total = meta?.total ?? slots.length
	const metaLimit = meta?.limit ?? limit
	const metaPage = meta?.page ?? page
	const pageCount = total ? Math.ceil(total / metaLimit) : 1
	const rangeStart = total === 0 ? 0 : (metaPage - 1) * metaLimit + 1
	const rangeEnd = total === 0 ? 0 : Math.min(metaPage * metaLimit, total)

	const colSpan = headers.length

	return (
		<>
			<PageHead
				title="Schedule slots"
				subtitle="Generate 30-minute slots across a date and time range in bulk."
				actions={<Button onClick={openModal}>+ Generate slots</Button>}
			/>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
					gap: 2,
					mb: 3,
				}}
			>
				<Stat
					label="Slots · next 30 days"
					value={isLoading ? "—" : total.toLocaleString()}
					deltaTrend="neutral"
					deltaLabel={`${dayjs(startDate).format("DD MMM")} → ${dayjs(endDate).format("DD MMM")}`}
				/>
				<Stat
					label="Booking insight"
					value="—"
					deltaTrend="neutral"
					deltaLabel="not reported by this view"
				/>
			</Box>

			<Box
				sx={{
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "22px",
					overflow: "hidden",
				}}
			>
				{/* Toolbar */}
				<Stack
					direction={{ xs: "column", md: "row" }}
					sx={{
						alignItems: { md: "center" },
						gap: 1.5,
						p: "16px 20px",
						borderBottom: "1px solid",
						borderColor: "divider",
						flexWrap: "wrap",
					}}
				>
					<Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", flex: 1 }}>
						Generated slots
					</Typography>
					<Typography sx={{ fontSize: 13, color: "text.secondary" }}>
						{dayjs(startDate).format("DD MMM")} — {dayjs(endDate).format("DD MMM")}
					</Typography>
				</Stack>

				{/* Table */}
				<Box sx={{ overflowX: "auto" }}>
					<Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
						<Box component="thead">
							<Box component="tr">
								{headers.map((h) => (
									<Box
										key={h.label}
										component="th"
										sx={{
											textAlign: h.align,
											fontSize: 11,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											color: "text.secondary",
											fontWeight: 500,
											p: "12px 20px",
											bgcolor: SHELL.bgSoft,
											borderBottom: "1px solid",
											borderColor: "divider",
											...(h.width ? { width: h.width } : {}),
										}}
									>
										{h.label}
									</Box>
								))}
							</Box>
						</Box>
						<Box component="tbody">
							{isLoading &&
								[0, 1, 2, 3].map((i) => (
									<Box component="tr" key={`sk-${i}`}>
										<Box
											component="td"
											colSpan={colSpan}
											sx={{
												...cellSx(i === 3),
												color: "text.secondary",
												fontSize: 13,
											}}
										>
											Loading…
										</Box>
									</Box>
								))}

							{!isLoading && isError && (
								<Box component="tr">
									<Box
										component="td"
										colSpan={colSpan}
										sx={{
											...cellSx(true),
											color: SHELL.urgent,
											textAlign: "center",
											fontSize: 13,
										}}
									>
										Failed to load slots. Please try again.
									</Box>
								</Box>
							)}

							{!isLoading && !isError && slots.length === 0 && (
								<Box component="tr">
									<Box
										component="td"
										colSpan={colSpan}
										sx={{
											...cellSx(true),
											color: "text.secondary",
											textAlign: "center",
											fontSize: 13,
										}}
									>
										No slots in this range. Generate some.
									</Box>
								</Box>
							)}

							{!isLoading &&
								!isError &&
								slots.map((s, i) => {
									const isLast = i === slots.length - 1
									return (
										<Box
											key={s.id}
											component="tr"
											sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
										>
											<Box component="td" sx={cellSx(isLast)}>
												{dayjs(s.startDateTime).format("ddd, DD MMM YYYY")}
											</Box>
											<Box component="td" sx={timeCellSx(isLast)}>
												{dayjs(s.startDateTime).format("hh:mm A")}
											</Box>
											<Box component="td" sx={timeCellSx(isLast)}>
												{dayjs(s.endDateTime).format("hh:mm A")}
											</Box>
											<Box
												component="td"
												sx={{ ...cellSx(isLast), textAlign: "right" }}
											>
												<Box
													component="button"
													onClick={() => handleDelete(s.id)}
													disabled={isDeleting}
													sx={{
														fontSize: 12,
														fontWeight: 600,
														px: 1,
														py: 0.5,
														borderRadius: "6px",
														border: "none",
														bgcolor: "transparent",
														cursor: isDeleting ? "not-allowed" : "pointer",
														color: SHELL.urgent,
														opacity: isDeleting ? 0.5 : 1,
														"&:hover": { bgcolor: SHELL.bgSoft },
													}}
												>
													Delete
												</Box>
											</Box>
										</Box>
									)
								})}
						</Box>
					</Box>
				</Box>

				{/* Pagination */}
				<Stack
					direction="row"
					sx={{
						alignItems: "center",
						justifyContent: "space-between",
						p: "14px 20px",
						borderTop: "1px solid",
						borderColor: "divider",
						fontSize: 12,
						color: "text.secondary",
					}}
				>
					<Box>
						Showing {rangeStart} — {rangeEnd} of {total} slots
					</Box>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{Array.from({ length: pageCount }, (_, idx) => idx + 1)
							.filter((p) => Math.abs(p - metaPage) <= 2)
							.map((p) => (
								<Box
									key={p}
									component="button"
									onClick={() => setPage(p)}
									sx={{
										width: 30,
										height: 30,
										borderRadius: "8px",
										border: "none",
										bgcolor: p === metaPage ? "text.primary" : "transparent",
										color: p === metaPage ? "#fff" : "text.secondary",
										fontSize: 12,
										fontFamily: MONO,
										cursor: "pointer",
										fontVariantNumeric: "tabular-nums",
										"&:hover": {
											bgcolor: p === metaPage ? "text.primary" : SHELL.bgSoft,
											color: p === metaPage ? "#fff" : "text.primary",
										},
									}}
								>
									{p}
								</Box>
							))}
					</Stack>
				</Stack>
			</Box>

			<GenerateSlotsModal open={modalOpen} onClose={closeModal} />
		</>
	)
}

export default SchedulesPage
