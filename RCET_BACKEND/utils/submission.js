const { submissionSchema } = require("../schemas/v1/schema");
const mongoose = require("mongoose");


const submissions = mongoose.model("Submissions", submissionSchema);

async function submitCode (data) {
   try {
      const newSubmission = new submissions(data);
      return await newSubmission.save();
   } catch (error) {
      console.error('Error saving submission at line 268:', error.message);
   }
}

module.exports = submitCode;