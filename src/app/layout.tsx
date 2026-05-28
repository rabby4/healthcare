import type { Metadata } from "next"
import { Roboto_Condensed, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import Providers from "@/lib/Providers/Providers"
import { Toaster } from "sonner"

const geistRobotoCondensed = Roboto_Condensed({
	variable: "--font-roboto-condensed",
	subsets: ["latin"],
})

const jetBrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
	title: "Medicare — Care, delivered.",
	description:
		"Book verified specialists online, pay securely, meet over encrypted video, and get a digital prescription.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistRobotoCondensed.variable} ${jetBrainsMono.variable} antialiased`}
			>
				<Providers>
					<AppRouterCacheProvider>
						<>
							<Toaster position="top-center" />
							{children}
						</>
					</AppRouterCacheProvider>
				</Providers>
			</body>
		</html>
	)
}
