// Плавная прокрутка при клике на ссылки в меню
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Учитываем высоту фиксированной шапки
        behavior: "smooth",
      });
    }
  });
});

// script.js - полный код для многошаговой формы
document.addEventListener("DOMContentLoaded", function () {
  console.log("ДOM загружен, инициализируем форму...");

  const form = document.getElementById("techConsultForm");
  if (!form) {
    console.error("Форма не найдена!");
    return;
  }

  const steps = form.querySelectorAll(".form-step");
  let currentStep = 0;

  console.log("Найдено шагов:", steps.length);

  // Функция показа шага
  function showStep(stepIndex) {
    console.log("Показываем шаг:", stepIndex);

    steps.forEach((step, index) => {
      step.style.display = index === stepIndex ? "block" : "none";
    });

    updateNavButtons();
  }

  // Обновление кнопок навигации
  function updateNavButtons() {
    const prevButtons = form.querySelectorAll(".btn-prev");
    const nextButtons = form.querySelectorAll(".btn-next");
    const submitButton = form.querySelector('button[type="submit"]');

    // Кнопки "Назад"
    prevButtons.forEach((btn) => {
      btn.style.display = currentStep > 0 ? "block" : "none";
    });

    // Кнопки "Далее"
    nextButtons.forEach((btn) => {
      btn.style.display = currentStep < steps.length - 1 ? "block" : "none";
    });

    // Кнопка "Отправить"
    if (submitButton) {
      submitButton.style.display =
        currentStep === steps.length - 1 ? "block" : "none";
    }
  }

  // Валидация шага
  function validateStep(stepIndex) {
    const currentStepElem = steps[stepIndex];
    const requiredInputs = currentStepElem.querySelectorAll("[required]");
    let isValid = true;

    requiredInputs.forEach((input) => {
      if (!input.value.trim()) {
        // Поле не заполнено
        input.style.borderColor = "#dc3545";
        isValid = false;

        // Добавляем сообщение об ошибке
        if (
          !input.nextElementSibling ||
          !input.nextElementSibling.classList.contains("error-message")
        ) {
          const errorMsg = document.createElement("div");
          errorMsg.className = "error-message";
          errorMsg.textContent = "Это поле обязательно для заполнения";
          errorMsg.style.cssText =
            "color: #dc3545; font-size: 0.8rem; margin-top: 0.25rem;";
          input.parentNode.appendChild(errorMsg);
        }
      } else {
        // Поле заполнено - убираем ошибки
        input.style.borderColor = "";
        const errorMsg = input.parentNode.querySelector(".error-message");
        if (errorMsg) {
          errorMsg.remove();
        }
      }
    });

    return isValid;
  }

  // Обработчик кнопки "Далее"
  function handleNextButton(e) {
    e.preventDefault();
    console.log('Кнопка "Далее" нажата, текущий шаг:', currentStep);

    if (validateStep(currentStep)) {
      currentStep++;
      showStep(currentStep);
    } else {
      console.log("Валидация не пройдена");
    }
  }

  // Обработчик кнопки "Назад"
  function handlePrevButton(e) {
    e.preventDefault();
    console.log('Кнопка "Назад" нажата');

    currentStep--;
    showStep(currentStep);
  }

  // Вешаем обработчики на все кнопки "Далее"
  const nextButtons = form.querySelectorAll(".btn-next");
  nextButtons.forEach((btn) => {
    btn.addEventListener("click", handleNextButton);
  });

  // Вешаем обработчики на все кнопки "Назад"
  const prevButtons = form.querySelectorAll(".btn-prev");
  prevButtons.forEach((btn) => {
    btn.addEventListener("click", handlePrevButton);
  });

  // Убираем ошибки при вводе в поля
  form.querySelectorAll("input, textarea, select").forEach((input) => {
    input.addEventListener("input", function () {
      this.style.borderColor = "";
      const errorMsg = this.parentNode.querySelector(".error-message");
      if (errorMsg) {
        errorMsg.remove();
      }
    });
  });

  // Обработчик отправки формы
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Форма отправляется...");

    if (validateStep(currentStep)) {
      // Показываем загрузку
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Отправка...";
      submitBtn.disabled = true;

      // Собираем данные формы
      const formData = new FormData(form);

      // Отправляем на сервер
      fetch("sendmail.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка сети");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Ответ сервера:", data);

          if (data.status === "success") {
            showSuccessMessage();
            form.reset();
            currentStep = 0;
            showStep(currentStep);
          } else {
            throw new Error(data.message || "Ошибка сервера");
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert("Ошибка отправки: " + error.message);
        })
        .finally(() => {
          // Восстанавливаем кнопку
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    }
  });

  // Функция показа успешного сообщения
  function showSuccessMessage() {
    const successHtml = `
            <div class="form-success" style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; color: #28a745; margin-bottom: 1rem;">✓</div>
                <h3 style="color: var(--color-dark); margin-bottom: 1rem;">Заявка отправлена!</h3>
                <p style="color: var(--color-text); margin-bottom: 2rem;">Наши специалисты свяжутся с вами в течение 24 часов</p>
                <button class="btn btn-primary" onclick="location.reload()">Отправить новую заявку</button>
            </div>
        `;

    form.innerHTML = successHtml;
  }

  // Инициализация - показываем первый шаг
  showStep(currentStep);
  console.log("Инициализация формы завершена");
});

