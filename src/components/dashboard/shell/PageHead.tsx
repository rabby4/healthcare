import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"

type Props = {
	title: string
	subtitle?: string
	actions?: ReactNode
}

const PageHead = ({ title, subtitle, actions }: Props) => (
	<Stack
		direction={{ xs: "column", md: "row" }}
		sx={{
			alignItems: { xs: "flex-start", md: "flex-end" },
			justifyContent: "space-between",
			gap: { xs: 2, md: 3 },
			mb: 3.5,
		}}
	>
		<Box>
			<Typography
				component="h1"
				sx={{
					fontSize: 28,
					fontWeight: 600,
					letterSpacing: "-0.02em",
					color: "text.primary",
					lineHeight: 1.2,
				}}
			>
				{title}
			</Typography>
			{subtitle && (
				<Typography
					sx={{
						mt: 0.75,
						fontSize: 14,
						color: "text.secondary",
					}}
				>
					{subtitle}
				</Typography>
			)}
		</Box>
		{actions && (
			<Stack direction="row" sx={{ gap: 1.25, alignItems: "center", flexWrap: "wrap" }}>
				{actions}
			</Stack>
		)}
	</Stack>
)

export default PageHead
