const displayEl = document.getElementById('display');
let expr = '';

function updateDisplay() {
  displayEl.textContent = expr || '0';
}

// Evaluate safely using Function (simple use-case)
function evaluateExpression(s) {
  // replace visual characters if any (we use '*' and '/' as values already)
  // handle percent: convert 'n%' -> (n/100)
  try {
    // Replace occurrences like "50%" -> "(50/100)"
    s = s.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    // Prevent accidental alphabetic input
    if (/[^0-9+\-*/().% ]/.test(s)) throw new Error('Invalid characters');
    // Evaluate
    // Using Function is slightly safer than eval in this tiny context
    return Function('"use strict";return (' + s + ')')();
  } catch {
    throw new Error('Invalid expression');
  }
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === 'clear') {
      expr = '';
      updateDisplay();
      return;
    }
    if (action === 'back') {
      expr = expr.slice(0, -1);
      updateDisplay();
      return;
    }
    if (action === 'equals') {
      try {
        const result = evaluateExpression(expr || '0');
        expr = String(result);
      } catch (e) {
        expr = 'Error';
      }
      updateDisplay();
      return;
    }

    // Append number/operator
    // Simple guard: prevent multiple dots in the same number
    if (value === '.') {
      // find last token after operator
      const parts = expr.split(/[\+\-\*\/]/);
      const last = parts[parts.length - 1];
      if (last.includes('.')) return;
    }

    expr += value;
    updateDisplay();
  });
});

// Optional: keyboard support
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if ((/[\d]/).test(key)) {
    expr += key;
    updateDisplay();
    return;
  }
  if (key === 'Enter' || key === '=') {
    try { expr = String(evaluateExpression(expr || '0')); } catch { expr = 'Error'; }
    updateDisplay();
    return;
  }
  if (key === 'Backspace') {
    expr = expr.slice(0, -1);
    updateDisplay();
    return;
  }
  if (key === 'Escape') {
    expr = '';
    updateDisplay();
    return;
  }
  if (['+','-','*','/','.','%'].includes(key)) {
    expr += key;
    updateDisplay();
    return;
  }
});