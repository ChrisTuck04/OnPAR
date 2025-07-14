const HappyTheme = () => {
  return (
    <div className="flex justify-center w-screen h-screen bg-onparBlue">
      <div className="absolute top-[-20vw] left-[-20vw] w-[60vw] h-[60vw] pointer-events-none 
        bg-[radial-gradient(circle,_rgba(250,204,21,0.6)_0%,_transparent_200%)] blur-[80px] animate-pulse z-0">
      </div>

      <img className="absolute bottom-[1px]" src="/assets/rainbow.png"/>
      <img className="absolute top-4 left-4 animate-spin [animation-duration:5s]" src="/assets/sun.png" alt="" />
      <img className="absolute bottom-[105px] z-20 w-[70px] h-[70px] rotate-[5deg]" src="/assets/sunflower.png" />
      <img className="absolute bottom-[50px] right-[380px] z-20 w-[100px] h-[100px]" src="/assets/sunflower.png" />
      <img className="absolute bottom-[90px] right-[50px] z-20 w-[80px] h-[80px] rotate-[-10deg]" src="/assets/sunflower.png" />
      <img className="absolute bottom-[198px] right-[260px] z-20 w-[50px] h-[50px] rotate-[-20deg]" src="/assets/sunflower.png" />
      <img className="absolute top-[225px] left-[16px] w-[80px] h-[80px] z-20" src="/assets/leftBirds.png" />
      <img className="absolute top-[200px] left-[120px] w-[80px] h-[80px] z-20" src="/assets/rightBirds.png" />
      
    </div>
  )
}

export default HappyTheme
