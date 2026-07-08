const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const generateFileName = (originalName) => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString("hex");
  return `${name}-${timestamp}-${random}${ext}`;
};

const saveFileLocally = async (fileBuffer, folder, originalName) => {
  try {
    const targetDir = path.join(uploadDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const fileName = generateFileName(originalName);
    const filePath = path.join(targetDir, fileName);

    fs.writeFileSync(filePath, fileBuffer);

    const relativePath = path.join("uploads", folder, fileName).replace(/\\/g, "/");

    return {
      success: true,
      filePath: relativePath,
      fileName,
    };
  } catch (error) {
    console.error("Local save error:", error);
    throw new Error("Failed to save file locally");
  }
};

const deleteFileLocally = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, "..", filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    return { success: true };
  } catch (error) {
    console.error("Local delete error:", error);
    throw new Error("Failed to delete file locally");
  }
};

const getFileUrl = (filePath) => {
  return `/${filePath}`;
};

module.exports = {
  saveFileLocally,
  deleteFileLocally,
  getFileUrl,
};
