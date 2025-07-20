
import GolfBackground from "../components/General/GolfBackground"
import CalendarContainer from "../components/CalendarPage/CalendarComponents/CalendarContainer.tsx";
import EmotionCard from "../components/CalendarPage/EmotionCard/JournalComponents/EmotionCard.tsx"
import HappyTheme from '../components/CalendarPage/HappyComponents/HappyTheme.tsx';
import SadTheme from '../components/CalendarPage/SadComponents/SadTheme.tsx';
import PleasantTheme from '../components/CalendarPage/PleasantComponents/PleasantTheme.tsx';
import AngryTheme from '../components/CalendarPage/AngryComponents/AngryTheme.tsx';
import DropdownMenu from '../components/CalendarPage/DropdownMenuComponents/DropdownMenu.tsx';
import DropdownButton from '../components/CalendarPage/DropdownMenuComponents/DropdownButton.tsx';
import { useState, useEffect, useRef, useCallback  } from 'react';
import {motion, AnimatePresence} from "framer-motion"
// @ts-expect-error axios functions in js
import { getUser } from "../api/auth"
import type { AxiosError } from "axios";
import type { Emotions } from "../types/Emotions"
// @ts-expect-error events interface import
import {createEmotion} from "../api/emotions"


const CalendarPage = () => {
  const [emotionCard, setEmotionCard] = useState(true)
  const [calendar, setCalendar] = useState(false)
  const [happyTheme, setHappyTheme] = useState(false);
  const [sadTheme, setSadTheme] = useState(false);
  const [pleasantTheme, setPleasantTheme] = useState(true);
  const [angryTheme, setAngryTheme] = useState(false);
  const [dropdownMenu, setDropdownMenu] = useState(false)
  const [menuButton, setMenuButton] = useState(false)
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [openJournal, setOpenJournal] = useState<boolean>(false)
  const [curEmotion, setCurEmotion] = useState<string>("")

  const CardVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(emotionCard === true)
      setEmotionCard(false)
    else if(emotionCard == false)
    {
      setEmotionCard(true)
      setDropdownMenu(false)
    }
    setCalendar(false)
    e.stopPropagation()
  }

  const CalendarVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(calendar === true)
    {
      setCalendar(false)
      setMenuButton(true)
    }
    else if(calendar === false && emotionCard === false)
    {
      setCalendar(true)
      setDropdownMenu(false)
    }
    e.stopPropagation()
  }

  const OpenDropdownMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDropdownMenu(true)
    setMenuButton(false)
    e.stopPropagation()
  }

  const CloseDropdownMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDropdownMenu(false)
    setMenuButton(true)
    e.stopPropagation()
  }

  const Happy = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(true)
      setAngryTheme(false)
      setPleasantTheme(false)
      setSadTheme(false)
      setEmotionCard(false)
      setMenuButton(true)
      e.stopPropagation()
  }

  const Sad = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(false)
      setAngryTheme(false)
      setPleasantTheme(false)
      setSadTheme(true)
      setEmotionCard(false)
      setMenuButton(true)
      e.stopPropagation()
  }

  const Pleasant = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(false)
      setAngryTheme(false)
      setPleasantTheme(true)
      setSadTheme(false)
      setEmotionCard(false)
      setMenuButton(true)
      e.stopPropagation()
  }

  const Angry = (e : React.MouseEvent<HTMLButtonElement>) => {
      setHappyTheme(false)
      setAngryTheme(true)
      setPleasantTheme(false)
      setSadTheme(false)
      setEmotionCard(false)
      setMenuButton(true)
      e.stopPropagation()
  }

  const fetchUserName = async () => {
    try {
      const user = await getUser()
      setUserId(user._id)
    } catch (err : unknown) {
      const error = err as AxiosError<{error : string}>
      alert(error.response?.data?.error || "retrieving user first name failed")
    }
  }

  useEffect(() => {
    fetchUserName()
  }, [])

  // Log the state whenever it changes
    useEffect(() => {
    console.log("EmotionCard: openJournal state is now:", openJournal);
    }, [openJournal]);
  
    const toggleJournalVisibility = (e : React.MouseEvent<HTMLButtonElement>) => {
      setOpenJournal((prevOpenJournal) => {
        console.log("toggleJournalVisibility: Toggling from", prevOpenJournal, "to", !prevOpenJournal)
        return !prevOpenJournal
      })
      e.stopPropagation()
    }

    const changeCurrentEmotionField = (data : string) => {
      setCurEmotion(data)
    }

  return (
      <div className="min-h-screen flex items-center justify-center">

        <WelcomeHeader name={userName}/>

        <div className="fixed snap-center z-30">
          {calendar && <CalendarContainer ExitCalendar={CalendarVisibility}/>}
        </div>

        <div className="fixed bottom-0 w-screen z-[5]">
          <GolfBackground/>
        </div>

        <div className="fixed snap-center z-40">
          {emotionCard && 
          <EmotionCard 
          Happy={Happy}
          Pleasant={Pleasant}
          Sad={Sad} 
          Angry={Angry}
          toggleJournalView={toggleJournalVisibility}
          journalValid={openJournal}
          changeEmotionField={changeCurrentEmotionField}/>}
        </div>

        <AnimatePresence>
					{openJournal &&
          <Journal
          onCloseJournal={toggleJournalVisibility}
          currentEmotion={curEmotion}
          userID={userId}
          />}
				</AnimatePresence>

        <div>
          {menuButton && <DropdownButton OpenDropdownMenu={OpenDropdownMenu}/>}
          {dropdownMenu && <DropdownMenu 
          CardVisibility={CardVisibility} 
          CalendarVisibility={CalendarVisibility} 
          ReflectionVisibility={toggleJournalVisibility} 
          FriendsListVisibility={()=> null}
          CloseDropdownMenu={CloseDropdownMenu}/>}
        </div>

        <div>
          {happyTheme && <HappyTheme/>}
          {sadTheme && <SadTheme/>}
          {pleasantTheme && <PleasantTheme/>}
          {angryTheme && <AngryTheme/>}
        </div>  
      </div>
  )
}

