let display = document.querySelector('#display'); 
let historyList = [];
let memory = 0;
const historyUl = document.getElementById('history-list');
const clickSound = document.getElementById('click-sound');
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

function addToDisplay(val){
    playClick();
    if (val === '√') {
        display.value += '√(';
    } else if (val === '^') {
        display.value += '^';
    } else {
        display.value += val;
    }
    animateButton(val);
}

function clearDisplay(){
    playClick();
    display.value = ""; 
}

function backspace() {
    playClick();
    display.value = display.value.slice(0, -1);
}

function calculate(){
    playClick();
    let expr = display.value;
    try{
        let result = parseAndEval(expr);
        addToHistory(expr, result);
        display.value = result;
    }catch(error){
        display.value = "Error!"
    }
}

// --- History ---
function addToHistory(expr, result) {
    historyList.unshift({ expr, result });
    renderHistory();
}
function renderHistory() {
    if (!historyUl) return;
    historyUl.innerHTML = '';
    if (historyList.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'History is empty';
        historyUl.appendChild(emptyMsg);
        return;
    }
    historyList.slice(0, 10).forEach((item, idx) => {
        const li = document.createElement('li');

        // Create delete button
        const delBtn = document.createElement('button');

        delBtn.textContent = 'x';
        delBtn.title = 'Delete';
        delBtn.style.marginRight = '8px';
        delBtn.style.fontSize = '12px';
        delBtn.style.width = '18px';
        delBtn.style.height = '18px';
        delBtn.style.padding = '0';
        delBtn.style.lineHeight = '16px';
        delBtn.style.border = 'none';
        delBtn.style.background = '#eee';
        delBtn.style.color = '#000';
        delBtn.style.cursor = 'pointer';
        delBtn.style.borderRadius = '3px';

        delBtn.onclick = (e) => {
            e.stopPropagation();
            // Remove the item from historyList
            const realIdx = historyList.indexOf(item);
            if (realIdx !== -1) {
                historyList.splice(realIdx, 1);
                renderHistory();
            }
        };
        
        li.appendChild(delBtn);
        // Add the history text
        const span = document.createElement('span');
        span.textContent = `${item.expr} = ${item.result}`;
        li.appendChild(span);
        li.onclick = () => { display.value = item.result; };
        historyUl.appendChild(li);
    });
}

// --- Memory Functions ---
function memoryAdd() {
    playClick();
    try { memory += Number(display.value) || 0; } catch {}
}
function memorySubtract() {
    playClick();
    try { memory -= Number(display.value) || 0; } catch {}
}
function memoryRecall() {
    playClick();
    display.value += memory;
}
function memoryClear() {
    playClick();
    memory = 0;
}

// --- Keyboard Support ---
document.addEventListener('keydown', (e) => {

    const key = e.key;
    if ((key >= '0' && key <= '9')) {
        addToDisplay(key);
    } else if ('+-*/'.includes(key)) {
        addToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
        e.preventDefault();
    } else if (key === 'Backspace') {
        backspace();
        e.preventDefault();
    } else if (key === 'c' || key === 'C') {
        clearDisplay();
        e.preventDefault();
    } else if (key === '(' || key === ')') {
        addToDisplay(key);
    } else if (key === '.') {
        addToDisplay(key);
    } else if (key === '%') {
        addToDisplay(key);
    }

});

// --- Theme Switcher ---
function updateThemeLabel() {
    if (document.body.classList.contains('dark-theme')) {
        themeLabel.textContent = 'Dark Mode';
    } else {
        themeLabel.textContent = 'Light Mode';
    }
}

themeToggle?.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme', themeToggle.checked);
    updateThemeLabel();
});

// Set correct label on page load
updateThemeLabel();

// --- Button Sound & Animation ---
function playClick() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}
function animateButton(val) {
    // Optional: add animation logic if you assign IDs or classes to buttons
}

// --- Advanced Parsing for Scientific Functions ---
function parseAndEval(expr) {
    // Replace custom functions with JS equivalents
    expr = expr.replace(/√\(/g, 'Math.sqrt(')
               .replace(/(\d+)\^/g, 'Math.pow($1,')
               .replace(/sin\(/g, 'Math.sin(deg2rad(')
               .replace(/cos\(/g, 'Math.cos(deg2rad(')
               .replace(/tan\(/g, 'Math.tan(deg2rad(')
               .replace(/log\(/g, 'Math.log10(');

    // Add closing parenthesis for pow if needed
    expr = expr.replace(/Math\.pow\(([^,]+),/g, (m, base) => `Math.pow(${base},`);

    // Evaluate
    // eslint-disable-next-line no-eval
    let result = eval(expr);
    if (!isFinite(result)) throw new Error('Math Error');
    return result;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Initialize history panel on startup
renderHistory();