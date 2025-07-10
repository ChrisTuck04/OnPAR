interface Props {
  name? : string
  emotion : number
}

const DayCalendar = () => {
  return (
    <div className="relative bg-onparLightYellow border-[4px] border-onparOrange w-full h-full rounded-[40px]">
      <DayHeading/>
    </div>
  )
}

const DayHeading = () => {

  const days= ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const left = "<<"
  const right = ">>"

  return (
    <div>
      <div className="relative grid grid-cols-3 text-center font-fredoka text-black top-[8px]" style={{WebkitTextStroke:"1px #FFAA00"}}>
        <button className="text-[25px] py-2">
          {left}
        </button>

        <div className="text-[35px]">
          {days[1]}
        </div>

        <button className="text-[25px] py-2">
          {right}
        </button>
      </div>

      <h1 className="relative w-full border-[2px] border-onparOrange top-[10px]"></h1>

      <div className="relative flex items-center justify-center w-[920px] h-[70px] border-[4px] border-onparOrange left-1/2 -translate-x-1/2 rounded-[40px] top-[15px]">
        <EmotionInnerContainer/>
      </div>

      <h1 className="relative w-full border-[2px] border-onparOrange top-[20px]"></h1>

    </div>
  )
}

const EmotionInnerContainer = () => {

  const emotion = () => {
    
  }

  return (
    <div className="relative flex flex-row items-center justify-center w-full h-[55px] bg-onparLightYellow z-50 gap-1 rounded-[40px]">
      <p className="font-fredoka text-[45px]">We Are Happy Today</p>
      <EmotionIcon emotion={1}/>
    </div>
  )
}

const EmotionIcon = ({name, emotion} : Props) => {

  const EmotionImage = (emotion : number) : string => {
    if(emotion === 1) {
      return "/assets/HappyEmotion.png"
    } else if(emotion === 2) {
      return "/assets/PleasantEmotion.png"
    } else if(emotion === 3) {
      return "/assets/SadEmotion.png"
    } else if(emotion === 4) {
      return "/assets/AngryEmotion.png"
    } else {
      return "error"
    }
  }

  return (
    <div>
      <img className="w-[50px] h-[50px]" src={EmotionImage(emotion)} />
      <p>{name}</p>
    </div>
  )
}
export default DayCalendar