/*
const DateTimeHeader = () => {

  const [currTime, setCurrTime] = useState(dayjs())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrTime(dayjs())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed w-full h-full flex flex-col items-center top-[200px] text-[60px] font-fredoka text-white z-[25]"
          style={{WebkitTextStroke: "1px #D2C1B6"}}>
      <p className="flex justify-center items-center w-[800px] h-[100px]">Today is {currTime.format("dddd")}</p>
      <p className="flex justify-center items-center w-[800px] h-[100px]">{currTime.format("MMMM D, YYYY")}</p>
      <p className="flex justify-center items-center w-[600px] h-[100px]">{currTime.format("hh:mm A")}</p>
    </div>
  )
}
*/

interface WelcomeHeaderProps {
  name: string
}

const WelcomeHeader = ({name} : WelcomeHeaderProps) => {
  return (
    <div className="fixed flex flex-col items-center w-full h-full top-[100px] text-white font-fredoka text-[65px] z-[25]"
          style={{WebkitTextStroke: "1px #D2C1B6"}}>
      <p className="flex items-center justify-center w-[800px] h-[100px]">Welcome {name}!</p>
    </div>
  )
}

interface JournalProps {
  onCloseJournal: (e: React.MouseEvent<HTMLButtonElement>) => void;
  currentEmotion : string
  userID : string
}

