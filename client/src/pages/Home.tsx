import Banner from "@/components/Banner"
import FutureSection from "@/components/FutureSection"
import TrailersSection from "@/components/TrailersSection"

const Home = () => {
  return (
    <div className="min-h-screen">
      <Banner/>
      <FutureSection/>
      <TrailersSection/>
    </div>
  )
}

export default Home