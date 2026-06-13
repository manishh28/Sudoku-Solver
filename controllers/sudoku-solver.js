class SudokuSolver {
  // Validate that the puzzle string is 81 chars long and only contains 1-9 or .
  validate(puzzleString) {
    if (puzzleString === undefined || puzzleString === null || puzzleString === '') {
      return { error: 'Required field missing' };
    }

    if (typeof puzzleString !== 'string') {
      return { error: 'Invalid characters in puzzle' };
    }

    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    return { valid: true };
  }

  // row, column are 0-indexed (0-8). value is a string '1'-'9'
  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    for (let c = 0; c < 9; c++) {
      if (c !== column && puzzleString[rowStart + c] === String(value)) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (r !== row && puzzleString[r * 9 + column] === String(value)) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;

    for (let r = regionRowStart; r < regionRowStart + 3; r++) {
      for (let c = regionColStart; c < regionColStart + 3; c++) {
        if ((r !== row || c !== column) && puzzleString[r * 9 + c] === String(value)) {
          return false;
        }
      }
    }
    return true;
  }

  // Solves the puzzle using backtracking. Returns { solution } or { error }
  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (validation.error) return validation;

    const board = puzzleString.split('');

    // First pass: make sure the given clues themselves don't conflict
    for (let i = 0; i < 81; i++) {
      const value = board[i];
      if (value === '.') continue;
      const row = Math.floor(i / 9);
      const col = i % 9;
      board[i] = '.'; // temporarily remove to check against the rest
      const tempString = board.join('');
      const rowOk = this.checkRowPlacement(tempString, row, col, value);
      const colOk = this.checkColPlacement(tempString, row, col, value);
      const regionOk = this.checkRegionPlacement(tempString, row, col, value);
      board[i] = value; // restore
      if (!rowOk || !colOk || !regionOk) {
        return { error: 'Puzzle cannot be solved' };
      }
    }

    const solved = this._solveBoard(board);
    if (!solved) {
      return { error: 'Puzzle cannot be solved' };
    }

    return { solution: board.join('') };
  }

  _solveBoard(board) {
    const emptyIndex = board.indexOf('.');
    if (emptyIndex === -1) return true; // no empty cells left, solved

    const row = Math.floor(emptyIndex / 9);
    const col = emptyIndex % 9;
    const currentString = board.join('');

    for (let num = 1; num <= 9; num++) {
      const value = String(num);
      if (
        this.checkRowPlacement(currentString, row, col, value) &&
        this.checkColPlacement(currentString, row, col, value) &&
        this.checkRegionPlacement(currentString, row, col, value)
      ) {
        board[emptyIndex] = value;
        if (this._solveBoard(board)) return true;
        board[emptyIndex] = '.';
      }
    }

    return false;
  }
}

module.exports = SudokuSolver;
