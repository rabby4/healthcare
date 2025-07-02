import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
	palette: {
		primary: {
			main: "#1586fd",
		},
		secondary: {
			main: "#666f73",
		},
	},
	components: {
		MuiButton: {
			defaultProps: {
				variant: "contained",
			},
			styleOverrides: {
				root: {
					padding: "8px 24px",
				},
			},
		},
		MuiContainer: {
			defaultProps: {
				maxWidth: "lg",
			},
		},
	},
	typography: {
		body1: {
			color: "#0b1134cc",
		},
	},
})

theme.shadows[1] = "0px 5px 22px lightgray"
