import { useState } from "react";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
// @ts-ignore
import { registerUser } from "../api/auth.js"; // adjust the path as needed

const RegisterPage = () => {
  const navigate = useNavigate();
    const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate("/register-success");
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      alert(error.response?.data?.error || "Login failed");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" font-fredoka w-full max-w-md rounded-lg">
      <img src="/assets/clouds.png" className="absolute top-[78px] left-[220px] w-30" />
      <img src="/assets/sun.png" className="absolute top-20 left-10 w-48" />
      <img src="/assets/smallCloud.png" className="absolute top-[250px] right-[150px] w-30" />
      <img src="/assets/bigCloud.png" className="absolute top-[78px] right-[300px] w-30" />
        <h2 className="text-white text-7xl mb-4 mt-2 text-center" style={{ WebkitTextStroke: '1px black' }}>Register</h2>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          {(Object.keys(form) as (keyof typeof form)[]).map((field) => (
            <div key={field}>
              <h2 className="text-white text-2xl text-center" style={{ WebkitTextStroke: '1px black' }}>
                {field === "firstName" ? "First Name" :
                 field === "lastName" ? "Last Name" :
                 field === "email" ? "Email" : "Password"}
              </h2>
              <input
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                name={field}
                placeholder={`Enter ${field}...`}
                value={form[field]}
                onChange={handleChange}
                className="p-4 rounded-lg border border-black text-black placeholder-gray-400"
              />
            </div>
          ))}
          <div className="flex flex-row justify-between">
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
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
