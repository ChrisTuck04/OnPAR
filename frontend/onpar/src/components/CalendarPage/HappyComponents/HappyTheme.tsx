const HappyTheme = () => {
  return (
    <div className="flex justify-center w-screen h-screen bg-onparBlue relative overflow-hidden">
      <div className="absolute top-[-20vw] left-[-20vw] w-[60vw] h-[60vw] pointer-events-none 
        bg-[radial-gradient(circle,_rgba(250,204,21,0.6)_0%,_transparent_200%)] blur-[80px] animate-pulse z-0">
      </div>

      <img className="absolute top-0 w-50 h-auto" src="/assets/rainbow.png" alt="Rainbow" /> 
      
      <img className="absolute top-[1vh] left-[1vw] animate-spin [animation-duration:5s]" src="/assets/sun.png" alt="Sun" />
      
      <img className="absolute bottom-[5vh] left-[5vw] z-20 w-[4vw] h-auto rotate-[5deg]" src="/assets/sunflower.png" alt="Sunflower" />
      
      <img className="absolute bottom-[5vh] right-[20vw] z-20 w-[5vw] h-auto" src="/assets/sunflower.png" alt="Sunflower" />
      
      <img className="absolute bottom-[8.5vh] right-[3vw] z-20 w-[4.5vw] h-auto rotate-[-10deg]" src="/assets/sunflower.png" alt="Sunflower" />
      
      <img className="absolute bottom-[15.5vh] right-[14vw] z-20 w-[3vw] h-auto rotate-[-20deg]" src="/assets/sunflower.png" alt="Sunflower" />
      
      <img className="absolute top-[21vh] left-[1vw] w-[4.5vw] h-auto z-20" src="/assets/leftBirds.png" alt="Birds" />
      
      <img className="absolute top-[18.5vh] left-[6.5vw] w-[4.5vw] h-auto z-20" src="/assets/rightBirds.png" alt="Birds" />
      
    </div>
  )
}

export default HappyTheme
