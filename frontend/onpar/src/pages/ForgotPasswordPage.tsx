import { useState } from "react";
import { useNavigate } from "react-router";
// @ts-ignore
import { sendForgotPasswordEmail } from "../api/auth.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await sendForgotPasswordEmail(email);
      setMessage("Reset link sent! Please check your email.");
      setError("");
    } catch (error) {
      setMessage("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" font-fredoka w-full max-w-3xl p-8 rounded-lg">
        <img src="/assets/clouds.png" className="absolute top-[78px] left-[220px] w-48 hidden lg:block" />
        <img src="/assets/sun.png" className="absolute top-20 left-10 w-32 hidden lg:block" />
        <img src="/assets/smallCloud.png" className="absolute top-[250px] right-[150px] w-16 hidden lg:block" />
        <img src="/assets/bigCloud.png" className="absolute top-[78px] right-[300px] w-28 hidden lg:block" />
        <div className="flex flex-col gap-6">
          <h2 className="text-white text-7xl mb-4 text-center" style={{ WebkitTextStroke: '1px black' }}>Forgot Password?</h2>
          <h2 className="text-white text-2xl text-center" style={{ WebkitTextStroke: '1px black' }}>Email</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setMessage("");
            }}
            className="p-4 mb-6 rounded-lg border border-black text-black placeholder-gray-400"
          />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <p className="text-center text-black text-3xl mb-4">{message}</p>
          <div className="flex flex-row justify-evenly">
            <button
              className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
              onClick={() => navigate('/login')}
            >
              Cancel
            </button>
            <button
              className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
              onClick={handleSubmit}
            >
              Send Recovery Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
