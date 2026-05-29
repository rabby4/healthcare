import { Box } from "@mui/material"
import { ReactNode } from "react"

import Sidebar, { NavGroup } from "./Sidebar"
import Topbar from "./Topbar"
import { AvatarVariant, SHELL } from "./tokens"

type Props = {
	groups: NavGroup[]
	roleLabel: string
	roleVariant: AvatarVariant
	userName: string
	userInitials: string
	children: ReactNode
}

const DashboardShell = ({
	groups,
	roleLabel,
	roleVariant,
	userName,
	userInitials,
	children,
}: Props) => (
	<Box
		sx={{
			display: "grid",
			gridTemplateColumns: { xs: "1fr", md: "252px 1fr" },
			minHeight: "100vh",
			bgcolor: SHELL.bgSoft,
		}}
	>
		<Sidebar
			groups={groups}
			roleLabel={roleLabel}
			roleVariant={roleVariant}
			userName={userName}
			userInitials={userInitials}
		/>
		<Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
			<Topbar
				roleVariant={roleVariant}
				userName={userName}
				userInitials={userInitials}
			/>
			<Box
				component="main"
				sx={{
					p: { xs: 2.5, md: 4 },
					width: "100%",
					flex: 1,
				}}
			>
				{children}
			</Box>
		</Box>
	</Box>
)

export default DashboardShell
