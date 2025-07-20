interface Props{
    Happy: (e: React.MouseEvent<HTMLButtonElement>) => void
    Pleasant: (e: React.MouseEvent<HTMLButtonElement>) => void
    Sad: (e: React.MouseEvent<HTMLButtonElement>) => void
    Angry: (e: React.MouseEvent<HTMLButtonElement>) => void
		toggleJournalView : (e : React.MouseEvent<HTMLButtonElement>) => void
		journalValid : boolean
		changeEmotionField : (data : string) => void
}

const EmotionCard = ({Happy, Pleasant, Sad, Angry, toggleJournalView, changeEmotionField}: Props) => {
    return (
			<div className="flex items-center justify-center border-[10px] border-onparOrange bg-onparLightYellow w-[700px] h-[400px] rounded-[40px] font-fredoka">
				<p className="absolute top-[80px] text-[30px]" style={{WebkitTextStroke: "1px #FFAA00"}}>
						How are We Feeling Today?
				</p>

				<div className="absolute grid grid-cols-4 ">
						
					<EmotionButton
					image="/assets/HappyEmotion.png"
					emotion="Happy"
					color="text-orange-500"
					ThemeChange={Happy}
					openJournal={toggleJournalView}
					changeEmotionField={changeEmotionField}/>

					<EmotionButton
					image="/assets/PleasantEmotion.png"
					emotion="Pleasant"
					color="text-green-600"
					ThemeChange={Pleasant}
					openJournal={toggleJournalView}
					changeEmotionField={changeEmotionField}/>

					<EmotionButton
					image="/assets/SadEmotion.png"
					emotion="Sad"
					color="text-blue-600"
					ThemeChange={Sad}
					openJournal={toggleJournalView}
					changeEmotionField={changeEmotionField}/>

					<EmotionButton
					image="/assets/AngryEmotion.png"
					emotion="Angry"
					color="text-red-600"
					ThemeChange={Angry}
					openJournal={toggleJournalView}
					changeEmotionField={changeEmotionField}/> 
						
				</div>
			</div>
    )
}

interface ButtonProps{
  image: string
  emotion: string
  color: string
  ThemeChange? : (e: React.MouseEvent<HTMLButtonElement>) => void
  openJournal : (e : React.MouseEvent<HTMLButtonElement>) => void
	changeEmotionField : (data : string) => void
}

const EmotionButton = ({image, emotion, color, ThemeChange, openJournal, changeEmotionField}: ButtonProps) => {

	const setEmotionFieldString = () => {
		if(emotion === "Happy") 
			changeEmotionField("Happy")
		else if(emotion === "Sad")
			changeEmotionField("Sad")
		else if(emotion === "Pleasant")
			changeEmotionField("Pleasant")
		else if(emotion === "Angry")
			changeEmotionField("Angry")

		console.log("emotionField changed by button!")
	}

  return (
    <div className="flex items-center justify-center font-fredoka">
      <button
			className="relative top-[10px] m-3 p-7 rounded-[70px] h-[130px] border-[6px] border-onparOrange bg-black"
			onClick={(e) => {
				setEmotionFieldString()
				openJournal(e)
				ThemeChange!(e)
				}}>
        <img className="relative bottom-[6px] w-[80px] h-[80px]" src={image} alt="image" />
      </button>

      <p className={`absolute ${color} top-[180px] text-2xl`}>
        {emotion}
      </p>

    </div>
  )
}

export default EmotionCard
