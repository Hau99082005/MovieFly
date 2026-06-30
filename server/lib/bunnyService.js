const axios = require("axios");

const uploadToBunny = async (fileBuffer, fileName, folder = "banners") => {
    try {
        const filePath = `${folder}/${Date.now()}-${fileName}`;
        const uploadUrl = `${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_ZONE}/${filePath}`;

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
        };
    } catch (error) {
        console.error("Bunny upload error:", error.response?.data || error.message);
        throw new Error("Failed to upload to Bunny CDN");
    }
};

const deleteFromBunny = async (filePath) => {
    try {
        const deleteUrl = `${process.env.BUNNY_STORAGE_HOST}/${process.env.BUNNY_STORAGE_ZONE}/${filePath}`;

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
    deleteFromBunny,
};
