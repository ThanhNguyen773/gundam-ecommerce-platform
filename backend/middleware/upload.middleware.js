import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const uploadLogoMiddleware = upload.single("logo");

export const uploadAvatarMiddleware = upload.single("avatar");
