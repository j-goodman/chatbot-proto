window.onload = function () {
  // elements:
  var inputField; var outputField;
  // objects:
  var answerListeners={}; var stringResponses={}; var functionResponses={}; var mem={};
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

  functionResponses = {
    "hello": function () {
      askQuestion("Hello. Choose a number between 1 and 5?", {
        "1": function () {
          enterText("No, it can't be 1 or 5");
        },
        "2": function () {
          mem.numGiven = 2;
          enterText("Okay, I'll remember it if you ask me.");
        },
        "3": function () {
          mem.numGiven = 3;
          enterText("Okay, I'll remember it if you ask me.");
        },
        "4": function () {
          mem.numGiven = 4;
          enterText("Okay, I'll remember it if you ask me. 4. Got it.");
        },
        "5": function () {
          enterText("No, it can't be 1 or 5");
        }
      });
    }
  };

  respond = function (input) {
    output = '';
    input = input.toLowerCase();
    if (Object.keys(stringResponses).includes(input)) {
      output = stringResponses[input.toLowerCase()];
      enterText(output);
    } else if (Object.keys(functionResponses).includes(input)) {
      functionResponses[input]();
    } else {
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
