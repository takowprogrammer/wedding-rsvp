"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThankYouModule = void 0;
const common_1 = require("@nestjs/common");
const thank_you_service_1 = require("./thank-you.service");
const thank_you_controller_1 = require("./thank-you.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const mailer_module_1 = require("../mailer/mailer.module");
let ThankYouModule = class ThankYouModule {
};
exports.ThankYouModule = ThankYouModule;
exports.ThankYouModule = ThankYouModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, mailer_module_1.MailerModule],
        controllers: [thank_you_controller_1.ThankYouController],
        providers: [thank_you_service_1.ThankYouService],
        exports: [thank_you_service_1.ThankYouService],
    })
], ThankYouModule);
//# sourceMappingURL=thank-you.module.js.map