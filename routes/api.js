'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (puzzle === undefined || coordinate === undefined || value === undefined) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const validation = solver.validate(puzzle);
    if (validation.error) {
      return res.json(validation);
    }

    if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]$/.test(String(value))) {
      return res.json({ error: 'Invalid value' });
    }

    const row = coordinate.toUpperCase().charCodeAt(0) - 65; // 'A' -> 0
    const col = parseInt(coordinate[1], 10) - 1;
    const index = row * 9 + col;
    const valueStr = String(value);

    // If that value is already placed at that exact coordinate, it's valid
    if (puzzle[index] === valueStr) {
      return res.json({ valid: true });
    }

    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, col, valueStr)) conflicts.push('row');
    if (!solver.checkColPlacement(puzzle, row, col, valueStr)) conflicts.push('column');
    if (!solver.checkRegionPlacement(puzzle, row, col, valueStr)) conflicts.push('region');

    if (conflicts.length > 0) {
      return res.json({ valid: false, conflict: conflicts });
    }

    return res.json({ valid: true });
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    if (puzzle === undefined) {
      return res.json({ error: 'Required field missing' });
    }

    const validation = solver.validate(puzzle);
    if (validation.error) {
      return res.json(validation);
    }

    const result = solver.solve(puzzle);
    return res.json(result);
  });
};
