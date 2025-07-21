const PleasantTheme = () => {
  return (
    <div className="relative flex justify-center w-screen h-screen bg-onparBlue">
      <img className="absolute top-[25px] w-[800px]" src="/assets/cloudGroup.png" alt="" />
      <img className="absolute top-4 left-4 animate-spin [animation-duration:20s]" src="/assets/sun.png" alt="" />
      <img className="absolute bottom-[7.5vh] right-[14vw] z-20 w-[12vw] h-auto rotate-[-7deg]" src="/assets/GolfCart.png" alt="Sunflower" />
    </div>
  )
}

export default PleasantTheme
