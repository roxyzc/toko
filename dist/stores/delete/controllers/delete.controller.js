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
const store_model_1 = __importDefault(require("../../../models/store.model"));
const deleteStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idStore } = req.params;
    const { userId } = req.USER;
    try {
        const findStore = yield store_model_1.default.findOne({ where: { idStore } });
        if (!findStore)
            return res.status(404).json({ success: false, error: { message: "store not found" } });
        const access = Array.from(JSON.parse(findStore.access)).filter((x, _v) => x.userId == userId && x.role == "owner");
        if (!access)
            return res.status(403).json({ success: false, error: { message: "You are not alowed to do that" } });
        const store = yield store_model_1.default.destroy({ where: { idStore } });
        res.status(200).json({ success: true, data: { message: "success", store } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = deleteStore;
