import { getUserInfo, removeUser } from "@/services/auth.services"
import { Button } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"

const AuthButton = () => {
	const userInfo = getUserInfo()
	const router = useRouter()
	const handleLogOut = () => {
		removeUser()
		router.refresh()
	}
	return (
		<>
			{userInfo?.id ? (
				<Button onClick={handleLogOut} color="error">
					Log Out
				</Button>
			) : (
				<Button component={Link} href="/login">
					Login
				</Button>
			)}
		</>
	)
}

export default AuthButton
