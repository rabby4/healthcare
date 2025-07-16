/* eslint-disable @typescript-eslint/no-explicit-any */
import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const scheduleApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createSchedule: build.mutation({
			query: (data) => ({
				url: "/schedule",
				method: "POST",
				data,
			}),
			invalidatesTags: [tagTypes.schedule],
		}),
		getAllSchedules: build.query({
			query: (arg: Record<string, any>) => ({
				url: "/schedule",
				method: "GET",
				params: arg,
			}),
			transformResponse: (response) => {
				return {
					schedule: response?.data,
					meta: response.meta,
				}
			},
			providesTags: [tagTypes.schedule],
		}),
		deleteSchedule: build.mutation({
			query: (id) => ({
				url: `/schedule/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [tagTypes.schedule],
		}),
	}),
	overrideExisting: false,
})

export const {
	useCreateScheduleMutation,
	useGetAllSchedulesQuery,
	useDeleteScheduleMutation,
} = scheduleApi
