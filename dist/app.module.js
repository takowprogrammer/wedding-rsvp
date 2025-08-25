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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const guests_module_1 = require("./modules/guests/guests.module");
const invitations_module_1 = require("./modules/invitations/invitations.module");
const qr_codes_module_1 = require("./modules/qr-codes/qr-codes.module");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const guest_groups_module_1 = require("./modules/guest-groups/guest-groups.module");
const mailer_module_1 = require("./modules/mailer/mailer.module");
const thank_you_module_1 = require("./modules/thank-you/thank-you.module");
const thank_you_service_1 = require("./modules/thank-you/thank-you.service");
const auth_module_1 = require("./modules/auth/auth.module");
let AppModule = class AppModule {
    constructor(thankYouService) {
        this.thankYouService = thankYouService;
    }
    async onModuleInit() {
        this.thankYouService.sendIfAfterWedding().catch(() => undefined);
        setInterval(() => {
            this.thankYouService.sendIfAfterWedding().catch(() => undefined);
        }, 24 * 60 * 60 * 1000);
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            guests_module_1.GuestsModule,
            invitations_module_1.InvitationsModule,
            qr_codes_module_1.QrCodesModule,
            guest_groups_module_1.GuestGroupsModule,
            mailer_module_1.MailerModule,
            thank_you_module_1.ThankYouModule,
            auth_module_1.AuthModule,
        ],
    }),
    __metadata("design:paramtypes", [thank_you_service_1.ThankYouService])
], AppModule);
//# sourceMappingURL=app.module.js.map