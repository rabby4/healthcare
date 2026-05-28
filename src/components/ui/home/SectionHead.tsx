import { Box, Link, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"

export const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace"

export const Eyebrow = ({
	children,
	light,
}: {
	children: ReactNode
	light?: boolean
}) => (
	<Stack direction="row" sx={{ alignItems: "center", gap: 1.25, mb: 1.5 }}>
		<Box
			sx={{
				width: 24,
				height: "1px",
				bgcolor: light ? "rgba(255,255,255,0.6)" : "primary.main",
			}}
		/>
		<Typography
			sx={{
				fontFamily: MONO,
				fontSize: 12,
				letterSpacing: "0.14em",
				textTransform: "uppercase",
				fontWeight: 500,
				color: light ? "rgba(255,255,255,0.6)" : "primary.main",
			}}
		>
			{children}
		</Typography>
	</Stack>
)

export const LinkArrow = ({
	children,
	href = "#",
}: {
	children: ReactNode
	href?: string
}) => (
	<Link
		href={href}
		underline="none"
		sx={{
			display: "inline-flex",
			alignItems: "center",
			gap: 0.75,
			fontFamily: MONO,
			fontSize: 13,
			fontWeight: 600,
			letterSpacing: "0.06em",
			textTransform: "uppercase",
			color: "primary.main",
			whiteSpace: "nowrap",
			"&:hover": { color: "primary.dark" },
		}}
	>
		{children}
	</Link>
)

export const SectionHead = ({
	eyebrow,
	title,
	sub,
	center,
	action,
	light,
}: {
	eyebrow?: ReactNode
	title: ReactNode
	sub?: ReactNode
	center?: boolean
	action?: ReactNode
	light?: boolean
}) => {
	const head = (
		<Stack
			sx={{
				alignItems: center ? "center" : "flex-start",
				textAlign: center ? "center" : "left",
				maxWidth: 760,
				...(center && { mx: "auto" }),
			}}
		>
			{eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
			<Typography variant="h2" sx={{ color: light ? "#fff" : "text.primary" }}>
				{title}
			</Typography>
			{sub && (
				<Typography
					sx={{
						mt: 2,
						fontSize: { xs: 15, md: 17 },
						lineHeight: 1.6,
						maxWidth: 620,
						color: light ? "rgba(255,255,255,0.7)" : "text.secondary",
					}}
				>
					{sub}
				</Typography>
			)}
		</Stack>
	)

	if (action) {
		return (
			<Stack
				direction={{ xs: "column", md: "row" }}
				sx={{
					justifyContent: "space-between",
					alignItems: { md: "flex-end" },
					gap: 2,
					mb: 5,
				}}
			>
				{head}
				{action}
			</Stack>
		)
	}

	return <Box sx={{ mb: { xs: 5, md: 7 } }}>{head}</Box>
}
