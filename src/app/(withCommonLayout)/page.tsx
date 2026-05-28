import HeroSection from "@/components/ui/home/heroSection/HeroSection"
import Specialist from "@/components/ui/home/specialist/Specialist"
import HowItWorks from "@/components/ui/home/howItWorks/HowItWorks"
import TopRatedDoctors from "@/components/ui/home/topRatedDoctors/TopRatedDoctors"
import WhyUs from "@/components/ui/home/whyUs/WhyUs"
import Stats from "@/components/ui/home/stats/Stats"
import Testimonials from "@/components/ui/home/testimonials/Testimonials"
import ForDoctors from "@/components/ui/home/forDoctors/ForDoctors"
import Faq from "@/components/ui/home/faq/Faq"
import FinalCta from "@/components/ui/home/finalCta/FinalCta"

const HomePage = () => {
	return (
		<>
			<HeroSection />
			<Specialist />
			<HowItWorks />
			<TopRatedDoctors />
			<WhyUs />
			<Stats />
			<Testimonials />
			<ForDoctors />
			<Faq />
			<FinalCta />
		</>
	)
}

export default HomePage
