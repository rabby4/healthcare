"use client"
import * as React from "react"
import { styled, SxProps } from "@mui/material/styles"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"

type TModalProps = {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	title: string
	children: React.ReactNode
	sx?: SxProps
}

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}))

const ProModal = ({
	open = false,
	setOpen,
	title = "",
	children,
	sx,
}: TModalProps) => {
	const handleClose = () => {
		setOpen(false)
	}

	return (
		<React.Fragment>
			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				sx={{ ...sx }}
			>
				<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
					{title}
				</DialogTitle>
				<IconButton
					aria-label="close"
					onClick={handleClose}
					sx={(theme) => ({
						position: "absolute",
						right: 8,
						top: 8,
						color: theme.palette.grey[500],
					})}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent dividers>{children}</DialogContent>
			</BootstrapDialog>
		</React.Fragment>
	)
}

export default ProModal
