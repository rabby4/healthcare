import { redirect } from "next/navigation"

// The patient overview lives at /dashboard (role-branched). This bare
// /dashboard/patient route is a leftover — redirect it to the real overview.
const PatientIndex = () => {
	redirect("/dashboard")
}

export default PatientIndex
