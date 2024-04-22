const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const { stringify } = require("querystring");
const { describe } = require("node:test");
const { log } = require("console");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://Admin:Password123@rcetdata.lma3adh.mongodb.net/RCET_DATA";
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(mongoURI, {});
const db = mongoose.connection;
const questionSchema = new mongoose.Schema({
  text: String,
  difficulty: String,
  QuestionScore: Number,
  QuestionId: Number,
  QuestionInputFormat: String,
  QuestionOutputFormat: String,
  QuestionTestInput01: String,
  QuestionTestInput02: String,
  QuestionTestInput03: String,
  QuestionTestOutput01: String,
  QuestionTestOutput02: String,
  QuestionTestOutput03: String,
  QuestionTitle: String,
  runMemoryLimit: String,
  runTimeout: Number,
});
const submissionSchema = new mongoose.Schema({
  QuestionID: String,
  SubmissionID: String,
  UserID: String,
  ContestID: String,
  CompileStatus: String,
  Status01: String,
  Status02: String,
  Status03: String,
  Status: String,
  userSubmittedCode: String,
});

const Submissions = mongoose.model("Submissions", submissionSchema);

const Questions = mongoose.model("Questions", questionSchema);
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
const data = {
  questionTitle: "Sample Question Title",
  questionText: "This is a sample question text.",
  inputFormat: "Sample input format.",
  outputFormat: "Sample output format.",
  testInput01: "Sample test input 1",
  testOutput01: "Sample test output 1",
  testInput02: "Sample test input 2",
  testOutput02: "Sample test output 2",
  testInput03: "Sample test input 3",
  testOutput03: "Sample test output 3",
  status: "Yet to Solve",
  status01: "Not Accepted",
  status02: "Not Accepted",
  status03: "Not Accepted",
};
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});
const sampleData = {
  questionTitle: "Sample Question Title",
  questionText: "This is a sample question text.",
  inputFormat: "Sample input format.",
  outputFormat: "Sample output format.",
  testInput01: "Sample test input 1",
  testOutput01: "Sample test output 1",
  testInput02: "Sample test input 2",
  testOutput02: "Sample test output 2",
  testInput03: "Sample test input 3",
  testOutput03: "Sample test output 3",
  status: "Yet to Solve",
  status01: "Not Accepted",
  status02: "Not Accepted",
  status03: "Not Accepted",
};

app.get("/", (req, res) => {
  res.render("RCET_home", data);
});

app.get("/RCET/practice/:questionID/:userID/:contestID", async (req, res) => {
  const questionId = req.params.questionID;
  const userID = req.params.userID;
  const contestID = req.params.contestID;

  try {
    //const question = await Questions.findOne({ QuestionId: 189});
   const question = await Questions.findOne({id:'660dc17cf8ba68be2e25373e'});
    const submission = await Submissions.find(
      { QuestionID: questionId, UserID: userID },
      {}
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    console.log(question);
    console.log(questionId);

    // Create a copy of the sample data object and update its fields with fetched details

    if (!submission) {
      var updatedData = {
        ...sampleData,
        questionTitle: question.Question_title,
        questionText: question.text,
        inputFormat: question.Question_input_Format,
        outputFormat: question.Question_output_format,
        testInput01: question.testInput01,
        testOutput01: question.testOutput01,
        testInput02: question.testInput02,
        testOutput02: question.testOutput02,
        testInput03: question.testInput03,
        testOutput03: question.testOutput03,
      };
    }
    var updatedData = {
      ...sampleData,
      questionTitle: question.Question_title,
      questionText: question.text,
      inputFormat: question.Question_input_Format,
      outputFormat: question.Question_output_format,
      testInput01: question.testInput01,
      testOutput01: question.testOutput01,
      testInput02: question.testInput02,
      testOutput02: question.testOutput02,
      testInput03: question.testInput03,
      testOutput03: question.testOutput03,
      status: submission[0].status,
      status01: submission[0].status01,
      status02: submission[0].status02,
      status03: submission[0].status03,
    };

    // Render the page with updated data
    res.render("RCET_home", updatedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Use JSON middleware to parse incoming JSON requests
app.use(express.json());

const sampleSubmission = {
  QuestionID: "000",
  SubmissionID: "000",
  UserID: "000",
  ContestID: "000",
  CompileStatus: "RUNNING",
  Status01: "NO",
  Status02: "NO",
  Status03: "NO",
  Status: "NOT ACCEPTED",
  userSubmittedCode: "",
};
var userCode;
function generateString(questionID, userID, timestamp) {
  // Example of generating a string based on the parameters
  return `String based on questionID: ${questionID}, userID: ${userID}, and timestamp: ${timestamp}`;
}

// Usage:

// Define the route to handle POST requests for saving and running code
app.post("/upload", async (req, res) => {
  const Val = req.body.code; // Parse the request body
  const questionID = req.body.questionID;
  const userID = req.body.userID;
  console.log(Val);
  console.log(typeof Val);
  userCode = Val;
  const myHeaders = new Headers();
  const questionData = req.body.updatedData;
  myHeaders.append("Content-Type", "application/json");

  const question = await Questions.findOne({ Question_id: questionId });

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  const inputArray = [
    question.testInput01,
    question.testInput02,
    question.testInput03,
  ]; // Square brackets for array declaration
  const outputArray = [
    question.testOutput01,
    question.testOutput02,
    question.testOutput03,
  ]; // Square brackets for array declaration
  const resultArray = [];
  const compStatus = "RUNNING";
  for (let i = 0; i < 3; i++) {
    const raw = JSON.stringify({
      language: "c++",
      version: "10.2.0",
      files: [
        {
          name: "my_cool_code.cpp",
          content: Val,
        },
      ],
      stdin: inputArray[i],
      args: ["1", "2", "3"],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:2000/api/v2/execute",
        requestOptions
      );
      const result = await response.json();

      if (result.compile.code !== 1) {
        if (result.stdout === outputArray[i]) {
          resultArray.push("YES");
        } else {
          resultArray.push("NO");
        }
      } else {
        compStatus = "FAILED";
        resultArray.push("NO");
      }
    } catch (error) {
      console.error(error);
    }
  }
  const timestamp = new Date().toISOString();

  const submissionDeets = {
    ...sampleSubmission,
    QuestionID: questionID,
    SubmissionID: generateString(questionID, userID, timestamp),
    UserID: userID,
    ContestID: contestID,
    CompileStatus: compStatus,
    Status01: resultArray[0],
    Status02: resultArray[1],
    Status03: resultArray[2],
    Status:
      resultArray[0] === "YES" &&
      resultArray[1] === "YES" &&
      resultArray[2] === "YES"
        ? "ACCEPTED"
        : "NOT ACCEPTED",
    userSubmittedCode: Val,
  };
  const pageData = {
    ...updatedData,
    Status01: resultArray[0],
    Status02: resultArray[1],
    Status03: resultArray[2],
    Status: compStatus,
  };

  res.render("RCET_home", pageData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
