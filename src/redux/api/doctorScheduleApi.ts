/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi"
import { tagTypes } from "../tag-types"
import { IMeta } from "@/types"

export const doctorScheduleApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createDoctorSchedule: build.mutation({
			query: (data) => ({
				url: "/doctor-schedule",
				method: "POST",
				data,
			}),
			// Claiming a slot removes it from the open /schedule pool, so refresh both.
			invalidatesTags: [tagTypes.doctorSchedule, tagTypes.schedule],
		}),
		getAllDoctorSchedules: build.query({
			query: (arg: Record<string, any>) => {
				return {
					url: "/doctor-schedule",
					method: "GET",
					params: arg,
				}
			},
			transformResponse: (response: [], meta: IMeta) => {
				return {
					doctorSchedules: response,
					meta,
				}
			},
			providesTags: [tagTypes.doctorSchedule],
		}),
		getDoctorSchedule: build.query({
			query: (id: string | string[] | undefined) => ({
				url: `/doctor-schedule/${id}`,
				method: "GET",
			}),
			providesTags: [tagTypes.doctorSchedule],
		}),
		// NOTE: GET /doctor-schedule/my-schedule is NOT self-scoped on the backend
		// (it leaks every doctor's slots). Use getAllDoctorSchedules({ doctorId })
		// for a reliable "my slots" list instead.
		deleteDoctorSchedule: build.mutation({
			query: (id: string) => ({
				url: `/doctor-schedule/${id}`,
				method: "DELETE",
			}),
			// Removing a claimed slot frees it back into the open /schedule pool.
			invalidatesTags: [tagTypes.doctorSchedule, tagTypes.schedule],
		}),
	}),
})

export const {
	useCreateDoctorScheduleMutation,
	useGetAllDoctorSchedulesQuery,
	useGetDoctorScheduleQuery,
	useDeleteDoctorScheduleMutation,
} = doctorScheduleApi
