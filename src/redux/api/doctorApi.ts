import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const doctorApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createDoctor: build.mutation({
			query: (data) => ({
				url: "/user/create-doctor",
				method: "POST",
				contentType: "multipart/form-data",
				data,
			}),
			invalidatesTags: [tagTypes.doctor],
		}),
		getAllDoctors: build.query({
			query: () => ({
				url: "/doctor",
				method: "GET",
			}),
			providesTags: [tagTypes.doctor],
		}),
		deleteDoctor: build.mutation({
			query: (id) => ({
				url: `/doctor/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [tagTypes.doctor],
		}),
	}),
	overrideExisting: false,
})

export const {
	useCreateDoctorMutation,
	useGetAllDoctorsQuery,
	useDeleteDoctorMutation,
} = doctorApi
