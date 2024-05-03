const executeCodeBtn = document.querySelector('.editor__run');
const submitCodeBtn = document.querySelector('.editor__submit');
//Editor Initialising 
let codeEditor = ace.edit(codeEditorWindow);

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
let url = window.location.href;
url = (new URL(url)).pathname.split('/');


const requestOptions = {
  method: "POST",
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify({
    code: userCode,
    questionID: url[3],
    userID: url[4],
    contestID: url[5],
  }),
};

fetch("http://localhost:3000/upload", requestOptions)
  .then((response) => response.text())
  .then((result) => document.getElementById('editorConsole').innerHTML = result)
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


