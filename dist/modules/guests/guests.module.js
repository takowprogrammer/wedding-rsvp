"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsModule = void 0;
const common_1 = require("@nestjs/common");
const guests_service_1 = require("./guests.service");
const guests_controller_1 = require("./guests.controller");
const qr_codes_module_1 = require("../qr-codes/qr-codes.module");
const mailer_module_1 = require("../mailer/mailer.module");
let GuestsModule = class GuestsModule {
};
exports.GuestsModule = GuestsModule;
exports.GuestsModule = GuestsModule = __decorate([
    (0, common_1.Module)({
        imports: [qr_codes_module_1.QrCodesModule, mailer_module_1.MailerModule],
        controllers: [guests_controller_1.GuestsController],
        providers: [guests_service_1.GuestsService],
        exports: [guests_service_1.GuestsService],
    })
], GuestsModule);
//# sourceMappingURL=guests.module.js.map