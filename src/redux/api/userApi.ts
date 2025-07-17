import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const doctorApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getSingleUsr: build.query({
			query: () => ({
				url: "/user/me",
				method: "GET",
			}),
			providesTags: [tagTypes.user],
		}),
	}),
	overrideExisting: false,
})

export const { useGetSingleUsrQuery } = doctorApi
