import Lottie from "lottie-react"
import rain from "../../assets/animations/raining.json"

const Rain = () => {
  return (
    <div className="pointer-events-none opacity-80">
      <Lottie animationData={rain} loop={true} autoplay={true} className="w-full h-full scale-y-[2]"/>
    </div>
  )
}

export default Rain

