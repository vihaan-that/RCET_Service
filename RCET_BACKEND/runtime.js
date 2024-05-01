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
app.set('view cache', false);
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
  // What do these Status{X} represent ?

  Status01: String,
  Status02: String,
  Status03: String,
  Status: String,
  userSubmittedCode: String,
});

const Submissions = mongoose.model("Submissions", submissionSchema);

const Questions = mongoose.model("bhargav_question", questionSchema);

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
  questionText: "This is a sample sample text.",
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
  res.render("RCET_home", sampleData);
});


// Takes preliminary info and submits the solution ?
app.get("/RCET/practice/:questionID/:userID/:contestID", async (req, res) => {
  const questionId = req.params.questionID;
  const userID = req.params.userID;
  const contestID = req.params.contestID;

   try {
      //const question = await Questions.findOne({ QuestionId: 189});

   // const question = await Questions.findOne({id:'660dc17cf8ba68be2e25373e'}); // why are you using a static id ?
      // fetching dynamic question
      const question = await Questions.findOne({ QuestionId: questionId });
    const submission = await Submissions.find(
      { QuestionID: questionId, UserID: userID },
      {}
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    console.log("Question object Fetched is:\n");
    console.log(question);
    console.log("Question ID is:\n ");
    console.log(questionId);

    // Create a copy of the sample data object and update its fields with fetched details
    let updatedData;

    if (!submission) {
       updatedData = {
        ...sampleData,
        questionTitle: question.QuestionTitle,
        questionText: question.text,
        inputFormat: question.QuestionInputFormat,
        outputFormat: question.QuestionOutputFormat,
        testInput01: question.QuestionTestInput01,
        testOutput01: question.QuestionTestOutput01,
        testInput02: question.QuestionTestInput02,
        testOutput02: question.QuestionTestOutput02,
        testInput03: question.QuestionTestInput03,
        testOutput03: question.QuestionTestOutput03,
      };
    }

    else {
      console.log("Type of Question Title is:\n");
      console.log(typeof(question.QuestionTitle));
     updatedData = {
      questionTitle: question.QuestionTitle,
      questionText: question.text,
      inputFormat: question.QuestionInputFormat,
      outputFormat: question.QuestionOutputFormat,
      testInput01: question.QuestionTestInput01,
      testOutput01: question.QuestionTestOutput01,
      testInput02: question.QuestionTestInput02,
      testOutput02: question.QuestionTestOutput02,
      testInput03: question.QuestionTestInput03,
      testOutput03: question.QuestionTestOutput03,
      status: submission.Status,
      status01: submission.Status01,
      status02: submission.Status02,
      status03: submission.Status03,
     };
     console.log("The value of Updated Data is\n");
     console.log(updatedData);
    }
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
  return `${questionID}-${userID}-${timestamp}`;
}

// Usage:

// Define the route to handle POST requests for saving and running code
app.post("/upload", async (req, res) => {
  const Val = req.body.code; // Parse the request body
  const questionID = req.body.questionID;
  const userID = req.body.userID;
  console.log("The value of req.body.code at upload route is:\n");
  console.log(Val);
  console.log(typeof Val);
  userCode = Val;
  const myHeaders = new Headers();
  let CheckedFlag = true;
  let updatedData;
  try {
    //const question = await Questions.findOne({ QuestionId: 189});

 // const question = await Questions.findOne({id:'660dc17cf8ba68be2e25373e'}); // why are you using a static id ?
    // fetching dynamic question
    const question = await Questions.findOne({ QuestionId: questionID });
  const submission = await Submissions.find(
    { QuestionID: questionID, UserID: userID },
    {}
  );

  if (!question&&typeof(question)=="undefined") {
    return res.status(404).json({ error: "Question not found" });
  }
  console.log("Question object Fetched is:\n");
  console.log(question);
  console.log(questionID);

  // Create a copy of the sample data object and update its fields with fetched details
  

  if (!submission||submission==undefined) {
      CheckedFlag = false;
     updatedData = {  
      ...sampleData,
      questionTitle: question.QuestionTitle,
      questionText: question.text,
      inputFormat: question.QuestionInputFormat,
      outputFormat: question.QuestionOutputFormat,
      testInput01: question.QuestionTestInput01,
      testOutput01: question.QuestionTestOutput01,
      testInput02: question.QuestionTestInput02,
      testOutput02: question.QuestionTestOutput02,
      testInput03: question.QuestionTestInput03,
      testOutput03: question.QuestionTestOutput03,
    };
  }

  else {
    console.log(typeof(question.QuestionTitle));
   updatedData = {
     status: "Yet to Solve",
    questionTitle: question.QuestionTitle,
    questionText: question.text,
    inputFormat: question.QuestionInputFormat,
    outputFormat: question.QuestionOutputFormat,
    testInput01: question.QuestionTestInput01,
    testOutput01: question.QuestionTestOutput01,
    testInput02: question.QuestionTestInput02,
    testOutput02: question.QuestionTestOutput02,
    testInput03: question.QuestionTestInput03,
    testOutput03: question.QuestionTestOutput03,
    status: submission.Status,
    status01: submission.Status01,
    status02: submission.Status02,
    status03: submission.Status03,
   };
   console.log("The value of Updated Data at upload route is\n");
   console.log(updatedData);
  }
} catch (error) {console.error("Error:", error);}
  myHeaders.append("Content-Type", "application/json");

  // const question = await Questions.findOne({ QuestionId: questionID });
  // console.log("The question fetched at upload route is:\n");
  // console.log(question);
  
  

  // if (!question) {
  //   return res.status(404).json({ error: "Question not found" });
  // }

  // const inputArray = [
  //   question.testInput01,
  //   question.testInput02,
  //   question.testInput03,
  // ]; // Square brackets for array declaration

  // const outputArray = [
  //   question.testOutput01,
  //   question.testOutput02,
  //   question.testOutput03,
  // ]; // Square brackets for array declaration
  // //testing to debug
  // for(let looperValue = 0;looperValue<3;looperValue++){
  //   console.log("The value of inputArray[looperValue] and outputArray[looperValue] is:\n");
  //   console.log(inputArray[looperValue]);
  //   console.log(outputArray[looperValue]);  
  // }
  const question = await Questions.findOne({ QuestionId: questionID });

// Check if question exists and has test input/output fields
if (!question) {
  return res.status(404).json({ error: "Question not found" });
} else if (
  !question.QuestionTestInput01 ||
  !question.QuestionTestInput02 ||
  !question.QuestionTestInput03 ||
  !question.QuestionTestOutput01 ||
  !question.QuestionTestOutput02 ||
  !question.QuestionTestOutput03
) {
  return res.status(404).json({ error: "Question data is incomplete" });
}

// Populate input and output arrays
const inputArray = [
  question.QuestionTestInput01,
  question.QuestionTestInput02,
  question.QuestionTestInput03,
];
const outputArray = [
  question.QuestionTestOutput01,
  question.QuestionTestOutput02,
  question.QuestionTestOutput03,
];

  const resultArray = [];
  let compStatus = "RUNNING";
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
        "https://emkc.org/api/v2/piston/execute",
        requestOptions
      );
      const result = await response.json();

      if (result.compile.code !== 1) {
        if (result.stdout === outputArray[i]) resultArray.push("YES");
        
        else resultArray.push("NO");
      } else {
         compStatus = "FAILED";
        resultArray.push("NO");
      }
      console.log("The values of result.stdout and outputArray[i] are:\n");
      console.log(toString(result.stdout));
        console.log(toString(outputArray[i]));
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
    ContestID: "000",
    CompileStatus: compStatus,
    Status01: resultArray[0],
    Status02: resultArray[1],
    Status03: resultArray[2],
    Status:
      (resultArray[0] === "YES" &&
      resultArray[1] === "YES" &&
      resultArray[2] === "YES") ? "ACCEPTED" : "NOT ACCEPTED",
    userSubmittedCode: Val,
  };
    try {
    const newSubmission = new Submissions(submissionDeets);
    const savedSubmission = await newSubmission.save();
    } catch(error){
      console.error('Error saving submission at line 268:', error);
      res.status(500).json({ error: "Internal server error" });
    }

  
  



  const pageData = {
    ...updatedData,
    Status01: resultArray[0],
    Status02: resultArray[1],
    Status03: resultArray[2],
    Status: compStatus,
  };

  res.render("RCET_home", pageData);
});

// starts server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
