const fs = require("fs");
const path = require("path");
const { saveFileLocally, getFileUrl } = require("../lib/localStorage");

const uploadDir = path.join(__dirname, "../uploads/chunks");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadChunk = async (req, res) => {
  try {
    const { chunkIndex, totalChunks, uploadId, fileName } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Chunk file is required" });
    }

    const uploadFolder = path.join(uploadDir, uploadId);
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const chunkPath = path.join(uploadFolder, `chunk-${chunkIndex}`);
    fs.writeFileSync(chunkPath, req.file.buffer);

    return res.status(200).json({
      message: "Chunk uploaded successfully",
      chunkIndex: parseInt(chunkIndex),
      totalChunks: parseInt(totalChunks),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const finalizeTrailerUpload = async (req, res) => {
  let uploadFolder = null;
  let finalFilePath = null;

  try {
    const { uploadId, fileName, totalChunks, folder } = req.body;

    uploadFolder = path.join(uploadDir, uploadId);
    finalFilePath = path.join(uploadDir, `final_${Date.now()}_${fileName}`);

    if (!fs.existsSync(uploadFolder)) {
      return res.status(400).json({
        message: "Upload folder not found. Please re-upload chunks.",
      });
    }

    const writeStream = fs.createWriteStream(finalFilePath);

    for (let i = 0; i < parseInt(totalChunks); i++) {
      const chunkPath = path.join(uploadFolder, `chunk-${i}`);

      if (!fs.existsSync(chunkPath)) {
        writeStream.end();
        if (fs.existsSync(finalFilePath)) fs.unlinkSync(finalFilePath);
        return res.status(400).json({
          message: `Chunk ${i} not found`,
        });
      }

      const chunkBuffer = fs.readFileSync(chunkPath);
      writeStream.write(chunkBuffer);
    }

    writeStream.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const fileBuffer = fs.readFileSync(finalFilePath);

    const uploadResult = await saveFileLocally(
      fileBuffer,
      "movies",
      fileName
    );

    if (fs.existsSync(uploadFolder)) {
      const remainingFiles = fs.readdirSync(uploadFolder);
      remainingFiles.forEach((file) => {
        const filePath = path.join(uploadFolder, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      fs.rmdirSync(uploadFolder);
    }

    if (fs.existsSync(finalFilePath)) {
      fs.unlinkSync(finalFilePath);
    }

    if (!uploadResult.success) {
      return res.status(500).json({ message: "Failed to upload trailer" });
    }

    const cdnUrl = getFileUrl(uploadResult.filePath);

    return res.status(200).json({
      message: "Trailer uploaded successfully",
      cdnUrl: cdnUrl,
      filePath: uploadResult.filePath,
    });
  } catch (error) {
    console.error("Finalize trailer error:", error);

    if (uploadFolder && fs.existsSync(uploadFolder)) {
      try {
        const remainingFiles = fs.readdirSync(uploadFolder);
        remainingFiles.forEach((file) => {
          fs.unlinkSync(path.join(uploadFolder, file));
        });
        fs.rmdirSync(uploadFolder);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }

    if (finalFilePath && fs.existsSync(finalFilePath)) {
      try {
        fs.unlinkSync(finalFilePath);
      } catch (cleanupError) {
        console.error("Final file cleanup error:", cleanupError);
      }
    }

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  uploadChunk,
  finalizeTrailerUpload,
};
