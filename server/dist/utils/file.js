"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = deleteFiles;
exports.deleteFilesByPaths = deleteFilesByPaths;
exports.moveToDeleted = moveToDeleted;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function deleteFiles(files) {
    files.forEach((file) => {
        fs_1.default.unlink(file.path, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
}
function deleteFilesByPaths(paths) {
    paths.forEach((path) => {
        fs_1.default.rename(path, path.replace("public", "public/deleted/avatars"), (err) => {
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
function moveToDeleted(paths) {
    // First ensure the deleted/avatars directory exists
    const deletedDir = path_1.default.join(process.cwd(), "public", "deleted", "avatars");
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
