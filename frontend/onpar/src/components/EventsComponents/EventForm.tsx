import {useState, useEffect, useRef} from "react"
// @ts-expect-error events interface import
import type { Events } from "../types/Events" 

interface Props {
  addEvent : (e : React.FormEvent<HTMLFormElement>) => void
  exitEventForm : (e : React.MouseEvent<HTMLButtonElement>) => void
}

let date = ""

const EventForm = ({addEvent, exitEventForm} : Props) => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null) 
  const [events, setEvents] = useState<Events[]>([])
  const [event, setEvent] = useState<Events>({
      title: "",
      content: "",
      startTime: new Date(),
      endTime: new Date(),
      recurring: false,
      userId: "", // or the logged-in user’s ID
      sharedEmails: [],
      color: 0,
      recurDays: [],
      recurEnd: new Date(),
  })

  const [eventErrors, setEventErrors] = useState({
    title: "",
    content: "",
    startTime: "",
    endTime: "",
    recurring: "",
    userId: "", 
    sharedEmails: "",
    color: "",
    recurDays: "",
    recurEnd: "",
  })
  

  //useEffect for the description box.
  useEffect(() => {
    if(textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust to content
    }
  }, [event.content])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvent({...event, [e.target.name] : e.target.value})
    setEventErrors({...eventErrors, [e.target.name] : "No error, updated field successfully" })
  }

  const dateHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    date += e
  }

  return (
    <div className="h-full flex flex-col items-center w-[300px] bg-[#F9F3EF] border-[4px] border-[#D2C1B6] gap-4 font-fredoka text-[25px] rounded-tr-3xl rounded-br-3xl overflow-hidden"
         style={{WebkitTextStroke:"1px #D2C1B6"}}>
      
      <form className="flex flex-col items-center mt-4 gap-4" onSubmit={addEvent}>
        <input
        className="placeholder-black w-[280px] text-[20px] text-black font-fredoka p-2 bg-[#D2C1B6] rounded-xl"
        type="text"
        name="title"
        value={event.title}
        onChange={handleChange}
        placeholder="Title"
        style={{WebkitTextStroke:"0px"}}
        />

        <div className="relative flex flex-row justify-between gap-4 rounded-xl">
          <input type="text" className="w-[90px] rounded-xl"/>

          <input type="text" className="w-[60px] rounded-xl"/>
          <p className="w-[10px]">-</p>
          <input type="text"className="w-[60px] rounded-xl" />
        </div>
        
        <RecurringMenu/>

        <textarea
        ref={textAreaRef}
        className="placeholder-black w-[280px] text-[15px] text-black font-fredoka p-2 bg-[#D2C1B6] rounded-xl"
        name="content"
        value={event.content}
        onChange={handleChange}
        placeholder="Add Description"
        rows={1}
        required>
          
        </textarea>

        <button
        className="w-[280px] h-[70px] border-[5px] border-[#D2C1B6] py-[10px] rounded-3xl"
        type="submit">
          Finish
        </button>

        <button
        className="w-[280px] h-[70px] border-[5px] border-[#D2C1B6] py-[10px] rounded-3xl"
        onClick={exitEventForm}>
          Cancel
        </button>
      </form>

    </div>
  )
}

const RecurringMenu = () => {
  return (
    <div>

    </div>
  )
}

const AddGuests = () => {
  return (
    <div>
      
    </div>
    )
}

export default EventForm
