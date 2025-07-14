
interface Props{
  image: string
  emotion: string
  color: string
  ThemeChange : (e: React.MouseEvent<HTMLButtonElement>) => void
}

const EmotionButton = ({image, emotion, color, ThemeChange}: Props) => {
  return (
    <div className="flex items-center justify-center font-fredoka">
      <button className="relative top-[10px] m-3 p-7 rounded-[70px] w-[35] h-[130px] border-[6px] border-onparOrange bg-black" onClick={ThemeChange}>
        <img className="relative bottom-[6px] w-[80px] h-[80px]" src={image} alt="image" />
      </button>

      <p className={`absolute ${color} top-[180px] text-2xl`}>
        {emotion}
      </p>

    </div>
  )
}

export default EmotionButton
