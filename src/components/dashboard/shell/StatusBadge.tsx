import { Box } from "@mui/material"
import { SHELL } from "./tokens"

export type StatusKind =
	| "active"
	| "completed"
	| "paid"
	| "invited"
	| "inprogress"
	| "scheduled"
	| "cancelled"
	| "revoked"
	| "unpaid"
	| "neutral"
	| "teal"
	| "purple"

const map: Record<StatusKind, { bg: string; color: string; defaultLabel: string }> = {
	active: { bg: SHELL.successBg, color: SHELL.success, defaultLabel: "Active" },
	completed: { bg: SHELL.successBg, color: SHELL.success, defaultLabel: "Completed" },
	paid: { bg: SHELL.successBg, color: SHELL.success, defaultLabel: "Paid" },
	invited: { bg: SHELL.warningBg, color: SHELL.warning, defaultLabel: "Invited" },
	inprogress: { bg: SHELL.warningBg, color: SHELL.warning, defaultLabel: "In progress" },
	scheduled: { bg: SHELL.infoBg, color: SHELL.info, defaultLabel: "Scheduled" },
	cancelled: { bg: SHELL.dangerBg, color: SHELL.urgent, defaultLabel: "Cancelled" },
	revoked: { bg: SHELL.dangerBg, color: SHELL.urgent, defaultLabel: "Revoked" },
	unpaid: { bg: SHELL.dangerBg, color: SHELL.urgent, defaultLabel: "Unpaid" },
	neutral: { bg: SHELL.bgSoft, color: "#465065", defaultLabel: "—" },
	teal: { bg: "#E6F2F1", color: "#0E7C7B", defaultLabel: "Admin" },
	purple: { bg: SHELL.purpleTint, color: SHELL.purple, defaultLabel: "Super Admin" },
}

type Props = {
	kind: StatusKind
	label?: string
	withDot?: boolean
}

const StatusBadge = ({ kind, label, withDot = true }: Props) => {
	const { bg, color, defaultLabel } = map[kind]
	const showDotKinds: StatusKind[] = [
		"active",
		"completed",
		"paid",
		"invited",
		"inprogress",
		"scheduled",
		"cancelled",
		"revoked",
		"unpaid",
	]
	const showDot = withDot && showDotKinds.includes(kind)
	return (
		<Box
			component="span"
			sx={{
				display: "inline-flex",
				alignItems: "center",
				gap: 0.75,
				px: 1.25,
				py: 0.5,
				borderRadius: 999,
				fontSize: 11,
				fontWeight: 600,
				letterSpacing: "0.04em",
				textTransform: "uppercase",
				bgcolor: bg,
				color,
			}}
		>
			{showDot && (
				<Box
					component="span"
					sx={{
						width: 6,
						height: 6,
						borderRadius: "50%",
						bgcolor: "currentColor",
					}}
				/>
			)}
			{label ?? defaultLabel}
		</Box>
	)
}

export default StatusBadge
