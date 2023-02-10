"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_config_1 = __importDefault(require("../configs/multer.config"));
const verifyFile = (req, res, next) => {
    return multer_config_1.default.single("image")(req, res, (error) => {
        if (error && error.field === "image")
            return next(error);
        if (req.file === undefined)
            return next();
        req.body.image = req.file;
        next();
    });
};
exports.default = verifyFile;
