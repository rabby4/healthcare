export const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace"

export const SHELL = {
	bgSoft: "#F4F6F8",
	bgSoft2: "#ECF1F3",
	dividerSoft: "#F0F2F5",
	tealTint2: "#F2F8F8",
	purpleTint: "#EDE7F5",
	purple: "#7B4DA8",
	star: "#F2B544",
	urgent: "#D9624A",
	success: "#0F7A48",
	successBg: "#E1F2EA",
	info: "#2A6FB5",
	infoBg: "#E6EEF8",
	warning: "#B5811C",
	warningBg: "#FFF1D6",
	dangerBg: "#FDE9E4",
}

export const GRAD = {
	teal: "linear-gradient(135deg, #0E7C7B, #16A085)",
	blue: "linear-gradient(135deg, #2A6FB5, #4A90D9)",
	purple: "linear-gradient(135deg, #7B4DA8, #A26CC8)",
	orange: "linear-gradient(135deg, #C56A3F, #E59364)",
	green: "linear-gradient(135deg, #3D8B5A, #5DAE7B)",
} as const

export type AvatarVariant = keyof typeof GRAD
