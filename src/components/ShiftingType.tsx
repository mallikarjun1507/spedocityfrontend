import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";

const ShiftingType: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (type: "office" | "home") => {
    navigate(`/shifting-details/${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col px-6 pt-10 pb-14 font-sans items-center relative overflow-x-hidden">
      
      {/* Floating backgrounds */}
      <motion.div
        className="absolute top-20 left-8 w-36 h-36 bg-purple-200 rounded-full opacity-25 blur-3xl"
        animate={{ y: [0, 32, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-6 w-36 h-36 bg-pink-200 rounded-full opacity-25 blur-3xl"
        animate={{ y: [0, -26, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 mt-2 mb-16 select-none text-center drop-shadow-lg max-w-2xl"
      >
        Choose Your Shifting Type
      </motion.h1>

      {/* Cards container */}
      <div className="flex flex-col gap-16 w-full max-w-xl mx-auto mb-16">
        {/* Home Shifting card */}
        <motion.div
          whileHover={{ scale: 1.07, rotate: -1.7, boxShadow: "0 20px 48px 0 rgba(230,80,120,0.18)" }}
          whileTap={{ scale: 0.97 }}
          className="bg-gradient-to-r from-pink-400 via-red-400 to-yellow-300 text-white rounded-[2em] py-12 px-7 shadow-2xl cursor-pointer flex flex-col items-center transition"
          onClick={() => handleSelect("home")}
          tabIndex={0}
          aria-label="Select Home Shifting"
        >
          <Player
            src="https://assets7.lottiefiles.com/packages/lf20_llfeoiyx.json"
            className="w-[110px] h-[110px] mb-6"
            loop
            autoplay
            style={{ background: "none" }}
          />
          <span className="font-bold text-2xl mb-2 drop-shadow-md">Home Shifting</span>
          <span className="block text-base text-white/90">Safe &amp; easy house relocation</span>
        </motion.div>

        {/* Office Shifting card */}
        <motion.div
          whileHover={{ scale: 1.07, rotate: 1.7, boxShadow: "0 20px 48px 0 rgba(59,130,246,0.14)" }}
          whileTap={{ scale: 0.97 }}
          className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-white rounded-[2em] py-12 px-7 shadow-2xl cursor-pointer flex flex-col items-center transition"
          onClick={() => handleSelect("office")}
          tabIndex={0}
          aria-label="Select Office Shifting"
        >
          <Player
            src="https://assets10.lottiefiles.com/packages/lf20_q5qe3ocg.json"
            className="w-[110px] h-[110px] mb-6"
            loop
            autoplay
            style={{ background: "none" }}
          />
          <span className="font-bold text-2xl mb-2 drop-shadow-md">Office Shifting</span>
          <span className="block text-base text-white/90">Minimal downtime, expert packing</span>
        </motion.div>
      </div>

      {/* Moving truck animation */}
      <motion.div
        initial={{ opacity: 0, y: 55 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        className="z-10"
      >
        <Player
          src="https://assets2.lottiefiles.com/packages/lf20_jsjahydu.json"
          className="w-[320px] h-[115px] mx-auto"
          loop
          autoplay
          style={{ background: "none" }}
        />
      </motion.div>
    </div>
  );
};

export default ShiftingType;
