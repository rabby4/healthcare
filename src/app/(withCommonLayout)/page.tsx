import HeroSection from "@/components/ui/home/heroSection/HeroSection"
import Specialist from "@/components/ui/home/specialist/Specialist"
import TopRatedDoctors from "@/components/ui/home/topRatedDoctors/TopRatedDoctors"
import React from "react"

const HomePage = () => {
	return (
		<>
			<HeroSection />
			<Specialist />
			<TopRatedDoctors />
		</>
	)
}

export default HomePage
