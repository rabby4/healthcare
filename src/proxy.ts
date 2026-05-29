/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type Role = keyof typeof roleBasedPrivateRoutes

const AuthRoutes = ["/login", "/register"]
// Routes any logged-in user can access (exact match).
const commonPrivateRoutes = [
	"/dashboard",
	"/dashboard/change-password",
]
// Path prefixes anyone can browse (public — both logged-in and out).
const publicPrefixes = ["/doctors"]
// Resource routes both admin tiers can manage.
const adminTierRoutes = [
	/^\/dashboard\/doctors(\/|$)/,
	/^\/dashboard\/specialties(\/|$)/,
	/^\/dashboard\/schedules(\/|$)/,
	/^\/dashboard\/appointments(\/|$)/,
	/^\/dashboard\/reviews(\/|$)/,
	/^\/dashboard\/users(\/|$)/,
]
const roleBasedPrivateRoutes = {
	PATIENT: [/^\/dashboard\/patient(\/|$)/],
	DOCTOR: [/^\/dashboard\/doctor(\/|$)/],
	ADMIN: adminTierRoutes,
	SUPER_ADMIN: [/^\/dashboard\/admins(\/|$)/, ...adminTierRoutes],
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	const cookie = await cookies()
	const accessToken = cookie.get("accessToken")?.value

	let decodedData: any = null
	if (accessToken) {
		try {
			decodedData = jwtDecode(accessToken)
			if (decodedData?.exp && decodedData.exp * 1000 < Date.now()) {
				decodedData = null
			}
		} catch {
			decodedData = null
		}
	}

	// /login and /register are always reachable. If the cookie is stale,
	// clear it so the user can log in again cleanly.
	if (AuthRoutes.includes(pathname)) {
		const res = NextResponse.next()
		if (accessToken && !decodedData) res.cookies.delete("accessToken")
		return res
	}

	// Public prefixes (e.g. /doctors) — always allowed.
	if (publicPrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
		return NextResponse.next()
	}

	// Not authenticated (no token, invalid token, or expired token)
	if (!decodedData) {
		return NextResponse.redirect(new URL("/login", request.url))
	}

	// Shared dashboard routes any logged-in user can access.
	if (commonPrivateRoutes.includes(pathname)) {
		return NextResponse.next()
	}

	const role = decodedData.role
	if (role && roleBasedPrivateRoutes[role as Role]) {
		const routes = roleBasedPrivateRoutes[role as Role]
		if (routes.some((route) => pathname.match(route))) {
			return NextResponse.next()
		}
	}

	// Authenticated but not authorized for this path — bounce to their overview.
	return NextResponse.redirect(new URL("/dashboard", request.url))
}

export const config = {
	matcher: ["/login", "/register", "/dashboard/:page*", "/doctors/:page*"],
}
