import { Box, Button, Container, Stack, Typography } from "@mui/material"

const FinalCta = () => {
	return (
		<Box component="section" sx={{ py: { xs: 9, md: 15 }, bgcolor: "primary.main", color: "#fff" }}>
			<Container>
				<Box sx={{ textAlign: "center" }}>
					<Typography
						variant="h2"
						sx={{ color: "#fff", fontSize: { xs: 38, md: 60 }, maxWidth: 820, mx: "auto" }}
					>
						The next time you need a doctor,
						<br />
						<Box component="span" sx={{ fontWeight: 700 }}>
							don&apos;t leave home.
						</Box>
					</Typography>
					<Typography sx={{ mt: 3, mx: "auto", mb: 4.5, maxWidth: 540, color: "rgba(255,255,255,0.8)", fontSize: 17 }}>
						Sign up free. Browse 240+ specialists. Book your first consultation in
						under two minutes.
					</Typography>
					<Stack direction="row" sx={{ gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
						<Button
							href="/register"
							sx={{ bgcolor: "#fff", color: "primary.main", px: 3.5, py: 1.75, fontSize: 15, "&:hover": { bgcolor: "#f1f5f5" } }}
						>
							Create your account →
						</Button>
						<Button
							href="/doctors"
							variant="outlined"
							sx={{ px: 3.5, py: 1.75, fontSize: 15, color: "#fff", borderColor: "rgba(255,255,255,0.4)", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" } }}
						>
							Browse doctors
						</Button>
					</Stack>
				</Box>
			</Container>
		</Box>
	)
}

export default FinalCta
