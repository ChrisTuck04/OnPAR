import { useNavigate } from "react-router"

const LoginPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className=" font-fredoka w-full max-w-md p-8 rounded-lg"
      >
      <img src="/assets/clouds.png" className="absolute top-[78px] left-[220px] w-30" />
      <img src="/assets/sun.png" className="absolute top-20 left-10 w-48" />
      <img src="/assets/smallCloud.png" className="absolute top-[250px] right-[150px] w-30" />
      <img src="/assets/bigCloud.png" className="absolute top-[78px] right-[300px] w-30" />
        <h2 className="text-white text-7xl mb-8 text-center" style={{ WebkitTextStroke: '1px black' }}>Login</h2>
        <form className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email"
            className="p-5 rounded-lg border border-white text-black placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-5 rounded-lg border border-white text-black placeholder-gray-400"
          />
          <button
            type="submit"
            className="p-5 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
            onClick={() => navigate('/calendar')}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
