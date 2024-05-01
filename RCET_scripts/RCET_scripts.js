

const executeCodeBtn = document.querySelector('.editor__run');
const submitCodeBtn = document.querySelector('.editor__submit');
//Editor Initialising 
let codeEditor = ace.edit(codeEditorWindow);
userData = {
  "username": "exampleUser",
  "time": "2024-04-11T10:00:00Z",
  "questionID": "12345"
}


let editorLibrary = {
  init() {
    //configure Editor

    //Theme
    codeEditor.setTheme("ace/theme/monokai");
    //language Setter
    //append language name to the value in future edits;
    codeEditor.session.setMode("ace/mode/c_cpp");
    //set options
    codeEditor.setOptions({
      fontFamily: "JetBrains Mono",
      fontSize: '14pt',
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,

    });
  }
}
//events
// Add an event listener to the execute code button
executeCodeBtn.addEventListener('click', async () => {
  const userCode = codeEditor.getValue();
  function escapeString(input) {
    return input
        .replace(/\\/g, '\\\\') // Escapes backslashes
        .replace(/\n/g, '\\n') // Escapes newline characters
        .replace(/\r/g, '\\r') // Escapes carriage return characters
        .replace(/\t/g, '\\t') // Escapes tab characters
        .replace(/"/g, '\\"') // Escapes double quotes
        .replace(/'/g, '\\\''); // Escapes single quotes
}
const escapedString = escapeString(userCode);
console.log('Escaped string:', escapedString);
const codeJson = {"code":userCode, "questionID":"919", "userID":"0"};
console.log(codeJson);
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: JSON.stringify(codeJson),
  redirect: "follow"
};

fetch("http://localhost:3000/upload", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

}
);

submitCodeBtn.addEventListener('click', () => {
  const finalUserCode = codeEditor.getValue();
  fetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: finalUserCode
  })
    .then(response => response.text())
    .then(message => {
      alert(message);
    })
    .catch(error => {
      console.error('ERROR: ', error);
      //ERROR HANDLING;
    });
});
editorLibrary.init();
// note: Implement a DropDown for language Selection.


