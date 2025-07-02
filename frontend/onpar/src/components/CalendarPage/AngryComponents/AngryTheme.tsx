import Rain from "../SadComponents/Rain"

const AngryTheme = () => {
  return (
    <div className="relative w-screen h-screen bg-[#021526] overflow-hidden">
      <div className="absolute flex justify-center top-[30px] bottom-0 left-0 right-0 z-[10]">
        <Rain/>
      </div>

      <img className="absolute top-[25px] w-[800px] z-[0] left-1/2 -translate-x-1/2" src="/assets/blackClouds.png" alt="" />
    </div>
  )
}

export default AngryTheme
