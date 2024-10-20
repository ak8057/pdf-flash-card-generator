import React, { useRef, useState } from "react";
import axios from "axios";
import logo from "../assets/white-logo.png";
import BackgroundSVG from "../components/BackgroundSVG";
import AnimatedLoader from "../components/AnimatedLoader";

const FlashcardGenerator = () => {
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [file, setFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null); // To track selected option

  const toggleAnswerVisibility = () => {
    setIsAnswerVisible(!isAnswerVisible);
  };

  const handleFileChange = async (e) => {
    e.preventDefault();

    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", selectedFile);
      setFlashcards(response.data.flashcards);
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Response data:", error.response.data);
        setError(
          `Server error: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        // No response was received
        setError(
          "No response received from server. Please check if the server is running."
        );
      } else {
        // Something else happened
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const currentCard = flashcards[currentCardIndex];

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Set the selected option
    setIsAnswerVisible(true); // Reveal the answer after clicking
  };

  const resetStates = () => {
    setSelectedOption(null); // Reset the selected option when moving to the next/previous card
    setIsAnswerVisible(false); // Reset answer visibility
  };

const extractAnswerLetter = (option) => {
  // Trim the input and replace unwanted characters, keeping only the first letter (A, B, C, D, etc.)
  const cleanedOption = option
    .trim()
    .replace(/[^A-Z\s]/gi, "")
    .charAt(0)
    .toUpperCase();
  return cleanedOption.match(/[A-Z]/) ? cleanedOption : null; // Return the letter or null if it's not A-Z
};


  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/upload",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     setFlashcards(response.data.flashcards);
  //   } catch (error) {
  //     console.error("Error uploading file", error);
  //     if (error.response) {
  //       console.error("Response data:", error.response.data);
  //       console.error("Response status:", error.response.status);
  //       console.error("Response headers:", error.response.headers);
  //       // The request was made and the server responded with a status code
  //       // that falls out of the range of 2xx
  //       setError(
  //         `Server error: ${
  //           error.response.data.message || error.response.statusText
  //         }`
  //       );
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       setError(
  //         "No response received from server. Please check if the server is running."
  //       );
  //     } else {
  //       // Something happened in setting up the request that triggered an Error
  //       setError(`Error: ${error.message}`);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen text-white">
      <BackgroundSVG />
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <div className="flex space-x-4">
          <img src={logo} alt="Limbiks Logo" className="h-10 w-10" />
          <div className="text-white tracking-[0.5rem] text-[26px] font-sans">
            LIMBIKS
          </div>
        </div>
        <div className="hidden md:flex space-x-20">
          <a
            href="#generators"
            className="hover:text-gray-300 flex items-center"
          >
            Generators
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 w-4 h-4 rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          <a href="#features" className="hover:text-gray-300 flex items-center">
            Features
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 w-4 h-4 rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          <a href="#examples" className="hover:text-gray-300 flex items-center">
            Examples
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 w-4 h-4 rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          <a href="#company" className="hover:text-gray-300 flex items-center">
            Company
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 w-4 h-4 rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        <div className="space-x-8">
          <a href="#login" className="text-gray-300 hover:text-white">
            Login
          </a>
          <a
            href="#signup"
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-full"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-28 py-40 flex justify-between items-center">
        {/* Left Section */}
        <div className="w-[41%]">
          <h1 className="text-6xl font-bold mb-6 mt-[-2rem] ml-[2rem] ">
            AI Flashcard Generator
          </h1>
          <p className="text-gray-300 text-xl mt-[1.5rem] ml-[2rem] mb-6">
            Upload PDFs, presentations, notes, images, and more. Limbiks
            generates a comprehensive deck of flashcards in seconds. Master your
            flashcards with our powerful study tools.
          </p>
        </div>

        {/* Right Section */}
        <div className="hidden md:block w-[26rem] mt-[-5rem] mr-[11rem] text-center">
          <div className=" rounded-md py-6 px-4">
            {!loading && !flashcards.length ? (
              <form className="space-y-4">
                <label className="block">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf, .pptx"
                    required
                    className=" w-full text-sm text-gray-300
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-orange-500 file:text-white
                            hover:file:bg-orange-600 hidden"
                  />

                  <h3 className="text-xl  mb-4 font-sans">
                    Preview your generated flashcards
                  </h3>
                  <div className="flex justify-center items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Click here to Upload a File
                    </button>
                  </div>
                </label>

                <p className="text-sm text-gray-400">
                  Supported Files: <span className="font-bold">PDF, PPT</span>
                </p>

                <div className="m-5 flex justify-center items-center">
                  <div class="w-[100px] mb-[10px] mr-[15px] pt-[15px] border-b float-left"></div>
                  <div class="text-sm font-medium text-gray-300 float-left">
                    or try
                  </div>
                  <div class="w-[100px] mb-[10px] ml-[15px] pt-[15px] border-b  float-left"></div>
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md">
                    YouTube
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md">
                    Wikipedia
                  </button>
                </div>
              </form>
            ) : loading ? (
              <p className="text-xl flex flex-col  text-gray-400">
                <p className="font-sans mb-10">Generating flashcards...</p>
                {/* Loading Spinner */}
                <AnimatedLoader />

                <p className="font-sans">
                  This should take only few seconds...
                </p>
              </p>
            ) : (
              <div className=" rounded-md py-6 px-4 bg-white h-[19rem] text-black w-[28rem]">
                {/* Flashcard Navigation */}
                {flashcards.length > 0 && (
                  <div className="-mt-2">
                    <div className="flex items-normal justify-between">
                      <button
                        onClick={() => {
                          prevCard();
                          setIsAnswerVisible(false); // Reset answer visibility when moving to the previous card
                          resetStates();
                        }}
                        className="bg-gradient-to-r  right-[5rem] from-gray-200 to-gray-300 top-12 relative h-[3rem] min-w-[3rem] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6 text-black"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <div className="text-center">
                        {/* Flashcard Question */}
                        {flashcards.length > 0 && (
                          <div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">
                                {currentCard.question}
                               
                              </div>
                              <hr className="border-gray-700 my-3 w-full mx-auto opacity-80" />

                              {/* Render MCQ Options if the type is 'MCQ' */}
                              {currentCard.type === "MCQ" ? (
                                <div className="mcq-options flex flex-col space-y-2">
                                  {currentCard.options.map((option, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleOptionClick(option)}
                                      className={`py-1 px-4 rounded-lg shadow-md 
                      ${
                        selectedOption
                          ? extractAnswerLetter(option) === currentCard.answer
                            ? "bg-green-400 text-white" // Correct option - green
                            : option === selectedOption
                            ? "bg-red-400 text-white" // Incorrect option - red
                            : "bg-gray-200" // Unselected options remain neutral
                          : "bg-gray-200 hover:bg-gray-300"
                      } transition-all duration-300 ease-in-out`}
                                      disabled={selectedOption !== null} // Disable once an option is selected
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div
                                  className="flashcard-container p-4 bg-gray-100 rounded-lg shadow-md"
                                  onClick={() =>
                                    setIsAnswerVisible(!isAnswerVisible)
                                  } // Click to reveal the answer
                                >
                                  {isAnswerVisible ? (
                                    <div className="text-md mt-2">
                                      {currentCard.answer}
                                    </div>
                                  ) : (
                                    <div className="text-md mt-2 text-gray-400 italic">
                                      Click to reveal the answer
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          nextCard();
                          setIsAnswerVisible(false);
                          resetStates(); // Reset answer visibility when moving to the next card
                        }}
                        className="bg-gradient-to-r from-gray-200 to-gray-300 top-12 relative left-[5rem] h-[3rem] min-w-[3rem] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6 text-black"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardGenerator;
