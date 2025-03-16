import multer from "multer";
import APIError from "../shared/lib/error";
const allowedMimeTypes = ["image", "audio"];
const multerConfig = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 52_428_800,
    },
    fileFilter(_req, file, callback) {
        const is_valid_mime = allowedMimeTypes.some(v => file.mimetype.startsWith(v));
        if (is_valid_mime) return callback(null, true);
        return callback(new APIError(`File with mimetype "${file.mimetype}" not supported`, 400));
    },
});

export default multerConfig;
