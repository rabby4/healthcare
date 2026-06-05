"use client"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import dynamic from "next/dynamic"

const AgoraUIKit = dynamic(() => import("agora-react-uikit"), { ssr: false })
import { Button, Stack, Typography } from "@mui/material"
import VideocamIcon from "@mui/icons-material/Videocam"
import Image from "next/image"

const VideoCallingContent = () => {
	const videoCallingId = useSearchParams().get("videoCallingId")

	const [startVideoCall, setStartVideoCall] = useState(false)

	const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || ""

	const rtcProps = {
		appId,
		channel: videoCallingId as string, // your agora channel
		token: null, // Agora testing / no-certificate mode
	}
	const callbacks = {
		EndCall: () => setStartVideoCall(false),
	}

	// Guard against missing configuration before mounting the call widget.
	if (!appId || !videoCallingId) {
		return (
			<Stack
				sx={{
					width: "100%",
					maxWidth: 500,
					mx: "auto",
					mt: { xs: 2, md: 10 },
					alignItems: "center",
					justifyContent: "center",
					gap: 1,
					textAlign: "center",
				}}
				direction="column"
			>
				<Typography variant="h5" sx={{ fontWeight: 700 }}>
					{!appId ? "Video is not configured" : "Missing call id"}
				</Typography>
				<Typography sx={{ color: "secondary.main" }}>
					{!appId
						? "The Agora App ID is not set up for this environment."
						: "No videoCallingId was provided for this call."}
				</Typography>
				<Typography variant="caption" sx={{ color: "text.secondary" }}>
					Note: video uses Agora testing mode (no token / certificate).
				</Typography>
			</Stack>
		)
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
			<Typography variant="caption" sx={{ color: "text.secondary" }}>
				Note: video uses Agora testing mode (no token / certificate).
			</Typography>
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
