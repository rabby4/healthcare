export interface ISpecialties {
	id: string
	title: string
	icon: string
}
export interface IDoctor {
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

interface IPatientData {
	name: string
	email: string
	contactNumber: string
	address: string
}

export interface IPatientRegisterFromData {
	password: string
	patient: IPatientData
}

export interface IUserLogin {
	email: string
	password: string
}
