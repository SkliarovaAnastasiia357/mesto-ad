function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`); //формируется ошибка, отображ сообщение об ошибке
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
  inputElement.classList.add(settings.inputErrorClass); //добавляет классы
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`); //сообщение скрывается
  errorElement.textContent = "";
  errorElement.classList.remove(settings.errorClass);
  inputElement.classList.remove(settings.inputErrorClass); //классы удаляютчя
}

function checkInputValidity(formElement, inputElement, settings) {
  if (!inputElement.value.trim()) { //проверка на валидность строки после удаления пробелов
    showInputError(
      formElement,
      inputElement,
      "Поле обязательно для заполнения",
      settings
    );
    return;
  }

  const minLength =
    inputElement.classList.contains("popup__input_type_name") ||
    inputElement.classList.contains("popup__input_type_card-name")
      ? 2
      : 2; // граничу худшим значением

  const maxLength = inputElement.classList.contains("popup__input_type_name")
    ? 40
    : inputElement.classList.contains("popup__input_type_card-name")
    ? 30
    : inputElement.classList.contains("popup__input_type_description")
    ? 200
    : 200;  // граничу худшим значением

  if (
    inputElement.value.length < minLength ||
    inputElement.value.length > maxLength
  ) {
    let message = "";
    if (
      inputElement.classList.contains("popup__input_type_name") ||
      inputElement.classList.contains("popup__input_type_card-name")
    ) {
      message = "Длина должна быть от 2 до 40 символов (или 2–30 для названия)";
    } else if (
      inputElement.classList.contains("popup__input_type_description")
    ) {
      message = "Длина должна быть от 2 до 200 символов";
    } else if (inputElement.classList.contains("popup__input_type_url")) {
      message = "Введите корректную ссылку";
    }
    showInputError(formElement, inputElement, message, settings);
    return;
  }

  if (
    inputElement.classList.contains("popup__input_type_name") ||
    inputElement.classList.contains("popup__input_type_card-name")
  ) {
    const regex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
    if (!regex.test(inputElement.value)) {
      const customMessage =
        inputElement.dataset.errorMessage ||
        "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
      showInputError(formElement, inputElement, customMessage, settings);
      return;
    }
  }

  if (inputElement.classList.contains("popup__input_type_url")) {
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i;
    if (!urlRegex.test(inputElement.value)) {
      showInputError(
        formElement,
        inputElement,
        "Введите корректную ссылку",
        settings
      );
      return;
    }
  }

  hideInputError(formElement, inputElement, settings);
}

function hasInvalidInput(formElement, settings) {
  const inputElements = formElement.querySelectorAll(settings.inputSelector);
  return Array.from(inputElements).some((input) => !input.validity.valid); // true, если хотябы 1 поле не прошло валидацию
}

function disableSubmitButton(formElement, settings) {
  const submitButton = formElement.querySelector(settings.submitButtonSelector);
  submitButton.disabled = true;
  submitButton.classList.add(settings.inactiveButtonClass); //делает кнопку неактивной
}

function enableSubmitButton(formElement, settings) {
  const submitButton = formElement.querySelector(settings.submitButtonSelector);
  submitButton.disabled = false;
  submitButton.classList.remove(settings.inactiveButtonClass); 
}

function toggleButtonState(formElement, settings) { //работа кнопки в завис от валид всех полей
  const isInvalid = hasInvalidInput(formElement, settings);
  if (isInvalid) {
    disableSubmitButton(formElement, settings);
  } else {
    enableSubmitButton(formElement, settings);
  }
}

function setEventListeners(formElement, settings) { //обработчик input для всех полей формы, вызов функции для кажд поля
  const inputElements = formElement.querySelectorAll(settings.inputSelector);

  inputElements.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(formElement, input, settings);
      toggleButtonState(formElement, settings);
    });
  });
}

function clearValidation(formElement, settings) { //очистка ошибок, неактив кнопка, исп при открытии формы
  const inputElements = formElement.querySelectorAll(settings.inputSelector);
  inputElements.forEach((input) => {
    hideInputError(formElement, input, settings);
  });
  disableSubmitButton(formElement, settings);
}

function enableValidation(settings) { //вкл валидации форм, принимает все необх селекторы как объект настроек
  const formElements = document.querySelectorAll(settings.formSelector);
  formElements.forEach((formElement) => {
    formElement.querySelectorAll(settings.inputSelector).forEach((input) => {
      input.removeEventListener("input", () => {});
    });

    setEventListeners(formElement, settings);
    toggleButtonState(formElement, settings);
  });
}

export { enableValidation, clearValidation };
//последние две функции импортируются в index.js
