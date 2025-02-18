document.addEventListener("DOMContentLoaded", () => {
    loadQuizzes();
});

let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
let currentQuizIndex = null;

function showCreateQuiz() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("createQuiz").classList.remove("hidden");
}

function addQuestion() {
    let questionDiv = document.createElement("div");
    questionDiv.innerHTML = `
        <input type="text" class="question" placeholder="Question">
        <input type="text" class="option" placeholder="Option 1">
        <input type="text" class="option" placeholder="Option 2">
        <input type="text" class="option" placeholder="Option 3">
        <input type="text" class="option" placeholder="Option 4">
        <select class="correctOption">
            <option value="0">Option 1</option>
            <option value="1">Option 2</option>
            <option value="2">Option 3</option>
            <option value="3">Option 4</option>
        </select>
    `;
    document.getElementById("questions").appendChild(questionDiv);
}

function saveQuiz() {
    let quizTitle = document.getElementById("quizTitle").value;
    if (!quizTitle) {
        alert("Please enter a quiz title.");
        return;
    }

    let questions = [];
    document.querySelectorAll("#questions > div").forEach((div) => {
        let questionText = div.querySelector(".question").value;
        let options = [...div.querySelectorAll(".option")].map(input => input.value);
        let correctOption = div.querySelector(".correctOption").value;
        if (questionText && options.every(opt => opt)) {
            questions.push({ questionText, options, correctOption });
        }
    });

    if (questions.length === 0) {
        alert("Please add at least one valid question.");
        return;
    }

    quizzes.push({ title: quizTitle, questions });
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
    alert("Quiz saved!");
    goHome();
}

function showQuizList() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("quizList").classList.remove("hidden");

    let quizItems = document.getElementById("quizItems");
    quizItems.innerHTML = "";
    quizzes.forEach((quiz, index) => {
        let li = document.createElement("li");
        li.innerHTML = `<button onclick="startQuiz(${index})">${quiz.title}</button>`;
        quizItems.appendChild(li);
    });
}

function startQuiz(index) {
    currentQuizIndex = index;
    document.getElementById("quizList").classList.add("hidden");
    document.getElementById("takeQuiz").classList.remove("hidden");

    let quiz = quizzes[index];
    document.getElementById("quizTitleDisplay").innerText = quiz.title;
    let quizContent = document.getElementById("quizContent");
    quizContent.innerHTML = "";

    quiz.questions.forEach((q, i) => {
        let div = document.createElement("div");
        div.classList.add("quiz-question");
        div.innerHTML = `
            <p>${q.questionText}</p>
            <div class="quiz-options">
                ${q.options.map((opt, j) => `
                    <label>
                        <input type="radio" name="q${i}" value="${j}"> ${opt}
                    </label>
                `).join("")}
            </div>
        `;
        quizContent.appendChild(div);
    });
}


function submitQuiz() {
    let quiz = quizzes[currentQuizIndex];
    let score = 0;
    let totalPoints = quiz.questions.length;
    let feedbackMessage = "";

    let resultsHTML = "<h3>Correct Answers:</h3><ul>";

    quiz.questions.forEach((q, i) => {
        let selected = document.querySelector(`input[name="q${i}"]:checked`);
        let userAnswer = selected ? selected.value : null;

        if (userAnswer == q.correctOption) {
            score++;
            resultsHTML += `<li>✅ ${q.questionText} - <b>Correct</b></li>`;
        } else {
            resultsHTML += `<li>❌ ${q.questionText} - <b>Wrong</b> (Correct: ${q.options[q.correctOption]})</li>`;
        }
    });

    resultsHTML += "</ul>";

    // Feedback based on score
    let percentage = (score / totalPoints) * 100;

    if (percentage === 100) {
        feedbackMessage = "🌟 Excellent! You got a perfect score!";
    } else if (percentage >= 75) {
        feedbackMessage = "👍 Great job! You did very well!";
    } else if (percentage >= 50) {
        feedbackMessage = "🙂 Good effort! Keep practicing!";
    } else {
        feedbackMessage = "😞 Keep trying! Review the correct answers and improve.";
    }
    
    

    // Show results
    document.getElementById("takeQuiz").classList.add("hidden");
    document.getElementById("quizResults").classList.remove("hidden");
    document.getElementById("scoreDisplay").innerHTML = `
        <h2>Your Score: ${score} / ${totalPoints}</h2>
        <p>${feedbackMessage}</p>
        ${resultsHTML}
    `;
}



function goHome() {
    document.querySelectorAll(".hidden").forEach(el => el.classList.add("hidden"));
    document.getElementById("home").classList.remove("hidden");
    document.getElementById("questions").innerHTML = "";
}

function loadQuizzes() {
    quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
}


