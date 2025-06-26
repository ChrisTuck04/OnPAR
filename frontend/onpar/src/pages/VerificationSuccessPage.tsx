import { useLocation } from "react-router";

const VerificationSuccessPage = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tokenStatus = queryParams.get("token");

  let message = "";
  let subtext = "";

  if (tokenStatus === "valid") {
    message = "Email Verified Successfully!";
    subtext = "You may now close this tab and login!";
  } else if (tokenStatus === "invalid") {
    message = "Invalid or Expired Verification Token.";
    subtext = "You can request a new verification email.";
  } else {
    message = "Verification Failed.";
    subtext = "Please try again later.";
  }

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
          {message}
        </h2>
        <p className="text-white text-2xl mb-10" style={{ WebkitTextStroke: "1px black" }}>
          {subtext}
        </p>
      </div>
    </div>
  );
};

export default VerificationSuccessPage;
