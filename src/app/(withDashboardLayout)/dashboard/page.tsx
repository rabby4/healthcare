/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"

import AdminOverview from "./_views/AdminOverview"
import DoctorOverview from "./_views/DoctorOverview"
import PatientOverview from "./_views/PatientOverview"
import SuperAdminOverview from "./_views/SuperAdminOverview"

const DashboardPage = async () => {
	const cookie = await cookies()
	const token = cookie.get("accessToken")?.value
	let role = ""
	if (token) {
		try {
			role = (jwtDecode(token) as any)?.role ?? ""
		} catch {}
	}

	if (role === "SUPER_ADMIN") return <SuperAdminOverview />
	if (role === "ADMIN") return <AdminOverview />
	if (role === "DOCTOR") return <DoctorOverview />
	if (role === "PATIENT") return <PatientOverview />
	return null
}

export default DashboardPage
