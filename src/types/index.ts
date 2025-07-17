/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { USER_ROLE } from "@/constants/role"
import { SvgIconTypeMap } from "@mui/material"
import { OverridableComponent } from "@mui/material/OverridableComponent"

export interface ISpecialty {
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
	experience: number | undefined
	gender: "MALE" | "FEMALE"
	appointmentFee: number | undefined
	qualification: string
	currentWorkingPlace: string
	designation: string
	averageRating: number
	specialties?: ISpecialties[]
}

export interface ISpecialties {
	specialtiesId: string
	isDeleted?: null
}

export interface IDoctorFormData {
	doctor: IDoctor
	password: string
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

export interface IMeta {
	page: number
	limit: number
	total: number
}

export type UserRole = keyof typeof USER_ROLE

export interface DrawerItem {
	title: string
	path: string
	parentPath?: string
	icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string }
	child?: DrawerItem[]
}

export interface ResponseSuccessType {
	data: any
	meta?: IMeta
}

export interface IGenericErrorResponse {
	statusCode: number
	message: string
	errorMessages: IGenericErrorMessage[]
}

export interface IGenericErrorMessage {
	path: string | number
	message: string
}

export const Gender = ["MALE", "FEMALE"]

export type ISchedule = {
	id?: string
	startDateTime: string
	endDateTime: string
}

export type IScheduleFrom = {
	startDate: Date
	endDate: Date
	startTime: string
	endTime: string
}
