/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"

import DoctorOverview from "./_views/DoctorOverview"
import Overview from "./_views/Overview"
import PatientOverview from "./_views/PatientOverview"

const DashboardPage = async () => {
	const cookie = await cookies()
	const token = cookie.get("accessToken")?.value
	let role = ""
	if (token) {
		try {
			role = (jwtDecode(token) as any)?.role ?? ""
		} catch {}
	}

	// Admins and super admins share the same overview; the component itself
	// gates the super-admin-only bits (create admin, seeing super-admin info).
	if (role === "SUPER_ADMIN") return <Overview role="SUPER_ADMIN" />
	if (role === "ADMIN") return <Overview role="ADMIN" />
	if (role === "DOCTOR") return <DoctorOverview />
	if (role === "PATIENT") return <PatientOverview />
	return null
}

export default DashboardPage
