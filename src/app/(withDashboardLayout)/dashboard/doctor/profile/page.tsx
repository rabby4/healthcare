"use client"
import {
	useGetMYProfileQuery,
	useUpdateMYProfileMutation,
} from "@/redux/api/myProfileApi"
import { Box, Button, Container, Grid } from "@mui/material"
import Image from "next/image"
import { useState } from "react"
import ProfileUpdateModal from "./components/ProfileUpdateModal"
import AutoFileUploader from "@/components/form/AutoFileUploader"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import EditSquareIcon from "@mui/icons-material/EditSquare"
import DoctorInformation from "./components/DoctorInformation"

const DoctorProfilePage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const { data, isLoading } = useGetMYProfileQuery({})
	const [updateMYProfile, { isLoading: updating }] =
		useUpdateMYProfileMutation()

	const fileUploadHandler = (file: File) => {
		const formData = new FormData()
		formData.append("file", file)
		formData.append("data", JSON.stringify({}))

		updateMYProfile(formData)
	}

	if (isLoading) {
		return <p>Loading...</p>
	}

	return (
		<>
			<ProfileUpdateModal
				open={isModalOpen}
				setOpen={setIsModalOpen}
				id={data?.id}
			/>
			<Container>
				<Grid container spacing={5}>
					<Grid size={{ xs: 12, md: 4 }}>
						<Box
							sx={{
								height: 300,
								width: "100%",
								overflow: "hidden",
								borderRadius: 1,
							}}
						>
							<Image
								height={300}
								width={400}
								src={
									data?.profilePhoto ||
									"https://res.cloudinary.com/dtw7xqrds/image/upload/v1747856982/isv4lb548qkzuvhtkeb3.jpg"
								}
								alt="User Photo"
							/>
						</Box>

						{updating ? (
							<p>Uploading...</p>
						) : (
							<AutoFileUploader
								name="file"
								label="Choose Your Profile Photo"
								icon={<CloudUploadIcon />}
								onFileUpload={fileUploadHandler}
								variant="text"
								sx={{ my: 2, width: "100%", border: "1px dashed #1586fd" }}
							/>
						)}

						<Button
							fullWidth
							endIcon={<EditSquareIcon />}
							onClick={() => setIsModalOpen(true)}
						>
							Edit Profile
						</Button>
					</Grid>
					<Grid size={{ xs: 12, md: 8 }}>
						<DoctorInformation data={data} />
					</Grid>
				</Grid>
			</Container>
		</>
	)
}

export default DoctorProfilePage
