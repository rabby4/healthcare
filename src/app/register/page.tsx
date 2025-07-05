import assets from "@/assets"
import {
	Box,
	Button,
	Container,
	Grid,
	Stack,
	TextField,
	Typography,
} from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const RegisterPage = () => {
	return (
		<Container>
			<Stack
				sx={{ justifyContent: "center", alignItems: "center", height: "100vh" }}
			>
				<Box
					sx={{
						maxWidth: 600,
						width: "100%",
						boxShadow: 1,
						borderRadius: 1,
						p: 4,
						textAlign: "center",
					}}
				>
					<Stack sx={{ justifyContent: "center", alignItems: "center" }}>
						<Box>
							<Image src={assets.svgs.logo} width={50} height={50} alt="logo" />
						</Box>
						<Box>
							<Typography variant="h5" fontWeight={700}>
								Patient Register
							</Typography>
						</Box>
					</Stack>
					<Box>
						<form>
							<Grid container spacing={3} my={2}>
								<Grid size={{ md: 12 }}>
									<TextField
										label="Name"
										type="text"
										variant="outlined"
										size="small"
										fullWidth
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<TextField
										label="Email"
										type="email"
										variant="outlined"
										size="small"
										fullWidth
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<TextField
										label="Password"
										type="password"
										variant="outlined"
										size="small"
										fullWidth
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<TextField
										label="Contact Number"
										type="tel"
										variant="outlined"
										size="small"
										fullWidth
									/>
								</Grid>
								<Grid size={{ md: 6 }}>
									<TextField
										label="Address"
										type="text"
										variant="outlined"
										size="small"
										fullWidth
									/>
								</Grid>
							</Grid>
							<Button fullWidth sx={{ my: 2 }}>
								Register
							</Button>
							<Typography component="p">
								Do you already have an account?{" "}
								<Link href={"/login"} className="text-blue-500">
									Login
								</Link>
							</Typography>
						</form>
					</Box>
				</Box>
			</Stack>
		</Container>
	)
}

export default RegisterPage
