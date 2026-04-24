# Auto Folder Remover

## Introduction
This extension helps you automatically clean your workspaces by removing unnecessary folders such as node_modules, dist, build, etc..., as soon as vscode is closed.

It is designed to keep your laptop storage disk light by removing unnecessary folders after vscode is closed.

---

## Videos Showing How To Use This Extension

[Watch: Tutorial on how to install it here](https://mega.nz/embed/Xp5FnBgB#97KUjJVyFjXSsAiGevGp-PPP-9hdnsXG93vVr48P6TQ)

[Watch: Tutorial on how to use it here](https://mega.nz/embed/6tBzABRZ#vFvDy9F4FBjpOqzEa4oiS3YJwBP12WVp4hdY7FBLX24)

## Extension Settings

You can configure this extension by modifing its settings. This settings are:
- folderremover.foldersToTrack: Array containing folder(s) to track and auto delete each time a vscode project is closed. By default its:
  <pre>
    [
      "node_modules",
      "dist",
      ".next"
    ]
  </pre>
  You can add any folder name like: <b>.venv, venv, lib, packages, .gradle, vendor, ...</b>; then the extension will consider them and delete them each time you close a project.

---

## Want To Contribute Or Repport A Bug

- Report bugs by opening an [issue here](https://github.com/richazim/folder-remover/issues).
- Suggest features or improvements the same way.

  Want to contribute? Fork the repo and submit a PR — clear commits and concise messages appreciated!

  Check the [Contribution Guide Here](https://github.com/richazim/folder-remover/blob/main/CONTRIBUTING.md).

---

## How To Support Me

_Love this extension?_ Help it grow by showing your support!

[![Star on GitHub](https://img.shields.io/badge/⭐_Star_on_GitHub-black?style=for-the-badge&logo=github)](https://github.com/richazim/folder-remover)
[![Rate on Marketplace](https://img.shields.io/badge/📝_Rate_on_Marketplace-blue?style=for-the-badge&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=SAZ.folderremover&ssr=false#review-details)

<!-- ---

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension. -->

---

## Following extension guidelines

  Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.
  [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
