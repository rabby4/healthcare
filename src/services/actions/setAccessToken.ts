"use server"
import { authKey } from "@/constants/authKey"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/* eslint-disable @typescript-eslint/no-explicit-any */
const setAccessToken = async (token: string, options?: any) => {
	const cookie = await cookies()
	cookie.set(authKey, token)
	if (options && options.redirect) {
		redirect(options.redirect)
	}
}

export default setAccessToken
