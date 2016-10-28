window.onload = function () {
  // elements:
  var inputField; var outputField;
  // objects:
  var answerListeners={}; var stringResponses={}; var mem={};
  // functions:
  var append; var askQuestion; var enterText; var respond; var keypress; var dice;

  inputField = document.getElementById('input');
  outputField = document.getElementById('output');

  dice = function (min, max) {
    return Math.random() * (max-min) + min;
  };

  enterText = function (text) {
    if (text) {
      window.setTimeout(function () {
        outputField.innerText += 'Me: ' + text + '\n';
      }, dice(100, 1000));
    }
  };

  stringResponses = {
    "hi": "Hello.",
    'help': "Sorry, I haven't been programmed to talk much yet. Say hello to test my memory."
  };

  respond = function (input) {
    output = '';
    input = input.toLowerCase();
    if (Object.keys(stringResponses).includes(input)) {
      output = stringResponses[input.toLowerCase()];
      enterText(output);
    }
  };

  append = function (appendedObj, baseObj) {
    var keys; var ii;
    keys = Object.keys(appendedObj);
    for (ii=0 ; ii < keys.length ; ii++) {
      baseObj[keys[ii]] = appendedObj[keys[ii]];
    }
  };

  keypress = function (e) {
    var input;
    if (e.key==='Enter') {
      input = inputField.value;
      outputField.innerText += 'You: ' + input + '\n';
      inputField.value = '';
      inputField.placeholder = '';
      respond(input);
    }
  };
  document.onkeydown = keypress;

  askQuestion = function (text, answersObj) {
    if (text) {
      enterText(text);
      append(answersObj, answerListeners);
    }
  };
};
