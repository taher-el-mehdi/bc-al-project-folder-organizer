# AL Project Folder Organizer 🚀

A VS Code extension that automatically **organizes Microsoft Dynamics 365 Business Central (AL) projects** into a clean and maintainable folder structure.

Perfect after using **Txt2AL conversion**, where all objects are generated in a single `src` folder.

---

## ✨ Features

- 📁 Automatically organizes AL files by **object type**
- 🧩 Supports:
  - Tables
  - Pages
  - Codeunits
  - Reports
  - Queries
  - Enums
  - Interfaces
  - XMLPorts
  - Page Extensions
  - Table Extensions
- ⚡ Fast and lightweight (no parsing overhead)
- 🛠 Works on existing projects or freshly converted Txt2AL projects
- 🧼 Keeps your repository clean and readable

---

## 📂 Example Structure

### Before
```text
src/
  table1.al
  table2.al
  page1.al
  page2.al
  page3.al
  codeunit1.al
  report1.al
  report2.al
````

### After

```text
src/
  tables/
    table1.al
    table2.al
  pages/
    page1.al
    page2.al
    page3.al
  codeunits/
    codeunit1.al
  reports/
    report1.al
    report2.al
```

---

## ▶️ How to Use

1. Open an **AL project** in VS Code
2. Open the **Command Palette**
   (`Ctrl + Shift + P`)
3. Run:
   ```
   AL: Organize src Folder Structure
   ```
4. Your project is instantly reorganized ✨

---

## ⚙️ How It Works

* Scans all `.al` files inside `src`
* Detects object type using:
  * File name conventions
  * AL object keywords (`table`, `page`, `codeunit`, etc.)
* Moves files into matching folders
* Creates folders automatically if missing

---

## 🧠 Why This Extension?

After running **Txt2AL**, all objects are dumped into a single folder.
This extension restores **structure, clarity, and maintainability** — instantly.

---

## 🤝 Contributing

Contributions and ideas are welcome!
Feel free to open issues or submit pull requests.

---

## 📜 License

MIT License