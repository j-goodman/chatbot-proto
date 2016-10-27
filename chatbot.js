window.onload = function () {
  var inputField; var outputField; var respond; var enterText; var hardResponses;

  inputField = document.getElementById('input');
  outputField = document.getElementById('output');

  enterText = function (text) {
    if (text) {
      window.setTimeout(function () {
        outputField.innerText += 'Me: ' + text + '\n';
      }, 900*Math.random()+100);
    }

  };

  hardResponses = {
    'hello': 'Hello to you too.',
    'hi': 'Hello.',
  };

  respond = function (input) {
    output = '';
    if (Object.keys(hardResponses).includes(input.toLowerCase())) {
      output = hardResponses[input.toLowerCase()];
    }
    enterText(output);
  };

  document.onkeydown = function (e) {
    var input;
    if (e.key==='Enter') {
      input = inputField.value;
      outputField.innerText += 'You: ' + input + '\n';
      inputField.value = '';
      inputField.placeholder = '';
      respond(input);
    }
  };
};
