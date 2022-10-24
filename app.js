'use strict'

// API FOR WORD: https://random-word-api.herokuapp.com/word?number=100

const TIMER = document.getElementById('timer');
const SCORE = document.getElementById('score');
const WORD = document.getElementById('chosenWord');
const INPUT_FORM = document.getElementById('inputForm');
const WORD_INPUT = document.getElementById('wordInput');
const START_BUTTON = document.getElementById('startGame');
const WRAPPER = document.getElementById('wrapper');

class App {

    #randomWords = []; // Will contain words the API fetches
    #score = 0; // Score
    #chosenWord; // To track which word is currently picked
    #timer; // Will be an interval to clear
    #gameRunning = false; // Determine the state of the game

    constructor() {
        // Fetch words from the API first
        this.#getRandomWords();
        // Setup events
        START_BUTTON.addEventListener('click', this.#handleGame.bind(this));
        INPUT_FORM.addEventListener('submit', this.#submitWord.bind(this));
    }

    // Function to handle submitted words
    #submitWord(e) {
        e.preventDefault();
        
        const playerWord = WORD_INPUT.value.toLowerCase().trim();
        
        if (!this.#chosenWord || playerWord !== this.#chosenWord) return;
        
        this.#score++
        this.#updateScoreValue();
        this.#changeChosenWord();

        WORD_INPUT.value = '';
    }

    // Function that will handle ending or starting the game based on its state
    #handleGame() {
        this.#gameRunning ? this.#endGame() : this.#startGame();
    }

    // Function to end the game
    #endGame() {
        this.#gameRunning = false;

        this.#chosenWord = null;

        WORD.innerHTML = 'Start the game!';
        START_BUTTON.innerHTML = 'Start';
        WORD_INPUT.value = '';
        
        this.#score = 0;
        this.#updateScoreValue()
        clearInterval(this.#timer);
    }

    // Function to update the score value based on the variable 
    #updateScoreValue() {
        SCORE.innerHTML = `Score: ${this.#score}`;
    }

    // Function to start the game
    #startGame() {
        this.#gameRunning = true;

        WORD_INPUT.focus();

        START_BUTTON.innerHTML = 'Stop';
        this.#changeChosenWord();
        this.#startTimer(30);
    }

    // Function to get a random word and update the UI
    #changeChosenWord() {
        this.#chosenWord = this.#getRandomWord();
        WORD.innerHTML = this.#chosenWord.toUpperCase();
    }

    // Gets the random word from the array
    #getRandomWord() {
        return this.#randomWords[Math.floor(Math.random() * this.#randomWords.length)]
    }

    // Function to handle the timer
    #startTimer(len) {
        let i = len;
        TIMER.innerHTML = `Time: ${i}s`;

        this.#timer = setInterval(() => {
            i--;
            i < 0 ? this.#endGame() : TIMER.innerHTML = `Time: ${i}s`
        }, 1000);
    }

    // API Call to get a set of random words on each page load
    async #getRandomWords() {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=100');
        const data = await response.json()

        this.#randomWords = data;
    }
}

const app = new App();