import React, { useState } from "react";
import axios from "axios";

const FlashcardGenerator = () => {
  const [file, setFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setError(null);

    try {
      // Send the file to the backend
      const response = await axios.post(
        "http://localhost:5000/upload", // Change to your backend endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Assuming the API returns an array of flashcards with 'question' and 'answer'
      setFlashcards(response.data.flashcards);

    } catch (error) {
      console.error("Error uploading file", error);

      if (error.response) {
        // Handle server-side errors
        setError(
          `Server error: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        // Handle cases where no response is received
        setError(
          "No response received from the server. Check if the server is running."
        );
      } else {
        // Handle other errors
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Upload PDF/PPT to Generate Flashcards using Google Generative AI
      </h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf, .pptx"
          required
          className="mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload & Generate Flashcards"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {flashcards.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Generated Flashcards</h2>
          <ul className="list-disc pl-5">
            {flashcards.map((card, index) => (
              <li key={index} className="mb-2">
                <strong>Q:</strong> {card.question} <br />
                <strong>A:</strong> {card.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator;
