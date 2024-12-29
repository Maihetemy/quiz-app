const categorySelect = document.querySelector("#categorySelect");
const difficultySelect = document.querySelector("#difficultySelect");
const questionsNumber = document.querySelector("#questionsNumber");
const startQuizBtn = document.querySelector("#startQuizBtn");
const startQuizForm = document.querySelector("#startQuizForm");
const rowData = document.querySelector("#rowData");

let questionsList = [];
let quiz = {};

startQuizBtn.addEventListener('click', async () => {
    const values = {
        category: categorySelect.value,
        difficulty: difficultySelect.value,
        number: questionsNumber.value,
    }

    quiz = new Quiz(values);

    questionsList = await quiz.getQuiz();
    quiz.hideStartQuizForm();
    let question = new Question(0);
    question.displayQuestion();
    console.log(question.randomization());
    console.log(questionsList);
    console.log(question);

});



class Quiz {
    constructor({ category, difficulty, number }) {
        this.score = 0;
        this.category = category;
        this.difficulty = difficulty;
        this.number = number;
    };

    getQuiz = async () => {
        try {
            // https://opentdb.com/api.php?amount=10&category=20&difficulty=easy
            const baseUrl = 'https://opentdb.com/api.php?';
            let response = await fetch(`${baseUrl}amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`);
            console.log(`${baseUrl}amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`);

            let data = await response.json();
            return data.results;

        } catch (error) {
            console.log(error);
        }
    }

    hideStartQuizForm = () => {
        startQuizForm.classList.replace('d-flex', 'd-none');
    }



    finishQuiz = () => {
        rowData.innerHTML = `
        <div class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
            <h2 class="mb-0 text-center">
            ${this.score === this.number
                ? `🎉 Congratulations! You achieved a perfect score! 🎉 
                You answered all ${this.number} questions correctly.`
                : `Good effort! Your score is ${this.score} out of ${this.number}. 
                Keep practicing, and you'll get there next time! 😊`}
            </h2>
            <button class="again btn btn-primary rounded-pill" id="tryAgainBtn"><i class="bi bi-arrow-repeat"></i> Try Again</button>
        </div>`;
        document.querySelector("#tryAgainBtn").addEventListener('click', ()=>{
            window.location.reload();
        })
    }
}

class Question {
    constructor(i) {
        this.index = i;
        this.difficulty = questionsList[i].difficulty;
        this.category = questionsList[i].category;
        this.question = questionsList[i].question;
        this.correctAnswer = questionsList[i].correct_answer;
        this.incorrectAnswers = questionsList[i].incorrect_answers;
        this.answers = this.randomization();
        this.isAnswer = false;
    };

    displayQuestion = () => {
        rowData.innerHTML = `
            <div class="question shadow-lg col-lg-5 p-4 rounded-3 d-flex flex-column
                justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
                <div class="w-100 d-flex justify-content-between flex-row">
                    <span class="badge p-3 categoryBadge">${this.category}</span>
                    <span class="badge p-3 questionsNBadge">${this.index} of ${questionsList.length} Questions</span>
                </div>
                <p class="text-capitalize h4 text-center">${this.question}</p>
                <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
                ${this.answers.map((answer) => `<li>${answer}</li>`).toString().replaceAll(',', '')}
                </ul>
                <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score:${quiz.score}</h2>
            </div>`;

        const choices = document.querySelectorAll('.choices li');

        choices.forEach(element => {
            element.addEventListener('click', () => {
                console.log('im here');
                this.chickAnswer(element);
            })
        });
    };
    randomization = () => {
        let answers = [...this.incorrectAnswers, this.correctAnswer].sort();
        return answers;
    }
    chickAnswer = (choise) => {
        if (this.isAnswer === false) {
            this.isAnswer = true;
            if (choise.innerHTML == this.correctAnswer) {
                console.log('correct');
                choise.classList.add('correct', 'animate__animated', 'animate__pulse');
                quiz.score++;
            }
            else {
                console.log('wrong');
                choise.classList.add('wrong', 'animate__animated', 'animate__shakeX');
            }
            this.nextQuestion();
        }

    }
    nextQuestion = () => {
        this.index++;
        if (this.index < questionsList.length) {
            setTimeout(() => {
                let newQuesrion = new Question(this.index);
                newQuesrion.displayQuestion();
                console.log('hello in next question');
                console.log(this.index);
            }, 1000)
        }
        else {
            setTimeout(() => {
                quiz.finishQuiz();
            }, 1000)

        }
    }
}

