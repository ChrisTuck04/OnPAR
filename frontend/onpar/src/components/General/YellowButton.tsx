
import { useNavigate } from "react-router"

interface buttonNavigation {
    to: string
}

const YellowButton = ({to} : buttonNavigation) => {

    const navigate = useNavigate()

    const nav = () => {
        navigate(to)
    }

    return (
    <div>
        <button onClick={nav} className="p-5 rounded-2xl border-2 border-onparOrange bg-onparLightYellow hover:bg-onparOrange relative w-[193px] h-[52px] font-fredoka text-black text-lg flex items-center justify-center">
            Login
        </button>
    </div>
    )
}

export default YellowButton



