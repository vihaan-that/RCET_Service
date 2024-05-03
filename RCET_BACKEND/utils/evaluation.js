async function evaluateCode (Val, inputArray, outputArray) {
   let resultArray = []
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
         headers: {
            "content-type": "application/json",
         },
         body: raw,
         redirect: "follow",
      };

      try {
         const response = await fetch("https://emkc.org/api/v2/piston/execute", requestOptions);
         const result = await response.json();

         // Added Guard instead of nested if-else
         if (result.compile.code !== 0 || result.run.code !== 0) {
            compStatus = "FAILED";
            resultArray.push("NO");
         } else
            result.run.stdout === outputArray[i] ? resultArray.push("YES") : resultArray.push("NO");

      } catch (error) {
         console.error(error);
      }
   }
   return { resultArray, compStatus };
}

module.exports = evaluateCode;