const Journal = ({ onCloseJournal, currentEmotion, userID }: JournalProps) => {
  const [emotion, setEmotion] = useState<Emotions>({
    title : "",
    emotion : "",
    leftContent : "",
    rightContent : "",
    userId : "",
    sharedEmails : [],
  })

  const [emotionIcon, setEmotionIcon] = useState("")
  const [title, setTitle] = useState("");
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [userId, setUserId] = useState("")
  const [sharedEmails, setSharedEmails] = useState<string[]>([])

  // Refs for the textareas to measure their content height
  const leftTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const rightTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Define the common style for lined paper background
  const linedPaperStyle = {
    backgroundImage: `repeating-linear-gradient(to bottom, #FFAA00 0px, #FFAA00 1px, transparent 1px, transparent 28px)`,
    backgroundSize: "100% 28px",
    backgroundPositionY: "0px", // Lines start one line below the text
  };

  // --- Helper function to handle text area changes and enforce visual limit ---
  const handleTextAreaChange = useCallback((
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const newValue = e.target.value;
    setText(newValue); // Optimistically update the state first
  }, []);

  // --- Effect to enforce visual limit for left textarea ---
  useEffect(() => {
    if (leftTextAreaRef.current) {
      const textarea = leftTextAreaRef.current;
      // We don't need to set height to 'auto' here if we rely on Tailwind's fixed height.
      // The 'scrollHeight' will naturally reflect the content's height.
      
      // If scrollHeight is greater than clientHeight, content overflows
      if (textarea.scrollHeight > textarea.clientHeight) {
        alert("Left page limit reached! Cannot type further.");
        // Revert to the previous content that fit
        setLeftText(prevText => {
          // This is a simple rollback. For more complex cases (e.g., pasting large text),
          // you might need to find the exact fitting substring.
          // For single character input, this effectively prevents the last char.
          return prevText; // `prevText` here is the content *before* the overflowing character was added.
        });
      }
      // No need to set height back to clientHeight here, Tailwind's h-[540px] handles it.
    }
  }, [leftText]); // Rerun this effect when leftText changes

  // --- Effect to enforce visual limit for right textarea ---
  useEffect(() => {
    if (rightTextAreaRef.current) {
      const textarea = rightTextAreaRef.current;
      // We don't need to set height to 'auto' here if we rely on Tailwind's fixed height.
      
      // If scrollHeight is greater than clientHeight, content overflows
      if (textarea.scrollHeight > textarea.clientHeight) {
        alert("Right page limit reached! Cannot type further.");
        setRightText(prevText => {
          return prevText;
        });
      }
      // No need to set height back to clientHeight here, Tailwind's h-[540px] handles it.
    }
  }, [rightText]); // Rerun this effect when rightText changes

  useEffect(() => {
    setEmotionIcon(currentEmotion)
    console.log("emotion icon useEffect ran!")
  }, [currentEmotion])

  useEffect(() => {
    setUserId(userID)
  }, [userID])

  const assignJournalEntryValues = () => {
    if(title === "") {
      alert("Invalid journal entry, title required!")
      return
    } else if(leftText === "" && rightText === "") {
      alert("Invalid, please include a journal entry")
      return
    } else {

      const updatedEmotion : Emotions = {
        ...emotion,
        title : title,
        emotion : emotionIcon,
        leftContent : leftText,
        rightContent : rightText,
        userId : userId,
        sharedEmails : sharedEmails,
      }

      setEmotion(updatedEmotion)
      return updatedEmotion
    }
  }

  const createEmotionObject = async (e : React.MouseEvent<HTMLButtonElement>, currentEmotion : Emotions) => {
    try {

      console.log("creating emotion")
      const response = await createEmotion(currentEmotion)
      console.log("created emotion successfully!", response)

      setEmotion((prevEmotion) => ({
        ...prevEmotion,
        emotion : "",
        leftContent : "",
        rightContent : "",
        sharedEmails : [],
      }))

      onCloseJournal(e)
    } catch(err: unknown) {
      const error = err as AxiosError<{error : string}>;
      console.error("Error creating emotion object:", error.response?.data?.error || "Unknown error occurred.");
      alert(`Failed to create emotion object: ${error.response?.data?.error || "Please try again."}`);
    }
  }

  const emotionCreationWrapper = async (e : React.MouseEvent<HTMLButtonElement>) => {
    const updatedEmotion = assignJournalEntryValues()
    if(!updatedEmotion) return
    await createEmotionObject(e, updatedEmotion)
  }

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <motion.div className="flex w-[1000px] h-[700px] bg-onparOrange rounded-[40px] shadow-xl origin-left overflow-hidden">
        {/* Left Page */}
        <div className="w-1/2 p-6 border-4 border-onparOrange bg-onparLightYellow font-fredoka rounded-bl-[40px] rounded-tl-[40px] relative flex flex-col">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold bg-transparent border-b-2 border-black focus:outline-none placeholder-black pb-2"
            style={{ WebkitTextStroke: "0px" }}
          />
          <textarea
            ref={leftTextAreaRef} // Attach ref
            placeholder="Write your thoughts..."
            value={leftText}
            onChange={(e) => handleTextAreaChange(e, setLeftText)}
            // Set overflowY to hidden to prevent scrolling
            className="mt-2 w-full h-[532px] bg-transparent resize-none focus:outline-none text-lg placeholder-black overflow-y-hidden"
            style={{
              ...linedPaperStyle,
              lineHeight: "28px",
              WebkitTextStroke: "0px",
            }}
          />
        </div>

        {/* Right Page */}
        <div className="w-1/2 p-6 flex flex-col border-t-4 border-r-4 border-b-4 font-fredoka border-onparOrange bg-onparLightYellow gap-2 rounded-br-[40px] rounded-tr-[40px]">
          <textarea
            ref={rightTextAreaRef} // Attach ref
            value={rightText}
            onChange={(e) => handleTextAreaChange(e, setRightText)}
            // Set overflowY to hidden to prevent scrolling
            className="w-full h-[532px] bg-transparent resize-none focus:outline-none text-lg placeholder-black overflow-y-hidden"
            style={{
              ...linedPaperStyle,
              lineHeight: "28px",
              WebkitTextStroke: "0px",
            }}
          />

          <div className="flex flex-row items-end justify-center w-full gap-2 mt-auto">
            <button
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
            onClick={emotionCreationWrapper}>
              Save
            </button>

            <button
            onClick={onCloseJournal}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};



export default CalendarPage