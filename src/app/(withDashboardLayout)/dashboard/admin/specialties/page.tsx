import { Box, Button, Stack, TextField } from "@mui/material"
import React from "react"

const SpecialtiesPage = () => {
	return (
		<Box>
			<Stack
				direction={"row"}
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				<Button>Create Specialty</Button>
				<TextField size="small" placeholder="Search Specialist" />
			</Stack>
		</Box>
	)
}

export default SpecialtiesPage
