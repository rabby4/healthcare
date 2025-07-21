/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type Role = keyof typeof roleBasedPrivateRoutes

const AuthRoutes = ["/login", "/register"]
const commonPrivateRoutes = ["/dashboard", "/dashboard/change-password"]
const roleBasedPrivateRoutes = {
	PATIENT: [/^\/dashboard\/patient/],
	DOCTOR: [/^\/dashboard\/doctor/],
	ADMIN: [/^\/dashboard\/admin/],
	SUPER_ADMIN: [/^\/dashboard\/super-admin/],
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const cookie = await cookies()
	const accessToken = cookie.get("accessToken")?.value

	if (!accessToken) {
		if (AuthRoutes.includes(pathname)) {
			return NextResponse.next()
		} else {
			return NextResponse.redirect(new URL("/login", request.url))
		}
	}

	if (accessToken && commonPrivateRoutes.includes(pathname)) {
		return NextResponse.next()
	}

	let decoded = null
	if (accessToken) {
		decoded = jwtDecode(accessToken) as any
	}

	const role = decoded?.role

	// if (role === "ADMIN" && pathname.startsWith("/dashboard/admin")) {
	// 	return NextResponse.next()
	// }
	// if (role === "SUPER_ADMIN" && pathname.startsWith("/dashboard/super_admin")) {
	// 	return NextResponse.next()
	// }
	// if (role === "DOCTOR" && pathname.startsWith("/dashboard/doctor")) {
	// 	return NextResponse.next()
	// }
	// if (role === "PATIENT" && pathname.startsWith("/dashboard/patient")) {
	// 	return NextResponse.next()
	// }

	if (role && roleBasedPrivateRoutes[role as Role]) {
		const routes = roleBasedPrivateRoutes[role as Role]
		if (routes.some((route) => pathname.match(route))) {
			return NextResponse.next()
		}
	}

	return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
	matcher: ["/login", "/register", "/dashboard/:page*"],
}
