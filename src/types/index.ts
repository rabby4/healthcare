export type TSpecialties = {
	id: string
	title: string
	icon: string
}
export type TDoctor = {
	id: string
	name: string
	email: string
	profilePhoto: string
	contactNumber: string
	address: string
	registrationNumber: string
	experience: number
	gender: string
	appointmentFee: number
	qualification: string
	currentWorkingPlace: string
	designation: string
	averageRating: number
	isDeleted: boolean
	createdAt: Date
	updatedAt: Date
}
