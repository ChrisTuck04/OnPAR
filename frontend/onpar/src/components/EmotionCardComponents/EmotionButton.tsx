
interface Props{
  image: string
  emotion: string
  color: string
}

const EmotionButton = ({image, emotion, color}: Props) => {
  return (
    <div className="flex items-center justify-center font-fredoka">
      <button className="relative top-[20px] m-3 p-7 bg-onparBlue rounded-[70px] w-[40] h-[130px]">
        <img className="w-[80px] h-[80px]" src={image} alt="image" />
      </button>

      <p className={`absolute ${color} top-[300px] text-2xl`}>
        {emotion}
      </p>

    </div>
  )
}

export default EmotionButton
