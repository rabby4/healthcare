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

const API =
	process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/api/v1"

// Replaces the admin-tier nav badges with real counts from the backend.
// Returns the groups unchanged (no badges) if anything fails.
const withLiveCounts = async (
	groups: NavGroup[],
	role: string,
	token?: string
): Promise<NavGroup[]> => {
	if (role !== "SUPER_ADMIN" && role !== "ADMIN") return groups

	const counts: Record<string, number> = {}
	try {
		const [metaRes, specRes] = await Promise.all([
			fetch(`${API}/meta`, {
				headers: token ? { Authorization: token } : {},
				cache: "no-store",
			}),
			fetch(`${API}/specialties`, { cache: "no-store" }),
		])
		const meta = (await metaRes.json())?.data ?? {}
		const spec = (await specRes.json())?.data ?? []
		if (typeof meta.adminCount === "number")
			counts["/dashboard/admins"] = meta.adminCount
		if (typeof meta.doctorCount === "number")
			counts["/dashboard/doctors"] = meta.doctorCount
		if (Array.isArray(spec)) counts["/dashboard/specialties"] = spec.length
	} catch {
		return groups
	}

	return groups.map((g) => ({
		...g,
		items: g.items.map((item) =>
			counts[item.href] !== undefined
				? { ...item, badge: counts[item.href] }
				: item
		),
	}))
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

	// Live counts for the sidebar badges (admin tier only). Best-effort: on any
	// failure we simply render no badge rather than a wrong/static number.
	const groups = await withLiveCounts(cfg.groups, role, token)

	return (
		<DashboardShell
			groups={groups}
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
