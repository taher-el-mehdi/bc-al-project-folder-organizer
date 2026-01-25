# AL Project Folder Organizer 🚀

A VS Code extension that automatically **organizes Microsoft Dynamics 365 Business Central (AL) projects** into a clean and maintainable folder structure.

### Before
```text
table1.al
table2.al
page1.al
page2.al
page3.al
codeunit1.al
report1.al
report2.al
```

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
  EMT: Organize AL Files
  ```
4. Your workspace's AL files are instantly reorganized into `src/` ✨
5. Enjoy a cleaner and more maintainable project structure! 🎉