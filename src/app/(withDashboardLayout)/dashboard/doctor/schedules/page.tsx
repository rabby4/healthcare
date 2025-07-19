"use client"
import React, { useState } from "react"
import DoctorScheduleModal from "./components/DoctorScheduleModal"
import { Box, Button } from "@mui/material"

const DoctorSchedulePage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	return (
		<Box>
			<Button onClick={() => setIsModalOpen(true)}>
				Create Doctor Schedule
			</Button>
			<DoctorScheduleModal open={isModalOpen} setOpen={setIsModalOpen} />
		</Box>
	)
}

export default DoctorSchedulePage
