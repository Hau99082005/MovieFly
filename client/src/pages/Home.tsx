import Banner from "@/components/Banner"
import FutureSection from "@/components/FutureSection"
import TakeMovies from "@/components/TakeMovies"
import TrailersSection from "@/components/TrailersSection"

const Home = () => {
  return (
    <div className="min-h-screen">
      <Banner/>
      <FutureSection/>
      <TrailersSection/>
      <TakeMovies/>
    </div>
  )
}

export default Home