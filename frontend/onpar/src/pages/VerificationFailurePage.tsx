const VerificationSuccessPage = () => {
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
            Invalid or Expired Verification Token
        </h2>
        <p className="text-white text-2xl mb-10" style={{ WebkitTextStroke: "1px black" }}>
            Resend Below!
        </p>
      </div>
    </div>
  );
};

export default VerificationSuccessPage;
