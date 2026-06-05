/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta } from "@/types"
import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

export interface IAdmin {
	id: string
	name: string
	email: string
	profilePhoto?: string
	contactNumber: string
	isDeleted: boolean
	createdAt: string
	updatedAt: string
	// Linked user's role — present so the client can badge / hide the super admin.
	user?: { role: "ADMIN" | "SUPER_ADMIN" }
}

const adminApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAllAdmins: build.query({
			query: (arg: Record<string, any>) => ({
				url: "/admin",
				method: "GET",
				params: arg,
			}),
			transformResponse: (response: IAdmin[], meta: IMeta) => {
				return {
					admins: response,
					meta,
				}
			},
			providesTags: [tagTypes.admin],
		}),
		createAdmin: build.mutation({
			query: (data: FormData) => ({
				url: "/user/create-admin",
				method: "POST",
				contentType: "multipart/form-data",
				data,
			}),
			invalidatesTags: [tagTypes.admin, tagTypes.user],
		}),
		updateAdmin: build.mutation({
			query: (data: { id: string; body: Record<string, any> }) => ({
				url: `/admin/${data.id}`,
				method: "PATCH",
				data: data.body,
			}),
			invalidatesTags: [tagTypes.admin],
		}),
		softDeleteAdmin: build.mutation({
			query: (id: string) => ({
				url: `/admin/soft/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [tagTypes.admin, tagTypes.user],
		}),
		deleteAdmin: build.mutation({
			query: (id: string) => ({
				url: `/admin/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [tagTypes.admin, tagTypes.user],
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetAllAdminsQuery,
	useCreateAdminMutation,
	useUpdateAdminMutation,
	useSoftDeleteAdminMutation,
	useDeleteAdminMutation,
} = adminApi
