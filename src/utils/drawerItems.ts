import { USER_ROLE } from "@/constants/role"
import { DrawerItem, UserRole } from "@/types"

//icons
import DashboardIcon from "@mui/icons-material/Dashboard"
import GroupIcon from "@mui/icons-material/Group"
import TryIcon from "@mui/icons-material/Try"
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import ReviewsIcon from "@mui/icons-material/Reviews"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import AccountBoxIcon from "@mui/icons-material/AccountBox"
import SyncLockIcon from "@mui/icons-material/SyncLock"

export const drawerItems = (role: UserRole): DrawerItem[] => {
	const roleMenus: DrawerItem[] = []

	const defaultMenus = [
		{
			title: "Profile",
			path: `${role}/profile`,
			icon: AccountBoxIcon,
		},
		{
			title: "Change Password",
			path: `change-password`,
			icon: SyncLockIcon,
		},
	]

	switch (role) {
		case USER_ROLE.SUPER_ADMIN:
			roleMenus.push(
				{
					title: "Dashboard",
					path: `${role}`,
					icon: DashboardIcon,
				},
				{
					title: "Manage Users",
					path: `${role}/manage-users`,
					icon: GroupIcon,
				}
			)
			break
		case USER_ROLE.ADMIN:
			roleMenus.push(
				{
					title: "Dashboard",
					path: `${role}`,
					icon: DashboardIcon,
				},
				{
					title: "Specialties",
					path: `${role}/specialties`,
					icon: TryIcon,
				},
				{
					title: "Doctors",
					path: `${role}/doctors`,
					icon: MedicalInformationIcon,
				},
				{
					title: "Schedules",
					path: `${role}/schedules`,
					icon: CalendarMonthIcon,
				},
				{
					title: "Appointments",
					path: `${role}/appointments`,
					icon: EventAvailableIcon,
				},
				{
					title: "Reviews",
					path: `${role}/reviews`,
					icon: ReviewsIcon,
				}
			)
			break
		case USER_ROLE.DOCTOR:
			roleMenus.push(
				{
					title: "Dashboard",
					path: `${role}`,
					icon: DashboardIcon,
				},
				{
					title: "Schedules",
					path: `${role}/schedules`,
					icon: CalendarMonthIcon,
				},
				{
					title: "Appointments",
					path: `${role}/appointments`,
					icon: EventAvailableIcon,
				}
			)
			break
		case USER_ROLE.PATIENT:
			roleMenus.push(
				{
					title: "Appointments",
					path: `${role}/appointments`,
					icon: CalendarMonthIcon,
				},
				{
					title: "Prescriptions",
					path: `${role}/prescriptions`,
					icon: ReceiptLongIcon,
				},
				{
					title: "Payment History",
					path: `${role}/payment-history`,
					icon: AttachMoneyIcon,
				}
			)
			break
		default:
			break
	}

	return [...roleMenus, ...defaultMenus]
}
