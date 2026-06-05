import { redirect } from "next/navigation"

// The doctor overview lives at /dashboard (role-branched). This bare /dashboard/doctor
// route is a leftover — redirect it to the real overview.
const DoctorIndex = () => {
	redirect("/dashboard")
}

export default DoctorIndex
