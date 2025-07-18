import {useState, useEffect, useRef, useCallback, KeyboardEvent} from "react"
import {motion} from "framer-motion"
// @ts-expect-error events interface import
import type { Events } from "../types/Events" 

interface Props {
  addEvent? : (e : React.FormEvent<HTMLFormElement>) => void
  exitEventForm? : (e : React.MouseEvent<HTMLButtonElement>) => void
  setColorName? : (currColor : string) => void
  color? : number
  toggleEmailMenu? : (e : React.MouseEvent<HTMLButtonElement>) => void
  recurringName? : string
  handleChange? : (e: React.MouseEvent<HTMLButtonElement>) => void
  handleRecurring? : (data : (boolean | number[])[]) => void
  selectedDays? : number[]
  toggleDay? : (day : number) => void 
  buttonName? : string
  updateTimeData? : (data : string) => void
  updateStartOrEndTime? : (data : string) => void
  timeSegment? : string
  recurEndDateSegment? : string
  updateRecurEndDateSegment? : (e : React.ChangeEvent<HTMLInputElement>) => void
  recurEndDateKeyDownFunction? : (
    e: KeyboardEvent,
    hideInput: () => void, // Add this parameter
    showButton: () => void // Add this parameter
  ) => void
}

const isValidMMDDFormat = (date : string) : boolean => {
    const mmddRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
    if(!mmddRegex.test(date))
      return false
    else
      return true
    
  }

