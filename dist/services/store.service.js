"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccessUserInStore = void 0;
const store_model_1 = __importDefault(require("../models/store.model"));
const checkUserInStore_util_1 = require("../utils/checkUserInStore.util");
const checkAccessUserInStore = (userId, idStore) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield store_model_1.default.findOne({
        where: { idStore },
        attributes: ["access"],
    });
    if (!store)
        return Promise.resolve(false);
    const access = Array.from(JSON.parse(store.access));
    if ((yield (0, checkUserInStore_util_1.checkUserInStore)(userId, access)) === false)
        return Promise.resolve(false);
    return Promise.resolve(true);
});
exports.checkAccessUserInStore = checkAccessUserInStore;
