/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, styled, Typography } from "@mui/material"

const StyledInformationBox = styled(Box)(({ theme }) => ({
	background: "#f4f7fe",
	borderRadius: theme.spacing(1),
	width: "45%",
	padding: "8px 16px",
	"& p": {
		fontWeight: 600,
	},
}))

const DoctorInformation = ({ data }: any) => {
	return (
		<>
			<Typography variant="h5" sx={{ color: "primary.main", mb: 2 }}>
				Personal Information
			</Typography>

			<Stack direction={{ xs: "column", md: "row" }} sx={{ gap: 2, flexWrap: "wrap" }}>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Role
					</Typography>
					<Typography>{data?.role}</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Name
					</Typography>
					<Typography>{data?.name}</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Email
					</Typography>
					<Typography>{data?.email}</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Gender
					</Typography>
					<Typography>{data?.gender}</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Designation
					</Typography>
					<Typography>{data?.designation}</Typography>
				</StyledInformationBox>
			</Stack>

			<Typography variant="h5" sx={{ my: 2, color: "primary.main" }}>
				Professional Information
			</Typography>
			<Stack direction={{ xs: "column", md: "row" }} sx={{ flexWrap: "wrap", gap: 2 }}>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Anointment Fee
					</Typography>
					<Typography>{data?.appointmentFee}</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Qualification
					</Typography>
					<Typography>{data?.qualification}</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Current Working Place
					</Typography>
					<Typography>{data?.currentWorkingPlace}</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Joined
					</Typography>
					<Typography>
						{data
							? new Date(data.createdAt).toLocaleDateString("en-US", {
									month: "2-digit",
									day: "2-digit",
									year: "2-digit",
							  })
							: null}
					</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Current Status
					</Typography>
					<Typography>{data?.status}</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						Average Rating
					</Typography>
					<Typography>{data?.averageRating}</Typography>
				</StyledInformationBox>
				<StyledInformationBox>
					<Typography variant="caption" sx={{ color: "secondary.main" }}>
						experience
					</Typography>
					<Typography>{data?.experience}</Typography>
				</StyledInformationBox>
			</Stack>
		</>
	)
}

export default DoctorInformation
