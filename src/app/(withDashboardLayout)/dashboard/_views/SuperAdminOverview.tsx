"use client"

import { Box, Button, Stack, Typography } from "@mui/material"
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined"
import Link from "next/link"

import AvatarGradient from "@/components/dashboard/shell/AvatarGradient"
import PageHead from "@/components/dashboard/shell/PageHead"
import Stat from "@/components/dashboard/shell/Stat"
import StatusBadge from "@/components/dashboard/shell/StatusBadge"
import { AvatarVariant, MONO, SHELL } from "@/components/dashboard/shell/tokens"

const adminTeam: Array<{
	initials: string
	variant: AvatarVariant
	name: string
	email: string
	role: "super" | "admin"
	lastActive: string
	status: "active" | "invited"
}> = [
	{
		initials: "SA",
		variant: "purple",
		name: "Kamrul Hasan",
		email: "k.hasan@medicare.app",
		role: "super",
		lastActive: "Now",
		status: "active",
	},
	{
		initials: "AD",
		variant: "blue",
		name: "Anika Das",
		email: "a.das@medicare.app",
		role: "admin",
		lastActive: "12 min ago",
		status: "active",
	},
	{
		initials: "MR",
		variant: "blue",
		name: "Masud Rana",
		email: "m.rana@medicare.app",
		role: "admin",
		lastActive: "2 hours ago",
		status: "active",
	},
	{
		initials: "JK",
		variant: "orange",
		name: "Jamila Karim",
		email: "j.karim@medicare.app",
		role: "admin",
		lastActive: "—",
		status: "invited",
	},
]

const systemHealth: Array<{ name: string; meta: string; ok: boolean; warn?: boolean }> = [
	{ name: "SSLCommerz · payments", meta: "99.98% uptime", ok: true },
	{ name: "Agora · video calls", meta: "99.95% uptime", ok: true },
	{ name: "Cloudinary · uploads", meta: "100% uptime", ok: true },
	{ name: "Email · password reset", meta: "degraded · 2.1s avg", ok: false, warn: true },
	{ name: "Auto-cancel cron", meta: "last run 2 min ago", ok: true },
]

const audit: Array<{
	initials: string
	variant: AvatarVariant
	you?: boolean
	body: React.ReactNode
	time: string
}> = [
	{
		initials: "AD",
		variant: "blue",
		body: (
			<>
				<strong>Anika Das</strong> verified doctor <strong>Dr. Faisal Ahmed</strong>
			</>
		),
		time: "12 min ago",
	},
	{
		initials: "MR",
		variant: "blue",
		body: (
			<>
				<strong>Masud Rana</strong> removed a flagged review on{" "}
				<strong>Dr. Rumana Nasir</strong>
			</>
		),
		time: "1 hour ago",
	},
	{
		initials: "SA",
		variant: "purple",
		you: true,
		body: (
			<>
				<strong>You</strong> invited a new admin <strong>Jamila Karim</strong>
			</>
		),
		time: "3 hours ago",
	},
	{
		initials: "AD",
		variant: "blue",
		body: (
			<>
				<strong>Anika Das</strong> blocked patient account{" "}
				<strong>sumon.p@email.com</strong>
			</>
		),
		time: "Yesterday",
	},
]

