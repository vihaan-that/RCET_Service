const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const { questionSchema, submissionSchema } = require("./schemas/v1/schema");
const submitCode = require("./utils/submission");
const evaluateCode = require("./utils/evaluation");
const mongoURI = "mongodb+srv://Admin:Password123@rcetdata.lma3adh.mongodb.net/RCET_DATA";
const app = express();
const PORT = 3000;
app.set('view cache', false);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

mongoose.connect(mongoURI, {});
const db = mongoose.connection;


const Submissions = mongoose.model("Submissions", submissionSchema);

const Questions = mongoose.model("bhargav_question", questionSchema);

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});


app.get("/RCET/practice/:questionID/:userID/:contestID", async (req, res) => {
  const questionId = req.params['questionID'];
  const userID = req.params['userID'];
  const contestID = req.params['contestID']

   try {
      const question = await Questions.findOne({ QuestionId: questionId });
      const submission = await Submissions.findOne(
         { QuestionID: questionId, UserID: userID,  Status: "ACCEPTED" }
      
      );

      if (!question) {
      return res.status(404).json({ error: "Question not found" });
      }

       // Create a copy of the sample data object and update its fields with fetched details
      let updatedData;

      if (!submission) {
         updatedData = {
            status: "none",
            status01: "none",
            status02: "none",
            status03: "none",
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
      }

      // Render the page with updated data
      res.render("RCET_home", updatedData);

   } catch (error) {
       console.error("Error:", error);
       res.status(500).json({ error: "Internal server error" });
   }
});

function generateString(questionID, userID, timestamp) {
  // Example of generating a string based on the parameters
  return `${questionID}-${userID}-${timestamp}`;
}


// Define the route to handle POST requests for saving and running code
app.post("/upload", async (req, res) => {
   const userCode = req.body['code']; // Parse the request body
   const questionID = req.body['questionID'];
   const userID = req.body['userID'];


   let checked_flag = true;
   let updatedData;

   try {
      const question = await Questions.findOne({ QuestionId: questionID });

      if (!question)
         return res.status(404).json({ error: "Question not found" });

      updatedData = { ...question['_doc'] };
      console.log(updatedData);
   } catch (error) {
      console.error("Error:", error);
   }

   const inputArray = [
      updatedData.QuestionTestInput01,
      updatedData.QuestionTestInput02,
      updatedData.QuestionTestInput03,
   ];

   const outputArray = [
      updatedData.QuestionTestOutput01,
      updatedData.QuestionTestOutput02,
      updatedData.QuestionTestOutput03,
   ];


   try {
      const { resultArray, compStatus } = await evaluateCode(userCode, inputArray, outputArray);
      const timestamp = new Date().toISOString();

      const submissionData = {
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
         userSubmittedCode: userCode,
      };

      await submitCode(submissionData);

      const pageData = {
         ...updatedData,
         status01: resultArray[0],
         status02: resultArray[1],
         status03: resultArray[2],
         status: compStatus,
      };

      statusValues = { status: pageData.status, status01: pageData.status01, status02: pageData.status02, status03: pageData.status03 };
      const consoleTemplate = fs.readFileSync("./views/console.ejs", "utf-8");
      const updatedconsoleView = ejs.compile(consoleTemplate);
      const updatedConsoleHTML = updatedconsoleView(statusValues);
      res.send(updatedConsoleHTML);

   } catch (e) {
      console.log(e.message);
   }
});

// starts server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
