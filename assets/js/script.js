// storing all questions and answers in an array
const myQuestions = [
    {
        question: "Inside which HTML element do we put the JavaScript?",
        choices: ["<script>", "<javascript>", "<js>", "<scripting>"],
        answer : "<script>"
    },
    {
        question: "Which of the following keywords is used to declare a variable? ",
        choices: ["let", "var", "both A and B", "char"],
        answer : "both A and B"
    },
    {
        question: "Which of the following methods is used to access HTML element by Id in javascript?",
        choices: ["getElementById()", "getElementByClass()", "elementById()", "accessById()"],
        answer : "getElementById()"
    },
    {
        question: "Commonly used Datatypes do not include:",
        choices: ["variables", "numbers", "alerts", "boolean"],
        answer : "alerts"
    },
    {
        question: "Arrays in Javascript can be used to store ______",
        choices: ["numbers", "strings", "objects", "all the above"],
        answer : "all the above"
    }
];
const timerEl = document.getElementById("timer");
const containerDiv = document.getElementById("container");
const questionDiv = document.getElementById("question");
const choicesDiv = document.getElementById("choices");
const buttons = document.querySelectorAll(".choice");
const validatingEl = document.getElementById("validating");
const submitEl = document.getElementById("submitForm");
const inputEl = document.getElementById("initials");
const submitDiv = document.getElementById("submit-score");
const renderScoresDiv = document.getElementById("render-scores");
const scoreListEl = document.getElementById("scores-list");
const clearEl = document.getElementById("clear");
const homeDiv = document.getElementById("homepage");
const backButton = document.getElementById("back-button");
let timerCount = 0;
let timer;
let questionIndex = -1;
let isTimeUp = false;// global variable to track the time
let score = 0;
let highScores = [];

// call to getScores function to fetch scores from local storage when page loads
getScores();

// starts the quiz by setting the timer
function startQuiz() {
    timerCount = 75;
    startTimer();
    renderQuestion();
}

function startTimer() {
    timer = setInterval(function(){
        timerCount--;
        timerEl.textContent = "Time Left: " + timerCount;
        if(timerCount === 0 || isTimeUp){
            clearInterval(timer);
            isTimeUp = true;
            score = 0;
            enterInitials();
        }
    },1000);
}

//renders each question with choices
function renderQuestion() {
    if(isTimeUp){
        return; // if time up, stops rendering questions
    }
    questionIndex++; 
    validatingEl.textContent = '';
    if(questionIndex < myQuestions.length){
        currentQuestion = myQuestions[questionIndex];
        containerDiv.className = "hide";
        questionDiv.className = "show";
        questionDiv.children[0].textContent = currentQuestion.question;
        currentQuestion.choices.forEach(function(element,index) {
        buttons[index].textContent = currentQuestion.choices[index];
        buttons[index].setAttribute("value",currentQuestion.choices[index]);
        buttons[index].setAttribute("style", "background-color:darkblue");    
        });
        choicesDiv.className = "show";
    }else {
        score = timerCount;
        clearInterval(timer); // stops the timer after rendering all the questions
        setTimeout(enterInitials, 1000);
    }
}

// validates the response entered for every question
function validateResponse(event) {
    if(isTimeUp){
        return;
    }
    event.stopPropagation();
    var e = event.target;

    if(e.matches(".choice")){
        value = e.getAttribute("value");
        validatingEl.className = "show";
        if(value === myQuestions[questionIndex].answer){
            validatingEl.textContent = "Correct!";
            validatingEl.style.color = "green";
            e.setAttribute('style', 'background-color:green');
        }else{
            validatingEl.textContent = "wrong!";
            validatingEl.style.color = "red";
            e.setAttribute('style', 'background-color:red');
            if(timerCount >= 10){
                timerCount -= 10;// decrements the counter for every wrong answer
            }else{
                isTimeUp = true;// sets isTimeUp to true to prevent timer going negative
                return;
            }
        }
        // renders next question with one second delay so that user can see the validation
        setTimeout(renderQuestion, 1000);
    }
}

// user can enter initials for storing the score
function enterInitials() {
    questionDiv.className = "hide";
    choicesDiv.className = "hide";
    validatingEl.className = "hide";
    submitDiv.className = "show";
    submitDiv.children[1].textContent = "Your final score is: " + score;
}

// stores the scores in local storage
function setScores(event) {
    event.preventDefault();
    nameEntered = inputEl.value;
    highScores.push({initials : nameEntered, score:score});
    localStorage.setItem("highScores", JSON.stringify(highScores));
    inputEl.value = '';
    submitDiv.className = "hide";
    homeDiv.className = "show";
}

//gets the scores from local storage
function getScores() {
    highScores = JSON.parse(localStorage.getItem("highScores"));
    if(highScores === null){
        highScores = [];
    }
}

//renders score on webpage from highest to lowest
function renderScores() {
    homeDiv.className = "hide";
    submitDiv.className = "hide";
    containerDiv.className = "hide";
    renderScoresDiv.className = "show";
    backButton.className = "show";
    if(highScores.length === 0) {
        document.getElementById("no-scores").className = "show";
        return;
    }
    document.getElementById("no-scores").className = "hide";
    let scoresArray = highScores.sort((a,b) => b.score - a.score);
    scoresArray.forEach(function(element,index) {
        scoreListEl.appendChild(document.createElement("li"));
        scoreListEl.children[index].textContent = index + 1 + ". " + element.initials + " : "+element.score;    
        scoreListEl.children[index].className = "list";
    });
    
}

//resets the quiz so that user can play again
function reset() {
    score = 0;
    questionIndex = -1;
    isTimeUp = false;
    timerEl.textContent = 'Time Left:   ';
    containerDiv.className = "show";
    homeDiv.className = "hide";  
}

// clears the scores from the local storage
function clearScores(event) {
    event.stopPropagation();
    localStorage.clear();
    highScores = [];
    homeDiv.className = "hide";
    clearEl.className = "hide";
    while (scoreListEl.firstChild) {
        scoreListEl.removeChild(scoreListEl.firstChild);
    }
    renderScores();
}

//renders the home page when clicked on back button
function home() {
    backButton.className = "hide";
    renderScoresDiv.className = "hide";
    homeDiv.className = "show";
    document.getElementById("no-scores").className = "hide";
}

//event listener for start quiz
document.getElementById("start").addEventListener("click", startQuiz);
//event listener for validating response
choicesDiv.addEventListener("click", validateResponse);
// event listener for submitting the initials
submitEl.addEventListener("click", setScores);
//event listener for clear highscores
clearEl.addEventListener("click", clearScores);
//event listener for resetting the quiz
document.getElementById("play").addEventListener("click", reset);
//event listener for viewing highscores
document.getElementById("scores").addEventListener("click", renderScores);
//event listener for back button
backButton.addEventListener("click", home); 



