const SuperAdminOverview = () => {
	return (
		<>
			<PageHead
				title="Super admin control"
				subtitle="Full platform oversight plus admin team management."
				actions={
					<>
						<Button
							component={Link}
							href="/dashboard/super_admin/admins"
							variant="outlined"
							sx={{
								bgcolor: "#fff",
								color: "text.primary",
								borderColor: "divider",
								"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
							}}
						>
							Manage admins
						</Button>
						<Button component={Link} href="/dashboard/super_admin/admins">
							+ Invite admin
						</Button>
					</>
				}
			/>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" },
					gap: 2,
					mb: 3,
				}}
			>
				<Stat
					label="Admins"
					value="6"
					icon={<ShieldOutlinedIcon sx={{ fontSize: 14 }} />}
					iconBg={SHELL.purpleTint}
					iconColor={SHELL.purple}
					delta=""
					deltaLabel="5 active, 1 invited"
					deltaTrend="neutral"
				/>
				<Stat label="Doctors" value="240" delta="↑ 8" deltaLabel="this month" />
				<Stat label="Patients" value="18,402" delta="↑ 6.4%" />
				<Stat
					label="Revenue · May"
					value={
						<>
							৳ <Box component="span" sx={{ fontVariantNumeric: "tabular-nums" }}>4.2M</Box>
						</>
					}
					delta="↑ 9%"
				/>
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
					gap: 3,
				}}
			>
				{/* Admin team */}
				<Box
					sx={{
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "22px",
						overflow: "hidden",
					}}
				>
					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							gap: 1.5,
							p: "16px 20px",
							borderBottom: "1px solid",
							borderColor: "divider",
						}}
					>
						<Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
							Admin team
						</Typography>
						<Box
							component={Link}
							href="/dashboard/super_admin/admins"
							sx={{
								ml: "auto",
								fontFamily: MONO,
								fontSize: 12,
								fontWeight: 600,
								letterSpacing: "0.04em",
								textTransform: "uppercase",
								color: "primary.main",
								textDecoration: "none",
								"&:hover": { textDecoration: "underline" },
							}}
						>
							Manage →
						</Box>
					</Stack>
					<Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
						<Box component="thead">
							<Box component="tr">
								{["Admin", "Role", "Last active", "Status"].map((h) => (
									<Box
										key={h}
										component="th"
										sx={{
											textAlign: "left",
											fontSize: 11,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											color: "text.secondary",
											fontWeight: 500,
											p: "12px 20px",
											bgcolor: SHELL.bgSoft,
											borderBottom: "1px solid",
											borderColor: "divider",
										}}
									>
										{h}
									</Box>
								))}
							</Box>
						</Box>
						<Box component="tbody">
							{adminTeam.map((m, i) => (
								<Box
									key={m.email}
									component="tr"
									sx={{
										"&:hover td": { bgcolor: SHELL.bgSoft },
									}}
								>
									<Box
										component="td"
										sx={{
											p: "16px 20px",
											borderBottom:
												i === adminTeam.length - 1
													? "none"
													: `1px solid ${SHELL.dividerSoft}`,
										}}
									>
										<Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
											<AvatarGradient
												initials={m.initials}
												variant={m.variant}
												size={36}
											/>
											<Box>
												<Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
													{m.name}
												</Typography>
												<Typography sx={{ fontSize: 12, color: "text.secondary", mt: "1px" }}>
													{m.email}
												</Typography>
											</Box>
										</Stack>
									</Box>
									<Box
										component="td"
										sx={{
											p: "16px 20px",
											borderBottom:
												i === adminTeam.length - 1
													? "none"
													: `1px solid ${SHELL.dividerSoft}`,
										}}
									>
										<StatusBadge
											kind={m.role === "super" ? "purple" : "teal"}
											label={m.role === "super" ? "Super Admin" : "Admin"}
											withDot={false}
										/>
									</Box>
									<Box
										component="td"
										sx={{
											p: "16px 20px",
											fontSize: 13,
											color: "text.secondary",
											borderBottom:
												i === adminTeam.length - 1
													? "none"
													: `1px solid ${SHELL.dividerSoft}`,
										}}
									>
										{m.lastActive}
									</Box>
									<Box
										component="td"
										sx={{
											p: "16px 20px",
											borderBottom:
												i === adminTeam.length - 1
													? "none"
													: `1px solid ${SHELL.dividerSoft}`,
										}}
									>
										<StatusBadge kind={m.status} />
									</Box>
								</Box>
							))}
						</Box>
					</Box>
				</Box>

				{/* System health */}
				<Box
					sx={{
						bgcolor: "#fff",
						border: "1px solid",
						borderColor: "divider",
						borderRadius: "22px",
						p: 3,
					}}
				>
					<Stack
						direction="row"
						sx={{ alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 2.25 }}
					>
						<Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
							System health
						</Typography>
						<StatusBadge kind="completed" label="All systems normal" />
					</Stack>
					<Stack sx={{ flexDirection: "column" }}>
						{systemHealth.map((s, i) => (
							<Stack
								key={s.name}
								direction="row"
								sx={{
									alignItems: "center",
									justifyContent: "space-between",
									py: 1.75,
									borderBottom:
										i === systemHealth.length - 1
											? "none"
											: "1px solid",
									borderColor: "divider",
								}}
							>
								<Stack direction="row" sx={{ alignItems: "center", gap: 1.25, fontSize: 13 }}>
									<Box
										component="span"
										sx={{
											width: 8,
											height: 8,
											borderRadius: "50%",
											bgcolor: s.warn ? SHELL.warning : SHELL.success,
										}}
									/>
									<Box component="span">{s.name}</Box>
								</Stack>
								<Typography
									sx={{
										fontFamily: MONO,
										fontSize: 12,
										color: s.warn ? SHELL.warning : "text.secondary",
									}}
								>
									{s.meta}
								</Typography>
							</Stack>
						))}
					</Stack>
					<Stack
						direction="row"
						sx={{ gap: 1.25, mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
					>
						<Button
							variant="outlined"
							size="small"
							sx={{
								bgcolor: "#fff",
								color: "text.primary",
								borderColor: "divider",
								fontSize: 12,
								px: 1.5,
								py: 0.75,
								"&:hover": { borderColor: "text.primary", bgcolor: SHELL.bgSoft },
							}}
						>
							View logs
						</Button>
						<Button
							size="small"
							sx={{
								bgcolor: SHELL.bgSoft,
								color: "text.primary",
								fontSize: 12,
								px: 1.5,
								py: 0.75,
								"&:hover": { bgcolor: SHELL.bgSoft2 },
							}}
						>
							Run cron now
						</Button>
					</Stack>
				</Box>
			</Box>

			{/* Audit log */}
			<Box
				sx={{
					mt: 3,
					bgcolor: "#fff",
					border: "1px solid",
					borderColor: "divider",
					borderRadius: "22px",
					p: 3,
				}}
			>
				<Stack
					direction="row"
					sx={{ alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 2.25 }}
				>
					<Typography sx={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
						Recent admin activity
					</Typography>
					<Box
						component={Link}
						href="#"
						sx={{
							fontFamily: MONO,
							fontSize: 12,
							fontWeight: 600,
							letterSpacing: "0.04em",
							textTransform: "uppercase",
							color: "primary.main",
							textDecoration: "none",
							"&:hover": { textDecoration: "underline" },
						}}
					>
						Full audit log →
					</Box>
				</Stack>
				<Stack>
					{audit.map((a, i) => (
						<Stack
							key={i}
							direction="row"
							sx={{
								alignItems: "center",
								gap: 1.75,
								py: 1.5,
								borderBottom:
									i === audit.length - 1 ? "none" : `1px solid ${SHELL.dividerSoft}`,
							}}
						>
							<AvatarGradient initials={a.initials} variant={a.variant} size={30} />
							<Typography sx={{ flex: 1, fontSize: 13 }}>{a.body}</Typography>
							<Typography
								sx={{ fontFamily: MONO, fontSize: 11, color: "text.secondary", whiteSpace: "nowrap" }}
							>
								{a.time}
							</Typography>
						</Stack>
					))}
				</Stack>
			</Box>
		</>
	)
}

export default SuperAdminOverview
