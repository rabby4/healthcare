"use client"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

type Props = {
	name: string
	label: string
	placeholder?: string
}

const PasswordField = ({ name, label, placeholder }: Props) => {
	const [show, setShow] = useState(false)
	const { control } = useFormContext()
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => (
				<TextField
					{...field}
					label={label}
					placeholder={placeholder}
					type={show ? "text" : "password"}
					fullWidth
					error={!!error?.message}
					helperText={error?.message}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShow((s) => !s)}
										edge="end"
										size="small"
										tabIndex={-1}
										aria-label={show ? "Hide password" : "Show password"}
									>
										{show ? (
											<VisibilityOffOutlinedIcon fontSize="small" />
										) : (
											<VisibilityOutlinedIcon fontSize="small" />
										)}
									</IconButton>
								</InputAdornment>
							),
						},
					}}
				/>
			)}
		/>
	)
}

export default PasswordField
