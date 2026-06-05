import { FieldValues } from "react-hook-form"
import setAccessToken from "./setAccessToken"

export const userLogin = async (data: FieldValues) => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(data),
			credentials: "include",
		}
	)
	const userInfo = await res.json()
	if (userInfo?.data?.accessToken) {
		// Await so the auth cookie is committed before the caller navigates —
		// otherwise the dashboard proxy guard bounces the user back to /login.
		// Navigation itself is the caller's job (client-side), which is more
		// reliable than redirect() inside a server action.
		await setAccessToken(userInfo.data.accessToken)
	}
	return userInfo
}
