let userScore = 0;
let compScore = 0;
let roundsPlayed = 0;
const maxRounds = 10;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");
const battleArea = document.createElement("div");
battleArea.classList.add("battle-area");
document.body.appendChild(battleArea);

// Sound effects
const clickSound = new Audio("./sounds/click.mp3");
const winSound = new Audio("./Singlewin.mp3");
const loseSound = new Audio("./sounds/lose.mp3");
const drawSound = new Audio("./sounds/draw.mp3");
const bgMusic = new Audio("./Gameover.mp3");

const showSelectedOption = (userChoice) => {
    if (roundsPlayed >= maxRounds) return;
    const selectedDisplay = document.createElement("p");
    selectedDisplay.innerText = `You chose: ${userChoice}`;
    selectedDisplay.style.position = "fixed";
    selectedDisplay.style.top = "20%";
    selectedDisplay.style.left = "50%";
    selectedDisplay.style.transform = "translateX(-50%)";
    selectedDisplay.style.fontSize = "1.5rem";
    selectedDisplay.style.fontWeight = "bold";
    selectedDisplay.style.color = "#fff";
    selectedDisplay.style.background = "rgba(0, 0, 0, 0.7)";
    selectedDisplay.style.padding = "10px 20px";
    selectedDisplay.style.borderRadius = "5px";
    selectedDisplay.style.zIndex = "1000";
    document.body.appendChild(selectedDisplay);

    setTimeout(() => {
        document.body.removeChild(selectedDisplay);
    }, 2000);
};

const animateFight = (userChoice, compChoice) => {
    battleArea.innerHTML = "";
    const userImg = document.createElement("img");
    userImg.src = `./images/${userChoice}.png`;
    userImg.classList.add("battle-image");

    const compImg = document.createElement("img");
    compImg.src = `./images/${compChoice}.png`;
    compImg.classList.add("battle-image");

    battleArea.appendChild(userImg);
    battleArea.appendChild(compImg);

    userImg.style.animation = "fight-animation 1s ease-in-out forwards";
    compImg.style.animation = "fight-animation 1s ease-in-out forwards";
};

const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    return options[Math.floor(Math.random() * options.length)];
};

const drawGame = () => {
    msg.innerText = "Game was a draw. Play again.";
    msg.style.backgroundColor = "#081b31";
    drawSound.play();
};

const showWinner = (userWin, userChoice, compChoice) => {
    setTimeout(() => {
        if (userWin) {
            userScore++;
            userScorePara.innerText = userScore;
            msg.innerText = `You win! Your ${userChoice} beats ${compChoice}`;
            msg.style.backgroundColor = "green";
            winSound.play();
        } else {
            compScore++;
            compScorePara.innerText = compScore;
            msg.innerText = `You lost. ${compChoice} beats your ${userChoice}`;
            msg.style.backgroundColor = "red";
            loseSound.play();
        }
    }, 1000);
};

const endGame = () => {
    msg.innerText = `Game Over! Final Score - You: ${userScore}, Computer: ${compScore}`;
    msg.style.backgroundColor = "#000";
    choices.forEach(choice => choice.removeEventListener("click", handleChoice));
    bgMusic.play(); // Play background music after 10 rounds
    bgMusic.loop = false;
};

const playGame = (userChoice) => {
    if (roundsPlayed >= maxRounds) return;
    
    showSelectedOption(userChoice);
    const compChoice = genCompChoice();
    animateFight(userChoice, compChoice);

    setTimeout(() => {
        if (userChoice === compChoice) {
            drawGame();
        } else {
            let userWin = true;
            if (userChoice === "rock") {
                userWin = compChoice === "paper" ? false : true;
            } else if (userChoice === "paper") {
                userWin = compChoice === "scissors" ? false : true;
            } else {
                userWin = compChoice === "rock" ? false : true;
            }
            showWinner(userWin, userChoice, compChoice);
        }
        roundsPlayed++;
        if (roundsPlayed >= maxRounds) {
            setTimeout(endGame, 1000);
        }
    }, 1000);
};

const handleChoice = (event) => {
    if (roundsPlayed >= maxRounds) return;
    clickSound.play();
    const userChoice = event.currentTarget.id;
    playGame(userChoice);
};

choices.forEach(choice => choice.addEventListener("click", handleChoice));

const restartButton = document.getElementById("restart");

restartButton.addEventListener("click", () => {
    // Reset scores and rounds
    userScore = 0;
    compScore = 0;
    roundsPlayed = 0;

    // Update UI elements
    userScorePara.innerText = userScore;
    compScorePara.innerText = compScore;
    msg.innerText = "Game restarted! Make your move.";
    msg.style.backgroundColor = "#081b31";

    // Reattach event listeners to enable gameplay again
    choices.forEach(choice => choice.addEventListener("click", handleChoice));

    // Stop background music if it was playing
    bgMusic.pause();
    bgMusic.currentTime = 0;
});
