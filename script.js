const fs = require("fs");
const path = require("path");

const folderPath = './';

let countFileNamed = 0;
let hasError = false;
// 1. loop through all files
let fileNames = fs.readdirSync(folderPath);
for (const fileName of fileNames) {
  const filePath = path.join(folderPath, fileName);

  // 2. check if it's file
  if (!fs.lstatSync(filePath).isFile() || fileName.split(".").length < 3)
    continue;

  // 3. extract object type (Table, Page,...)
  const pattern = /.*\.(\w+)\.al$/;
  // try {
  const match = filePath.match(pattern);
  // console.log(match.length);
  // } catch (error) {
  //   console.log("🔴", filePath);
  // }
  if (match && match.length >= 0) {
    const fileExtension = match[1];
    const newFlderPathByExt = path.join(folderPath, fileExtension);
    // 4. create a folder with that object type
    fs.mkdir(newFlderPathByExt, { recursive: true }, (err) => {
      if (err) {
        console.error(
          `Error creating folder for extension '${newFlderPathByExt}' with extension ${fileExtension}:`,
          err
        );
        process.exit(0);
        hasError = true;
      }
      // 4. move file to its corresponding folder extension
      const newFilePath = path.join(newFlderPathByExt, path.basename(filePath));
      fs.rename(filePath, newFilePath, (err) => {
        if (err) {
          console.error(
            `Error moving file '${filePath}' to '${newFilePath}':`,
            err
          );
          process.exit(0);
          hasError = true;
        }
        console.log(`✅ '${fileName}' Moved`);
      });
    });
  } else {
    console.warn(`Skipping file with no extension: ${filePath}`);
    process.exit(0);
    hasError = true;
  }
}
if (hasError) {
  console.error("🔴 There's some error!");
} else {
  console.log(`🔵 ${countFileNamed} objects moved!`);
}
