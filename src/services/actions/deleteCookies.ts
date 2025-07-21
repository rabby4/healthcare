"use server"
import { cookies } from "next/headers"

export const deleteCookies = async (keys: string[]) => {
	const cookie = await cookies()

	keys.forEach((key) => {
		cookie.delete(key)
	})
}
