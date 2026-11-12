
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");

const result = document.getElementById("result");
const exchangeRate = document.getElementById("exchangeRate");
const status = document.getElementById("status");

async function convertCurrency() {

    const amount = Number(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    status.textContent = "";
    result.textContent = "--";
    exchangeRate.textContent = "";

    if (!Number.isFinite(amount) || amount <= 0) {
        status.textContent = "Please enter a valid amount greater than zero.";
        return;
    }

    if (from === to) {
        result.textContent = `${amount.toLocaleString("en-IN", {
            maximumFractionDigits: 4
        })} ${to}`;

        exchangeRate.textContent = `1 ${from} = 1 ${to}`;
        return;
    }

    convertBtn.disabled = true;
    convertBtn.textContent = "Converting...";

    try {

        const url = `https://api.frankfurter.dev/v2/rate/${from}/${to}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch exchange rate.");
        }

        const data = await response.json();

        const convertedAmount = amount * data.rate;

        result.textContent = `${convertedAmount.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 4
            }
        )} ${to}`;

        exchangeRate.textContent =
            `1 ${from} = ${data.rate.toFixed(4)} ${to}`;

        status.textContent =
            `Reference rate date: ${data.date}`;

    } catch (error) {

        result.textContent = "--";
        exchangeRate.textContent = "";
        status.textContent =
            "Something went wrong. Please try again.";

        console.error(error);

    } finally {

        convertBtn.disabled = false;
        convertBtn.innerHTML = 'Convert Currency <span>→</span>';

    }
}

// Convert button
convertBtn.addEventListener("click", convertCurrency);

// Swap currencies
swapBtn.addEventListener("click", () => {

    const temp = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    convertCurrency();

});

// Automatically convert when currencies change
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

// Convert when amount changes
amountInput.addEventListener("change", convertCurrency);

// Initial conversion
convertCurrency();
