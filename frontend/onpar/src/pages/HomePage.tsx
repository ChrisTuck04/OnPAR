import { useNavigate } from "react-router"
import YellowButton from "../components/YellowButton"

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center">
        <div>

        </div>
        <div>
           <YellowButton to="/login"/>
        </div>
    </div>
  )
}

export default HomePage