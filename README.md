# Sudoku Solver

A full-stack JavaScript Sudoku Solver built with Node.js + Express, matching the
freeCodeCamp "Sudoku Solver" project requirements.

## Features

- `/api/solve` (POST) — solves a given puzzle string
- `/api/check` (POST) — checks whether a value can be placed at a given coordinate
- Front-end 9x9 grid with a puzzle-string text box
- Backtracking solver in `controllers/sudoku-solver.js`
- Full Mocha/Chai unit + functional test suite

## Project structure

```
.
├── controllers/
│   ├── sudoku-solver.js     # Core solving/validation logic
│   └── puzzle-strings.js    # Sample puzzles used by the tests
├── routes/
│   └── api.js               # /api/solve and /api/check routes
├── public/
│   ├── index.html
│   ├── style.css
│   └── client.js
├── tests/
│   ├── 1_unit-tests.js
│   └── 2_functional-tests.js
├── server.js
├── package.json
├── .env.example
└── .gitignore
```

## Run locally

```bash
git clone <your-repo-url>
cd sudoku-solver
npm install
cp .env.example .env
npm start
```

Visit `http://localhost:3000`.

## Run tests

```bash
npm test
```

This runs all 12 unit tests and 14 functional tests via Mocha + Chai.

---

## Deploy to GitHub

1. Create a new empty repository on GitHub (don't initialize with a README).
2. From inside this project folder:

```bash
git init
git add .
git commit -m "Initial commit: Sudoku Solver"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

> The `.env` file is git-ignored, so your local environment variables won't be pushed.
> `.env.example` is included as a template.

---

## Deploy to Render

1. Go to [render.com](https://render.com) and sign in (you can sign in with GitHub).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select the repository you just pushed.
4. Configure the service:
   - **Name**: `sudoku-solver` (or anything you like)
   - **Region**: closest to you
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free is fine
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - (Render automatically sets `PORT`, which `server.js` already reads via `process.env.PORT`)
6. Click **Create Web Service**.
7. Wait for the build/deploy to finish — Render will give you a live URL like
   `https://sudoku-solver-xxxx.onrender.com`.

That URL is your "Solution Link" for the freeCodeCamp project, and your GitHub
repo URL is your "Source Code Link".

---

## Notes

- To run freeCodeCamp's own browser-based test suite (the one embedded on the
  challenge page), set `NODE_ENV=test` in your `.env` before starting the
  server locally, and use that local URL with the FCC test runner.
- The solver uses backtracking and validates that the given clues don't already
  conflict before attempting to solve, so it correctly rejects unsolvable
  puzzles with `{ error: 'Puzzle cannot be solved' }`.
