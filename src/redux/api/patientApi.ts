/* eslint-disable @typescript-eslint/no-explicit-any */
import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const patientApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		// Full patient record incl. patientHealthData + medicalReport[].
		// id is Patient.id, obtained from getMyProfile (data.id). Only ever pass
		// the logged-in patient's own id.
		getPatient: build.query({
			query: (id: string) => ({
				url: `/patient/${id}`,
				method: "GET",
			}),
			providesTags: [tagTypes.patient],
		}),
		// JSON body (NOT multipart). Supports name/contactNumber, an upsert of
		// patientHealthData, and adding ONE medicalReport {reportName, reportLink}.
		// Do NOT send `address` (not a Patient column — errors at the DB layer).
		updatePatient: build.mutation({
			query: (data: { id: string; body: Record<string, any> }) => ({
				url: `/patient/${data.id}`,
				method: "PATCH",
				data: data.body,
			}),
			invalidatesTags: [tagTypes.patient, tagTypes.user],
		}),
	}),
	overrideExisting: false,
})

export const { useGetPatientQuery, useUpdatePatientMutation } = patientApi
