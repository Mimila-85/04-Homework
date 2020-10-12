// All ids and classes from html file that are going to be used in this script.
var secondsDisplay = document.querySelector("#seconds");
var start = document.querySelector(".start");
var startButton = document.querySelector(".startBtn");
var question = document.querySelector(".question");
var options = document.querySelector("#options");
var result = document.querySelector("#result");
var jumbotron = document.querySelector(".jumbotron");
var quiz = document.querySelector(".quiz");
var showScore = document.querySelector(".showScore");
var finalResult = document.querySelector("#finalResult");
var h1 = document.querySelector(".h1");
var highScore = document.querySelector(".highScore");
var highScoreList = document.querySelector("#highScoreList");
var viewScores = document.querySelector(".viewScores");
var viewHighScores = document.querySelector(".viewHighScores");
var h1ViewScores = document.querySelector(".h1ViewScores");
var submitScore = document.querySelector("#submitScore");


// Created an array of objects with all questions and correct answers for the quiz.
// Questions taken from https://www.tutorialspoint.com/javascript/javascript_online_quiz.htm
var questions = [
    {q: "Which built-in method calls a function for each element in the array?", 
    answers: [ 
        "While()",
        "loop()",
        "forEach()",
        "None of the above"],
    correct: "forEach()"
    },
    {q: "Which of the following function of Array object returns the last (greatest) index of an element within the array equal to the specified value, or -1 if none is found?", 
    answers: [
        "indexOf()",
        "lastIndexOf()",
        "join()",
        "map()"],
    correct: "lastIndexOf()"
    },
    {q: "Which of the following function of Array object adds and/or removes elements from an array?", 
    answers:[
        "splice()",
        "toSource()",
        "sort()",
        "unshift()"],
    correct: "splice()"
    },
    {q: "Which of the following is an advantage of using JavaScript?", 
    answers:[
        "Less server interaction",
        "Immediate feedback to the visitors",
        "Increased interactivity",
        "All of the above"],
    correct: "All of the above"
    },
    {q: "Which of the following function of String object returns the calling string value converted to lower case while respecting the current locale?", 
    answers:[ 
        "toLowerCase()",
        "toString()",
        "toLocaleLowerCase()",
        "substring()"],
    correct: "toLocaleLowerCase()"
    }
];

// Variable created to store scores.
var score = 0

// Variable created to set time span.
var secondsLeft;

// Variable created to set the first question index to be incremented by function displayQuestion.
var currentQuestion = 0;

// Variables created to display questions and answers.
var displayQ;
var displayA;
var displayAArray = [];
// console.log(displayAArray);

// Array created to store users initials and scores.
var highScoreArray = [{initials:[],userScore:[]}];
// console.log(highScoreArray);

// Calls function initial.
initial ()

// Function initial sets the original set for the start of the page.
function initial (){
    quiz.style.display = "none";
   
    // variable created to get items storage in the local storade and update highScoreArray.
    var storedScores = JSON.parse(localStorage.getItem("highScoreArray"));
    
    if (storedScores !== null) {
        highScoreArray = storedScores;
    }
    // Avoid duplication of buttons.
    var buttonClear = document.querySelector(".buttonClear");
    if (buttonClear){
        buttonClear.remove();
    }
    // Avoid duplication of buttons.
    var reStartQuiz = document.querySelector(".reStartQuiz");
    if (reStartQuiz){
        reStartQuiz.remove();
    }
    // Avoid duplication of input form.
    var userInitials = document.querySelector("#userInitials");
    if (userInitials){
        userInitials.remove();
    }
    
}

// Function created to stringify and set the highScoreArray key in localStorage.
function storeScores(){
    localStorage.setItem("highScoreArray", JSON.stringify(highScoreArray));
}

// Event listener to the start button that will start the timer function and start to display quiz questions.
startButton.addEventListener("click", function (event){
    event.preventDefault();
    // Display div with class quiz.
    quiz.style.display = "block";
    // Hide div with class start.
    start.style.display = "none";
    // Bring variables secondsLeft, currentQuestion and score to the start setting.
    secondsLeft = 60;
    currentQuestion = 0;
    score = 0;
    // Clear result.
    result.textContent ="";

    // Avoid image gameOver to show when user is trying the quiz for the second or more times.
    var gameOver = document.querySelector(".gameOver");
    if (gameOver){
        gameOver.remove();
    }
    
    // Call function displayQuestions;
    displayQuestions();
    // Call function timer;
    timer();
})

// When user click on "View High Scores" the following takes place.
viewScores.addEventListener("click", function highScorePage(){
    clearInterval(timerInterval);
    secondsDisplay.textContent = "";
    // Hide div class quiz;
    quiz.style.display = "none";
    // Hide div showScore;
    showScore.style.display = "none";
    // Hide div with class start.
    start.style.display = "none";
    // Display div viewHighScores;
    viewHighScores.style.display = "block";
    // Add a text content to h1ViewScores;
    h1ViewScores.textContent = "High Scores";

    initial();

    // Creates button to give user the option to restart quiz;
    var buttonRestart = document.createElement("button");
    buttonRestart.className = "button reStartQuiz";
    buttonRestart.textContent = "Restart Quiz";  
    viewHighScores.appendChild(buttonRestart); 

    // Event listerner that will bring user back to the start of the quiz.
    document.querySelector(".reStartQuiz").addEventListener("click", function(){
        viewHighScores.style.display = "none";
        start.style.display = "block";
    });

    // Clear highScoreList element.
    highScoreList.textContent = "";

    // Render a new li for each new stored initial and score.
    for (var i = 0; i < highScoreArray[0].initials.length; i++) {
        var newHighScore = highScoreArray[0].userScore[i];
        var newInitials = highScoreArray[0].initials[i];
        
        var li = document.createElement("li");
        li.textContent = newInitials + " " + newHighScore;
        li.setAttribute("data-index", i);
        highScoreList.appendChild(li);
    }
    
    // Create a button that gives user the ability to clear the local storage.
    var buttonClear = document.createElement("button");
    buttonClear.className = "button buttonClear";
    buttonClear.textContent = "Clear Scores";  
    viewHighScores.appendChild(buttonClear); 
    
    // Clear local storage and highScoreList.
    document.querySelector(".buttonClear").addEventListener("click", function(){
        localStorage.clear();        
        highScoreList.textContent = "";
        highScoreArray = [{initials:[],userScore:[]}];
    } )

})

