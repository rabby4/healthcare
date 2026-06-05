"use client"

import { Box, Button, Chip, Stack, Typography } from "@mui/material"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"

type ReviewAction = {
	label: string
	kind: "ghost" | "danger" | "light"
}

type Review = {
	initials: string
	variant: AvatarVariant
	name: string
	meta: string
	flagged?: boolean
	rating: number
	ratingLabel: string
	body: string
	actions: ReviewAction[]
	verified?: boolean
	borderColor?: string
}

const reviews: Review[] = [
	{
		initials: "RH",
		variant: "green",
		name: "Rashed H.",
		meta: "on Dr. Faisal Ahmed · 28 May",
		flagged: true,
		rating: 1,
		ratingLabel: "1.0",
		body: "Reported by 2 users — contains content that may violate community guidelines. Review and decide.",
		actions: [
			{ label: "Keep", kind: "ghost" },
			{ label: "Remove review", kind: "danger" },
			{ label: "View thread", kind: "light" },
		],
		borderColor: "#F8C9BC",
	},
	{
		initials: "FR",
		variant: "teal",
		name: "Farzana R.",
		meta: "on Dr. Asma Rahman · 22 May",
		rating: 5,
		ratingLabel: "5.0",
		body: "“Patient, careful, and explained every term. Walked me through the meds clearly. Will book again.”",
		actions: [{ label: "Hide", kind: "ghost" }],
		verified: true,
	},
	{
		initials: "SI",
		variant: "purple",
		name: "Shahriar I.",
		meta: "on Dr. Asma Rahman · 18 May",
		rating: 4,
		ratingLabel: "4.0",
		body: "“Connection dropped once, but the doctor called back immediately. Diagnosis felt thorough.”",
		actions: [{ label: "Hide", kind: "ghost" }],
		verified: true,
	},
	{
		initials: "NA",
		variant: "orange",
		name: "Nadia A.",
		meta: "on Dr. Sadia Khan · 14 May",
		rating: 5,
		ratingLabel: "5.0",
		body: "“Felt seen and heard. Followed up next day to check on me — really kind. Highly recommend.”",
		actions: [{ label: "Hide", kind: "ghost" }],
		verified: true,
	},
]

const filterPills: { label: string; count: string; active?: boolean }[] = [
	{ label: "All", count: "12,840", active: true },
	{ label: "Flagged", count: "5" },
	{ label: "5 ★", count: "9,210" },
	{ label: "1–2 ★", count: "328" },
]

const StarRating = ({
	rating,
	ratingLabel,
}: {
	rating: number
	ratingLabel: string
}) => (
	<Stack
		direction="row"
		sx={{
			alignItems: "center",
			gap: 0.375,
			fontSize: 13,
			fontFamily: MONO,
			fontVariantNumeric: "tabular-nums",
			color: "text.primary",
		}}
	>
		{Array.from({ length: 5 }).map((_, i) => (
			<StarRoundedIcon
				key={i}
				sx={{
					fontSize: 16,
					color: i < rating ? SHELL.star : "divider",
				}}
			/>
		))}
		<Box component="span" sx={{ ml: 0.5 }}>
			{ratingLabel}
		</Box>
	</Stack>
)

const actionButtonSx = (kind: "ghost" | "danger" | "light") => {
	if (kind === "danger") {
		return {
			fontSize: 12,
			fontWeight: 600,
			textTransform: "none" as const,
			px: 1.5,
			py: 0.75,
			borderRadius: "8px",
			bgcolor: SHELL.dangerBg,
			color: SHELL.urgent,
			border: "1px solid transparent",
			boxShadow: "none",
			"&:hover": {
				bgcolor: SHELL.dangerBg,
				borderColor: SHELL.urgent,
				boxShadow: "none",
			},
		}
	}
	if (kind === "light") {
		return {
			fontSize: 12,
			fontWeight: 600,
			textTransform: "none" as const,
			px: 1.5,
			py: 0.75,
			borderRadius: "8px",
			bgcolor: SHELL.bgSoft,
			color: "text.primary",
			border: "1px solid transparent",
			boxShadow: "none",
			"&:hover": {
				bgcolor: SHELL.bgSoft2,
				borderColor: "divider",
				boxShadow: "none",
			},
		}
	}
	// ghost
	return {
		fontSize: 12,
		fontWeight: 600,
		textTransform: "none" as const,
		px: 1.5,
		py: 0.75,
		borderRadius: "8px",
		bgcolor: "transparent",
		color: "text.primary",
		border: "1px solid",
		borderColor: "divider",
		boxShadow: "none",
		"&:hover": {
			bgcolor: SHELL.bgSoft,
			borderColor: "text.primary",
			boxShadow: "none",
		},
	}
}

