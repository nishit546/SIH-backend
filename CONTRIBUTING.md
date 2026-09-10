# Contributing Guidelines

Thank you for contributing to the **HSE Safety Intelligence Platform**! We welcome improvements, bug fixes, documentation enhancements, and feature suggestions.

---

## Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## Development Workflow

### 1. Fork & Clone
```bash
git clone https://github.com/nishit546/SIH-backend.git
cd SIH-backend
```

### 2. Branching Convention
Create a descriptive branch for your feature or bug fix:
- `feat/feature-name` (New features)
- `fix/bug-description` (Bug fixes)
- `docs/documentation-update` (Documentation changes)
- `refactor/component-name` (Code refactoring)

### 3. Setup Dependencies
```bash
# Backend Setup
cd backend
npm install
npm run prisma:generate

# Frontend Setup
cd ../frontend
npm install
```

### 4. Running Locally
Run the backend on port `3000` and the frontend on port `5173`:
```bash
# In backend/
npm run dev

# In frontend/
npm run dev
```

### 5. Code Quality & Verification
Before submitting a pull request, ensure all builds pass cleanly without TypeScript or linting errors:

```bash
# Backend Verification
cd backend
npx prisma validate
npm run build

# Frontend Verification
cd ../frontend
npm run build
```

---

## Commit Guidelines

We follow the Conventional Commits specification:
- `feat(...)`: A new user-facing feature
- `fix(...)`: A bug fix
- `docs(...)`: Documentation changes only
- `style(...)`: Formatting, missing semicolons, etc.
- `refactor(...)`: Code changes that neither fix a bug nor add a feature
- `test(...)`: Adding or updating tests
- `chore(...)`: Build process or auxiliary tool changes

---

## Pull Request Process

1. Ensure your branch is rebased on the latest `main` branch.
2. Provide a clear summary of the changes, affected components, and testing steps.
3. Reference any associated issues in the PR description (e.g., `Closes #12`).
4. Ensure CI/CD checks pass before requesting review.
