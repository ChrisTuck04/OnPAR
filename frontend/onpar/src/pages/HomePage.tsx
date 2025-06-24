import YellowButton from "../components/YellowButton"
import Title from "../components/Title"
import GolfBackground from "../components/GolfBackground"
import Clouds from "../components/Clouds"
import Sun from "../components/Sun"

const HomePage = () => {

  return (
    <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute top-[255px] w-screen">
          <GolfBackground/>
        </div>

        <div className="absolute top-[20px] w-[800px]">
          <Clouds/>
        </div>

        <div className="absolute top-4 left-4">
          <Sun/>
        </div>

        <div className="absolute top-[125px]">
          <Title/>
        </div>

        <div className="absolute top-4 right-4">
          <YellowButton to="/login"/>
        </div>
    </div>
  )
}

export default HomePage