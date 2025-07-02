import Rain from "./Rain"

const SadTheme = () => {
  return (
  
    <div className="relative w-screen h-screen bg-onparSadBlue overflow-hidden">

      <div className="absolute flex justify-center top-[30px] bottom-0 left-0 right-0 z-[10]">
        <Rain/>
      </div>

      <img className="absolute top-[25px] w-[800px] z-[0] left-1/2 -translate-x-1/2" src="/assets/SadClouds.png" alt="" />
    </div>
    
  )
}

export default SadTheme
