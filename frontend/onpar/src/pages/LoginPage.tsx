const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className=" font-fredoka w-full max-w-md p-8 rounded-lg"
      >
        <h2 className="text-white text-4xl mb-8 text-center" style={{ WebkitTextStroke: '1px black' }}>Login</h2>
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
            className="p-5 rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
