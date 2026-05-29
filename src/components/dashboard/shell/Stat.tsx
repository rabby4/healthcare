import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { SHELL } from "./tokens"

type Props = {
	label: string
	value: ReactNode
	icon?: ReactNode
	iconBg?: string
	iconColor?: string
	delta?: string
	deltaTrend?: "up" | "down" | "neutral"
	deltaLabel?: string
}

const Stat = ({
	label,
	value,
	icon,
	iconBg = "#E6F2F1",
	iconColor = "#0E7C7B",
	delta,
	deltaTrend = "up",
	deltaLabel,
}: Props) => (
	<Box
		sx={{
			bgcolor: "#fff",
			border: "1px solid",
			borderColor: "divider",
			borderRadius: "22px",
			p: "22px 22px 24px",
		}}
	>
		<Stack
			direction="row"
			sx={{
				alignItems: "center",
				gap: 1,
				fontSize: 12,
				color: "text.secondary",
				fontWeight: 500,
				letterSpacing: "0.04em",
				textTransform: "uppercase",
			}}
		>
			{icon && (
				<Box
					sx={{
						width: 26,
						height: 26,
						borderRadius: "8px",
						bgcolor: iconBg,
						color: iconColor,
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{icon}
				</Box>
			)}
			<Box component="span">{label}</Box>
		</Stack>
		<Typography
			sx={{
				fontSize: 38,
				fontWeight: 300,
				letterSpacing: "-0.03em",
				mt: 1.75,
				lineHeight: 1,
				fontVariantNumeric: "tabular-nums",
				color: "text.primary",
			}}
		>
			{value}
		</Typography>
		{(delta || deltaLabel) && (
			<Stack
				direction="row"
				sx={{
					mt: 1.25,
					alignItems: "center",
					gap: 0.5,
					fontSize: 12,
					fontWeight: 600,
					color: deltaTrend === "down" ? SHELL.urgent : deltaTrend === "up" ? SHELL.success : "text.secondary",
				}}
			>
				{delta && <Box component="span">{delta}</Box>}
				{deltaLabel && (
					<Box
						component="span"
						sx={{ color: "text.secondary", fontWeight: 500, ml: 0.5 }}
					>
						{deltaLabel}
					</Box>
				)}
			</Stack>
		)}
	</Box>
)

export default Stat
