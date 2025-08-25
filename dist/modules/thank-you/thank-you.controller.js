"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThankYouController = void 0;
const common_1 = require("@nestjs/common");
const thank_you_service_1 = require("./thank-you.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ThankYouController = class ThankYouController {
    constructor(thankYouService) {
        this.thankYouService = thankYouService;
    }
    async send() {
        try {
            await this.thankYouService.sendThankYouEmailsForAttendees();
            return { success: true };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to send thank-you emails', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ThankYouController = ThankYouController;
__decorate([
    (0, common_1.Post)('send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThankYouController.prototype, "send", null);
exports.ThankYouController = ThankYouController = __decorate([
    (0, common_1.Controller)('thank-you'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [thank_you_service_1.ThankYouService])
], ThankYouController);
//# sourceMappingURL=thank-you.controller.js.map