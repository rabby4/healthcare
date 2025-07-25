import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const specialtiesApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createSpecialty: build.mutation({
			query: (data) => ({
				url: "/specialties",
				method: "POST",
				contentType: "multipart/form-data",
				data,
			}),
			invalidatesTags: [tagTypes.doctor],
		}),
		getAllSpecialties: build.query({
			query: () => ({
				url: "/specialties",
				method: "GET",
			}),
			providesTags: [tagTypes.doctor],
		}),
		deleteSpecialty: build.mutation({
			query: (id) => ({
				url: `/specialties/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [tagTypes.doctor],
		}),
	}),
	overrideExisting: false,
})

export const {
	useCreateSpecialtyMutation,
	useGetAllSpecialtiesQuery,
	useDeleteSpecialtyMutation,
} = specialtiesApi
