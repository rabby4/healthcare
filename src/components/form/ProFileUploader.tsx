import * as React from "react"
import { SxProps } from "@mui/material/styles"
import Button from "@mui/material/Button"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { Controller, useFormContext } from "react-hook-form"
import { Input } from "@mui/material"

type TProps = {
	name: string
	label?: string
	sx?: SxProps
}

const ProFileUploader = ({ name, label, sx }: TProps) => {
	const { control } = useFormContext()
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value, ...field } }) => {
				return (
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
						startIcon={<CloudUploadIcon />}
						sx={{ ...sx }}
					>
						{label || "Upload files"}
						<Input
							{...field}
							type={name}
							value={value?.fileName}
							onChange={(e) =>
								onChange((e.target as HTMLInputElement).files?.[0])
							}
							style={{ display: "none" }}
						/>
					</Button>
				)
			}}
		/>
	)
}

export default ProFileUploader
