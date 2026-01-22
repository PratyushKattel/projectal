import HeroSection from "../components/home/HeroSection";
import Navbar from "../components/home/Navbar";

const Home = () => {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 border-b border-gray-300">
        <Navbar />
      </div>
      <HeroSection /> {/* Full width */}
    </>
  );
};

export default Home;
