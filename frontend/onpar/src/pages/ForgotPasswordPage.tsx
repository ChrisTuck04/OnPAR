import { useNavigate } from "react-router";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" font-fredoka w-full max-w-3xl p-8 rounded-lg">
      <img src="/assets/clouds.png" className="absolute top-[78px] left-[220px] w-30" />
      <img src="/assets/sun.png" className="absolute top-20 left-10 w-48" />
      <img src="/assets/smallCloud.png" className="absolute top-[250px] right-[150px] w-30" />
      <img src="/assets/bigCloud.png" className="absolute top-[78px] right-[230px] w-30" />
      <div className="flex flex-col gap-6">
          <h2 className="text-white text-7xl mb-4 text-center" style={{ WebkitTextStroke: '1px black' }}>Forgot Password?</h2>
          <h2 className="text-white text-2xl text-center" style={{ WebkitTextStroke: '1px black' }}>Email</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="p-4 mb-6 rounded-lg border border-black text-black placeholder-gray-400"
          />
          </div>
          <div className="flex flex-row justify-evenly">
            <button
              type="button"
              className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
              onClick={() => navigate('/login')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
            >
              Send Recovery Email
            </button>
          </div>
        </div>
      </div>
  );
};

export default ForgotPasswordPage;
