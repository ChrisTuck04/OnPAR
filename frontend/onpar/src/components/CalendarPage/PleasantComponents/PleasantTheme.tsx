const PleasantTheme = () => {
  return (
    <div className="relative flex justify-center w-screen h-screen bg-onparBlue">
      <img className="absolute top-[25px] w-[800px]" src="/assets/cloudGroup.png" alt="" />
      <img className="absolute top-4 left-4 animate-spin [animation-duration:20s]" src="/assets/sun.png" alt="" />
      <img className="absolute bottom-[155px] right-[310px] h-[200px] w-[200px] z-[10] rotate-[-7deg]" src="/assets/GolfCart.png" alt="" />
    </div>
  )
}

export default PleasantTheme
