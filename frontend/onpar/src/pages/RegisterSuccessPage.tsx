import { useNavigate } from "react-router";

const RegisterSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="font-fredoka p-8 rounded-lg flex flex-col items-center justify-center max-w-3xl mx-auto">
        <h1
          className="text-white text-8xl mb-4"
          style={{ WebkitTextStroke: "1px black" }}
        >
          OnPAR
        </h1>
        <h2
          className="text-white text-3xl mb-8"
          style={{ WebkitTextStroke: "1px black" }}
        >
          Registration Successful!
        </h2>

        <p className="text-white text-3xl mb-10" style={{ WebkitTextStroke: "1px black" }}>
          Please check your inbox for a verification email!
        </p>

        <button
          className="p-4 mb-4 w-full text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
          onClick={() => {}}
        >
          Resend Verification Email
        </button>

        <p className="text-white text-3xl mb-6" style={{ WebkitTextStroke: "1px black" }}>Once verified, you may login</p>

        <button
          className="p-4 w-full text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
