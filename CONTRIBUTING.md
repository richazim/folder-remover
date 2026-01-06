# Contributing to Auto Folder Remover

Thank you for your interest in improving **Auto Folder Remover**! Whether it’s a bug fix, new feature, or better docs — every contribution counts. Let’s build something awesome together.

---

## Setup Instructions

1. **Clone the repo**:

   ```bash
   git clone https://github.com/richazim/folder-remover.git
   cd folder-remover
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Open in VS Code**:

   ```bash
   code .
   ```

4. Press `F5` to launch a new **Extension Development Host**.

---

## Testing Your Changes

To test:

- Make changes in the source code
- Run the extension (`F5`)
- Open a workspace and trigger the command via **Command Palette**

You can also write test files in the `test/` directory and integrate with the `vscode-test` runner defined in `vscode-test.mjs`.

---

## Guidelines for Contributions

### Bug Fixes

- Clearly describe the bug and steps to reproduce it (if possible).
- Link to the related issue in your pull request.

### Features

- Discuss via GitHub Issue first, unless it’s small or obvious.
- Keep PRs focused. One feature or fix per PR is ideal.

### Documentation

- Improve existing docs or write missing explanations.
- If you add features, update `README.md` and `CHANGELOG.md`.

---

## Pull Request Process

1. Create a branch:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):

   ```bash
   git commit -m "feat: add new format support"
   ```

3. Push and open a Pull Request:

   ```bash
   git push origin feat/your-feature-name
   ```

---

## Thank You

Your time and effort help make "Auto Folder Remover" better for everyone.  
Star the repo, share it with others, and feel free to reach out or open issues!

---