var timerInterval
// Function created to set time interval.
function timer() {
    timerInterval = setInterval(function(){
        secondsLeft--;
        secondsDisplay.textContent = secondsLeft;

        if(secondsLeft === 0 || currentQuestion >= questions.length){
            secondsDisplay.textContent = "0";
            clearInterval(timerInterval);
            gameOver();
        }
    },1000);
}


// Function created to place a Game Over picture when the user does not have time to finish the quiz.
function gameOver() {
    result.textContent = "Sorry, time is out! Go to View High Score to see previous scores and restart quiz.";
    var imgGameOver = document.createElement("img");

    imgGameOver.setAttribute("src", "./assets/images/game_over.png");
    imgGameOver.setAttribute("alt", "Game Over");
    imgGameOver.setAttribute("style", "width: 500px; height:200px;");
    imgGameOver.className = "img img-fluid gameOver";
    quiz.appendChild(imgGameOver);
}

function displayQuestions(){
    
    // Clear options list to each time users go to a new question.
    options.innerHTML = "";
    
    // Variable created to take a question from questions object according to the current question index number. 
    var displayQ = questions[currentQuestion].q;
    // Display current question to the user.
    question.textContent = displayQ;
    
    // Loop through questions objects to replace the answers list accordingly.
    for (var i=0; i < questions[currentQuestion].answers.length; i++){

        var displayA = questions[currentQuestion].answers[i];
        displayAArray.push(displayA);

        // List the answers created by the for loop.
        var li = document.createElement("li");     
        li.setAttribute("data", displayA);
        li.setAttribute("data-index", i);                  
        
        // Create a button where the text of the answers created by the for loop is going to be placed.
        var button = document.createElement("button");                
        button.className = "button";
        button.textContent = displayA;
        
        // Append the new buttons to list.
        li.appendChild(button);
        //Append li (list) to ul with id #options captured in the beggining of this script.
        options.appendChild(li);
    }                
}


options.addEventListener("click", function(event){
    var element = event.target;

    // Check if element clicked was a button.
    if (element.matches("button") === true){ 
        console.log(questions[currentQuestion].correct);                    

        var selectedAnswer = element.parentElement.getAttribute("data");
        console.log(selectedAnswer);

        if(secondsLeft === 0 || currentQuestion >= questions.length){
            return;
        }

        // If the answer clicked match with the correct answer in the object increases score by one, and currentQuestion index by one as well, displaying the next question after click.
        if (selectedAnswer === questions[currentQuestion].correct){
            score++;
            console.log(score);
            currentQuestion++;
            console.log(currentQuestion);
            result.textContent = "Correct!"; 
            result.style.color = "green";                                  
        }

        // Else it will not change the current score; however, it will decrease the timer by 10. It will still display next.
        else{
            currentQuestion++;
            console.log(currentQuestion);
            secondsLeft-=10;
            result.textContent = "Incorrect! You lost time!"; 
            result.style.color = "red";                       
        }    

        // Check if the current question index is less than the question object length, if it is it will show the next question. Else it will show the final score.
        if (currentQuestion < questions.length){
            var index = element.parentElement.getAttribute("data-index");
            displayAArray.splice(index, 4);
            displayQuestions();
        }
        
        else {
            showScore.style.display = "block";
            finalScore();
        }
    }    
})      

function finalScore(){
    // Hide Questions 
    quiz.style.display = "none";

    // Place h1 and paragraph text content to be display on div class score.
    h1.textContent = "Check Your Results";
    finalResult.textContent = "Your final score is " + score + ".";
    submitScore.textContent = "Type your initials below and press enter to submit. Go to View High Score to see previous scores and restart quiz.";

    // Create an input tag on html and sets its attributes.
    var inputInitials = document.createElement("input");
    inputInitials.setAttribute("type", "text");
    inputInitials.setAttribute("placeholder", "Enter your Initials");
    inputInitials.setAttribute("name", "userInitials");
    inputInitials.setAttribute("id", "userInitials");

    // Append the new input tag as a child of form class highScore.
    highScore.appendChild(inputInitials);

    // When user press enter on the initials input form, the following will happen.
    highScore.addEventListener("submit", function(event){
        event.preventDefault();
        var initialsInput = document.getElementById("userInitials").value.trim();

        // if user don't enter anything it will not be stored.
        if (initialsInput === ""){
            return;
        }    

        // Send the user score and initials to the object highScoreArray. From there it will be storage in the local storage.
        highScoreArray[0].userScore.push(score);
        highScoreArray[0].initials.push(initialsInput);
        document.getElementById("userInitials").value = "";
        
        storeScores();
    })
}



