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
          className="text-green-500 text-3xl mb-8"
          style={{ WebkitTextStroke: "1px black" }}
        >
          Email Verified Successfully!
        </h2>
        <p className="text-white text-2xl mb-10" style={{ WebkitTextStroke: "1px black" }}>
          You may now close this tab and login!
        </p>
      </div>
    </div>
  );
};

export default VerificationSuccessPage;
