import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded"
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded"
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined"
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined"
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined"
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined"

import { NavGroup } from "./Sidebar"

// Shared resources both admin tiers can manage
const adminTierManage: NavGroup["items"] = [
	{
		label: "Doctors",
		href: "/dashboard/doctors",
		icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 18 }} />,
		badge: 240,
	},
	{
		label: "Specialties",
		href: "/dashboard/specialties",
		icon: <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />,
		badge: 18,
	},
	{
		label: "Schedules",
		href: "/dashboard/schedules",
		icon: <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />,
	},
	{
		label: "Appointments",
		href: "/dashboard/appointments",
		icon: <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />,
	},
	{
		label: "Reviews",
		href: "/dashboard/reviews",
		icon: <RateReviewOutlinedIcon sx={{ fontSize: 18 }} />,
	},
	{
		label: "Users",
		href: "/dashboard/users",
		icon: <GroupOutlinedIcon sx={{ fontSize: 18 }} />,
	},
]

const accountGroup: NavGroup = {
	heading: "Account",
	items: [
		{
			label: "Change Password",
			href: "/dashboard/change-password",
			icon: <LockOutlinedIcon sx={{ fontSize: 18 }} />,
		},
	],
}

export const superAdminNav: NavGroup[] = [
	{
		heading: "Manage",
		items: [
			{
				label: "Overview",
				href: "/dashboard",
				icon: <GridViewRoundedIcon sx={{ fontSize: 18 }} />,
				matchExact: true,
			},
			{
				label: "Admins",
				href: "/dashboard/admins",
				icon: <ShieldOutlinedIcon sx={{ fontSize: 18 }} />,
				badge: 6,
			},
			...adminTierManage,
		],
	},
	accountGroup,
]

export const adminNav: NavGroup[] = [
	{
		heading: "Manage",
		items: [
			{
				label: "Overview",
				href: "/dashboard",
				icon: <GridViewRoundedIcon sx={{ fontSize: 18 }} />,
				matchExact: true,
			},
			...adminTierManage,
		],
	},
	accountGroup,
]

export const doctorNav: NavGroup[] = [
	{
		heading: "Practice",
		items: [
			{
				label: "Overview",
				href: "/dashboard",
				icon: <GridViewRoundedIcon sx={{ fontSize: 18 }} />,
				matchExact: true,
			},
			{
				label: "Appointments",
				href: "/dashboard/doctor/appointments",
				icon: <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />,
			},
			{
				label: "Schedules",
				href: "/dashboard/doctor/schedules",
				icon: <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />,
			},
			{
				label: "Profile",
				href: "/dashboard/doctor/profile",
				icon: <PersonOutlinedIcon sx={{ fontSize: 18 }} />,
			},
		],
	},
	accountGroup,
]

export const patientNav: NavGroup[] = [
	{
		heading: "My Care",
		items: [
			{
				label: "Overview",
				href: "/dashboard",
				icon: <GridViewRoundedIcon sx={{ fontSize: 18 }} />,
				matchExact: true,
			},
			{
				label: "Appointments",
				href: "/dashboard/patient/appointments",
				icon: <CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />,
			},
		],
	},
	accountGroup,
]
