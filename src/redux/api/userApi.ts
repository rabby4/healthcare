/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "@/types"
import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const userApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getSingleUsr: build.query({
			query: () => ({
				url: "/user/me",
				method: "GET",
			}),
			providesTags: [tagTypes.user],
		}),
		getAllUsers: build.query({
			query: (arg: Record<string, any>) => ({
				url: "/user",
				method: "GET",
				params: arg,
			}),
			transformResponse: (response: any[], meta: IMeta) => {
				return {
					users: response,
					meta,
				}
			},
			providesTags: [tagTypes.user],
		}),
		changeUserStatus: build.mutation({
			query: (data: { id: string; body: { status: string } }) => ({
				url: `/user/${data.id}/status`,
				method: "PATCH",
				data: data.body,
			}),
			invalidatesTags: [tagTypes.user, tagTypes.admin, tagTypes.doctor],
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetSingleUsrQuery,
	useGetAllUsersQuery,
	useChangeUserStatusMutation,
} = userApi