const EventForm = ({addEvent, exitEventForm} : Props) => {

  const textAreaRef = useRef<HTMLTextAreaElement>(null) 
  //const [events, setEvents] = useState<Events[]>([])
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
  
  const [openEmailMenu, setOpenEmailMenu] = useState(false)
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmailInput, setCurrentEmailInput] = useState<string>("")
  const [dateInput, setDateInput] = useState<string>("")
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [recurEndDate, setRecurEndDate] = useState<string>("")

  //useEffect for the description box.
  useEffect(() => {
    if(textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust to content
    }
  }, [event.content])

  //useEffect for sharing emails list 
  useEffect(() => {
    setEvent((prevEvent : Events) => ({
      ...prevEvent,
      sharedEmails: emails,
    }))
  }, [emails])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget
    const name = target.name
    if(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLButtonElement) {
      setEvent({...event, [name] : target.value})
      setEventErrors({...eventErrors, [name] : "No error, updated field successfully" })
    }

  }

  //function for adding values to recurring fields
  const handleRecurring = ( data : (boolean | number[])[]) => {
    const recurring = "recurring"
    const recurDays = "recurDays"

    setEvent({...event, [recurring] : data[0]})
    setEvent({...event, [recurDays] : data[1]})
    setEventErrors({...event, [recurring] : "No error, updated field successfully"})
    setEventErrors({...event, [recurDays] : "No error, updated field successfully"})
  }

  const toggleEmailMenu = (e : React.MouseEvent<HTMLButtonElement>) => {
    if(openEmailMenu === false) {
      setOpenEmailMenu(true)
      
    } else if(openEmailMenu === true) {
      setOpenEmailMenu(false)
    }
    e.stopPropagation()
  }

  const handleEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(currentEmailInput && emailRegex.test(currentEmailInput)) {
      setEmails(prevEmails => {
        if(!prevEmails.includes(currentEmailInput)) {
          const newEmails = [...emails, currentEmailInput]
          return newEmails
        } else {
          return prevEmails
        }
      })
      setCurrentEmailInput("")
      setOpenEmailMenu(false)
    } else {
      alert("please enter a valid email address")
    }
  }

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEmailInput(e.target.value)
  }

  const combineDateInputs = useCallback((date : string, time : string) : Date | null => {
    const currentYear = new Date().getFullYear()

    const [month, day] = date.split("-") 
    const [hour, min] = time.split(":")

    const fullDateString = `${currentYear}-${month.padStart(2,'0')}-${day.padStart(2,'0')}T${hour.padStart(2,'0')}:${min.padStart(2,'0')}:00}`
    const parsedDate = new Date(fullDateString)

    if(isNaN(parsedDate.getTime())) {
      console.error("Invalid date or time input:", fullDateString)
      return null
    } else {
      return parsedDate
    }

  }, [])

  const handleDateTimeUpdate = useCallback(() => {
    if (dateInput && startTime && endTime) {
      const startDateTime = combineDateInputs(dateInput, startTime);
      const endDateTime = combineDateInputs(dateInput, endTime);

      setEvent((prevEvent: Events) => ({
        ...prevEvent,
        startTime: startDateTime || prevEvent.startTime,
        endTime: endDateTime || prevEvent.endTime,  
      }));

      if (!startDateTime || !endDateTime) {
          console.warn("One or both date/time values are currently invalid. Please check your inputs.");
      }
    }
  }, [dateInput, startTime, endTime, setEvent, combineDateInputs])

  const updateStartTime = (data : string) => {
    setStartTime(data)
  }

  const updateEndTime = (data : string) => {
    setEndTime(data)
  }

  useEffect(() => {
      handleDateTimeUpdate()
  }, [handleDateTimeUpdate])

  //updates the recurEndDate string 
  //will be in onChange() prop
  const updateRecurEndDate = (e : React.ChangeEvent<HTMLInputElement>) => {
    setRecurEndDate(e.currentTarget.value)
  }


  //helper function inside of handleRecurEndDate that will combine date and time and check for date format errors
  const combineRecurEndDateWithManualTime = useCallback(() => {
    const isValidDate = isValidMMDDFormat(recurEndDate)

    if(!isValidDate) 
      alert("Please enter a valid date")
    else {
      const currentYear = new Date().getFullYear()
      const fullDateString = `${currentYear}-${recurEndDate}T00:00:00}`
      const parsedDate = new Date(fullDateString)

      if(isNaN(parsedDate.getTime())) {
        console.error("Invalid date or time input:", fullDateString)
        return null
      } else {
        return parsedDate
      }
    }
  }, [recurEndDate])

   //converts recurEndTime string to a date and sets it to corresponding event field.
  //also needs to validate if its in MM-DD format, if not display and error --> helper function
  //will be in the onKeyDown prop
  const handleRecurEndDate = useCallback((e: KeyboardEvent<HTMLInputElement>, closeInput : () => void,  openButton : () => void) => {
    if(e.key === 'Enter') {
      const recurEndFullDate = combineRecurEndDateWithManualTime()
      if(recurEndFullDate) {
        setEvent((prevEvent: Events) => ({
          ...prevEvent,
          recurEnd: recurEndFullDate || prevEvent.recurEndFullDate, 
        }))

        closeInput()
        openButton()
      }
    }
  }, [combineRecurEndDateWithManualTime])


  return (
    <div className="h-full flex flex-col items-center w-[300px] bg-[#F9F3EF] border-[4px] border-[#D2C1B6] gap-4 font-fredoka text-[25px] rounded-tr-3xl rounded-br-3xl"
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

        <div className="relative flex flex-row justify-between rounded-xl font-fredoka gap-2">
          <input
          type="text"
          className="w-[90px] h-[40px] rounded-xl bg-[#D2C1B6] placeholder-black text-center text-[16px]"
          placeholder="MM-DD"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}/>

          <Time buttonName="Start" updateStartOrEndTime={updateStartTime}/>

          <Time buttonName="End" updateStartOrEndTime={updateEndTime}/>

        </div>
        
        <div className="relative flex flex-flow justify-between gap-4">
          <div className=" flex justify-center items-center w-[150px] h-[45px] rounded-xl border-[2px] border-[#D2C1B6] ">
            <Recurring
            handleRecurring={handleRecurring}
            recurEndDateSegment={recurEndDate}
            updateRecurEndDateSegment={updateRecurEndDate}
            recurEndDateKeyDownFunction={handleRecurEndDate}/>
          </div>

          <div className="flex justify-center items-center w-[100px] h-[45px] rounded-xl border-[2px] border-[#D2C1B6]">
            <Color handleChange={handleChange}/>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          {!openEmailMenu && <AddGuests toggleEmailMenu={toggleEmailMenu}/>}
          {openEmailMenu && <input
                        type="email"
                        className="w-[230px] placeholder-black text-[18px] text-black p-2 rounded-tl-xl rounded-bl-xl bg-[#D2C1B6]"
                        value={currentEmailInput}
                        onChange={handleEmailInputChange}
                        placeholder="Add Email"
                        style={{WebkitTextStroke:"0px"}}/>}
          {openEmailMenu && <button
                        type="button"
                        className="w-[50px] h-[45px] border-[2px] border-[#D2C1B6] font-fredoka text-[20px] rounded-tr-xl rounded-br-xl"
                        onClick={handleEmails}>Add</button>}
        </div>

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

