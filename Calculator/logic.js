const result = document.getElementById("result");
const expression = document.getElementById("expression");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let fresh = true;

function render() {
    result.textContent = current;
}

function clean(number) {
    if (!Number.isFinite(number)) return "Error";
    return String(Number(number.toPrecision(12)));
}

function calculate(a, b, operator) {
    switch(operator) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": 
            if (b === 0) throw new Error("Division by zero");
            return a / b;
    }
}

function reset() {
    current = "0";
    previous = null;
    operator = null;
    fresh = true;
    expression.textContent = "Ready to calculate";
    render();
}

function enterDigit(digit) {
    if (current === "Error" || fresh) {
        current = digit;
        fresh = false;
    }
    else {
        current = (current === "0")? digit : current + digit;
    }
    render();
}

function chooseOperator(op) {
    if (current === "Error") return;

    if (operator && !fresh) {
        solve();
        if (current === "Error") return;
    }

    previous = Number(current);
    operator = op;
    fresh = true;

    const symbols = {"/": "÷", "*": "x", "-": "-", "+": "+"};
    expression.textContext = current + " " + symbols[op];
}

function solve() {
    if (operator === null || previous === null || fresh) return;
    
    const a = previous;
    const b = Number(current);
    const op = operator;
    const symbols = {"/": "÷", "*": "x", "-": "-", "+": "+"};

    expression.textContent = a + " " + symbols[op] + " " + b + " =";

    try {
        current = clean(calculate(a, b, op));
    } catch {
        current = "Error";
    }

    previous = null;
    operator = null;
    fresh = true;
    render();
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.num !== undefined) {
        enterDigit(button.dataset.num);
        return;
    }

    if (button.dataset.op) {
        chooseOperator(button.dataset.op);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            reset();
            break;
        
        case "decimal":
            if (current === "Error" || fresh) {
                current = "0.";
                fresh = false;
            } else if (!current.includes(".")) {
                current += ".";
            }
            render();
            break;

        case "sign":
            if (current !== "Error" && Number(current) !== 0) {
                current = String(-Number(current));
            }
            render();
            break;

        case "percent":
            if (current !== "Error") {
                current = clean(Number(current) / 100);
            }
            render();
            break;

        case "backspace":
            if (current === "Error" || fresh) {
                current = "0";
                fresh = false;
            } else {
                current = (current.length > 1)? current.slice(0, -1): "0";
                if (current === "-") current = "0";
            }
            render();
            break;

        case "equals":
            solve();
            break;
    }
})
