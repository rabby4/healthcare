/* eslint-disable @typescript-eslint/no-explicit-any */
import { authKey } from "@/constants/authKey"
import { decodedToken } from "@/utils/jwt"
import {
	getFromLocalStorage,
	removeFromLocalStorage,
	setToLocalStorage,
} from "@/utils/setLocalStorage"

export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
	return setToLocalStorage(authKey, accessToken)
}

export const getUserInfo = () => {
	const authToken = getFromLocalStorage(authKey)
	if (authToken) {
		const decodedData: any = decodedToken(authToken)
		return {
			...decodedData,
			role: decodedData.role.toLowerCase(),
		}
	}
}

export const isLoggedIn = () => {
	const authToken = getFromLocalStorage(authKey)
	if (authToken) return !!authToken
}

export const removeUser = () => {
	return removeFromLocalStorage(authKey)
}
