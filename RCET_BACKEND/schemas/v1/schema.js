const mongoose = require("mongoose");

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


module.exports = { questionSchema, submissionSchema };