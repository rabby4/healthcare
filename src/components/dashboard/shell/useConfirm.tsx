"use client"

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Typography,
} from "@mui/material"
import { ReactNode, useCallback, useState } from "react"

import { SHELL } from "./tokens"

type ConfirmOptions = {
	title: string
	message: ReactNode
	confirmLabel?: string
	cancelLabel?: string
	danger?: boolean
}

type PendingState = ConfirmOptions & { resolve: (ok: boolean) => void }

/**
 * useConfirm — a reusable, MUI-styled replacement for window.confirm.
 * Usage:
 *   const { confirm, ConfirmDialog } = useConfirm()
 *   ... if (await confirm({ title, message, danger: true })) { ...do it... }
 *   ... render {ConfirmDialog} once in the component tree.
 */
export const useConfirm = () => {
	const [pending, setPending] = useState<PendingState | null>(null)

	const confirm = useCallback((options: ConfirmOptions) => {
		return new Promise<boolean>((resolve) => {
			setPending({ ...options, resolve })
		})
	}, [])

	const close = (ok: boolean) => {
		if (pending) pending.resolve(ok)
		setPending(null)
	}

	const ConfirmDialog = (
		<Dialog
			open={Boolean(pending)}
			onClose={() => close(false)}
			maxWidth="xs"
			fullWidth
			slotProps={{
				paper: {
					sx: {
						borderRadius: "18px",
						boxShadow: "0 40px 80px -20px rgba(15, 30, 46, 0.35)",
					},
				},
			}}
		>
			<DialogContent sx={{ p: 3, pb: 1 }}>
				<Typography sx={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", color: "text.primary" }}>
					{pending?.title}
				</Typography>
				<Box sx={{ mt: 1, fontSize: 14, color: "text.secondary", lineHeight: 1.55 }}>
					{pending?.message}
				</Box>
			</DialogContent>
			<DialogActions sx={{ p: 2, px: 3, gap: 1.25 }}>
				<Button
					onClick={() => close(false)}
					variant="outlined"
					sx={{
						bgcolor: "#fff",
						color: "text.primary",
						borderColor: "divider",
						"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
					}}
				>
					{pending?.cancelLabel ?? "Cancel"}
				</Button>
				<Button
					onClick={() => close(true)}
					sx={
						pending?.danger
							? { bgcolor: SHELL.urgent, "&:hover": { bgcolor: "#c2543d" } }
							: undefined
					}
				>
					{pending?.confirmLabel ?? "Confirm"}
				</Button>
			</DialogActions>
		</Dialog>
	)

	return { confirm, ConfirmDialog }
}
