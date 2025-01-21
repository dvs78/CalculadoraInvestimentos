import { generateReturnsArray } from "./src/investments.goals";
const form = document.getElementById("investiment-form");
const calculateButton = document.getElementById("calculate-results");
const clearFormButton = document.getElementById("clear-form");

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContibution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContibution,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

function clearForm() {
  document.getElementById("starting-amount").value = "";
  document.getElementById("additional-contribution").value = "";
  document.getElementById("time-amount").value = "";
  document.getElementById("return-rate").value = "";
  document.getElementById("tax-rate").value = "";

  const errorInputsContainers = document.querySelectorAll(".error");
  for (const errorInput of errorInputsContainers) {
    errorInput.classList.remove("error");
    errorInput.parentElement.querySelector("p").remove();
  }
}

function validateInput(event) {
  // console.log(event.target); // Aponta o alvo
  if (event.target.value === "") {
    return;
  }

  const { parentElement } = event.target; // Elemento pai
  const grandParentElement = event.target.parentElement.parentElement; // Pegar o elemento avô
  const inputValue = event.target.value.replace(",", ".");

  if (
    !parentElement.classList.contains("error") &&
    (isNaN(inputValue) || Number(inputValue) <= 0)
  ) {
    //<p class="text-red-500">Insira um valor numérico e maior que zero</p>
    const errorTextElement = document.createElement("p"); //<p></p>
    errorTextElement.classList.add("text-red-500"); //<p class="text-red-500"></p>
    errorTextElement.innerText = "Insira um valor numérico e maior que zero"; //<p>Insira um valor numérico e maior que zero</p>
    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    (parentElement.classList.contains("error") && !isNaN(inputValue)) ||
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput); // blur = qdo desfocar
  }
}
form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
