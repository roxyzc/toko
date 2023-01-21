"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_controller_1 = __importDefault(require("./register/controllers/register.controller"));
const route = (0, express_1.Router)();
route.post("/register", register_controller_1.default);
exports.default = route;
