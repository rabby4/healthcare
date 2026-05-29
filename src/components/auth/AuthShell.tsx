import { Box, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { ReactNode } from "react"

const BrandMark = () => (
	<Box sx={{ position: "relative", width: 22, height: 22 }}>
		<Box
			sx={{
				position: "absolute",
				top: 0,
				left: "50%",
				transform: "translateX(-50%)",
				width: 6,
				height: 22,
				borderRadius: "3px",
				bgcolor: "primary.main",
			}}
		/>
		<Box
			sx={{
				position: "absolute",
				left: 0,
				top: "50%",
				transform: "translateY(-50%)",
				width: 22,
				height: 6,
				borderRadius: "3px",
				bgcolor: "primary.main",
			}}
		/>
	</Box>
)

type Props = {
	title: string
	subtitle?: string
	icon: ReactNode
	switchPrompt?: string
	switchHref?: string
	switchLabel?: string
	maxWidth?: number
	children: ReactNode
}

const AuthShell = ({
	title,
	subtitle,
	icon,
	switchPrompt,
	switchHref,
	switchLabel,
	maxWidth = 480,
	children,
}: Props) => {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				bgcolor: "secondary.light",
			}}
		>
			<Box
				component="header"
				sx={{
					height: 72,
					bgcolor: "#fff",
					borderBottom: "1px solid",
					borderColor: "divider",
					px: { xs: 3, md: 4 },
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Stack
					component={Link}
					href="/"
					direction="row"
					sx={{
						alignItems: "center",
						gap: 1.25,
						textDecoration: "none",
						color: "text.primary",
					}}
				>
					<BrandMark />
					<Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
						Medi
						<Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
							care
						</Box>
					</Typography>
				</Stack>
				{switchHref && switchLabel && (
					<Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
						{switchPrompt && (
							<Typography
								sx={{
									fontSize: 13,
									color: "text.secondary",
									display: { xs: "none", sm: "block" },
								}}
							>
								{switchPrompt}
							</Typography>
						)}
						<Typography
							component={Link}
							href={switchHref}
							sx={{
								fontSize: 13,
								fontWeight: 600,
								color: "primary.main",
								textDecoration: "none",
								"&:hover": { textDecoration: "underline" },
							}}
						>
							{switchLabel} →
						</Typography>
					</Stack>
				)}
			</Box>

			<Box
				component="main"
				sx={{
					flex: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					py: { xs: 5, md: 7 },
					px: 3,
				}}
			>
				<Box
					sx={{
						width: "100%",
						maxWidth,
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "22px",
						p: { xs: 4, md: 5 },
						boxShadow: "0 24px 48px -16px rgba(15, 30, 46, 0.08)",
					}}
				>
					<Box
						sx={{
							width: 48,
							height: 48,
							borderRadius: "14px",
							bgcolor: "primary.light",
							color: "primary.main",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							mb: 3,
						}}
					>
						{icon}
					</Box>
					<Typography
						component="h1"
						sx={{
							fontSize: { xs: 24, md: 28 },
							fontWeight: 600,
							letterSpacing: "-0.025em",
							color: "text.primary",
							lineHeight: 1.2,
						}}
					>
						{title}
					</Typography>
					{subtitle && (
						<Typography
							sx={{
								mt: 1,
								color: "text.secondary",
								fontSize: 14,
								lineHeight: 1.55,
							}}
						>
							{subtitle}
						</Typography>
					)}
					{children}
				</Box>
			</Box>
		</Box>
	)
}

export default AuthShell
