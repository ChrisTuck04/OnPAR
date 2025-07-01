import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
// @ts-ignore
import { resetPassword } from "../api/auth.js";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

  const handleReset = async () => {
    if (!passwordRegex.test(password)) {
      setMessage("Password must be at least 8 characters and include a special character and a number.");
      return;
    }

    if(password !== confirm) {
      setMessage("Passwords must match.");
      return;
    }

    try {
      await resetPassword(token, password);
      navigate("/reset-password-success");
    } catch (error) {
      setMessage("Failed to reset password.");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" font-fredoka w-full max-w-3xl p-8 rounded-lg">
      <img src="/assets/clouds.png" className="absolute top-[78px] left-[220px] w-48 hidden lg:block" />
      <img src="/assets/sun.png" className="absolute top-20 left-10 w-32 hidden lg:block" />
      <img src="/assets/smallCloud.png" className="absolute top-[250px] right-[150px] w-16 hidden lg:block" />
      <img src="/assets/bigCloud.png" className="absolute top-[78px] right-[300px] w-28 hidden lg:block" />
        <div className="flex flex-col gap-6">
          <h2 className="text-white text-7xl mb-4 text-center" style={{ WebkitTextStroke: '1px black' }}>Reset Password</h2>
          <h2 className="text-white text-2xl text-center" style={{ WebkitTextStroke: '1px black' }}>New Password</h2>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-lg border border-black text-black placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-black hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        <h2 className="text-white text-2xl mb-4 mt-4 text-center" style={{ WebkitTextStroke: '1px black' }}>Confirm Password</h2>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Confirm Password..."
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-4 rounded-lg border border-black text-black placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-black hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button
          onClick={handleReset} 
          className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
        >
          Reset Password
        </button>
        {message && (
            <p className="text-red-600 text-center mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
