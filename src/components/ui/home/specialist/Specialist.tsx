import { TSpecialties } from "@/types"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import Image from "next/image"
import React from "react"

const Specialist = async () => {
	const res = await fetch("http://localhost:5000/api/v1/specialties", {
		next: { revalidate: 30 },
	})
	const { data: specialties } = await res.json()

	return (
		<Container>
			<Box
				sx={{
					margin: "40px 0px",
					textAlign: "center",
				}}
			>
				<Box
					sx={{
						textAlign: "left",
					}}
				>
					<Typography variant="h4" fontWeight={700}>
						Explore treatment Across Specialties
					</Typography>
					<Typography component="p" fontSize={18}>
						Experienced Doctors Across All Specialties
					</Typography>
				</Box>
				<Stack direction={"row"} gap={4} mt={5}>
					{specialties.map((specialty: TSpecialties) => (
						<Box
							key={specialty.id}
							sx={{
								flex: 1,
								width: "150px",
								background: "rgba(245,245,245,1)",
								border: "1px solid rgba(250,250,250,1)",
								borderRadius: "10px",
								textAlign: "center",
								padding: "30px 10px",
								"& img": {
									width: "50px",
									height: "50px",
									margin: "0 auto",
								},
								"&:hover": {
									border: "1px solid #1586fd",
									transition: ".5s",
									cursor: "pointer",
								},
							}}
						>
							<Image
								src={specialty.icon}
								width={100}
								height={100}
								alt={specialty.title}
							/>
							<Box>
								<Typography component="p" fontWeight={500} fontSize={18} mt={2}>
									{specialty.title}
								</Typography>
							</Box>
						</Box>
					))}
				</Stack>
				<Button variant="outlined" sx={{ marginTop: 3 }}>
					View All
				</Button>
			</Box>
		</Container>
	)
}

export default Specialist
