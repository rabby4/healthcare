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
		<Box bgcolor={"rgb(17, 26, 34)"} py={5}>
			<Container>
				<Stack
					direction={"row"}
					spacing={4}
					color={"#fff"}
					justifyContent={"center"}
				>
					<Typography component={Link} href="/consultation" color={"#fff"}>
						Consultation
					</Typography>
					<Typography color={"#fff"}>Health Plans</Typography>
					<Typography color={"#fff"}>Medicine</Typography>
					<Typography color={"#fff"}>Diagnostics</Typography>
					<Typography color={"#fff"}>NGOs</Typography>
				</Stack>
				<Stack direction={"row"} spacing={2} justifyContent={"center"} py={3}>
					<Image src={facebookIcon} width={30} height={30} alt="facebook" />
					<Image src={instagramIcon} width={30} height={30} alt="facebook" />
					<Image src={twitterIcon} width={30} height={30} alt="facebook" />
					<Image src={linkedinIcon} width={30} height={30} alt="facebook" />
				</Stack>
				<Box sx={{ border: "1px dashed lightgray" }}></Box>
				<Stack
					direction={"row"}
					spacing={4}
					color={"#fff"}
					justifyContent={"space-between"}
					py={4}
				>
					<Typography color={"#fff"}>
						&copy; {date.getFullYear()} HealthCare. All rights reserved.
					</Typography>
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
					<Typography color="#fff">
						Privacy Policy | Terms and Conditions
					</Typography>
				</Stack>
			</Container>
		</Box>
	)
}

export default Footer
