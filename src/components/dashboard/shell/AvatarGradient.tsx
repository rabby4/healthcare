import { Box } from "@mui/material"
import { AvatarVariant, GRAD } from "./tokens"

type Props = {
	initials: string
	variant?: AvatarVariant
	size?: number
}

const AvatarGradient = ({ initials, variant = "teal", size = 36 }: Props) => (
	<Box
		sx={{
			width: size,
			height: size,
			borderRadius: "50%",
			background: GRAD[variant],
			color: "#fff",
			fontWeight: 600,
			fontSize: size <= 28 ? 10 : size <= 36 ? 12 : 14,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: 0,
			lineHeight: 1,
		}}
	>
		{initials}
	</Box>
)

export default AvatarGradient
