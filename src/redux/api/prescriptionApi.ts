/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "@/types"
import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const prescriptionApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		// Doctor issues a prescription for one of their own COMPLETED + PAID appointments.
		// Body: { appointmentId, instructions, followUpDate? }. doctorId/patientId derive from the appointment.
		createPrescription: build.mutation({
			query: (data: {
				appointmentId: string
				instructions: string
				followUpDate?: string | null
			}) => ({
				url: "/prescription",
				method: "POST",
				data,
			}),
			invalidatesTags: [tagTypes.prescription, tagTypes.appointment],
		}),
		// Patient reads their own prescriptions (paginated, top-level meta).
		getMyPrescriptions: build.query({
			query: (arg: Record<string, any>) => ({
				url: "/prescription/my-prescriptions",
				method: "GET",
				params: arg,
			}),
			transformResponse: (response: any[], meta: IMeta) => ({
				prescriptions: response,
				meta,
			}),
			providesTags: [tagTypes.prescription],
		}),
	}),
	overrideExisting: false,
})

export const { useCreatePrescriptionMutation, useGetMyPrescriptionsQuery } =
	prescriptionApi
