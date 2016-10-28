window.onload = function () {
  // elements:
  var inputField; var outputField;
  // objects:
  var robot={}; var user={};
  // functions:
  var append; var keypress; var dice;

  inputField = document.getElementById('input');
  outputField = document.getElementById('output');

  append = function (appendedObj, baseObj) {
    var keys; var ii;
    keys = Object.keys(appendedObj);
    for (ii=0 ; ii < keys.length ; ii++) {
      baseObj[keys[ii]] = appendedObj[keys[ii]];
    }
  };

  dice = function (min, max, extra) {
    var val;
    val = Math.random() * (max-min) + min;
    if (extra==='floor') {
      val = Math.floor(val);
    }
    return val;
  };

  keypress = function (e) {
    var input;
    if (e.key==='Enter') {
      input = inputField.value;
      outputField.innerHTML += '<use>You: ' + input + '</use><br>';
      inputField.value = '';
      inputField.placeholder = '';
      robot.respond(input);
      window.scrollBy(0, 100);
    }
  };
  document.onkeydown = keypress;

  robot.enterText = function (text) {
    if (text) {
      window.setTimeout(function () {
        outputField.innerHTML += '<bot>Me: ' + text + '</bot><br>';
        window.scrollBy(0, 100);
      }, dice(100, 1000));
    }
  };

  robot.keywords = {

    exe: function (word) {
      if (typeof this.keywords.wordsObj[word]==='function') {
        this.keywords.wordsObj[word]();
      } else if (typeof this.keywords.wordsObj[word]==='string') {
        this.enterText(this.keywords.wordsObj[word]);
      }
    }.bind(robot),

    getWords: function () {
      return Object.keys(this.wordsObj);
    },
  };

  robot.introduce = function () {
    this.enterText("Hello, I'm a chatbot. I know some games, do you want to play?");
    this.listenFor(["yes", "sure", "ok", "yeah", "play"], function () {
      this.clearListeners();
      this.enterText("Okay! What do you want to play? I only know how to play hangman right now, is that good?");
      this.listenFor(["yes", "yeah", "sure", "ok", "play", "hangman", "do it", "fine", "great", "good"], function () {
        this.clearListeners();
        this.enterText("Okay great, which one of us should come up with the word?");
        this.listenFor(["i will", "i'll", "i can", "me"], function () {
          this.clearListeners();
          this.enterText("This is embarassing -- I actually don't know how to do that yet. I'm still learning... do you still want to play though?");
          this.listenFor(["yes", "yeah", "ok", "fine", "sure", "you", "play"], function () {
            this.clearListeners();
            this.playHangman();
          }.bind(this));
          this.listenFor(["no", "not", "don't"], function () {
            this.clearListeners();
            this.enterText("I guess that's fair if you don't want to. Sorry.");
          }.bind(this));
        }.bind(this));
        this.listenFor(["you", "bot"], function () {
          this.playHangman();
        }.bind(this));
      }.bind(this));
      this.listenFor(["no", "don't", "not"], function () {
        this.clearListeners();
        this.enterText("Oh well whatever, nevermind.");
      }.bind(this));
    }.bind(this));
    this.listenFor(["no"], function () {
      this.clearListeners();
      this.enterText("Okay, that's fine then.");
    }.bind(this));
  }.bind(robot);

  robot.playHangman = function () {
    this.keywords.wordsObj = {};
    this.correctLetters = [];
    this.incorrectLetters = [];
    this.clearListeners();
    this.enterText("Alright, I'll come up with a word. Let me think...");
    this.hangmanWord = dictionary[dice(0, dictionary.length, 'floor')];
    console.log(this.hangmanWord);
    window.setTimeout(function () {
      var num;
      if (this.hangmanWord.length < 21) {
        num = this.numNames[this.hangmanWord.length];
      } else {
        num = this.hangmanWord.length;
      }
      this.enterText("Okay, got it. It's " + num + " letters long. Now guess a letter and I'll tell you if you're right.");
    }.bind(this), 1000);
    this.game = 'start-hangman';
  };

  robot.displayHangmanWord = function () {
    var output; var word; var xx;
    output = '';
    word = this.hangmanWord.split('');
    for (xx=0 ; xx < word.length ; xx++) {
      if (this.correctLetters.includes(word[xx])) {
        output += word[xx];
      } else {
        output += '*';
      }
    }
    if (!output.includes('*')) {
      window.setTimeout(function () {
        this.enterText("Alright, you won! Do you want to play again?");
        this.listenFor(["yes", "sure", "okay", "play", "yeah"], function () {
          this.clearListeners();
          this.enterText("Great!");
          this.playHangman();
        }.bind(this));
        this.listenFor(["no", "don't", "not", "enough"], function () {
          this.clearListeners();
          this.enterText("Okay, let's hang out again some time!");
        }.bind(this));
        this.game = '';
      }.bind(this), 1000);
    }
    this.enterText(output);
  };

  robot.checkForHangmanGuess = function (input) {
    if (input.length > 1) {
      this.clearListeners();
      this.enterText("Are you trying to guess the word?");
      this.listenFor(["yes", "yeah", "right", "am"], function () {
        this.clearListeners();
        this.enterText("Okay, what do you think it is?");
      }.bind(this));
      this.listenFor(["no", "not"], function () {
        this.clearListeners();
        this.enterText("Alright, then you can only guess one letter at a time.");
      });
    } else if (input.length === 1) {
      if (this.correctLetters.includes(input) || this.incorrectLetters.includes(input)) {
        this.enterText("You already guessed that one.");
      } else if (this.hangmanWord.includes(input)) {
        this.enterText("Good guess.");
        this.correctLetters.push(input);
      } else {
        this.incorrectLetters.push(input);
        var rand; var reply; var num;
        rand = dice(1,30);
        if (rand < 10) {
          reply = "Nope.";
        } else if (rand < 20) {
          reply = "No.";
        } else {
          reply = "No " + input.toUpperCase() + '.';
        }
        if (this.incorrectLetters.length > 4 && (dice(1,10) > 3)) {
          if (this.incorrectLetters.length < 21) {
            num = this.numNames[this.incorrectLetters.length];
          } else {
            num = this.incorrectLetters.length;
          }
          reply += " That's " + num + " wrong guesses!";
        }
        this.enterText(reply);
      }
      window.setTimeout(function () {
        this.displayHangmanWord();
      }.bind(this), 250);
    }
  };

  robot.activeListeners = [];

  robot.numNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

  robot.clearListeners = function () {
    var xx;
    for (xx=0 ; xx < this.activeListeners.length ; xx++) {
      delete this.keywords.wordsObj[this.activeListeners[xx]];
    }
    this.activeListeners = [];
  };

  robot.listenFor = function (words, callback) {
    var xx;
    for (xx=0 ; xx < words.length ; xx++) {
      this.activeListeners.push(words[xx]);
      this.keywords.wordsObj[words[xx]] = callback;
    }
  };

  robot.keywords.wordsObj = {
    'hello': robot.introduce,
    'hey': robot.introduce,
    'hi': robot.introduce,
    'help': robot.introduce,
  };

  robot.dontUnderstand = function () {
    var response; var randPercent;
    randPercent = dice(1,100);
    if (randPercent < 20) {
      response = "I didn't understand that, sorry.";
    } else if (randPercent < 30) {
      response = "Sorry, I can't understand that.";
    } else if (randPercent < 50) {
      response = "I don't understand";
    } else if (randPercent < 70) {
      response = "Sorry, I don't understand what you're saying.";
    } else {
      response = "I'm sorry, I don't think I understand.";
    }
    return response;
  };

  robot.respond = function (input) {
    var xx; var understood;
    input = input.toLowerCase();
    output = '';

    for (xx=0 ; xx < this.keywords.getWords().length ; xx++) {
      if (input.includes(this.keywords.getWords()[xx]) && !understood) {
        this.keywords.exe(this.keywords.getWords()[xx]);
        understood = true;
      }
    }

    if (output) {
      this.enterText(output);
    }

    if (this.game === 'hangman') {
      this.checkForHangmanGuess(input);
      understood = true;
    } else if (this.game === 'start-hangman') {
      this.game = 'hangman';
      understood = true;
    }

    if (!understood) {
      this.enterText(this.dontUnderstand());
    }
  };
};
