import { Box, Button, Container, Typography } from "@mui/material"
import Image from "next/image"
import assets from "@/assets"

const HeroSection = () => {
	return (
		<Container
			sx={{
				display: "flex",
				direction: "row",
				my: 16,
			}}
		>
			<Box
				sx={{
					flex: 1,
					position: "relative",
					width: "50%",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						width: "800px",
						top: "-90px",
						left: "-120px",
					}}
				>
					<Image src={assets.svgs.grid} alt="grid" />
				</Box>
				<Typography variant="h2" component={"h1"} fontWeight={700}>
					Healthier Hearts
				</Typography>
				<Typography variant="h2" component={"h1"} fontWeight={700}>
					Come From
				</Typography>
				<Typography
					variant="h2"
					component={"h1"}
					color="primary.main"
					fontWeight={700}
				>
					Preventive Care
				</Typography>
				<Typography component={"p"} my={3}>
					It is a long established fact that a reader will be distracted by the
					readable content of a page when looking at its layout. The point of
					using Lorem Ipsum is that it has a more-or-less normal distribution of
					letters, as opposed to using Content here.
				</Typography>
				<Button>Make Appointment</Button>
				<Button variant="outlined" sx={{ ml: 3 }}>
					Contact us
				</Button>
			</Box>
			<Box
				sx={{
					width: "50%",
					p: 1,
					flex: 1,
					display: "flex",
					justifyContent: "center",
					position: "relative",
					mt: 0,
				}}
			>
				<Box
					sx={{
						position: "absolute",
						left: "220px",
						top: "-30px",
					}}
				>
					<Image src={assets.svgs.arrow} width={100} height={100} alt="arrow" />
				</Box>
				<Box
					sx={{
						display: "flex",
						gap: 2,
					}}
				>
					<Box
						sx={{
							mt: 4,
						}}
					>
						<Image
							src={assets.images.doctor1}
							width={240}
							height={380}
							alt="doctor1"
						/>
					</Box>
					<Box>
						<Image
							src={assets.images.doctor2}
							width={240}
							height={350}
							alt="doctor2"
						/>
					</Box>
				</Box>
				<Box
					sx={{
						position: "absolute",
						bottom: "-50px",
						left: "150px",
					}}
				>
					<Image
						src={assets.images.doctor3}
						width={240}
						height={240}
						alt="doctor3"
					/>
				</Box>
				<Box
					sx={{
						position: "absolute",
						bottom: "-50px",
						right: "0",
						zIndex: "-10",
					}}
				>
					<Image
						src={assets.images.stethoscope}
						width={180}
						height={180}
						alt="doctor3"
					/>
				</Box>
			</Box>
		</Container>
	)
}

export default HeroSection