// Добавляем глобальную функцию для перезагрузки
function reloadPage() {
  location.reload();
}

// Фильтрация публикаций
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".news-filters .filter-btn");
  const newsCards = document.querySelectorAll(".news-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Убираем активный класс
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      newsCards.forEach((card) => {
        if (filterValue === "all") {
          card.style.display = "flex";
        } else {
          const cardCategory = card.getAttribute("data-category");
          if (cardCategory === filterValue) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        }
      });
    });
  });
});
// Показ номера телефона
document.addEventListener("DOMContentLoaded", function () {
  const showPhoneBtn = document.getElementById("showPhoneBtn");
  const phoneModal = document.getElementById("phoneModal");
  const closeModal = document.querySelector(".close-modal");

  if (showPhoneBtn && phoneModal) {
    showPhoneBtn.addEventListener("click", function (e) {
      e.preventDefault();
      phoneModal.style.display = "block";
    });

    closeModal.addEventListener("click", function () {
      phoneModal.style.display = "none";
    });

    // Закрытие по клику вне окна
    window.addEventListener("click", function (e) {
      if (e.target === phoneModal) {
        phoneModal.style.display = "none";
      }
    });
  }
});
// Проверка доступности сайта
function checkSiteAvailability() {
  fetch("/health-check")
    .then((response) => {
      if (!response.ok) throw new Error("Site down");
    })
    .catch((error) => {
      // Если сайт недоступен, показываем игру
      if (window.location.pathname !== "/404.html") {
        window.location.href = "/404.html";
      }
    });
}

// Проверяем каждые 30 секунд
setInterval(checkSiteAvailability, 30000);

// Сохранение рекорда
function getHighScore() {
  return localStorage.getItem("dinoHighScore") || 0;
}

function setHighScore(score) {
  localStorage.setItem("dinoHighScore", score);
}

