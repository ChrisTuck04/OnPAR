import { useNavigate } from "react-router";
const ResetPasswordSuccessPage = () => {
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
          className="text-green-500 text-4xl mb-8"
          style={{ WebkitTextStroke: "1px black" }}
        >
          Password Reset Successfully!
        </h2>
        <p className="text-white text-4xl mb-10" style={{ WebkitTextStroke: "1px black" }}>
          You may now login!
        </p>
        <button
            className="p-4 text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
            onClick={() => navigate('/login')}
        >
            Log In
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordSuccessPage;
