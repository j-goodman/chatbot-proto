window.onload = function () {
  // elements:
  var inputField; var outputField; var canvasField;
  // objects:
  var robot={}; var user={};
  // functions:
  var append; var keypress; var dice;

  inputField = document.getElementById('input');
  outputField = document.getElementById('output');
  canvasField = document.getElementById('canvas');

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
      window.scrollBy(0, 250);
    }
  };
  document.onkeydown = keypress;

  robot.enterText = function (text) {
    if (text) {
      window.setTimeout(function () {
        outputField.innerHTML += '<bot>Me: ' + text + '</bot><br>';
        window.scrollBy(0, 250);
      }, dice(100, 1000));
    }
  };


  robot.enterImage = function (src) {
    outputField.innerHTML += '<img src='+src+'></img><br>';
    window.scrollBy(0, 250);
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
      num = this.nameNum(this.hangmanWord.length);
      this.enterText("Okay, got it. It's " + num + " letters long. Now guess a letter and I'll tell you if you're right.");
    }.bind(this), 1000);
    this.game = 'start-hangman';
  };

  robot.generateWrongGuessGIF = function (letter, wrongGuesses) {
    encoder = new GIFEncoder();
    encoder.setRepeat(1);
    encoder.setDelay(200);
    encoder.start();

    var ctx;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,400,400);
    ctx.font = '120pt monospace';
    ctx.fillStyle = "#000";
    ctx.fillText(letter, 148, 224);
    encoder.addFrame(ctx);
    ctx.font = '150pt sans-serif';
    ctx.fillStyle = "#f00";
    ctx.fillText('X', 132, 252);
    encoder.addFrame(ctx);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,400,400);
    ctx.beginPath();
    ctx.moveTo(50,400);
    ctx.lineTo(50,350);
    ctx.lineTo(350,350);
    ctx.lineTo(350,400);
    ctx.moveTo(100,350);
    ctx.lineTo(100,50);
    ctx.lineTo(240,50);
    ctx.lineTo(240,100);
    ctx.stroke();

    if (wrongGuesses > 0) {
      ctx.beginPath();
      ctx.arc(240,130,30,0,2*Math.PI);
      ctx.strokeStyle = "#000";
      ctx.stroke();
      encoder.addFrame(ctx);
    }

    if (wrongGuesses > 1) {
      ctx.moveTo(224, 156);
      ctx.lineTo(224, 220);
      ctx.lineTo(256, 220);
      ctx.lineTo(256, 156);
      ctx.strokeStyle = "#000";
      ctx.stroke();
      encoder.addFrame(ctx);
    }

    if (wrongGuesses > 2) {
      ctx.moveTo(224, 156);
      ctx.lineTo(206, 212);
      ctx.strokeStyle = "#000";
      ctx.stroke();
      encoder.addFrame(ctx);
    }

    if (wrongGuesses > 3) {
      ctx.moveTo(256, 156);
      ctx.lineTo(274, 212);
      ctx.strokeStyle = "#000";
      ctx.stroke();
      encoder.addFrame(ctx);
    }

    if (wrongGuesses > 4) {
      ctx.moveTo(224, 220);
      ctx.lineTo(224, 280);
      ctx.strokeStyle = "#000";
      ctx.stroke();
      encoder.addFrame(ctx);
    }

    if (wrongGuesses > 5) {
      ctx.moveTo(256, 220);
      ctx.lineTo(256, 280);
      ctx.strokeStyle = "#000";
      ctx.stroke();
      encoder.addFrame(ctx);
    }

    encoder.addFrame(ctx);
    encoder.addFrame(ctx);
    encoder.addFrame(ctx);
    encoder.addFrame(ctx);
    encoder.addFrame(ctx);
    encoder.addFrame(ctx);
    encoder.finish();
    binaryGif = encoder.stream().getData();
    dataURL = 'data:image/gif;base64,'+encode64(binaryGif);
    return dataURL;
  };

  robot.generateRightGuessGIF = function (letter, word, correctLetters) {
    var offset; var xx; var space; var size;
    letter = letter.toLowerCase();
    word = word.toLowerCase();
    encoder = new GIFEncoder();
    encoder.setRepeat(1);
    encoder.setDelay(500);
    encoder.start();

    var ctx;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,400,400);
    size = 42-word.length;
    ctx.font = size+'pt monospace';
    ctx.fillStyle = "#000";
    space = 36-word.length;
    offset = 200-((word.length/2)*space);
    word = word.split('');
    for (xx=0 ; xx < word.length ; xx++) {
      if (correctLetters.includes(word[xx])) {
        ctx.fillText(word[xx], offset+(space*xx), 220);
      } else {
        ctx.fillText('-', offset+(space*xx), 220);
      }
    }
    encoder.addFrame(ctx);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,400,400);
    ctx.fillStyle = "#000";
    for (xx=0 ; xx < word.length ; xx++) {
      if (correctLetters.includes(word[xx])) {
        ctx.fillText(word[xx], offset+(space*xx), 220);
      } else if (word[xx]===letter) {
        ctx.fillStyle = "#0c0";
        ctx.fillText(word[xx], offset+(space*xx), 220);
        ctx.fillStyle = "#000";
      } else {
        ctx.fillText('-', offset+(space*xx), 220);
      }
    }
    encoder.addFrame(ctx);
    for (xx=0 ; xx < word.length ; xx++) {
      if (correctLetters.includes(word[xx]) || word[xx]===letter) {
        ctx.fillText(word[xx], offset+(space*xx), 220);
      } else {
        ctx.fillText('-', offset+(space*xx), 220);
      }
    }
    encoder.addFrame(ctx);
    encoder.addFrame(ctx);
    encoder.addFrame(ctx);
    encoder.finish();
    binaryGif = encoder.stream().getData();
    dataURL = 'data:image/gif;base64,'+encode64(binaryGif);
    return dataURL;
  };

  robot.displayHangmanWord = function () {
    var output; var word; var xx; var guessesText; var points;
    output = '';
    word = this.hangmanWord.split('');
    for (xx=0 ; xx < word.length ; xx++) {
      if (this.correctLetters.includes(word[xx])) {
        output += word[xx];
      } else {
        output += '*';
      }
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
      }.bind(this));
    } else if (input.length === 1) {
      if (this.correctLetters.includes(input) || this.incorrectLetters.includes(input)) {
        this.enterText("You already guessed that one.");
      } else if (this.hangmanWord.includes(input)) {
        this.enterText("Good guess.");
        var src = robot.generateRightGuessGIF(input, this.hangmanWord, this.correctLetters);
        robot.enterImage(src);
        this.correctLetters.push(input);
        if (this.wordIsGuessed()) {
          window.setTimeout(function () {
            this.enterText("Alright, you won! Do you want to play again?");
            this.listenFor(["yes", "sure", "okay", "play", "yeah"], function () {
              this.clearListeners();
              this.enterText("Great!");
              this.playHangman();
            }.bind(this));
            this.listenFor(["no", "don't", "not", "enough"], function () {
              this.clearListeners();
              this.enterText("Okay, see you around then!");
            }.bind(this));
            this.game = '';
          }.bind(this), 1000);
        }
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
          num = this.nameNum(this.incorrectLetters.length);
          reply += " That's " + num + " wrong guesses!";
        }
        if (this.incorrectLetters.length >= 6) {
          this.enterText('Looks like you lose this round! The word was "'+this.hangmanWord+'"! Do you want to play again?');
          this.listenFor(["yes", "sure", "okay", "play", "yeah"], function () {
            this.clearListeners();
            this.enterText("Great!");
            this.playHangman();
          }.bind(this));
          this.listenFor(["no", "don't", "not", "enough"], function () {
            this.clearListeners();
            this.enterText("Okay, see you around then!");
          }.bind(this));
          this.game = '';
        } else {
          this.enterText(reply);
        }
        window.setTimeout(function () {
          var gifsrc = this.generateWrongGuessGIF(input.toUpperCase(), this.incorrectLetters.length);
          this.enterImage(gifsrc);
        }.bind(this), 1);
      }
    }
  };

  robot.wordIsGuessed = function () {
    var word; var xx; var correct;
    correct = true;
    word = this.hangmanWord.split('');
    for (xx=0 ; xx < word.length ; xx++) {
      if (!this.correctLetters.includes(word[xx])) {
        correct = false;
      }
    }
    return correct;
  };

  robot.activeListeners = [];

  robot.numNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

  robot.nameNum = function (num) {
    if (num < this.numNames.length) {
      return this.numNames[num];
    } else {
      return num.toString();
    }
  };

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
      response = "Sorry, I can't understand what you said.";
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
  window.setTimeout(function () {
    robot.introduce();
  }, 1600);
};
