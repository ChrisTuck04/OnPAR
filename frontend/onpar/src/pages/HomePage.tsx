import { useNavigate } from "react-router"

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="font-fredoka text-white" style={{WebkitTextStroke: '2px black'}}>
            <button className="text-9xl" onClick={() => navigate('/login')}>Hello</button>
        </div>
    </div>
  )
}

export default HomePage