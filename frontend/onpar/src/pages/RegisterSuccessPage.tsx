import { useNavigate, useLocation } from "react-router";
// @ts-ignore
import { resendVerification } from "../api/auth.js";
import { useState } from "react";

const RegisterSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email) {
      setError("No email found");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await resendVerification(email);
      setMessage(response.message);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="font-fredoka p-8 rounded-lg flex flex-col items-center justify-center max-w-3xl mx-auto">
        <h1
          className="text-white text-6xl mb-4"
          style={{ WebkitTextStroke: "1px black" }}
        >
          OnPAR
        </h1>

        <h2
          className="text-green-500 text-3xl mb-8"
          style={{ WebkitTextStroke: "1px black" }}
        >
          Registration Successful!
        </h2>

        <h2
          className="text-white text-3xl mb-8"
          style={{ WebkitTextStroke: "1px black" }}
        >
          Please do not close this tab.
        </h2>

        <p className="text-white text-3xl mb-10" style={{ WebkitTextStroke: "1px black" }}>
          Check your inbox for a verification email!
        </p>

        <button
          className="p-4 mb-2 w-full text-2xl rounded-lg border-4 border-onparOrange bg-onparLightYellow hover:bg-onparOrange text-black font-bold transition"
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>

        {message && <p className="text-green-500 text-xl">{message}</p>}
        {error && <p className="text-red-500 text-xl">{error}</p>}

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
