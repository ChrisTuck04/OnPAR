import EmotionButton from "./EmotionButton"

interface Props{
    CardVisibility: (e: React.MouseEvent<HTMLButtonElement>) => void
    Happy: (e: React.MouseEvent<HTMLButtonElement>) => void
    Pleasant: (e: React.MouseEvent<HTMLButtonElement>) => void
    Sad: (e: React.MouseEvent<HTMLButtonElement>) => void
    Angry: (e: React.MouseEvent<HTMLButtonElement>) => void
}


const EmotionCard = ({Happy, Pleasant, Sad, Angry}: Props) => {

    return (
    <div className="flex items-center justify-center border-[10px] border-onparOrange bg-onparLightYellow w-[700px] h-[400px] rounded-[40px] font-fredoka">
        <p className="absolute top-[80px] text-[30px]" style={{WebkitTextStroke: "1px #FFAA00"}}>
            How are We Feeling Today?
        </p>

        <div className="absolute grid grid-cols-4 ">
            
            <EmotionButton image="/assets/HappyEmotion.png" emotion="Happy" color="text-orange-500" ThemeChange={Happy}/>
            <EmotionButton image="/assets/PleasantEmotion.png" emotion="Pleasant" color="text-green-600" ThemeChange={Pleasant}/>
            <EmotionButton image="/assets/SadEmotion.png" emotion="Sad" color="text-blue-600" ThemeChange={Sad}/>
            <EmotionButton image="/assets/AngryEmotion.png" emotion="Angry" color="text-red-600" ThemeChange={Angry}/> 
            
        </div>
    </div>
    )
}

export default EmotionCard
