import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"

interface Props{
    Happy: (e: React.MouseEvent<HTMLButtonElement>) => void
    Pleasant: (e: React.MouseEvent<HTMLButtonElement>) => void
    Sad: (e: React.MouseEvent<HTMLButtonElement>) => void
    Angry: (e: React.MouseEvent<HTMLButtonElement>) => void
}


const EmotionCard = ({Happy, Pleasant, Sad, Angry}: Props) => {

	const [openJournal, setOpenJournal] = useState(false)

	const toggleJournalVisibility = (e : React.MouseEvent<HTMLButtonElement>) => {
		setOpenJournal((prevOpenJournal) => {
			console.log("toggleJournalVisibility: Toggling from", prevOpenJournal, "to", !prevOpenJournal)
			return !prevOpenJournal
		})
		e.stopPropagation()
	}

    return (
			<div className="flex flex-col items-center justify-center">
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
						openJournal={toggleJournalVisibility}/>

						<EmotionButton
						image="/assets/PleasantEmotion.png"
						emotion="Pleasant"
						color="text-green-600"
						ThemeChange={Pleasant}
						openJournal={toggleJournalVisibility}/>

						<EmotionButton
						image="/assets/SadEmotion.png"
						emotion="Sad"
						color="text-blue-600"
						ThemeChange={Sad}
						openJournal={toggleJournalVisibility}/>

						<EmotionButton
						image="/assets/AngryEmotion.png"
						emotion="Angry"
						color="text-red-600"
						ThemeChange={Angry}
						openJournal={toggleJournalVisibility}/> 
							
					</div>
				</div>

				<AnimatePresence>
					{openJournal && <Journal onCloseJournal={toggleJournalVisibility}/>}
				</AnimatePresence>
			</div>
    )
}

interface ButtonProps{
  image: string
  emotion: string
  color: string
  ThemeChange : (e: React.MouseEvent<HTMLButtonElement>) => void
	openJournal : (e : React.MouseEvent<HTMLButtonElement>) => void
}

const EmotionButton = ({image, emotion, color, ThemeChange, openJournal}: ButtonProps) => {
  return (
    <div className="flex items-center justify-center font-fredoka">
      <button
			className="relative top-[10px] m-3 p-7 rounded-[70px] h-[130px] border-[6px] border-onparOrange bg-black"
			onClick={(e) => {
				openJournal(e)
				ThemeChange(e)
				}}>
        <img className="relative bottom-[6px] w-[80px] h-[80px]" src={image} alt="image" />
      </button>

      <p className={`absolute ${color} top-[180px] text-2xl`}>
        {emotion}
      </p>

    </div>
  )
}

interface JournalProps {
  onCloseJournal: (e : React.MouseEvent<HTMLButtonElement>) => void;
}

const Journal = ({ onCloseJournal }: JournalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
		<motion.div
			initial={{ scaleX: 0 }}
			animate={{ scaleX: 1 }}
			exit={{ scaleX: 0 }}
			transition={{ duration: 0.5, ease: "easeInOut" }}
			className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
		>
			<motion.div
				className="flex w-[700px] h-[400px] bg-white rounded-[40px] shadow-xl origin-left overflow-hidden"
			>
				{/* Left Page */}
				<div className="w-1/2 p-6 border-r-2 border-gray-300 bg-onparLightYellow font-fredoka">
					<input
						type="text"
						placeholder="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-400 focus:outline-none placeholder-gray-500"
					/>
					<textarea
						placeholder="Write your thoughts..."
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="mt-4 w-full h-64 bg-transparent resize-none focus:outline-none text-lg"
					/>
				</div>

				{/* Right Page */}
				<div className="w-1/2 p-6 flex items-start justify-end bg-onparLightYellow">
					<button
						onClick={onCloseJournal}
						className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
					>
						Close
					</button>
				</div>
			</motion.div>
		</motion.div>
  );
}

export default EmotionCard