// В функции gameLoop добавьте:
if (gameOver) {
  const highScore = getHighScore();
  if (score > highScore) {
    setHighScore(score);
    ctx.fillText(`Новый рекорд: ${score}!`, canvas.width / 2, 100);
  } else {
    ctx.fillText(`Рекорд: ${highScore}`, canvas.width / 2, 100);
  }
}
// Система комментариев
document.addEventListener("DOMContentLoaded", function () {
  const commentForm = document.getElementById("commentForm");
  const commentsContainer = document.getElementById("commentsContainer");
  const commentsCount = document.getElementById("commentsCount");
  const noComments = document.querySelector(".no-comments");

  // Инициализация
  loadComments();

  // Обработчик отправки формы
  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(commentForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const text = formData.get("text").trim();

    if (!name || !text) {
      alert("Пожалуйста, заполните обязательные поля");
      return;
    }

    const newComment = {
      id: Date.now(),
      name: name,
      email: email,
      text: text,
      date: new Date().toISOString(),
      likes: 0,
      liked: false,
    };

    addComment(newComment);
    commentForm.reset();
  });

  // Загрузка комментариев из LocalStorage
  function loadComments() {
    const comments = getComments();
    displayComments(comments);
  }

  // Получение комментариев
  function getComments() {
    const commentsJSON = localStorage.getItem("siteComments");
    return commentsJSON ? JSON.parse(commentsJSON) : [];
  }

  // Сохранение комментариев
  function saveComments(comments) {
    localStorage.setItem("siteComments", JSON.stringify(comments));
  }

  // Добавление нового комментария
  function addComment(comment) {
    const comments = getComments();
    comments.unshift(comment); // Добавляем в начало
    saveComments(comments);
    displayComments(comments);
  }

  // Отображение комментариев
  function displayComments(comments) {
    commentsContainer.innerHTML = "";
    commentsCount.textContent = comments.length;

    if (comments.length === 0) {
      noComments.style.display = "block";
      return;
    }

    noComments.style.display = "none";

    comments.forEach((comment) => {
      const commentElement = createCommentElement(comment);
      commentsContainer.appendChild(commentElement);
    });
  }

  // Создание элемента комментария
  function createCommentElement(comment) {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";
    commentDiv.dataset.id = comment.id;

    const date = new Date(comment.date);
    const formattedDate = date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    commentDiv.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">${escapeHTML(comment.name)}</div>
                <div class="comment-date">${formattedDate}</div>
            </div>
            <div class="comment-text">${escapeHTML(comment.text)}</div>
            <div class="comment-actions">
                <button class="like-btn ${comment.liked ? "liked" : ""}" 
                        onclick="toggleLike(${comment.id})">
                    ♥ <span>${comment.likes}</span>
                </button>
                <button class="reply-btn" onclick="replyToComment(${
                  comment.id
                })">
                    ↪ Ответить
                </button>
            </div>
        `;

    return commentDiv;
  }

  // Экранирование HTML для безопасности
  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});

// Глобальные функции для обработки событий
function toggleLike(commentId) {
  const comments = JSON.parse(localStorage.getItem("siteComments") || "[]");
  const commentIndex = comments.findIndex((c) => c.id === commentId);

  if (commentIndex !== -1) {
    const comment = comments[commentIndex];

    if (comment.liked) {
      comment.likes--;
      comment.liked = false;
    } else {
      comment.likes++;
      comment.liked = true;
    }

    localStorage.setItem("siteComments", JSON.stringify(comments));

    // Обновляем отображение
    const likeBtn = document.querySelector(
      `.comment[data-id="${commentId}"] .like-btn`
    );
    const likeCount = likeBtn.querySelector("span");

    likeBtn.classList.toggle("liked");
    likeCount.textContent = comment.likes;
  }
}

function replyToComment(commentId) {
  const comments = JSON.parse(localStorage.getItem("siteComments") || "[]");
  const comment = comments.find((c) => c.id === commentId);

  if (comment) {
    const commentForm = document.getElementById("commentForm");
    const textarea = document.getElementById("commentText");

    textarea.value = { commentname };
    textarea.focus();

    // Плавная прокрутка к форме
    commentForm.scrollIntoView({ behavior: "smooth" });
  }
}

// Дополнительные функции
function clearAllComments() {
  if (confirm("Вы уверены, что хотите удалить все комментарии?")) {
    localStorage.removeItem("siteComments");
    document.getElementById("commentsContainer").innerHTML =
      '<p class="no-comments">Пока нет комментариев. Будьте первым!</p>';
    document.getElementById("commentsCount").textContent = "0";
  }
}

// Для администрирования (можно добавить кнопку в консоли)
console.log("Доступные функции:");
console.log("- toggleLike(commentId) - лайк комментария");
console.log("- replyToComment(commentId) - ответ на комментарий");
console.log("- clearAllComments() - очистка всех комментариев");

// Эффект печатной машинки для герой-секции
document.addEventListener("DOMContentLoaded", function () {
  const titleElement = document.getElementById("typed-title");
  const subtitleElement = document.getElementById("typed-subtitle");

  // Если элементы не найдены, выходим
  if (!titleElement || !subtitleElement) return;

  // Тексты для анимации
  const texts = {
    title: "Точность, которой можно доверять",
    subtitle:
      "Анализатор ScienceDevice — портативное решение для экспертных химико-экологических исследований",
  };

  // Настройки анимации
  const config = {
    titleSpeed: 80, // Скорость печати заголовка
    subtitleSpeed: 40, // Скорость печати подзаголовка
    titleDelay: 1000, // Задержка перед началом печати заголовка
    subtitleDelay: 500, // Задержка после заголовка перед подзаголовком
    cursorChar: "|", // Символ курсора
    showCursor: true, // Показывать курсор
  };

  // Функция печати текста
  function typeText(element, text, speed, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let i = 0;
        let currentText = "";

        function type() {
          if (i < text.length) {
            currentText += text.charAt(i);
            element.innerHTML =
              currentText +
              (config.showCursor ? (
                <span class="typed-cursor">${config.cursorChar}</span>
              ) : (
                ""
              ));
            i++;
            setTimeout(type, speed);
          } else {
            // Убираем курсор в конце
            element.innerHTML = currentText;
            resolve();
          }
        }

        type();
      }, delay);
    });
  }

  // Запуск анимации
  function startTypingAnimation() {
    // Сначала показываем кнопки (они уже видны по умолчанию)
    const buttons = document.querySelector(".hero__buttons");
    if (buttons) {
      buttons.style.opacity = "1";
      buttons.style.visibility = "visible";
    }

    // Затем запускаем анимацию текста
    typeText(titleElement, texts.title, config.titleSpeed, config.titleDelay)
      .then(() => {
        return typeText(
          subtitleElement,
          texts.subtitle,
          config.subtitleSpeed,
          config.subtitleDelay
        );
      })
      .catch((error) => {
        console.error("Ошибка анимации:", error);
      });
  }

  // Запускаем анимацию при загрузке
  startTypingAnimation();

  // Дополнительно: перезапуск анимации при hover на кнопках
  const buttons = document.querySelectorAll(".hero__buttons .btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      // Можно добавить дополнительный эффект при наведении
    });
  });
});

// Альтернативная версия с более плавной анимацией
function createTypingAnimation() {
  const titleElement = document.getElementById("typed-title");
  const subtitleElement = document.getElementById("typed-subtitle");

  if (!titleElement || !subtitleElement) return;

  const texts = {
    title: "Точность, которой можно доверять",
    subtitle:
      "Анализатор ScienceDevice — портативное решение для экспертных химико-экологических исследований",
  };

  // Быстрая анимация для нетерпеливых
  function quickTypeText(element, text) {
    element.innerHTML = text;
  }

  // Проверяем, предпочитает ли пользователь reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // Показываем текст сразу без анимации
    quickTypeText(titleElement, texts.title);
    quickTypeText(subtitleElement, texts.subtitle);
  } else {
    // Запускаем полноценную анимацию
    typeText(titleElement, texts.title, 80, 1000);
    then(() => typeText(subtitleElement, texts.subtitle, 40, 500));
  }
}

// Запускаем при полной загрузке страницы
window.addEventListener("load", createTypingAnimation);
