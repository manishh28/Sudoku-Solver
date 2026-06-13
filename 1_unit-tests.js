const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
const {
  puzzlesAndSolutions,
  invalidPuzzle,
  invalidCharsPuzzle,
  wrongLengthPuzzle
} = require('../controllers/puzzle-strings.js');

const solver = new SudokuSolver();
const [validPuzzle, validSolution] = puzzlesAndSolutions[0];

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const result = solver.validate(validPuzzle);
    assert.deepEqual(result, { valid: true });
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const result = solver.validate(invalidCharsPuzzle);
    assert.deepEqual(result, { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const result = solver.validate(wrongLengthPuzzle);
    assert.deepEqual(result, { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    // row 0 ('A'), column 1 (index 1) is empty ('3' is actually at index 1... pick an empty cell)
    // validPuzzle[2] is '.', placing '4' there should be valid for row
    const result = solver.checkRowPlacement(validPuzzle, 0, 2, '4');
    assert.isTrue(result);
  });

  test('Logic handles an invalid row placement', () => {
    // row 0 already contains '5' at index 0, placing '5' elsewhere in row 0 is invalid
    const result = solver.checkRowPlacement(validPuzzle, 0, 2, '5');
    assert.isFalse(result);
  });

  test('Logic handles a valid column placement', () => {
    // column 2 (index 2), row 0 is empty; '4' does not appear in column 2 of validPuzzle
    const result = solver.checkColPlacement(validPuzzle, 0, 2, '4');
    assert.isTrue(result);
  });

  test('Logic handles an invalid column placement', () => {
    // column 0 already contains '6' (row 1) and '8' (row 3) etc. '6' is already in column 0
    const result = solver.checkColPlacement(validPuzzle, 0, 0, '6');
    assert.isFalse(result);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    // top-left region (rows 0-2, cols 0-2) is missing '4'; placing '4' at row 0, col 2 is valid
    const result = solver.checkRegionPlacement(validPuzzle, 0, 2, '4');
    assert.isTrue(result);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    // top-left region already contains '5' (row 0, col 0)
    const result = solver.checkRegionPlacement(validPuzzle, 0, 2, '5');
    assert.isFalse(result);
  });

  test('Valid puzzle strings pass the solver', () => {
    const result = solver.solve(validPuzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution.length, 81);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const result = solver.solve(invalidPuzzle);
    assert.deepEqual(result, { error: 'Puzzle cannot be solved' });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const result = solver.solve(validPuzzle);
    assert.equal(result.solution, validSolution);
  });
});
