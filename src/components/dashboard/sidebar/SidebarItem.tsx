import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material"
import Link from "next/link"
import { DrawerItem } from "@/types"
import { usePathname } from "next/navigation"

type IProps = {
	item: DrawerItem
}

const SidebarItem = ({ item }: IProps) => {
	const linkPath = `/dashboard/${item.path}`
	const pathName = usePathname()

	return (
		<Link href={linkPath}>
			<ListItem
				disablePadding
				sx={{
					...(pathName === linkPath
						? {
								borderRight: "3px solid #1586fd",
								"& svg": { color: "#1586fd" },
								"& span": { color: "#1586fd" },
						  }
						: {}),
				}}
			>
				<ListItemButton>
					<ListItemIcon>{item.icon && <item.icon />}</ListItemIcon>
					<ListItemText primary={item.title} />
				</ListItemButton>
			</ListItem>
		</Link>
	)
}

export default SidebarItem
