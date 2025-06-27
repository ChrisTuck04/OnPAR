import { useState } from "react";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" font-fredoka w-full max-w-3xl p-8 rounded-lg">
        <img src="/assets/clouds.png" className="absolute top-[78px] left-[220px] w-30" />
        <img src="/assets/sun.png" className="absolute top-20 left-10 w-48" />
        <img src="/assets/smallCloud.png" className="absolute top-[250px] right-[150px] w-30" />
        <img src="/assets/bigCloud.png" className="absolute top-[78px] right-[230px] w-30" />
        <div className="flex flex-col gap-6">
          <h2 className="text-white text-7xl mb-4 text-center" style={{ WebkitTextStroke: '1px black' }}>Reset Password</h2>
          <h2 className="text-white text-2xl text-center" style={{ WebkitTextStroke: '1px black' }}>New Password</h2>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password..."
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
          type="submit"
          className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
        >
          Reset Password
        </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
