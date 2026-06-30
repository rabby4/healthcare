/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Box, Button, Stack, Typography } from "@mui/material"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"
import {
	useDeleteDoctorMutation,
	useGetAllDoctorsQuery,
} from "@/redux/api/doctorApi"
import { IDoctor } from "@/types"
import DoctorFormModal from "./DoctorFormModal"

const headers: { label: string; align?: "left" | "right"; width?: string }[] = [
	{ label: "Doctor", width: "26%" },
	{ label: "Specialty" },
	{ label: "Exp.", align: "right" },
	{ label: "Fee", align: "right" },
	{ label: "Rating", align: "right" },
	{ label: "Status" },
	{ label: "Actions", align: "right" },
]

const selectFilters = ["Specialty: All", "Sort: Rating"]

const avatarVariants: AvatarVariant[] = ["teal", "blue", "purple", "orange", "green"]

const variantFor = (key: string) => {
	let hash = 0
	for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0
	return avatarVariants[Math.abs(hash) % avatarVariants.length]
}

const initialsFor = (name: string) =>
	name
		.replace(/^Dr\.?\s*/i, "")
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? "")
		.join("") || "DR"

const cellSx = (last: boolean) => ({
	p: "16px 20px",
	fontSize: 14,
	color: "text.primary",
	borderBottom: last ? "none" : `1px solid ${SHELL.dividerSoft}`,
	verticalAlign: "middle" as const,
})

const ActionLink = ({
	children,
	primary,
	danger,
	disabled,
	onClick,
}: {
	children: React.ReactNode
	primary?: boolean
	danger?: boolean
	disabled?: boolean
	onClick?: () => void
}) => (
	<Box
		component="button"
		onClick={onClick}
		disabled={disabled}
		sx={{
			fontSize: 12,
			fontWeight: 600,
			px: 1,
			py: 0.5,
			borderRadius: "6px",
			border: "none",
			bgcolor: "transparent",
			cursor: disabled ? "not-allowed" : "pointer",
			opacity: disabled ? 0.5 : 1,
			color: danger ? SHELL.urgent : primary ? "primary.main" : "text.secondary",
			"&:hover": {
				bgcolor: disabled ? "transparent" : SHELL.bgSoft,
				color: danger ? SHELL.urgent : "text.primary",
			},
		}}
	>
		{children}
	</Box>
)

const MessageRow = ({ children }: { children: React.ReactNode }) => (
	<Box component="tr">
		<Box
			component="td"
			colSpan={headers.length}
			sx={{
				p: "32px 20px",
				textAlign: "center",
				fontSize: 13,
				color: "text.secondary",
			}}
		>
			{children}
		</Box>
	</Box>
)

const SkeletonRow = ({ last }: { last: boolean }) => (
	<Box component="tr">
		{headers.map((h, i) => (
			<Box key={i} component="td" sx={cellSx(last)}>
				<Box
					sx={{
						height: 12,
						borderRadius: 999,
						bgcolor: SHELL.bgSoft,
						width: i === 0 ? "70%" : "50%",
						ml: h.align === "right" ? "auto" : 0,
					}}
				/>
			</Box>
		))}
	</Box>
)

