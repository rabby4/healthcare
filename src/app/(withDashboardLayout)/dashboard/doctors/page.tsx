"use client"

import { Box, Button, Stack, Typography } from "@mui/material"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import { useState } from "react"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge, { StatusKind } from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"
import DoctorFormModal from "./DoctorFormModal"

type DoctorAction = {
	label: string
	primary?: boolean
	danger?: boolean
}

type Doctor = {
	initials: string
	variant: AvatarVariant
	name: string
	email: string
	regNo: string
	specialty: string
	experience: string
	fee: string
	rating: string
	status: StatusKind
	statusLabel: string
	actions: DoctorAction[]
}

const doctors: Doctor[] = [
	{
		initials: "AR",
		variant: "teal",
		name: "Dr. Asma Rahman",
		email: "dr.asma@medicare.app",
		regNo: "A-49271",
		specialty: "Cardiology",
		experience: "14y",
		fee: "৳ 1,500",
		rating: "4.9 ★",
		status: "active",
		statusLabel: "Active",
		actions: [
			{ label: "Edit", primary: true },
			{ label: "Suspend" },
		],
	},
	{
		initials: "TH",
		variant: "blue",
		name: "Dr. Tanvir Hossain",
		email: "t.hossain@medicare.app",
		regNo: "A-50118",
		specialty: "Cardiology",
		experience: "11y",
		fee: "৳ 1,200",
		rating: "4.8 ★",
		status: "active",
		statusLabel: "Active",
		actions: [
			{ label: "Edit", primary: true },
			{ label: "Suspend" },
		],
	},
	{
		initials: "MI",
		variant: "purple",
		name: "Dr. Mehnaz Iqbal",
		email: "m.iqbal@medicare.app",
		regNo: "A-51902",
		specialty: "Neurology",
		experience: "9y",
		fee: "৳ 1,400",
		rating: "4.9 ★",
		status: "active",
		statusLabel: "Active",
		actions: [
			{ label: "Edit", primary: true },
			{ label: "Suspend" },
		],
	},
	{
		initials: "SK",
		variant: "orange",
		name: "Dr. Sadia Khan",
		email: "s.khan@medicare.app",
		regNo: "A-48771",
		specialty: "Pediatrics",
		experience: "12y",
		fee: "৳ 900",
		rating: "4.9 ★",
		status: "active",
		statusLabel: "Active",
		actions: [
			{ label: "Edit", primary: true },
			{ label: "Suspend" },
		],
	},
	{
		initials: "FA",
		variant: "green",
		name: "Dr. Faisal Ahmed",
		email: "f.ahmed@medicare.app",
		regNo: "pending",
		specialty: "Orthopedics",
		experience: "7y",
		fee: "৳ 1,000",
		rating: "—",
		status: "inprogress",
		statusLabel: "Pending",
		actions: [
			{ label: "Verify", primary: true },
			{ label: "Reject" },
		],
	},
	{
		initials: "RN",
		variant: "orange",
		name: "Dr. Rumana Nasir",
		email: "r.nasir@medicare.app",
		regNo: "A-47210",
		specialty: "Dermatology",
		experience: "10y",
		fee: "৳ 1,100",
		rating: "4.6 ★",
		status: "cancelled",
		statusLabel: "Suspended",
		actions: [
			{ label: "Reactivate", primary: true },
			{ label: "Delete", danger: true },
		],
	},
]

const headers: { label: string; align?: "left" | "right"; width?: string }[] = [
	{ label: "Doctor", width: "26%" },
	{ label: "Specialty" },
	{ label: "Exp.", align: "right" },
	{ label: "Fee", align: "right" },
	{ label: "Rating", align: "right" },
	{ label: "Status" },
	{ label: "Actions", align: "right" },
]

const selectFilters = ["Specialty: All", "Status: All", "Sort: Rating"]

const pageButtons: { label: string; active?: boolean; disabled?: boolean }[] = [
	{ label: "‹", disabled: true },
	{ label: "1", active: true },
	{ label: "2" },
	{ label: "3" },
	{ label: "…" },
	{ label: "40" },
	{ label: "›" },
]

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
	onClick,
}: {
	children: React.ReactNode
	primary?: boolean
	danger?: boolean
	onClick?: () => void
}) => (
	<Box
		component="button"
		onClick={onClick}
		sx={{
			fontSize: 12,
			fontWeight: 600,
			px: 1,
			py: 0.5,
			borderRadius: "6px",
			border: "none",
			bgcolor: "transparent",
			cursor: "pointer",
			color: danger ? SHELL.urgent : primary ? "primary.main" : "text.secondary",
			"&:hover": {
				bgcolor: SHELL.bgSoft,
				color: danger ? SHELL.urgent : "text.primary",
			},
		}}
	>
		{children}
	</Box>
)

const DoctorsPage = () => {
	const [modalOpen, setModalOpen] = useState(false)

	const openModal = () => setModalOpen(true)
	const closeModal = () => setModalOpen(false)

	return (
		<>
			<PageHead
				title="Doctors"
				subtitle="240 doctors · 232 active · 5 pending verification · 3 suspended"
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
						<Button onClick={openModal}>+ Add doctor</Button>
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
							{doctors.map((d, i) => {
								const isLast = i === doctors.length - 1
								return (
									<Box
										key={d.email}
										component="tr"
										sx={{ "&:hover td": { bgcolor: SHELL.bgSoft } }}
									>
										<Box component="td" sx={cellSx(isLast)}>
											<Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
												<AvatarGradient
													initials={d.initials}
													variant={d.variant}
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
														{d.email} · {d.regNo}
													</Typography>
												</Box>
											</Stack>
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											{d.specialty}
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
											{d.experience}
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
											{d.fee}
										</Box>
										<Box
											component="td"
											sx={{
												...cellSx(isLast),
												textAlign: "right",
												fontFamily: MONO,
												fontVariantNumeric: "tabular-nums",
												color: d.rating === "—" ? "text.secondary" : "text.primary",
											}}
										>
											{d.rating}
										</Box>
										<Box component="td" sx={cellSx(isLast)}>
											<StatusBadge kind={d.status} label={d.statusLabel} />
										</Box>
										<Box
											component="td"
											sx={{ ...cellSx(isLast), textAlign: "right" }}
										>
											<Stack
												direction="row"
												sx={{ gap: 0.75, justifyContent: "flex-end" }}
											>
												{d.actions.map((a) => (
													<ActionLink
														key={a.label}
														primary={a.primary}
														danger={a.danger}
														onClick={a.primary ? openModal : undefined}
													>
														{a.label}
													</ActionLink>
												))}
											</Stack>
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
					<Box>Showing 1 — 6 of 240 doctors</Box>
					<Stack direction="row" sx={{ gap: 0.5 }}>
						{pageButtons.map((p, i) => (
							<Box
								key={i}
								component="button"
								disabled={p.disabled}
								sx={{
									width: 30,
									height: 30,
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

			<DoctorFormModal open={modalOpen} onClose={closeModal} />
		</>
	)
}

export default DoctorsPage
