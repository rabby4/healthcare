import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import dayjs from "dayjs"
import { SxProps } from "@mui/material"
import { Controller, useFormContext } from "react-hook-form"

interface IDatePicker {
	name: string
	size?: "small" | "medium"
	label?: string
	required?: boolean
	fullWidth?: boolean
	sx?: SxProps
}

const ProDatePicker = ({
	name,
	size = "small",
	label,
	required,
	fullWidth,
	sx,
}: IDatePicker) => {
	const { control } = useFormContext()

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={dayjs(new Date().toDateString())}
			render={({ field: { onChange, value, ...field } }) => {
				return (
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DesktopDatePicker
							{...field}
							label={label}
							timezone="system"
							disablePast
							onChange={(date) => onChange(date)}
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
								},
							}}
						/>
					</LocalizationProvider>
				)
			}}
		/>
	)
}

export default ProDatePicker