const ReviewsPage = () => {
	return (
		<>
			<PageHead
				title="Reviews"
				subtitle="12,840 reviews · avg 4.8 ★ · 5 flagged for moderation."
				actions={
					<Stack
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
						<Box component="span">Sort: Newest</Box>
						<KeyboardArrowDownRoundedIcon
							sx={{ fontSize: 14, color: "text.secondary" }}
						/>
					</Stack>
				}
			/>

			{/* Info banner — review moderation not yet supported */}
			<Stack
				direction="row"
				sx={{
					mb: 2.5,
					gap: 1.5,
					p: 2,
					borderRadius: "16px",
					bgcolor: "#E6F0FA",
					border: "1px solid #C4D8EC",
					color: "#1E4D7F",
				}}
			>
				<Box
					sx={{
						width: 32,
						height: 32,
						borderRadius: "10px",
						bgcolor: "rgba(42, 111, 181, 0.15)",
						color: SHELL.info,
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
					}}
				>
					<InfoOutlinedIcon sx={{ fontSize: 16 }} />
				</Box>
				<Box>
					<Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1E4D7F" }}>
						Review moderation isn&apos;t available yet
					</Typography>
					<Typography sx={{ fontSize: 12, mt: 0.5, color: "#1E4D7F" }}>
						The backend currently supports review creation only (patients can
						post reviews after a visit). Listing and moderating reviews requires
						new API endpoints (GET /review and DELETE/PATCH). The cards below are
						an illustrative preview.
					</Typography>
				</Box>
			</Stack>

			{/* Filter pills */}
			<Stack
				direction="row"
				sx={{
					gap: 1,
					flexWrap: "wrap",
					mb: 2.5,
				}}
			>
				{filterPills.map((p) => (
					<Stack
						key={p.label}
						direction="row"
						sx={{
							alignItems: "center",
							gap: 0.75,
							px: 1.5,
							py: 0.75,
							borderRadius: 999,
							fontSize: 12,
							fontWeight: 600,
							cursor: "pointer",
							border: "1px solid",
							borderColor: p.active ? "text.primary" : "divider",
							bgcolor: p.active ? "text.primary" : "#fff",
							color: p.active ? "#fff" : "text.primary",
							"&:hover": {
								borderColor: "text.primary",
							},
						}}
					>
						<Box component="span">{p.label}</Box>
						<Box
							component="span"
							sx={{
								fontFamily: MONO,
								fontVariantNumeric: "tabular-nums",
								fontSize: 11,
								color: p.active ? "rgba(255,255,255,0.75)" : "text.secondary",
							}}
						>
							{p.count}
						</Box>
					</Stack>
				))}
			</Stack>

			{/* Section label + preview chip */}
			<Stack
				direction="row"
				sx={{ alignItems: "center", gap: 1, mb: 1.5 }}
			>
				<Typography
					sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary" }}
				>
					Illustrative preview — not live data
				</Typography>
				<Chip
					label="Preview"
					size="small"
					sx={{
						height: 22,
						fontSize: 11,
						fontWeight: 600,
						bgcolor: "#E6F0FA",
						color: "#1E4D7F",
						border: "1px solid #C4D8EC",
						"& .MuiChip-label": { px: 1 },
					}}
				/>
			</Stack>

			{/* Reviews grid */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
					gap: 2.5,
				}}
			>
				{reviews.map((r, idx) => (
					<Stack
						key={idx}
						sx={{
							gap: "14px",
							bgcolor: "#fff",
							border: "1px solid",
							borderColor: r.borderColor ?? "divider",
							borderRadius: "22px",
							p: "22px",
						}}
					>
						{/* Top row */}
						<Stack
							direction="row"
							sx={{
								alignItems: "center",
								justifyContent: "space-between",
								gap: 1.5,
							}}
						>
							<Stack
								direction="row"
								sx={{ alignItems: "center", gap: "10px", minWidth: 0 }}
							>
								<AvatarGradient
									initials={r.initials}
									variant={r.variant}
									size={36}
								/>
								<Box sx={{ minWidth: 0 }}>
									<Typography
										sx={{
											fontSize: 14,
											fontWeight: 600,
											color: "text.primary",
											lineHeight: 1.3,
										}}
									>
										{r.name}
									</Typography>
									<Typography
										sx={{
											fontSize: 12,
											color: "text.secondary",
											mt: "2px",
										}}
									>
										{r.meta}
									</Typography>
								</Box>
							</Stack>
							{r.flagged ? (
								<StatusBadge kind="cancelled" label="Flagged" />
							) : (
								<StarRating rating={r.rating} ratingLabel={r.ratingLabel} />
							)}
						</Stack>

						{/* Star rating row for flagged card */}
						{r.flagged && (
							<StarRating rating={r.rating} ratingLabel={r.ratingLabel} />
						)}

						{/* Quote */}
						<Typography
							sx={{
								fontSize: 14,
								color: "text.primary",
								lineHeight: 1.5,
							}}
						>
							{r.body}
						</Typography>

						{/* Bottom row */}
						<Stack
							direction="row"
							sx={{
								alignItems: "center",
								gap: 1,
								pt: 0.5,
								flexWrap: "wrap",
							}}
						>
							{r.actions.map((a, i) => {
								const isLight = a.kind === "light"
								return (
									<Button
										key={a.label}
										variant={a.kind === "danger" ? "contained" : "outlined"}
										disabled
										sx={{
											...actionButtonSx(a.kind),
											...(isLight ? { ml: "auto" } : {}),
											"&.Mui-disabled": {
												opacity: 0.5,
												cursor: "not-allowed",
												pointerEvents: "auto",
											},
										}}
									>
										{a.label}
									</Button>
								)
							})}
							{r.verified && (
								<Box sx={{ ml: "auto" }}>
									<StatusBadge kind="neutral" label="Verified visit" withDot={false} />
								</Box>
							)}
						</Stack>
					</Stack>
				))}
			</Box>

			{/* Load more */}
			<Stack
				direction="row"
				sx={{ justifyContent: "center", mt: 3.5 }}
			>
				<Button
					variant="outlined"
					disabled
					sx={{
						bgcolor: "#fff",
						color: "text.primary",
						borderColor: "divider",
						textTransform: "none",
						fontWeight: 600,
						fontSize: 13,
						px: 2.25,
						py: 1,
						borderRadius: "10px",
						"&:hover": {
							borderColor: "text.primary",
							bgcolor: SHELL.bgSoft,
						},
						"&.Mui-disabled": { opacity: 0.5 },
					}}
				>
					Load more reviews
				</Button>
			</Stack>
		</>
	)
}

export default ReviewsPage
