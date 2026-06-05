/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useMemo, useState } from "react"
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Collapse,
	Stack,
	Typography,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import CheckIcon from "@mui/icons-material/Check"
import dayjs from "dayjs"
import { toast } from "sonner"
import { useGetAllSchedulesQuery } from "@/redux/api/scheduleApi"
import { useCreateDoctorScheduleMutation } from "@/redux/api/doctorScheduleApi"
import { MONO } from "@/components/dashboard/shell/tokens"

type TProps = {
	startDate: string
	endDate: string
}

const TEAL = "#0E7C7B"
const TEAL_2 = "#16A085"

const ClaimAvailabilityCard = ({ startDate, endDate }: TProps) => {
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState<string[]>([])

	const { data, isLoading, isError } = useGetAllSchedulesQuery({
		startDate,
		endDate,
		page: 1,
		limit: 200,
	})

	const [createDoctorSchedule, { isLoading: claiming }] =
		useCreateDoctorScheduleMutation()

	const slots: any[] = data?.schedule ?? []

	// Group claimable slots by calendar day
	const grouped = useMemo(() => {
		const map = new Map<string, any[]>()
		for (const slot of slots) {
			const key = dayjs(slot.startDateTime).format("YYYY-MM-DD")
			if (!map.has(key)) map.set(key, [])
			map.get(key)!.push(slot)
		}
		return Array.from(map.entries())
			.sort(([a], [b]) => (a < b ? -1 : 1))
			.map(([key, list]) => ({
				key,
				label: dayjs(key).format("ddd, DD MMM"),
				list: list.sort(
					(a, b) =>
						dayjs(a.startDateTime).valueOf() - dayjs(b.startDateTime).valueOf()
				),
			}))
	}, [slots])

	const toggle = (id: string) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		)
	}

	const handleClaim = async () => {
		if (selected.length === 0) return
		try {
			await createDoctorSchedule({ scheduleIds: selected }).unwrap()
			toast.success(
				`Claimed ${selected.length} slot${selected.length > 1 ? "s" : ""}`
			)
			setSelected([])
			setOpen(false)
		} catch (err: any) {
			toast.error(
				err?.data?.message || err?.message || "Something went wrong"
			)
		}
	}

	return (
		<Box
			sx={{
				background: "linear-gradient(135deg, #0F1E2E, #1a2a3d)",
				color: "#fff",
				borderRadius: "22px",
				p: { xs: 3, md: "28px" },
				mb: 3,
			}}
		>
			<Stack
				direction={{ xs: "column", md: "row" }}
				sx={{
					gap: { xs: 3, md: 4 },
					alignItems: { md: "center" },
					justifyContent: "space-between",
				}}
			>
				<Box>
					<Typography
						sx={{
							fontFamily: MONO,
							fontSize: 11,
							letterSpacing: "0.12em",
							textTransform: "uppercase",
							color: TEAL_2,
						}}
					>
						Claim availability
					</Typography>
					<Typography
						component="h2"
						sx={{
							color: "#fff",
							fontSize: { xs: 20, md: 24 },
							fontWeight: 600,
							mt: 1,
							letterSpacing: "-0.02em",
						}}
					>
						Open consultation slots, published by admin.
					</Typography>
					<Typography
						sx={{
							color: "rgba(255,255,255,0.7)",
							mt: 1,
							maxWidth: 480,
							fontSize: 14,
						}}
					>
						Doctors cannot generate global slots — those are created by the
						admin. Pick the slots you want to be bookable for and claim them.
						They become available to patients the moment you claim.
					</Typography>
				</Box>

				<Box sx={{ minWidth: { md: 220 } }}>
					<Button
						onClick={() => setOpen((o) => !o)}
						variant="contained"
						startIcon={<AddIcon />}
						sx={{
							bgcolor: TEAL_2,
							color: "#fff",
							textTransform: "none",
							fontWeight: 600,
							borderRadius: "10px",
							px: 2.5,
							"&:hover": { bgcolor: TEAL },
						}}
					>
						{open ? "Close" : "Browse open slots"}
					</Button>
					{!isLoading && !isError && (
						<Typography
							sx={{
								mt: 1.5,
								fontSize: 12,
								fontFamily: MONO,
								color: "rgba(255,255,255,0.6)",
							}}
						>
							{slots.length} open slot{slots.length === 1 ? "" : "s"} available
						</Typography>
					)}
				</Box>
			</Stack>

			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box
					sx={{
						mt: 3,
						pt: 3,
						borderTop: "1px solid rgba(255,255,255,0.12)",
					}}
				>
					{isLoading ? (
						<Stack
							direction="row"
							sx={{ alignItems: "center", gap: 1.5, py: 2 }}
						>
							<CircularProgress size={18} sx={{ color: "#fff" }} />
							<Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
								Loading open slots…
							</Typography>
						</Stack>
					) : isError ? (
						<Typography sx={{ color: "#FFB4A2", fontSize: 14, py: 2 }}>
							Could not load open slots. Please try again.
						</Typography>
					) : grouped.length === 0 ? (
						<Typography
							sx={{ color: "rgba(255,255,255,0.7)", fontSize: 14, py: 2 }}
						>
							No open slots published by admin yet.
						</Typography>
					) : (
						<Stack spacing={2.5}>
							{grouped.map((day) => (
								<Box key={day.key}>
									<Typography
										sx={{
											fontFamily: MONO,
											fontSize: 11,
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											color: "rgba(255,255,255,0.55)",
											mb: 1,
										}}
									>
										{day.label}
									</Typography>
									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											gap: 1,
										}}
									>
										{day.list.map((slot) => {
											const isSel = selected.includes(slot.id)
											return (
												<Chip
													key={slot.id}
													onClick={() => toggle(slot.id)}
													icon={
														isSel ? (
															<CheckIcon sx={{ fontSize: 16 }} />
														) : undefined
													}
													label={dayjs(slot.startDateTime).format("hh:mm A")}
													sx={{
														fontFamily: MONO,
														fontSize: 12,
														borderRadius: "8px",
														cursor: "pointer",
														color: isSel ? "#fff" : "rgba(255,255,255,0.85)",
														bgcolor: isSel
															? TEAL_2
															: "rgba(255,255,255,0.1)",
														border: "1px solid",
														borderColor: isSel
															? TEAL_2
															: "rgba(255,255,255,0.18)",
														"& .MuiChip-icon": { color: "#fff" },
														"&:hover": {
															bgcolor: isSel
																? TEAL
																: "rgba(255,255,255,0.18)",
														},
													}}
												/>
											)
										})}
									</Box>
								</Box>
							))}

							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
									gap: 2,
									pt: 1,
								}}
							>
								{selected.length > 0 && (
									<Button
										onClick={() => setSelected([])}
										sx={{
											color: "rgba(255,255,255,0.7)",
											textTransform: "none",
										}}
									>
										Clear
									</Button>
								)}
								<Button
									onClick={handleClaim}
									disabled={selected.length === 0 || claiming}
									variant="contained"
									sx={{
										bgcolor: TEAL_2,
										color: "#fff",
										textTransform: "none",
										fontWeight: 600,
										borderRadius: "10px",
										px: 3,
										"&:hover": { bgcolor: TEAL },
										"&.Mui-disabled": {
											bgcolor: "rgba(255,255,255,0.15)",
											color: "rgba(255,255,255,0.4)",
										},
									}}
								>
									{claiming
										? "Claiming…"
										: `Claim ${selected.length} slot${
												selected.length === 1 ? "" : "s"
										  }`}
								</Button>
							</Box>
						</Stack>
					)}
				</Box>
			</Collapse>
		</Box>
	)
}

export default ClaimAvailabilityCard
