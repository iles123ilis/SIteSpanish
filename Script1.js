// База данных 5 основных времен для глагола hablar
const tensesDatabase = {
    presente: {
        title: "Presente",
        forms: [
            { pronoun: "Yo", answer: "hablo" },
            { pronoun: "Tú", answer: "hablas" },
            { pronoun: "Él / Ella", answer: "habla" },
            { pronoun: "Nosotros", answer: "hablamos" },
            { pronoun: "Vosotros", answer: "habláis" },
            { pronoun: "Ellos / Ellas", answer: "hablan" }
        ]
    },
    indefinido: {
        title: "Pretérito Indefinido",
        forms: [
            { pronoun: "Yo", answer: "hablé" },
            { pronoun: "Tú", answer: "hablaste" },
            { pronoun: "Él / Ella", answer: "habló" },
            { pronoun: "Nosotros", answer: "hablamos" },
            { pronoun: "Vosotros", answer: "hablasteis" },
            { pronoun: "Ellos / Ellas", answer: "hablaron" }
        ]
    },
    imperfecto: {
        title: "Pretérito Imperfecto",
        forms: [
            { pronoun: "Yo", answer: "hablaba" },
            { pronoun: "Tú", answer: "hablabas" },
            { pronoun: "Él / Ella", answer: "hablaba" },
            { pronoun: "Nosotros", answer: "hablábamos" },
            { pronoun: "Vosotros", answer: "hablabais" },
            { pronoun: "Ellos / Ellas", answer: "hablaban" }
        ]
    },
    futuro: {
        title: "Futuro Simple",
        forms: [
            { pronoun: "Yo", answer: "hablaré" },
            { pronoun: "Tú", answer: "hablarás" },
            { pronoun: "Él / Ella", answer: "hablará" },
            { pronoun: "Nosotros", answer: "hablaremos" },
            { pronoun: "Vosotros", answer: "hablaréis" },
            { pronoun: "Ellos / Ellas", answer: "hablarán" }
        ]
    },
    condicional: {
        title: "Condicional Simple",
        forms: [
            { pronoun: "Yo", answer: "hablaría" },
            { pronoun: "Tú", answer: "hablarías" },
            { pronoun: "Él / Ella", answer: "hablaría" },
            { pronoun: "Nosotros", answer: "hablaríamos" },
            { pronoun: "Vosotros", answer: "hablaríais" },
            { pronoun: "Ellos / Ellas", answer: "hablarían" }
        ]
    }
};

let activeQuestions = [];
let currentIndex = 0;
let scoreCorrect = 0;
let scoreIncorrect = 0;

// Элементы
const cardPronoun = document.getElementById("card-pronoun");
const cardTenseTag = document.getElementById("card-tense-tag");
const inputField = document.getElementById("user-input");
const checkButton = document.getElementById("check-btn");
const correctSpan = document.getElementById("correct-count");
const incorrectSpan = document.getElementById("incorrect-count");
const resultMessage = document.getElementById("result-message");
const tenseCheckboxes = document.querySelectorAll('input[name="tense"]');

// Элементы выпадающего списка слева
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownMenu = document.getElementById("dropdown-menu");

// Модальное окно справа
const helpBtn = document.getElementById("help-btn");
const modalPopup = document.getElementById("modal-popup");
const closeModal = document.getElementById("close-modal");
const modalTenseContainer = document.getElementById("modal-tense-container");

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Открытие/закрытие выпадающего меню слева
dropdownBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

// Закрытие выпадающего меню при клике мимо
document.addEventListener("click", function() {
    dropdownMenu.style.display = "none";
});

dropdownMenu.addEventListener("click", function(e) {
    e.stopPropagation(); // Чтобы меню не закрывалось при кликах по галочкам
});

// Обновление общего списка вопросов
function updateActiveQuestions() {
    activeQuestions = [];
    
    tenseCheckboxes.forEach(checkbox => {
        if (checkbox.checked && tensesDatabase[checkbox.value]) {
            const key = checkbox.value;
            tensesDatabase[key].forms.forEach(item => {
                activeQuestions.push({
                    pronoun: item.pronoun,
                    answer: item.answer,
                    tenseTitle: tensesDatabase[key].title
                });
            });
        }
    });

    if (activeQuestions.length === 0) {
        document.querySelector('input[value="presente"]').checked = true;
        updateActiveQuestions();
        return;
    }

    getRandomIndex();
    showCurrentCard();
}

function getRandomIndex() {
    if (activeQuestions.length <= 1) {
        currentIndex = 0;
        return;
    }
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * activeQuestions.length);
    } while (newIndex === currentIndex);
    currentIndex = newIndex;
}

function showCurrentCard() {
    const currentQ = activeQuestions[currentIndex];
    cardPronoun.textContent = currentQ.pronoun;
    cardTenseTag.textContent = currentQ.tenseTitle;
}

// Обновление содержимого справочника справа
function updateModalContent() {
    modalTenseContainer.innerHTML = "";
    
    tenseCheckboxes.forEach(checkbox => {
        if (checkbox.checked && tensesDatabase[checkbox.value]) {
            const data = tensesDatabase[checkbox.value];
            const div = document.createElement("div");
            div.className = "tense-block";
            
            let html = `<div class="tense-title">${data.title}</div><ul>`;
            data.forms.forEach(f => {
                html += `<li><strong>${f.pronoun}</strong> — ${f.answer}</li>`;
            });
            html += `</ul>`;
            
            div.innerHTML = html;
            modalTenseContainer.appendChild(div);
        }
    });
}

tenseCheckboxes.forEach(cb => {
    cb.addEventListener("change", updateActiveQuestions);
});

helpBtn.addEventListener("click", function() {
    updateModalContent();
    modalPopup.style.display = "flex";
});

closeModal.addEventListener("click", function() {
    modalPopup.style.display = "none";
});

modalPopup.addEventListener("click", function(e) {
    if (e.target === modalPopup) modalPopup.style.display = "none";
});

inputField.addEventListener("keydown", function(e) {
    if (e.key === "Enter") checkButton.click();
});

checkButton.addEventListener("click", function() {
    const userValue = removeAccents(inputField.value.trim().toLowerCase());
    if (userValue === "") return;

    const currentQ = activeQuestions[currentIndex];
    const currentCorrectAnswer = removeAccents(currentQ.answer.toLowerCase());

    resultMessage.style.opacity = "1";

    if (userValue === currentCorrectAnswer) {
        scoreCorrect++;
        correctSpan.textContent = scoreCorrect;

        inputField.style.backgroundColor = "#86efac";
        resultMessage.textContent = "¡Correcto!";
        resultMessage.style.color = "#16a34a";
        resultMessage.style.backgroundColor = "#dcfce7";

        setTimeout(() => {
            getRandomIndex();
            showCurrentCard();
            resultMessage.style.opacity = "0";
            inputField.value = "";
            inputField.style.backgroundColor = "#e2e8f0";
            inputField.focus();
        }, 1000);

    } else {
        scoreIncorrect++;
        incorrectSpan.textContent = scoreIncorrect;
        
        inputField.style.backgroundColor = "#fca5a5";
        resultMessage.textContent = `Неправильно. Ответ: ${currentQ.answer}`;
        resultMessage.style.color = "#dc2626";
        resultMessage.style.backgroundColor = "#fee2e2";

        setTimeout(() => {
            resultMessage.style.opacity = "0";
            inputField.value = "";
            inputField.style.backgroundColor = "#e2e8f0";
            inputField.focus();
        }, 2500);
    }
});

// Инициализация
updateActiveQuestions();