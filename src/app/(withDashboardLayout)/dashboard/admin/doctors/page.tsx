"use client"
import { Box, Button, Stack, TextField } from "@mui/material"
import React, { useState } from "react"
import DoctorModal from "./components/DoctorModal"

const DoctorsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	return (
		<Box>
			<Stack
				direction={"row"}
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				<Button onClick={() => setIsModalOpen(true)}>Create New Doctor</Button>
				<DoctorModal open={isModalOpen} setOpen={setIsModalOpen} />
				<TextField size="small" placeholder="Search Doctor" />
			</Stack>
		</Box>
	)
}

export default DoctorsPage