const DoctorsPage = () => {
	const [modalOpen, setModalOpen] = useState(false)
	const [editing, setEditing] = useState<IDoctor | null>(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [page, setPage] = useState(1)
	const limit = 6

	const query = useMemo(() => {
		const q: Record<string, any> = { page, limit }
		if (searchTerm) q.searchTerm = searchTerm
		return q
	}, [page, searchTerm])

	const { data, isLoading, isError } = useGetAllDoctorsQuery(query)
	const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation()

	const doctors: IDoctor[] = data?.doctors ?? []
	const meta = data?.meta

	const openCreate = () => {
		setEditing(null)
		setModalOpen(true)
	}
	const openEdit = (doctor: IDoctor) => {
		setEditing(doctor)
		setModalOpen(true)
	}
	const closeModal = () => {
		setModalOpen(false)
		setEditing(null)
	}

	const handleDelete = async (doctor: IDoctor) => {
		if (!window.confirm("Are you sure?")) return
		try {
			await deleteDoctor(doctor.id).unwrap()
			toast.success("Doctor removed")
		} catch (err: any) {
			toast.error(err?.data?.message || err?.message || "Something went wrong")
		}
	}

	const total = meta?.total ?? doctors.length
	const currentPage = meta?.page ?? page
	const pageLimit = meta?.limit ?? limit
	const from = total === 0 ? 0 : (currentPage - 1) * pageLimit + 1
	const to = Math.min(currentPage * pageLimit, total)
	const pageCount = Math.max(1, Math.ceil(total / pageLimit))

	return (
		<>
			<PageHead
				title="Doctors"
				subtitle={`${total} doctor${total === 1 ? "" : "s"} · all active`}
				actions={
					<>
						<Button
							variant="outlined"
							startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
							sx={{
								bgcolor: "#fff",
								color: "text.primary",
								borderColor: "divider",
								"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
							}}
						>
							Export
						</Button>
						<Button onClick={openCreate}>+ Add doctor</Button>
					</>
				}
			/>

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
					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							gap: 1,
							px: 1.75,
							py: 1,
							bgcolor: SHELL.bgSoft,
							borderRadius: "10px",
							border: "1px solid transparent",
							fontSize: 13,
							color: "text.secondary",
							flex: 1,
							minWidth: 260,
						}}
					>
						<SearchRoundedIcon sx={{ fontSize: 16 }} />
						<Box
							component="input"
							value={searchTerm}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setSearchTerm(e.target.value)
								setPage(1)
							}}
							placeholder="Search by name, email, or registration no…"
							sx={{
								flex: 1,
								bgcolor: "transparent",
								border: "none",
								outline: "none",
								fontSize: 13,
								color: "text.primary",
								"&::placeholder": { color: "text.secondary" },
							}}
						/>
					</Stack>
					{selectFilters.map((label) => (
						<Stack
							key={label}
							direction="row"
							sx={{
								alignItems: "center",
								gap: 1,
								px: 1.75,
								py: 1,
								bgcolor: "#fff",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: "10px",
								fontSize: 13,
								color: "text.primary",
								cursor: "pointer",
								"&:hover": { borderColor: "text.primary" },
							}}
						>
							<Box component="span">{label}</Box>
							<KeyboardArrowDownRoundedIcon
								sx={{ fontSize: 14, color: "text.secondary" }}
							/>
						</Stack>
					))}
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
											textAlign: h.align ?? "left",
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
							{isLoading ? (
								[0, 1, 2, 3].map((i) => (
									<SkeletonRow key={i} last={i === 3} />
								))
							) : isError ? (
								<MessageRow>
									<Typography sx={{ color: SHELL.urgent, fontSize: 13 }}>
										Failed to load doctors. Please try again.
									</Typography>
								</MessageRow>
							) : doctors.length === 0 ? (
								<MessageRow>No doctors found.</MessageRow>
							) : (
								doctors.map((d, i) => {
									const isLast = i === doctors.length - 1
									const specialty =
										d.doctorSpecialties
											?.map((ds) => ds.specialties?.title)
											.filter(Boolean)
											.join(", ") || "—"
									const rating = d.averageRating
										? `${d.averageRating.toFixed(1)} ★`
										: "—"
									return (
										<Box
											key={d.id}
											component="tr"
											sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
										>
											<Box component="td" sx={cellSx(isLast)}>
												<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
													<AvatarGradient
														initials={initialsFor(d.name)}
														variant={variantFor(d.id || d.email)}
														size={36}
													/>
													<Box>
														<Typography
															sx={{
																fontSize: 14,
																fontWeight: 600,
																color: "text.primary",
															}}
														>
															{d.name}
														</Typography>
														<Typography
															sx={{
																fontSize: 12,
																color: "text.secondary",
																mt: "1px",
															}}
														>
															{d.email} · {d.registrationNumber}
														</Typography>
													</Box>
												</Stack>
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												{specialty}
											</Box>
											<Box
												component="td"
												sx={{
													...cellSx(isLast),
													textAlign: "right",
													fontFamily: MONO,
													fontVariantNumeric: "tabular-nums",
												}}
											>
												{d.experience}y
											</Box>
											<Box
												component="td"
												sx={{
													...cellSx(isLast),
													textAlign: "right",
													fontFamily: MONO,
													fontVariantNumeric: "tabular-nums",
												}}
											>
												৳ {d.appointmentFee}
											</Box>
											<Box
												component="td"
												sx={{
													...cellSx(isLast),
													textAlign: "right",
													fontFamily: MONO,
													fontVariantNumeric: "tabular-nums",
													color: rating === "—" ? "text.secondary" : "text.primary",
												}}
											>
												{rating}
											</Box>
											<Box component="td" sx={cellSx(isLast)}>
												<StatusBadge kind="active" label="Active" />
											</Box>
											<Box
												component="td"
												sx={{ ...cellSx(isLast), textAlign: "right" }}
											>
												<Stack
													direction="row"
													sx={{ gap: 0.75, justifyContent: "flex-end" }}
												>
													<ActionLink primary onClick={() => openEdit(d)}>
														Edit
													</ActionLink>
													<ActionLink
														danger
														disabled={isDeleting}
														onClick={() => handleDelete(d)}
													>
														Delete
													</ActionLink>
												</Stack>
											</Box>
										</Box>
									)
								})
							)}
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
						Showing {from} to {to} of {total} doctor{total === 1 ? "" : "s"}
					</Box>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{[
							{ label: "‹", disabled: currentPage <= 1, go: currentPage - 1 },
							{
								label: String(currentPage),
								active: true,
								go: currentPage,
							},
							{
								label: "›",
								disabled: currentPage >= pageCount,
								go: currentPage + 1,
							},
						].map((p, i) => (
							<Box
								key={i}
								component="button"
								disabled={p.disabled}
								onClick={() => !p.disabled && !p.active && setPage(p.go)}
								sx={{
									minWidth: 30,
									height: 30,
									px: 1,
									borderRadius: "8px",
									border: "none",
									bgcolor: p.active ? "text.primary" : "transparent",
									color: p.active
										? "#fff"
										: p.disabled
											? "divider"
											: "text.secondary",
									fontSize: 12,
									fontFamily: MONO,
									cursor: p.disabled ? "not-allowed" : "pointer",
									fontVariantNumeric: "tabular-nums",
									"&:hover": {
										bgcolor: p.active
											? "text.primary"
											: p.disabled
												? "transparent"
												: SHELL.bgSoft,
										color: p.active
											? "#fff"
											: p.disabled
												? "divider"
												: "text.primary",
									},
								}}
							>
								{p.label}
							</Box>
						))}
					</Stack>
				</Stack>
			</Box>

			<DoctorFormModal
				open={modalOpen}
				onClose={closeModal}
				doctor={editing ?? undefined}
			/>
		</>
	)
}

export default DoctorsPage
