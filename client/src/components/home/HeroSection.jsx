const HeroSection = () => {
  return (
    <main className="bg-background mt-10 py-5">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <div className="text-center md:text-left">
            <div>
              <span className="text-3xl md:text-4xl font-bold font-inter">
                Plan.Track.
              </span>
              <span className="text-primary text-3xl md:text-4xl font-bold font-inter">
                Deliver
              </span>
            </div>

            <div className="text-sm md:text-base opacity-60 my-5 max-w-md mx-auto md:mx-0">
              Projectal helps you manage projects and tasks in one simple
              workspace.
            </div>

            <div className="flex justify-center md:justify-start gap-5">
              <div>
                <button className="text-white bg-primary p-2 rounded hover:bg-secondary cursor-pointer">
                  Get Started
                </button>
              </div>

              <div>
                <button className="text-black bg-white border-b border-gray-300 p-2 rounded hover:bg-gray-100 cursor-pointer">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          <div>
            <img
              src="/images/heroimg-2.svg"
              alt="heroimg"
              className="w-full max-w-xs md:max-w-sm lg:max-w-md"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
