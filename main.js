import { generateReturnsArray } from "./src/investments.goals";
import { Chart } from "chart.js/auto";
import { createTable } from "./src/table";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");

const form = document.getElementById("investiment-form");
const clearFormButton = document.getElementById("clear-form");
const calculateButton = document.getElementById("calculate-results");

let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  { columnLabel: "Mês", accessor: "month" },
  {
    columnLabel: "Total investido",
    accessor: "investedAmount",
    format: (numberInfo) => {
      formatCurrencyToTable(numberInfo);
    },
  },
  {
    columnLabel: "Rendimento mensal",
    accessor: "interestReturns",
    format: (numberInfo) => {
      formatCurrencyToTable(numberInfo);
    },
  },
  {
    columnLabel: "Rendimento total",
    accessor: "totalInterestReturns",
    format: (numberInfo) => {
      formatCurrencyToTable(numberInfo);
    },
  },
  {
    columnLabel: "Quantia total",
    accessor: "totalAmount",
    format: (numberInfo) => {
      formatCurrencyToTable(numberInfo);
    },
  },
];

function formatCurrencyToTable(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }

  resetCharts();

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

  const finalInvestimentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrencyToGraph(finalInvestimentObject.investedAmount),
            formatCurrencyToGraph(
              finalInvestimentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyToGraph(
              finalInvestimentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: "Total Investido",
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.investedAmount)
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno do Investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.interestReturns)
          ),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });

  createTable(columnsArray, returnsArray, "results-table");
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  document.getElementById("starting-amount").value = "";
  document.getElementById("additional-contribution").value = "";
  document.getElementById("time-amount").value = "";
  document.getElementById("return-rate").value = "";
  document.getElementById("tax-rate").value = "";

  resetCharts();

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
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove(); // Isso aqui deu erro no código, não sei orque
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput); // blur = qdo desfocar
  }
}

const mainEl = document.querySelector("main");
const carouseEl = document.getElementById("carousel");
const previousButton = document.getElementById("slide-arrow-previous");
const nextButton = document.getElementById("slide-arrow-next");

nextButton.addEventListener("click", () => {
  carouseEl.scrollLeft += mainEl.clientWidth;
});

previousButton.addEventListener("click", () => {
  carouseEl.scrollLeft -= mainEl.clientWidth;
});

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
