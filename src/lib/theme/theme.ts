import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
	palette: {
		primary: {
			main: "#0E7C7B",
			dark: "#0A6968",
			light: "#E6F2F1",
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#8892A2",
			light: "#F4F6F8",
			dark: "#465065",
		},
		text: {
			primary: "#0F1E2E",
			secondary: "#465065",
		},
		background: {
			default: "#FFFFFF",
			paper: "#FFFFFF",
		},
		divider: "#E6E9EE",
		warning: { main: "#F2B544" },
		error: { main: "#D9624A" },
	},
	shape: {
		borderRadius: 12,
	},
	typography: {
		fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
		h1: { fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.04 },
		h2: { fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1 },
		h3: { fontWeight: 700, letterSpacing: "-0.02em" },
		h4: { fontWeight: 600, letterSpacing: "-0.02em" },
		h5: { fontWeight: 600, letterSpacing: "-0.01em" },
		h6: { fontWeight: 600 },
		button: { textTransform: "none", fontWeight: 600, letterSpacing: "-0.005em" },
		body1: { color: "#465065" },
	},
	components: {
		MuiButton: {
			defaultProps: {
				variant: "contained",
				disableElevation: true,
			},
			styleOverrides: {
				root: {
					borderRadius: 999,
					padding: "10px 22px",
				},
			},
		},
		MuiContainer: {
			defaultProps: {
				maxWidth: "lg",
			},
		},
	},
})

theme.shadows[1] = "0px 5px 22px lightgray"
