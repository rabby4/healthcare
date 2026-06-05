/* eslint-disable @typescript-eslint/no-explicit-any */
import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const reviewApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		// Patient leaves a review for one of their COMPLETED appointments.
		// Backend does NOT enforce COMPLETED (gate client-side) and surfaces a
		// duplicate (one review per appointment) as a raw Prisma P2002 error.
		createReview: build.mutation({
			query: (data: { appointmentId: string; rating: number; comment?: string }) => ({
				url: "/review",
				method: "POST",
				data,
			}),
			invalidatesTags: [tagTypes.review, tagTypes.appointment, tagTypes.doctor],
		}),
	}),
	overrideExisting: false,
})

export const { useCreateReviewMutation } = reviewApi