const Recurring = ({handleRecurring, recurEndDateSegment, updateRecurEndDateSegment, recurEndDateKeyDownFunction} : Props) => {

  const [open, setOpen] = useState(false)
  const [recurEndDateInputView, setRecurEndDateInputView] = useState(false)
  const [recurEndDateButton, setRecurEndDateButton] = useState(true)
  const recurringOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const toggleDay = (day : number) => {
    setSelectedDays(prevSelectedDays => {
      if(prevSelectedDays.includes(day)) {
        return prevSelectedDays.filter(d => d !== day)
      } else {
        const newSelectedDays = [...prevSelectedDays, day]
        return newSelectedDays.sort((a,b) => a - b)
      }
    })
  }

  const RecurringValid = () => {
    if(selectedDays.length > 0)
      handleRecurring!([true, selectedDays])
    else
      handleRecurring!([false, []])
    setOpen(false)
  }


  return (
    <div
    className="relative flex flex-col justify-center items-center w-[200px] h-[45px] hover:bg-[#D2C1B6] rounded-xl"
    onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <p className="text-[20px] font-fredoka">Recurring</p>
      <div className="absolute top-[45px]">
        {open && 
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          exit={{ opacity: 0}}
          className="flex flex-col justify-center items-center w-[150px] h-[400px] border-[2px] bg-[#F9F3EF] border-[#D2C1B6] rounded-xl gap-2">
            {recurringOptions.map((option, index) => (
              <RecurringButton
              key={index}
              recurringName={option}
              selectedDays={selectedDays}
              toggleDay={toggleDay}/>
            ))}

            {recurEndDateButton && <button
            type="button"
            className="border-[2px] border-[#D2C1B6] font-fredoka text-[20px] rounded-xl w-[130px] hover:bg-[#D2C1B6]"
            onClick={() => {
              setRecurEndDateButton(false)
              setRecurEndDateInputView(true)
            }}>
              End
            </button>
            }

            {recurEndDateInputView && <input
            type="text"
            placeholder="MM-DD"
            value={recurEndDateSegment}
            onChange={updateRecurEndDateSegment}
            onKeyDown={(e) => recurEndDateKeyDownFunction!(e, () => setRecurEndDateInputView(false), () => setRecurEndDateButton(true))}
            className="bg-[#D2C1B6] font-fredoka text-[18px] text-black placeholder-black w-[130px] h-[35px] rounded-xl p-2"/>
            }
            <button
            className="border-[2px] border-[#D2C1B6] font-fredoka text-[20px] rounded-xl w-[130px] hover:bg-[#D2C1B6]"
            type="button"
            onClick={RecurringValid}>
              Done
            </button>
          </motion.div>
        }
      </div>
    </div>
  )
}

const RecurringButton = ({recurringName, selectedDays, toggleDay} : Props) => {

  let day = -1

  if(recurringName === "Monday") {
    day = 1
  } else if(recurringName === "Tuesday") {
    day = 2
  } else if(recurringName === "Wednesday") {
    day = 3
  } else if(recurringName === "Thursday") {
    day = 4
  } else if(recurringName === "Friday") {
    day =5
  } else if(recurringName === "Saturday") {
    day = 6
  } else if(recurringName === "Sunday") {
    day = 0
  }

  const bgColor = selectedDays && selectedDays.includes(day) ? "[#D2C1B6]" : "[#F9F3EF]"

  return (
    <button
    className={`border-[2px] bg-${bgColor} border-[#D2C1B6] font-fredoka text-[20px] rounded-xl w-[130px] hover:bg-[#D2C1B6]`}
    type="button"
    onClick={() => {
      toggleDay!(day)
    }}
    >
      {recurringName}
    </button>
  )
}

const AddGuests = ({toggleEmailMenu} : Props) => {
  return (
    <button
    type="button"
    className="w-[280px] h-[45px] border-[2px] rounded-xl border-[#D2C1B6] bg-[#F9F3EF] font-fredoka"
    onClick={toggleEmailMenu}>
      Add Friends
    </button>
    )
}

const Color = ({handleChange} : Props) => {
  const [open, setOpen] = useState(false)
  const [colorName, setColorName] = useState("Color")

  const setColor = (color : string) => {
    setColorName(color)
  }


  return (
    <div className="relative w-[100px] h-[45px] flex flex-col justify-center items-center rounded-xl hover:bg-[#D2C1B6]" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <p className=" font-fredoka text-[20px] top-[5px]">{colorName}</p>
      <div className="absolute top-[45px]">
        {open &&
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        exit={{ opacity: 0}}
        className="relative flex flex-col justify-center items-center w-[50px] h-[350px] bg-[#F9F3EF] border-[2px] border-[#D2C1B6] rounded-xl gap-3">
          {[...Array(10)].map((_ , index) => (
            <ColorButton key={index} color={index} setColorName={setColor} handleChange={handleChange}/>
          ))}
        </motion.div>
        }
      </div>
    </div>
  )
}

