import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	Grid,
	Typography,
} from "@mui/material"
import Image from "next/image"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { TDoctor } from "@/types"

const TopRatedDoctors = async () => {
	const res = await fetch("http://localhost:5000/api/v1/doctor/?page=1&limit=3")
	const { data: doctors } = await res.json()
	// console.log(doctors)
	return (
		<Box
			sx={{
				my: 10,
				padding: 30,
				background: "rgba(20, 20, 20, 0.1)",
				clipPath: "polygon(0 0, 100% 25%, 100% 100%, 0 75%)",
			}}
		>
			<Box sx={{ textAlign: "center" }}>
				<Typography variant="h4" component={"h1"} fontWeight={700}>
					Our Top Rated Doctors
				</Typography>
				<Typography component={"p"} fontSize={18} sx={{ mt: 2 }}>
					Access to expert physicians and surgeons, advanced technologies
				</Typography>
				<Typography component={"p"} fontSize={18}>
					and top-quality surgery facilities right here
				</Typography>
			</Box>
			<Container sx={{ margin: "30px auto" }}>
				<Grid container spacing={2}>
					{doctors.map((doctor: TDoctor) => (
						<Grid key={doctor.id} size={4}>
							<Card>
								<Box>
									<Image
										src={doctor.profilePhoto}
										width={500}
										height={500}
										alt={doctor.name}
									/>
								</Box>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{doctor.name}
									</Typography>
									<Typography variant="body2" sx={{ color: "text.secondary" }}>
										{doctor.qualification}, {doctor.designation}
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: "text.secondary", mt: 1 }}
									>
										<LocationOnIcon /> {doctor.address}
									</Typography>
								</CardContent>
								<CardActions
									sx={{ justifyContent: "space-between", px: 2, pb: 3 }}
								>
									<Button sx={{ flex: 1 }}>Book Now</Button>
									<Button variant="outlined" sx={{ flex: 1 }}>
										View Profile
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
				<Box sx={{ margin: "20px", textAlign: "center" }}>
					<Button variant="outlined" sx={{ marginTop: 3 }}>
						View All
					</Button>
				</Box>
			</Container>
		</Box>
	)
}

export default TopRatedDoctors
