import YellowButton from "../components/General/YellowButton"
import Title from "../components/HomePageComponents/Title"
import GolfBackground from "../components/General/GolfBackground"
import Clouds from "../components/PleasantComponents/Clouds"
import Sun from "../components/PleasantComponents/Sun"

const HomePage = () => {

  return (
    <div className="relative min-h-screen flex items-center justify-center">
        <div className="fixed bottom-0  w-screen ">
          <GolfBackground/>
        </div>

        <div className="fixed top-[25px] w-[800px]">
          <Clouds/>
        </div>

        <div className="fixed top-4 left-4">
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