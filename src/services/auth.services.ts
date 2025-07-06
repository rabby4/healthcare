import { authKey } from "@/constants/authKey"
import { setToLocalStorage } from "@/utils/setLocalStorage"

export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
	return setToLocalStorage(authKey, accessToken)
}
