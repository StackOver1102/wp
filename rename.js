import fs from 'fs';
import path from 'path';

const folderPath = './img';
const newFileExtension = '.jpg'; 

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Error reading folder: ${err}`);
  } else {
    console.log('Renaming files in the folder:');
    files.forEach((file, index) => {
      const oldFilePath = path.join(folderPath, file);
     
      const newFilePath = path.join(folderPath, `anh_${index + 1}${newFileExtension}`);

      fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) {
          console.error(`Error renaming file ${file}: ${err}`);
        } else {
          console.log(`Renamed ${file} to ${path.basename(newFilePath)}`);
        }
      });
    });
  }
});
