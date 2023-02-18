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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserInStoreAsOwner = exports.checkUserInStore = void 0;
const checkUserInStore = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const check = data.find(value => id === value.userId);
    return check ? true : false;
});
exports.checkUserInStore = checkUserInStore;
const checkUserInStoreAsOwner = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const check = data.find(value => id === value.userId && value.role === "owner");
    return check ? true : false;
});
exports.checkUserInStoreAsOwner = checkUserInStoreAsOwner;
