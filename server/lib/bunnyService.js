const axios = require("axios");

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_RETRIES = 3;
const STORAGE_ZONES = process.env.BUNNY_STORAGE_ZONE
  ? process.env.BUNNY_STORAGE_ZONE.split(",")
  : ["study-storage-2026"];

const getStorageZone = (index = 0) => {
  return STORAGE_ZONES[index % STORAGE_ZONES.length].trim();
};

const uploadToBunny = async (fileBuffer, fileName, folder = "banners") => {
  try {
    const filePath = `${folder}/${Date.now()}-${fileName}`;
    const storageZone = getStorageZone(0);
    const uploadUrl = `${process.env.BUNNY_STORAGE_HOST}/${storageZone}/${filePath}`;

    await axios.put(uploadUrl, fileBuffer, {
      headers: {
        AccessKey: process.env.BUNNY_STORAGE_API_KEY,
        "Content-Type": "application/octet-stream",
      },
    });

    const cdnUrl = `https://${process.env.BUNNY_PULL_ZONE}.b-cdn.net/${filePath}`;

    return {
      success: true,
      filePath,
      cdnUrl,
      storageZone,
    };
  } catch (error) {
    console.error("Bunny upload error:", error.response?.data || error.message);
    throw new Error("Failed to upload to Bunny CDN");
  }
};

const uploadChunkToBunny = async (
  chunk,
  fileName,
  folder,
  chunkIndex,
  totalChunks,
  retryCount = 0,
) => {
  try {
    const storageZone = getStorageZone(chunkIndex);
    const tempFilePath = `${folder}/temp/${Date.now()}-${fileName}.part${chunkIndex}`;
    const uploadUrl = `${process.env.BUNNY_STORAGE_HOST}/${storageZone}/${tempFilePath}`;

    await axios.put(uploadUrl, chunk, {
      headers: {
        AccessKey: process.env.BUNNY_STORAGE_API_KEY,
        "Content-Type": "application/octet-stream",
      },
      timeout: 60000,
    });

    return {
      success: true,
      chunkIndex,
      tempFilePath,
      storageZone,
    };
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying chunk ${chunkIndex}, attempt ${retryCount + 1}`);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (retryCount + 1)),
      );
      return uploadChunkToBunny(
        chunk,
        fileName,
        folder,
        chunkIndex,
        totalChunks,
        retryCount + 1,
      );
    }
    throw new Error(`Failed to upload chunk ${chunkIndex}: ${error.message}`);
  }
};

const mergeChunksOnBunny = async (chunkPaths, finalFileName, folder) => {
  try {
    const storageZone = getStorageZone(0);
    const finalPath = `${folder}/${Date.now()}-${finalFileName}`;
    const mergeUrl = `${process.env.BUNNY_STORAGE_HOST}/${storageZone}/${finalPath}`;

    const chunks = await Promise.all(
      chunkPaths.map(async (chunkPath) => {
        const chunkUrl = `${process.env.BUNNY_STORAGE_HOST}/${chunkPath.storageZone}/${chunkPath.tempFilePath}`;
        const response = await axios.get(chunkUrl, {
          headers: {
            AccessKey: process.env.BUNNY_STORAGE_API_KEY,
          },
          responseType: "arraybuffer",
        });
        return Buffer.from(response.data);
      }),
    );

    const mergedBuffer = Buffer.concat(chunks);

    await axios.put(mergeUrl, mergedBuffer, {
      headers: {
        AccessKey: process.env.BUNNY_STORAGE_API_KEY,
        "Content-Type": "application/octet-stream",
      },
    });

    await Promise.all(
      chunkPaths.map(async (chunkPath) => {
        const deleteUrl = `${process.env.BUNNY_STORAGE_HOST}/${chunkPath.storageZone}/${chunkPath.tempFilePath}`;
        await axios
          .delete(deleteUrl, {
            headers: {
              AccessKey: process.env.BUNNY_STORAGE_API_KEY,
            },
          })
          .catch((err) => console.log("Cleanup error:", err.message));
      }),
    );

    const cdnUrl = `https://${process.env.BUNNY_PULL_ZONE}.b-cdn.net/${finalPath}`;

    return {
      success: true,
      filePath: finalPath,
      cdnUrl,
      storageZone,
    };
  } catch (error) {
    throw new Error(`Failed to merge chunks: ${error.message}`);
  }
};

const uploadLargeFileToBunny = async (
  fileBuffer,
  fileName,
  folder = "videos",
) => {
  try {
    if (fileBuffer.length <= CHUNK_SIZE) {
      return uploadToBunny(fileBuffer, fileName, folder);
    }

    const totalChunks = Math.ceil(fileBuffer.length / CHUNK_SIZE);
    const chunkPromises = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, fileBuffer.length);
      const chunk = fileBuffer.slice(start, end);
      chunkPromises.push(
        uploadChunkToBunny(chunk, fileName, folder, i, totalChunks),
      );
    }

    const uploadedChunks = await Promise.all(chunkPromises);

    const result = await mergeChunksOnBunny(uploadedChunks, fileName, folder);

    return result;
  } catch (error) {
    console.error("Large file upload error:", error.message);
    throw new Error("Failed to upload large file to Bunny CDN");
  }
};

const deleteFromBunny = async (filePath, storageZone = null) => {
  try {
    const zone = storageZone || getStorageZone(0);
    const deleteUrl = `${process.env.BUNNY_STORAGE_HOST}/${zone}/${filePath}`;

    await axios.delete(deleteUrl, {
      headers: {
        AccessKey: process.env.BUNNY_STORAGE_API_KEY,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Bunny delete error:", error.response?.data || error.message);
    throw new Error("Failed to delete from Bunny CDN");
  }
};

module.exports = {
  uploadToBunny,
  uploadLargeFileToBunny,
  deleteFromBunny,
  CHUNK_SIZE,
};
