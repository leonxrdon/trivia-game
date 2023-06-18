const API_URL = 'https://opentdb.com/api.php?amount=1&type=multiple';

const categoryForm = document.getElementById('categoryForm');
const categorySelect = document.getElementById('categorySelect');
const questionContainer = document.getElementById('questionContainer');
const scoreContainer = document.getElementById('scoreContainer');
const resetButton = document.getElementById('resetButton');

let score = 0;
let selectedCategory = 9; // Valor predeterminado para la categoría (General Knowledge)

categoryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  selectedCategory = categorySelect.value;
  startTrivia();
});

resetButton.addEventListener('click', () => {
  resetGame();
});

function resetGame() {
  score = 0;
  questionContainer.innerHTML = '';
  scoreContainer.textContent = '';
  categoryForm.style.display = 'block';
}

function startTrivia() {

  questionContainer.innerHTML = 'Loading question...';
  scoreContainer.textContent = 'Score: ' + score;

  fetch(API_URL + '&category=' + selectedCategory)
    .then(response => response.json())
    .then(data => {
      const question = data.results[0].question;
      const answers = data.results[0].incorrect_answers;
      const correctAnswer = data.results[0].correct_answer;

      questionContainer.innerHTML = '';
      questionContainer.innerHTML += `<h2>${question}</h2>`;

      const options = [...answers, correctAnswer];
      options.sort(() => Math.random() - 0.5);

      options.forEach(option => {
        const button = document.createElement('button');
        button.innerHTML = option;
        button.addEventListener('click', () => checkAnswer(button, correctAnswer));
        questionContainer.appendChild(button);
      });
    })
    .catch(error => {
      console.error('An error has occurred:', error);
      questionContainer.innerHTML = 'An error occurred while loading the question.';
    });
}

function checkAnswer(button, correctAnswer) {
  const selectedAnswer = button.innerHTML;

  if (selectedAnswer === correctAnswer) {
    score++;
    scoreContainer.textContent = 'Score: ' + score;
    
    questionContainer.innerHTML =  `
    <span>🤩</span>
    <div class="alert alert-success" role="alert"><strong> Correct answer..!! </strong></div>
    `;
  } else {
    questionContainer.innerHTML = `
    <span>😞</span>
    <div class="alert alert-danger" role="alert"> Wrong answer, the correct answer was: <strong>${correctAnswer}</strong></div>
    `;
    score = 0;
  }

  setTimeout(() => {
    startTrivia(); // Genera una nueva pregunta después de un breve retraso
  }, 1500);
}
