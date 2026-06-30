const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const os = require("os");

const getVideoDuration = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `temp_video_${Date.now()}.mp4`);

        fs.writeFile(tempFilePath, fileBuffer, (writeErr) => {
            if (writeErr) {
                return reject(new Error("Failed to write temp file"));
            }

            ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
                fs.unlink(tempFilePath, () => {});

                if (err) {
                    return reject(new Error("Failed to read video metadata"));
                }

                if (metadata && metadata.format && metadata.format.duration) {
                    const durationInMinutes = Math.ceil(metadata.format.duration / 60);
                    resolve(durationInMinutes);
                } else {
                    resolve(0);
                }
            });
        });
    });
};

module.exports = {
    getVideoDuration,
};