const ColorButton = ({setColorName, color, handleChange} : Props) => {

  const Color = ['','']

  const changeColor = () => Color[1] && setColorName!(Color[1])

  if(color == 0) {
    Color[0] = '#CF1F1F'
    Color[1] = 'Red'
  } else if(color === 1) {
    Color[0] = '#6BCB77'
    Color[1] = `Green`
  } else if(color === 2) {
    Color[0] = '#4D96FF'
    Color[1] = `Blue`
  } else if(color === 3) {
    Color[0] = '#FFDB3D'
    Color[1] = `Yellow`
  } else if(color === 4) {
    Color[0] = '#C780FA'
    Color[1] = `Purple`
  } else if(color === 5) {
    Color[0] = '#FF9F1C'
    Color[1] = `Orange`
  } else if(color === 6) {
    Color[0] = '#00C2D1'
    Color[1] = `Teal`
  } else if(color === 7) {
    Color[0] = '#500AA3'
    Color[1] = `Violet`
  } else if(color === 8) {
    Color[0] = '#F15BB5'
    Color[1] = `Pink`
  } else if(color === 9) {
    Color[0] = '#2B282A'
    Color[1] = `Gray`
  }

  return (
    <button
    type="button"
    className="rounded-3xl w-[20px] h-[20px] text-[10px]"
    onClick={(e) => {
      changeColor()
      handleChange!(e)
    }}
    style={{background : Color[0]}}
    name="color"
    value={color}>
    </button>
  )
}

const Time = ({buttonName, updateStartOrEndTime} : Props) => {

  const [open, setOpen] = useState(false)
  const hour = ["1", "2", "3", "4", "6", "7", "8", "9", "10", "11", "12"]
  const intervals = ["00", "15", "30", "45"]
  const amORpm = ["am", "pm"]
  const [updateHour, setUpdateHour] = useState<string>("")
  const [updateInterval, setUpdateInterval] = useState<string>("")
  const [updatePeriod, setUpdatePeriod] = useState<string>("")

  const concatenateTimeSegments = () => {
    if(updateHour !== "" && updateInterval !== "" && updatePeriod !== "") {
      if(updatePeriod === "am") {
        return `${updateHour}:${updateInterval}`
      } else {
        const hour = parseInt(updateHour) + 12
        const stringHour = hour.toString()
        setUpdateHour(stringHour)
        return `${updateHour}:${updateInterval}`
      }
    }

    else {
      alert("Must choose a valid time!")
      return null
    }
  }

  const updateHourString = (data : string) => {
    if(updateHour === "") {
      setUpdateHour(data)
    } else {
      setUpdateHour("")
    }
  }

  const updateIntervalString = (data : string) => {
    if(updateInterval === "") {
      setUpdateInterval(data)
    } else {
      setUpdateInterval("")
    }
  }

  const updatePeriodString = (data : string) => {
    if(updatePeriod === "") {
      setUpdatePeriod(data)
    } else {
      setUpdatePeriod("")
    }
  }

  const validTimeString = () => {

    const validTimeStr : string | null = concatenateTimeSegments()

    if(validTimeString !== null) {
      updateStartOrEndTime!(validTimeStr!)
      setOpen(false)
    }
  }

  return (
    <div 
    className="relative flex flex-col justify-center items-center w-[80px] h-[40px] hover:bg-[#D2C1B6] border-[2px] border-[#D2C1B6] rounded-xl"
    onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <p className="text-[20px] font-fredoka">{buttonName}</p>
      <div className="absolute top-[38px] z-50">
        {open && 
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        exit={{ opacity: 0}}
        className="flex flex-col items-center w-[180px] h-[440px] border-[2px] bg-[#F9F3EF] border-[#D2C1B6] rounded-xl p-2 gap-2">
          <div className="flex flex-row justify-between gap-2">
            <div className="relative flex flex-col gap-2 top-[5px]">
              {hour.map((hour, index) => (
                <TimeButton
                key={index}
                buttonName={hour}
                updateTimeData={updateHourString}
                timeSegment={updateHour}/>
              ))}
            </div>

            <div className="relative flex flex-col gap-2 top-[5px]">
              {intervals.map((interval, index) => (
                <TimeButton
                key={index}
                buttonName={interval}
                updateTimeData={updateIntervalString}
                timeSegment={updateInterval}/>
              ))}
            </div>

            <div className="relative flex flex-col gap-2 top-[5px]">
              {amORpm.map((options, index) => (
                <TimeButton
                key={index}
                buttonName={options}
                updateTimeData={updatePeriodString}
                timeSegment={updatePeriod}/>
              ))}
            </div>
          </div> 

          <button
          type="button"
          className="w-[150px] h-[50px] font-fredoka text-[15px] rounded-xl border-[2px] border-[#D2C1B6] hover:bg-[#D2C1B6]"
          onClick={validTimeString}>
            Done
          </button>

        </motion.div>}
      </div>
    </div>
  )
}

const TimeButton = ({buttonName, updateTimeData, timeSegment} : Props) => {
  const bgColor = timeSegment && timeSegment === buttonName ? "[#D2C1B6]" : "[#F9F3EF]"
  return (
    <button
    className={`bg-${bgColor} border-[2px] border-[#D2C1B6] font-fredoka text-[15px] rounded-xl w-[50px] hover:bg-[#D2C1B6]`}
    type="button"
    onClick={() => updateTimeData!(buttonName!)}>
      {buttonName}
    </button>
  )
}

export default EventForm
