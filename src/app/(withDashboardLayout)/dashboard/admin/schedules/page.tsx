"use client"
import { Box, Button, Stack } from "@mui/material"
import React, { useState } from "react"
import ScheduleModal from "./components/ScheduleModal"

const SchedulesPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	return (
		<Box>
			<Stack
				direction={"row"}
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				<Button onClick={() => setIsModalOpen(true)}>Create Specialty</Button>
				<ScheduleModal open={isModalOpen} setOpen={setIsModalOpen} />
			</Stack>
		</Box>
	)
}

export default SchedulesPage
