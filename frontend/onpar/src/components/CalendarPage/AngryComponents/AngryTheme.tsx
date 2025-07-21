import Rain from "../SadComponents/Rain"

const AngryTheme = () => {
  return (
    <div className="relative w-screen h-screen bg-[#021526] overflow-hidden">
      <div className="absolute flex justify-center top-[30px] bottom-0 left-0 right-0 z-[10]">
        <Rain/>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-55 z-10"></div>
      <img className="absolute bottom-[7.5vh] right-[14vw] z-20 w-[9vw] h-auto rotate-[deg]" src="/assets/fire3.png" alt="Fire" />
      <img className="absolute bottom-[7.5vh] right-[25vw] z-20 w-[6vw] h-auto rotate-[deg]" src="/assets/fire3.png" alt="Fire" />





      <img className="absolute top-[25px] w-[800px] z-[0] left-1/2 -translate-x-1/2" src="/assets/blackClouds.png" alt="" />
    </div>
  )
}

export default AngryTheme
