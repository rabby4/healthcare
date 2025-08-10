"use client"

import useUserInfo from "@/hooks/useUserInfo"
import { logoutUser } from "@/services/actions/logoutUser"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"

const Navbar = () => {
	const userInfo = useUserInfo()
	const router = useRouter()
	const handleLogOut = () => {
		logoutUser(router)
	}

	return (
		<Container>
			<Stack
				py={2}
				direction={"row"}
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				<Typography
					variant="h4"
					component={Link}
					fontWeight={700}
					textTransform={"uppercase"}
					href="/"
				>
					<Box component={"span"} color={"primary.main"}>
						H
					</Box>
					ealth Care
				</Typography>
				<Stack direction={"row"} spacing={3} justifyContent={"space-between"}>
					<Typography component={Link} href="/consultation">
						Consultation
					</Typography>
					<Typography>Health Plans</Typography>
					<Typography>Medicine</Typography>
					<Typography>Diagnostics</Typography>
					<Typography>NGOs</Typography>

					{userInfo.id && (
						<Typography component={Link} href={"/dashboard"}>
							Dashboard
						</Typography>
					)}
				</Stack>
				{userInfo?.id ? (
					<Button onClick={handleLogOut} color="error">
						Log Out
					</Button>
				) : (
					<Button component={Link} href="/login">
						Login
					</Button>
				)}
			</Stack>
		</Container>
	)
}

export default Navbar
