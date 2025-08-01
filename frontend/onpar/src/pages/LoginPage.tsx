import { useState } from "react";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router";
// @ts-ignore
import { loginUser } from "../api/auth"; // adjust the path as needed

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    if(!passwordRegex.test(form.password)) {
      newErrors.password = "Password must be at least 8 characters and include a special character and a number.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token); // save the JWT
      navigate("/calendar");
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" font-fredoka w-full max-w-md p-8 rounded-lg">
      <img src="/assets/clouds.png" className="absolute top-[78px] left-[220px] w-48 hidden lg:block" />
      <img src="/assets/sun.png" className="absolute top-20 left-10 w-32 hidden lg:block" />
      <img src="/assets/smallCloud.png" className="absolute top-[250px] right-[150px] w-16 hidden lg:block" />
      <img src="/assets/bigCloud.png" className="absolute top-[78px] right-[300px] w-28 hidden lg:block" />

        <h2 className="text-white text-7xl mb-8 text-center" style={{ WebkitTextStroke: '1px black' }}>Login</h2>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <h2 className="text-white text-2xl text-center" style={{ WebkitTextStroke: '1px black' }}>Email</h2>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-4 rounded-lg border border-black text-black placeholder-gray-400"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1 text-center">{errors.email}</p>
          )}

          <h2 className="text-white text-2xl text-center" style={{ WebkitTextStroke: '1px black' }}>Password</h2>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
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

          {errors.password && (
            <p className="text-red-600 text-sm mt-1 text-center">{errors.password}</p>
          )}
          
          <div className="flex flex-row justify-between">
            <button
              type="button"
              className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
            >
              Log In
            </button>
          </div>
        </form>
        <div className="mt-6 flex flex-col gap-2 text-center">
          <Link to="/forgot-password" className="text-black text-xl hover:underline">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-black text-xl hover:underline">
            Need an account? Click here to register!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
