document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('sudoku-grid');
  const textInput = document.getElementById('text-input');
  const solveButton = document.getElementById('solve-button');
  const clearButton = document.getElementById('clear-button');
  const checkButton = document.getElementById('check-button');
  const errorMsg = document.getElementById('error-msg');
  const checkResult = document.getElementById('check-result');
  const coordinateInput = document.getElementById('coordinate');
  const valueInput = document.getElementById('value');

  const cells = [];

  // Build the 9x9 grid of inputs
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('maxlength', '1');
      input.dataset.row = r;
      input.dataset.col = c;
      input.id = `${String.fromCharCode(65 + r)}${c + 1}`;

      if (c === 2 || c === 5) input.classList.add('region-right');
      if (r === 2 || r === 5) input.classList.add('region-bottom');

      input.addEventListener('input', () => {
        // Allow only 1-9 or empty
        if (!/^[1-9]?$/.test(input.value)) {
          input.value = '';
        }
        syncGridToText();
      });

      grid.appendChild(input);
      cells.push(input);
    }
  }

  function syncGridToText() {
    let str = '';
    cells.forEach((cell) => {
      str += cell.value === '' ? '.' : cell.value;
    });
    textInput.value = str;
  }

  function syncTextToGrid() {
    const str = textInput.value.trim();
    if (str.length !== 81) return;
    cells.forEach((cell, i) => {
      const ch = str[i];
      cell.value = ch === '.' ? '' : ch;
    });
  }

  textInput.addEventListener('input', () => {
    errorMsg.textContent = '';
    syncTextToGrid();
  });

  clearButton.addEventListener('click', () => {
    cells.forEach((cell) => (cell.value = ''));
    textInput.value = '';
    errorMsg.textContent = '';
    checkResult.textContent = '';
    coordinateInput.value = '';
    valueInput.value = '';
  });

  solveButton.addEventListener('click', async () => {
    errorMsg.textContent = '';
    const puzzle = textInput.value.trim();

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzle })
      });
      const data = await response.json();

      if (data.error) {
        errorMsg.textContent = data.error;
        return;
      }

      textInput.value = data.solution;
      syncTextToGrid();
    } catch (err) {
      errorMsg.textContent = 'Something went wrong contacting the server.';
    }
  });

  checkButton.addEventListener('click', async () => {
    checkResult.textContent = '';
    const puzzle = textInput.value.trim();
    const coordinate = coordinateInput.value.trim();
    const value = valueInput.value.trim();

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzle, coordinate, value })
      });
      const data = await response.json();

      if (data.error) {
        checkResult.textContent = data.error;
        return;
      }

      if (data.valid) {
        checkResult.textContent = 'Valid placement!';
      } else {
        checkResult.textContent = `Invalid placement. Conflicts: ${data.conflict.join(', ')}`;
      }
    } catch (err) {
      checkResult.textContent = 'Something went wrong contacting the server.';
    }
  });
});
