import DashedLine from "@/components/ui/doctor/DashedLine"
import DoctorCard from "@/components/ui/doctor/DcotorCard"
import ScrollCategory from "@/components/ui/doctor/ScrollCategory"
import { IDoctor } from "@/types"
import { Box, Container } from "@mui/material"
import React from "react"

interface PropType {
	searchParams: { specialties: string }
}

const DoctorsPage = async ({ searchParams }: PropType) => {
	const params = await searchParams
	let res

	if (params.specialties) {
		res = await fetch(
			`http://localhost:5000/api/v1/doctor?specialties=${params.specialties}`
		)
	} else {
		res = await fetch("http://localhost:5000/api/v1/doctor")
	}

	const { data } = await res.json()

	return (
		<Container>
			<DashedLine />

			<ScrollCategory specialties={params?.specialties} />
			<Box sx={{ mt: 2, p: 3, bgcolor: "secondary.light" }}>
				{data.map((doctor: IDoctor, index: number) => (
					<Box key={doctor.id}>
						<DoctorCard doctor={doctor} />
						{index === data.length - 1 ? null : <DashedLine />}
					</Box>
				))}
			</Box>
		</Container>
	)
}

export default DoctorsPage
