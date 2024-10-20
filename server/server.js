const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const pptxgenjs = require("pptxgenjs");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", file);
    const filePath = path.join(__dirname, "uploads", file.filename);
    let textContent = "";

    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      textContent = data.text;
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      textContent = await extractTextFromPpt(filePath);
    } else {
      return res
        .status(400)
        .json({ error: "Invalid file type. Please upload a PDF or PPT." });
    }

    console.log(
      "Text content extracted:",
      textContent.substring(0, 100) + "..."
    );

    // Generate flashcards using Google Generative AI
    const flashcards = await generateFlashcardsFromAI(textContent);

    console.log("Flashcards generated:", flashcards);

    res.json({ flashcards });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      error: "An error occurred while processing the file",
      details: error.message,
    });
  }
});


async function generateFlashcardsFromAI(textContent) {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const fileManager = new GoogleAIFileManager(process.env.API_KEY);
  try {
    console.log(
      "Sending text to Google Generative AI for flashcard generation..."
    );

   
    const tempFilePath = path.join(__dirname, "uploads", "tempText.txt");
    fs.writeFileSync(tempFilePath, textContent);

  
    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: "text/plain",
      displayName: "Temporary Text Content",
    });

    console.log(`Uploaded file as: ${uploadResponse.file.uri}`);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

   
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: "Generate flashcards from this text with a mixture of one word answer and MCQs . Also, include some flashcards as multiple-choice questions (MCQs) with 4 options A B C D. Ensure that each flashcard follows this format: **Front:** Any text **Back:** any text, if it is a MCQ question keep the format like this: **Front:** Any text **Options:** any text and give all options in 4 different new lines and provide MCQ answer in format **Back:** containing only options A B C D"
      },
    ]);

    const aiResponseText = result.response.text();
    console.log("AI Response:", aiResponseText);

    const flashcards = parseFlashcards(aiResponseText);
    return flashcards;
  } catch (err) {
    console.error("Error contacting AI service:", err);
    throw new Error("Failed to generate flashcards from AI");
  }
}

function parseFlashcards(text) {
  const flashcards = [];
  const lines = text.split("\n");
  let currentCard = {};
  let isMCQ = false;

  lines.forEach((line) => {
    line = line.trim(); 

   
    if (line.startsWith("**Front:**")) {
     
      if (currentCard.question) {
        if (isMCQ) {
         
          flashcards.push({ ...currentCard, type: "MCQ" });
        } else if (currentCard.answer) {
          flashcards.push(currentCard);
        }
      }
    
      currentCard = { question: line.replace("**Front:**", "").trim() };
      isMCQ = false;
    }

  
    if (line.startsWith("**Options:**")) {
      currentCard.options = [];
      isMCQ = true;
    }

  
    if (
      (isMCQ &&
        (line.startsWith("A.") ||
          line.startsWith("A:") ||
          line.startsWith("A)") ||
          line.startsWith("B.") ||
          line.startsWith("B)") ||
          line.startsWith("B:") ||
          line.startsWith("C.") ||
          line.startsWith("C)") ||
          line.startsWith("C:") ||
          line.startsWith("D."))) ||
      line.startsWith("D)") ||
      line.startsWith("D:")
    ) {
      currentCard.options.push(line.trim());
    }

  
    if (line.startsWith("**Back:**")) {
      currentCard.answer = line.replace("**Back:**", "").trim();
    }
  });

  if (currentCard.question) {
    if (isMCQ) {
      flashcards.push({ ...currentCard, type: "MCQ" });
    } else if (currentCard.answer) {
      flashcards.push(currentCard);
    }
  }

  return flashcards;
}


async function extractTextFromPpt(filePath) {
  
  return ""; 
}


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
