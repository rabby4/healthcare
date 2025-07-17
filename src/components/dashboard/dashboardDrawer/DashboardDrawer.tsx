"use client"
import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Sidebar from "../sidebar/Sidebar"
import { useGetSingleUsrQuery } from "@/redux/api/userApi"
import { Avatar, Badge, Stack } from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import AccountMenu from "../accountMenu/AccountMenu"

const drawerWidth = 240

const DashboardDrawer = ({ children }: { children: React.ReactNode }) => {
	const [mobileOpen, setMobileOpen] = React.useState(false)
	const [isClosing, setIsClosing] = React.useState(false)
	const { data, isLoading } = useGetSingleUsrQuery({})
	console.log(data)

	const handleDrawerClose = () => {
		setIsClosing(true)
		setMobileOpen(false)
	}

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false)
	}

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen)
		}
	}

	if (isLoading) {
		return <p>loading...</p>
	}

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
					background: "#f4f7fe",
					boxShadow: 0,
					borderBottom: "1px solid lightgray",
				}}
			>
				<Toolbar
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" }, color: "primary.main" }}
					>
						<MenuIcon />
					</IconButton>
					<Box>
						<Typography variant="body2" noWrap component="div" color="gray">
							Hi, {data.name}.
						</Typography>
						<Typography
							variant="body2"
							noWrap
							component="div"
							color="primary.main"
						>
							Welcome to, HealthCare!!
						</Typography>
					</Box>
					<Stack direction={"row"} gap={3}>
						<Badge badgeContent={1} color="primary">
							<IconButton sx={{ background: "white" }}>
								<NotificationsIcon color="action" />
							</IconButton>
						</Badge>
						<Avatar
							src={
								data.profilePhoto
									? data.profilePhoto
									: "https://res.cloudinary.com/dtw7xqrds/image/upload/v1747856982/isv4lb548qkzuvhtkeb3.jpg"
							}
							alt={data.name}
						/>
						<AccountMenu />
					</Stack>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders"
			>
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					slotProps={{
						root: {
							keepMounted: true, // Better open performance on mobile.
						},
					}}
				>
					<Sidebar />
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					open
				>
					<Sidebar />
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
				}}
			>
				<Toolbar />
				<Box>{children}</Box>
			</Box>
		</Box>
	)
}

export default DashboardDrawer
