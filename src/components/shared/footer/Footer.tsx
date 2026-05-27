"use client"

import { Box, Container, Stack, Typography } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import facebookIcon from "@/assets/landing_page/facebook.png"
import instagramIcon from "@/assets/landing_page/instagram.png"
import twitterIcon from "@/assets/landing_page/twitter.png"
import linkedinIcon from "@/assets/landing_page/linkedin.png"

const Footer = () => {
	const date = new Date()
	return (
		<Box sx={{ bgcolor: "rgb(17, 26, 34)", py: 5 }}>
			<Container>
				<Stack
					direction={"row"}
					spacing={4}
					sx={{ color: "#fff", justifyContent: "center" }}
				>
					<Typography
						component={Link}
						href="/consultation"
						sx={{ color: "#fff" }}
					>
						Consultation
					</Typography>
					<Typography sx={{ color: "#fff" }}>Health Plans</Typography>
					<Typography sx={{ color: "#fff" }}>Medicine</Typography>
					<Typography sx={{ color: "#fff" }}>Diagnostics</Typography>
					<Typography sx={{ color: "#fff" }}>NGOs</Typography>
				</Stack>
				<Stack
					direction={"row"}
					spacing={2}
					sx={{ justifyContent: "center", py: 3 }}
				>
					<Image src={facebookIcon} width={30} height={30} alt="facebook" />
					<Image src={instagramIcon} width={30} height={30} alt="facebook" />
					<Image src={twitterIcon} width={30} height={30} alt="facebook" />
					<Image src={linkedinIcon} width={30} height={30} alt="facebook" />
				</Stack>
				<Box sx={{ border: "1px dashed lightgray" }}></Box>
				<Stack
					direction={"row"}
					spacing={4}
					sx={{ color: "#fff", justifyContent: "space-between", py: 4 }}
				>
					<Typography sx={{ color: "#fff" }}>
						&copy; {date.getFullYear()} HealthCare. All rights reserved.
					</Typography>
					<Typography
						variant="h4"
						component={Link}
						href="/"
						sx={{ fontWeight: 700, textTransform: "uppercase" }}
					>
						<Box component={"span"} sx={{ color: "primary.main" }}>
							H
						</Box>
						ealth Care
					</Typography>
					<Typography sx={{ color: "#fff" }}>
						Privacy Policy | Terms and Conditions
					</Typography>
				</Stack>
			</Container>
		</Box>
	)
}

export default Footer
