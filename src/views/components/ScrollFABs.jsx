import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const ScrollFABs = () => {
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      setShowTopButton(scrollTop > 100);
      setShowBottomButton(scrollTop + windowHeight < documentHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <>
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-16 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg"
        >
          <FaArrowUp />
        </button>
      )}
      {showBottomButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg"
        >
          <FaArrowDown />
        </button>
      )}
    </>
  );
};

export default ScrollFABs;
