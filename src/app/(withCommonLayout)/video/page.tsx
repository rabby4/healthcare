"use client"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import dynamic from "next/dynamic"

const AgoraUIKit = dynamic(() => import("agora-react-uikit"), { ssr: false })
import { Button, Stack } from "@mui/material"
import VideocamIcon from "@mui/icons-material/Videocam"
import Image from "next/image"

const VideoCallingContent = () => {
	const videoCallingId = useSearchParams().get("videoCallingId")

	const [startVideoCall, setStartVideoCall] = useState(false)

	const rtcProps = {
		appId: "<Agora App ID>",
		channel: videoCallingId as string, // your agora channel
		token: process.env.NEXT_PUBLIC_AGORA_APP_ID, // use null or skip if using app in testing mode
	}
	const callbacks = {
		EndCall: () => setStartVideoCall(false),
	}

	return startVideoCall ? (
		<div style={{ display: "flex", width: "100vw", height: "100vh" }}>
			<AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
		</div>
	) : (
		<Stack
			sx={{
				width: "100%",
				maxWidth: 500,
				mx: "auto",
				mt: { xs: 2, md: 10 },
				alignItems: "center",
				justifyContent: "center",
				gap: 2,
			}}
			direction="column"
		>
			<Button
				onClick={() => setStartVideoCall(true)}
				endIcon={<VideocamIcon />}
				sx={{ borderRadius: "20px" }}
			>
				Start Call
			</Button>
			<Image
				src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExb25jMWk1b3VxYWtjYTdpZXlnNGcwZHVqcGppejM3bDUybTl3aXQ0ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/PnHX3RAVHsjHXTO4qv/giphy.gif"
				width={500}
				height={500}
				alt="video call gif"
			/>
		</Stack>
	)
}

const VideoCalling = () => (
	<Suspense>
		<VideoCallingContent />
	</Suspense>
)

export default VideoCalling
