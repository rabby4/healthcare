import { SxProps } from "@mui/material"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import dayjs from "dayjs"
import React from "react"
import { Controller, useFormContext } from "react-hook-form"

interface ITimePicker {
	name: string
	size?: "small" | "medium"
	label?: string
	required?: boolean
	fullWidth?: boolean
	sx?: SxProps
}

const ProTimePicker = ({
	name,
	size = "small",
	label,
	required,
	fullWidth,
	sx,
}: ITimePicker) => {
	const { control, formState } = useFormContext()
	const isError = formState.errors[name] !== undefined

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={dayjs(new Date().toDateString())}
			render={({ field: { onChange, value, ...field } }) => {
				return (
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<TimePicker
							{...field}
							label={label}
							timezone="system"
							onChange={(time) => onChange(time)}
							value={value || Date.now()}
							slotProps={{
								textField: {
									required,
									size,
									sx: {
										...sx,
									},
									variant: "outlined",
									fullWidth,
									error: isError,
									helperText: isError
										? (formState.errors[name]?.message as string)
										: "",
								},
							}}
						/>
					</LocalizationProvider>
				)
			}}
		/>
	)
}

export default ProTimePicker
