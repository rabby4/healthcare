import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const metaApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getMeta: build.query({
			query: () => ({
				url: "/meta",
				method: "GET",
			}),
			// Response is unwrapped by the axios interceptor, so the hook's
			// `data` is the role-branched stats object directly.
			providesTags: [
				tagTypes.admin,
				tagTypes.doctor,
				tagTypes.patient,
				tagTypes.appointment,
				tagTypes.payment,
			],
		}),
		// Appointment counts grouped by year / month / week for the
		// "Appointments · by ___" chart dropdown. Hook `data` is { unit, trend }.
		getAppointmentTrend: build.query({
			query: (arg: { unit?: "year" | "month" | "week" } = {}) => ({
				url: "/meta/appointment-trend",
				method: "GET",
				params: { unit: arg?.unit ?? "month" },
			}),
			providesTags: [tagTypes.appointment],
		}),
	}),
	overrideExisting: false,
})

export const { useGetMetaQuery, useGetAppointmentTrendQuery } = metaApi
