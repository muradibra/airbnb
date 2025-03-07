import fs from "fs";
import path from "path";

export function deleteFiles(files: Express.Multer.File[]) {
  files.forEach((file) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

export function deleteFilesByPaths(paths: string[]) {
  paths.forEach((path) => {
    fs.rename(path, path.replace("public", "public/deleted/avatars"), (err) => {
      if (err) {
        console.log(err);
      }
    });
    // fs.unlink(path, (err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    // });
  });
}

export function moveToDeleted(paths: string[]) {
  // First ensure the deleted/avatars directory exists
  const deletedDir = path.join(process.cwd(), "public", "deleted", "avatars");
  console.log(deletedDir);

  // Create directory if it doesn't exist
  // if (!fs.existsSync(deletedDir)) {
  //   fs.mkdirSync(deletedDir, { recursive: true });
  // }

  // // Now move the files
  // paths.forEach((filePath) => {
  //   // Normalize the path and ensure it uses forward slashes
  //   const normalizedPath = filePath.replace(/\\/g, "/");

  //   // Get the filename from the path
  //   const fileName = path.basename(normalizedPath);

  //   // Create the new path using proper path joining
  //   const newPath = path.join(
  //     process.cwd(),
  //     "public",
  //     "deleted",
  //     "avatars",
  //     fileName
  //   );

  //   fs.rename(filePath, newPath, (err) => {
  //     if (err) {
  //       console.error("Error moving file:", filePath, err);
  //     }
  //   });
  // });
}
