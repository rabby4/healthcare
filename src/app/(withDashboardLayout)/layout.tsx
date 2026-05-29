/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import DashboardShell from "@/components/dashboard/shell/DashboardShell"
import {
	adminNav,
	doctorNav,
	patientNav,
	superAdminNav,
} from "@/components/dashboard/shell/navItems"
import { NavGroup } from "@/components/dashboard/shell/Sidebar"
import { AvatarVariant } from "@/components/dashboard/shell/tokens"

type RoleConfig = {
	groups: NavGroup[]
	label: string
	variant: AvatarVariant
}

const roleConfig: Record<string, RoleConfig> = {
	SUPER_ADMIN: { groups: superAdminNav, label: "Super Admin", variant: "purple" },
	ADMIN: { groups: adminNav, label: "Admin", variant: "teal" },
	DOCTOR: { groups: doctorNav, label: "Doctor", variant: "blue" },
	PATIENT: { groups: patientNav, label: "Patient", variant: "green" },
}

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
	const cookie = await cookies()
	const token = cookie.get("accessToken")?.value

	let email = ""
	let role = ""
	if (token) {
		try {
			const decoded: any = jwtDecode(token)
			email = decoded?.email ?? ""
			role = decoded?.role ?? ""
		} catch {
			redirect("/login")
		}
	} else {
		redirect("/login")
	}

	const cfg = roleConfig[role]
	if (!cfg) redirect("/login")

	const localPart = email.split("@")[0] || "User"
	const displayName =
		localPart.charAt(0).toUpperCase() + localPart.slice(1).replace(/[._-]/g, " ")
	const initials = (localPart.slice(0, 2) || "U").toUpperCase()

	return (
		<DashboardShell
			groups={cfg.groups}
			roleLabel={cfg.label}
			roleVariant={cfg.variant}
			userName={displayName}
			userInitials={initials}
		>
			{children}
		</DashboardShell>
	)
}

export default DashboardLayout
