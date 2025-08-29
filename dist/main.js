/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(4);
const guests_module_1 = __webpack_require__(5);
const invitations_module_1 = __webpack_require__(25);
const qr_codes_module_1 = __webpack_require__(22);
const prisma_module_1 = __webpack_require__(29);
const guest_groups_module_1 = __webpack_require__(30);
const mailer_module_1 = __webpack_require__(24);
const thank_you_module_1 = __webpack_require__(34);
const thank_you_service_1 = __webpack_require__(35);
const auth_module_1 = __webpack_require__(37);
const health_module_1 = __webpack_require__(46);
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
            health_module_1.HealthModule,
            guests_module_1.GuestsModule,
            invitations_module_1.InvitationsModule,
            qr_codes_module_1.QrCodesModule,
            guest_groups_module_1.GuestGroupsModule,
            mailer_module_1.MailerModule,
            thank_you_module_1.ThankYouModule,
            auth_module_1.AuthModule,
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof thank_you_service_1.ThankYouService !== "undefined" && thank_you_service_1.ThankYouService) === "function" ? _a : Object])
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GuestsModule = void 0;
const common_1 = __webpack_require__(3);
const guests_service_1 = __webpack_require__(6);
const guests_controller_1 = __webpack_require__(16);
const qr_codes_module_1 = __webpack_require__(22);
const mailer_module_1 = __webpack_require__(24);
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


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GuestsService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GuestsService = void 0;
const common_1 = __webpack_require__(3);
const qr_codes_service_1 = __webpack_require__(7);
const prisma_service_1 = __webpack_require__(8);
const mailer_service_1 = __webpack_require__(12);
let GuestsService = GuestsService_1 = class GuestsService {
    constructor(prisma, qrCodesService, mailerService) {
        this.prisma = prisma;
        this.qrCodesService = qrCodesService;
        this.mailerService = mailerService;
        this.logger = new common_1.Logger(GuestsService_1.name);
    }
    async create(createGuestDto) {
        try {
            const savedGuest = await this.prisma.guest.create({
                data: {
                    firstName: createGuestDto.firstName,
                    lastName: createGuestDto.lastName,
                    email: createGuestDto.email,
                    phone: createGuestDto.phone,
                    numberOfGuests: createGuestDto.numberOfGuests,
                    dietaryRestrictions: createGuestDto.dietaryRestrictions,
                    specialRequests: createGuestDto.specialRequests,
                    status: 'CONFIRMED',
                    groupId: createGuestDto.groupId ?? undefined,
                },
            });
            if (!savedGuest) {
                throw new Error('Guest creation failed.');
            }
            this.logger.log(`Guest created successfully with ID: ${savedGuest.id}`);
            this.logger.log('Generating QR code...');
            const qrCode = await this.qrCodesService.generateQrCode(savedGuest.id);
            this.logger.log(`QR code generated: ${qrCode.alphanumericCode}`);
            this.logger.log('Generating QR code image...');
            const qrCodeImage = await this.qrCodesService.generateQrCodeImage(qrCode.qrCodeData);
            this.logger.log('QR code image generated successfully');
            const result = {
                guest: savedGuest,
                qrCode: {
                    alphanumericCode: qrCode.alphanumericCode,
                    qrCodeImage,
                },
            };
            this.logger.log('Guest creation completed successfully');
            try {
                await this.mailerService.sendGuestQrCodeEmail(savedGuest, {
                    alphanumericCode: qrCode.alphanumericCode,
                    qrCodeImage: qrCodeImage,
                });
                this.logger.log(`Email sent successfully to ${savedGuest.email}`);
            }
            catch (emailError) {
                this.logger.error(`Failed to send email to ${savedGuest.email}:`, emailError);
            }
            return result;
        }
        catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw new common_1.ConflictException('A guest with this email address has already RSVP\'d.');
            }
            this.logger.error('Error creating guest:', error.message);
            throw error;
        }
    }
    async findAll() {
        return await this.prisma.guest.findMany({
            include: { qrCode: true, group: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id) {
        return await this.prisma.guest.findUnique({
            where: { id },
            include: { qrCode: true, group: true }
        });
    }
    async getStats() {
        const total = await this.prisma.guest.count();
        const confirmed = await this.prisma.guest.count({ where: { status: 'CONFIRMED' } });
        const checkedIn = await this.prisma.guest.count({ where: { checkedIn: true } });
        const totalGuestsResult = await this.prisma.guest.aggregate({ _sum: { numberOfGuests: true } });
        return {
            totalRSVPs: total,
            confirmed,
            checkedIn,
            totalGuests: totalGuestsResult._sum.numberOfGuests || 0
        };
    }
    async getExtendedStats(eventDateISO) {
        const [confirmed, checkedIn, totalExpectedAgg] = await Promise.all([
            this.prisma.guest.count({ where: { status: 'CONFIRMED' } }),
            this.prisma.guest.count({ where: { checkedIn: true } }),
            this.prisma.guest.aggregate({ _sum: { numberOfGuests: true }, where: { status: 'CONFIRMED' } }),
        ]);
        const noShows = Math.max(confirmed - checkedIn, 0);
        const showRate = confirmed > 0 ? Number(((checkedIn / confirmed) * 100).toFixed(1)) : 0;
        let checkinTimeline = [];
        if (eventDateISO) {
            const date = new Date(eventDateISO);
            const start = new Date(date);
            start.setUTCHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setUTCDate(end.getUTCDate() + 1);
            const rows = await this.prisma.guest.groupBy({
                by: ['checkedInAt'],
                where: { checkedIn: true, checkedInAt: { gte: start, lt: end } },
                _count: true,
            });
            const buckets = {};
            rows.forEach(r => {
                const d = r.checkedInAt;
                if (d) {
                    const hour = d.toISOString().slice(11, 13);
                    buckets[hour] = (buckets[hour] || 0) + 1;
                }
            });
            checkinTimeline = Array.from({ length: 24 }).map((_, h) => {
                const hour = h.toString().padStart(2, '0');
                return { hour, count: buckets[hour] || 0 };
            });
        }
        const [codesGenerated, codesUsed, scanSuccess, scanFailures, scanManual, scanScan] = await Promise.all([
            this.prisma.qrCode.count(),
            this.prisma.qrCode.count({ where: { used: true } }),
            this.prisma.scanLog.count({ where: { success: true } }),
            this.prisma.scanLog.count({ where: { success: false } }),
            this.prisma.scanLog.count({ where: { method: 'MANUAL' } }),
            this.prisma.scanLog.count({ where: { method: 'SCAN' } }),
        ]);
        const [thankYouSent, emailFailures] = await Promise.all([
            this.prisma.guest.count({ where: { thankYouSentAt: { not: null } } }),
            this.prisma.emailLog.count({ where: { status: 'FAILED' } }),
        ]);
        return {
            attendance: {
                confirmed,
                checkedIn,
                noShows,
                showRate,
                checkinTimeline,
                totalExpectedGuests: totalExpectedAgg._sum.numberOfGuests || 0,
            },
            qr: {
                codesGenerated,
                codesUsed,
                scanSuccess,
                scanFailures,
                scanByMethod: { manual: scanManual, scan: scanScan },
            },
            communication: {
                thankYouSent,
                emailFailures,
            },
        };
    }
    async findAllAdmin(groupId, search, page = 1, limit = 10) {
        const where = {};
        if (groupId && groupId.trim() !== '') {
            where.groupId = groupId;
        }
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        console.log(`Finding all admin guests in service... Page: ${page}, Limit: ${limit}, GroupId: ${groupId}, Search: ${search}`);
        console.log('Where clause:', JSON.stringify(where, null, 2));
        const [guests, total] = await this.prisma.$transaction([
            this.prisma.guest.findMany({
                where,
                include: {
                    group: true,
                    qrCode: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.guest.count({ where }),
        ]);
        console.log(`Guests found in service: ${guests.length}, Total: ${total}`);
        return { guests, total };
    }
    async remove(id) {
        return await this.prisma.guest.delete({
            where: { id },
        });
    }
    async findAllUnpaginated() {
        return await this.prisma.guest.findMany({
            include: {
                group: true,
                qrCode: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.GuestsService = GuestsService;
exports.GuestsService = GuestsService = GuestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof qr_codes_service_1.QrCodesService !== "undefined" && qr_codes_service_1.QrCodesService) === "function" ? _b : Object, typeof (_c = typeof mailer_service_1.MailerService !== "undefined" && mailer_service_1.MailerService) === "function" ? _c : Object])
], GuestsService);


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var QrCodesService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QrCodesService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const QRCode = __webpack_require__(10);
const uuid_1 = __webpack_require__(11);
let QrCodesService = QrCodesService_1 = class QrCodesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(QrCodesService_1.name);
    }
    async generateQrCode(guestId) {
        this.logger.log(`Generating QR code for guest: ${guestId}`);
        const alphanumericCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        this.logger.log(`Generated alphanumeric code: ${alphanumericCode}`);
        const qrCodeData = alphanumericCode;
        this.logger.debug(`QR code data: ${qrCodeData}`);
        const qrCode = await this.prisma.qrCode.create({
            data: {
                id: (0, uuid_1.v4)(),
                guestId,
                alphanumericCode,
                qrCodeData,
                used: false,
            },
        });
        this.logger.log(`QR code saved to database with ID: ${qrCode.id}`);
        return qrCode;
    }
    async generateQrCodeImage(qrCodeData) {
        if (!qrCodeData) {
            this.logger.error('generateQrCodeImage called with no data');
            throw new Error('QR code data cannot be empty.');
        }
        try {
            const image = await QRCode.toDataURL(qrCodeData);
            return image;
        }
        catch (error) {
            this.logger.error('Failed to generate QR code image', error);
            throw error;
        }
    }
    async generateAlphanumericCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code;
        do {
            code = Array.from({ length: 8 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        } while (await this.prisma.qrCode.findUnique({ where: { alphanumericCode: code } }));
        return code;
    }
    async verifyCode(code) {
        const qrCode = await this.prisma.qrCode.findUnique({
            where: { alphanumericCode: code },
            include: { guest: true }
        });
        if (!qrCode) {
            throw new common_1.NotFoundException('Invalid code');
        }
        return qrCode;
    }
    async logScan(params) {
        await this.prisma.scanLog.create({
            data: {
                guestId: params.guestId,
                qrCodeId: params.qrCodeId,
                method: params.method,
                success: params.success,
                reason: params.reason,
            }
        });
    }
    async checkInGuest(code) {
        const qrCode = await this.verifyCode(code);
        if (qrCode.used) {
            await this.logScan({ guestId: qrCode.guestId, qrCodeId: qrCode.id, method: 'MANUAL', success: false, reason: 'Code already used' });
            throw new Error('Code already used');
        }
        const updatedQrCode = await this.prisma.$transaction(async (prisma) => {
            const updated = await prisma.qrCode.update({
                where: { id: qrCode.id },
                data: { used: true },
                include: { guest: true }
            });
            await prisma.guest.update({
                where: { id: qrCode.guestId },
                data: { checkedIn: true, checkedInAt: new Date() }
            });
            return updated;
        });
        await this.logScan({ guestId: updatedQrCode.guestId, qrCodeId: updatedQrCode.id, method: 'MANUAL', success: true });
        return updatedQrCode;
    }
    async findByGuestId(guestId) {
        return await this.prisma.qrCode.findUnique({
            where: { guestId },
            include: { guest: true }
        });
    }
};
exports.QrCodesService = QrCodesService;
exports.QrCodesService = QrCodesService = QrCodesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], QrCodesService);


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(9);
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            log: ['query', 'info', 'warn', 'error'],
            errorFormat: 'pretty',
        });
        this.logger = new common_1.Logger(PrismaService_1.name);
    }
    async onModuleInit() {
        try {
            this.logger.log('🔌 Connecting to database...');
            this.logger.log(`📊 Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
            await this.$connect();
            this.logger.log('✅ Database connected successfully');
        }
        catch (error) {
            this.logger.error('❌ Failed to connect to database:', error);
            this.logger.error('🔍 Please check your DATABASE_URL environment variable');
            throw error;
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('🔌 Database disconnected successfully');
        }
        catch (error) {
            this.logger.error('❌ Error disconnecting from database:', error);
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("qrcode");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailerService = void 0;
const common_1 = __webpack_require__(3);
const nodemailer = __webpack_require__(13);
const fs = __webpack_require__(14);
const path = __webpack_require__(15);
let MailerService = class MailerService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            } : undefined,
        });
    }
    async sendMail(options) {
        const from = options.from || process.env.MAIL_FROM || 'no-reply@wedding.local';
        const info = await this.transporter.sendMail({
            from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            attachments: options.attachments,
        });
        return info.messageId;
    }
    async sendGuestQrCodeEmail(guest, qrCode) {
        const templatePath = path.join(__dirname, 'templates', 'guest-qr-code.html');
        let html = fs.readFileSync(templatePath, 'utf-8');
        html = html.replace('__GUEST_NAME__', guest.firstName);
        html = html.replace('__ALPHANUMERIC_CODE__', qrCode.alphanumericCode);
        const mailOptions = {
            to: guest.email,
            subject: 'Your QR Code for the Event',
            html,
            attachments: [{
                    filename: 'qrcode.png',
                    content: qrCode.qrCodeImage.split(';base64,').pop(),
                    encoding: 'base64',
                    cid: 'qrcode'
                }]
        };
        return this.sendMail(mailOptions);
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailerService);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GuestsController_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GuestsController = void 0;
const common_1 = __webpack_require__(3);
const guests_service_1 = __webpack_require__(6);
const create_guest_dto_1 = __webpack_require__(17);
const express_1 = __webpack_require__(19);
const QRCode = __webpack_require__(10);
const jwt_auth_guard_1 = __webpack_require__(20);
let GuestsController = GuestsController_1 = class GuestsController {
    constructor(guestsService) {
        this.guestsService = guestsService;
        this.logger = new common_1.Logger(GuestsController_1.name);
    }
    async create(createGuestDto) {
        this.logger.log(`Received guest creation request for: ${createGuestDto.firstName} ${createGuestDto.lastName}`);
        this.logger.debug('Request body:', JSON.stringify(createGuestDto, null, 2));
        try {
            const result = await this.guestsService.create(createGuestDto);
            this.logger.log(`Guest created successfully: ${result.guest.id}`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to create guest:', error);
            throw error;
        }
    }
    async createWithQRCode(body, res) {
        try {
            const [firstName, lastName] = body.name.split(' ') || ['', ''];
            const createGuestDto = {
                firstName,
                lastName,
                email: body.email,
                phone: body.phone,
                numberOfGuests: 1,
            };
            const guest = await this.guestsService.create(createGuestDto);
            if (!guest) {
                throw new Error('Guest creation failed.');
            }
            const alphanumericCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            const qrCodeData = await QRCode.toDataURL(alphanumericCode);
            res.status(common_1.HttpStatus.CREATED).json({
                message: 'Guest created successfully. Please keep the code safe.',
                guest,
                qrCode: qrCodeData,
                alphanumericCode,
            });
        }
        catch (error) {
            console.error('[GuestsController] Failed to create guest:', error.message);
            res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
            });
        }
    }
    async findAll() {
        return await this.guestsService.findAll();
    }
    async findAllAdmin(groupId, search, page = '1', limit = '10') {
        console.log('Finding all admin guests...');
        console.log('Query parameters:', { groupId, search, page, limit });
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        console.log('Parsed parameters:', { pageNumber, limitNumber });
        const result = await this.guestsService.findAllAdmin(groupId, search, pageNumber, limitNumber);
        console.log('Guests found:', result.guests.length);
        console.log('Total count:', result.total);
        console.log('Response structure:', { guests: result.guests?.length || 0, total: result.total });
        return result;
    }
    async getStats() {
        return await this.guestsService.getStats();
    }
    async getExtendedStats(eventDate) {
        return await this.guestsService.getExtendedStats(eventDate);
    }
    async findOne(id) {
        const guest = await this.guestsService.findOne(id);
        if (!guest) {
            throw new common_1.HttpException('Guest not found', common_1.HttpStatus.NOT_FOUND);
        }
        return guest;
    }
    async remove(id) {
        return await this.guestsService.remove(id);
    }
    async findAllUnpaginated() {
        return await this.guestsService.findAllUnpaginated();
    }
};
exports.GuestsController = GuestsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_guest_dto_1.CreateGuestDto !== "undefined" && create_guest_dto_1.CreateGuestDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "createWithQRCode", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('groupId')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('stats/extended'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('eventDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "getExtendedStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestsController.prototype, "findAllUnpaginated", null);
exports.GuestsController = GuestsController = GuestsController_1 = __decorate([
    (0, common_1.Controller)('guests'),
    __metadata("design:paramtypes", [typeof (_a = typeof guests_service_1.GuestsService !== "undefined" && guests_service_1.GuestsService) === "function" ? _a : Object])
], GuestsController);


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateGuestDto = void 0;
const class_validator_1 = __webpack_require__(18);
class CreateGuestDto {
}
exports.CreateGuestDto = CreateGuestDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateGuestDto.prototype, "numberOfGuests", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "dietaryRestrictions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "specialRequests", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "groupId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "phone", void 0);


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(21);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QrCodesModule = void 0;
const common_1 = __webpack_require__(3);
const qr_codes_service_1 = __webpack_require__(7);
const qr_codes_controller_1 = __webpack_require__(23);
let QrCodesModule = class QrCodesModule {
};
exports.QrCodesModule = QrCodesModule;
exports.QrCodesModule = QrCodesModule = __decorate([
    (0, common_1.Module)({
        controllers: [qr_codes_controller_1.QrCodesController],
        providers: [qr_codes_service_1.QrCodesService],
        exports: [qr_codes_service_1.QrCodesService],
    })
], QrCodesModule);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QrCodesController = void 0;
const common_1 = __webpack_require__(3);
const qr_codes_service_1 = __webpack_require__(7);
let QrCodesController = class QrCodesController {
    constructor(qrCodesService) {
        this.qrCodesService = qrCodesService;
    }
    async verifyCode(code) {
        try {
            const qrCode = await this.qrCodesService.verifyCode(code);
            await this.qrCodesService.logScan({ guestId: qrCode.guestId, qrCodeId: qrCode.id, method: 'MANUAL', success: true });
            return {
                valid: true,
                guest: qrCode.guest,
                used: qrCode.used
            };
        }
        catch (error) {
            await this.qrCodesService.logScan({ method: 'MANUAL', success: false, reason: 'Invalid code' });
            throw new common_1.HttpException({ valid: false, message: error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async checkInGuest(code) {
        try {
            const qrCode = await this.qrCodesService.checkInGuest(code);
            return {
                success: true,
                guest: qrCode.guest,
                message: 'Guest checked in successfully'
            };
        }
        catch (error) {
            throw new common_1.HttpException({ success: false, message: error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getQrCodeByGuest(guestId) {
        const qrCode = await this.qrCodesService.findByGuestId(guestId);
        if (!qrCode) {
            throw new common_1.HttpException('QR code not found', common_1.HttpStatus.NOT_FOUND);
        }
        const qrCodeImage = await this.qrCodesService.generateQrCodeImage(qrCode.qrCodeData);
        return {
            alphanumericCode: qrCode.alphanumericCode,
            qrCodeImage,
            guest: qrCode.guest
        };
    }
};
exports.QrCodesController = QrCodesController;
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrCodesController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.Post)('checkin'),
    __param(0, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrCodesController.prototype, "checkInGuest", null);
__decorate([
    (0, common_1.Get)('guest/:guestId'),
    __param(0, (0, common_1.Param)('guestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrCodesController.prototype, "getQrCodeByGuest", null);
exports.QrCodesController = QrCodesController = __decorate([
    (0, common_1.Controller)('qr-codes'),
    __metadata("design:paramtypes", [typeof (_a = typeof qr_codes_service_1.QrCodesService !== "undefined" && qr_codes_service_1.QrCodesService) === "function" ? _a : Object])
], QrCodesController);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailerModule = void 0;
const common_1 = __webpack_require__(3);
const mailer_service_1 = __webpack_require__(12);
let MailerModule = class MailerModule {
};
exports.MailerModule = MailerModule;
exports.MailerModule = MailerModule = __decorate([
    (0, common_1.Module)({
        providers: [mailer_service_1.MailerService],
        exports: [mailer_service_1.MailerService],
    })
], MailerModule);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvitationsModule = void 0;
const common_1 = __webpack_require__(3);
const invitations_service_1 = __webpack_require__(26);
const invitations_controller_1 = __webpack_require__(27);
let InvitationsModule = class InvitationsModule {
};
exports.InvitationsModule = InvitationsModule;
exports.InvitationsModule = InvitationsModule = __decorate([
    (0, common_1.Module)({
        controllers: [invitations_controller_1.InvitationsController],
        providers: [invitations_service_1.InvitationsService],
        exports: [invitations_service_1.InvitationsService],
    })
], InvitationsModule);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InvitationsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvitationsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
let InvitationsService = InvitationsService_1 = class InvitationsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(InvitationsService_1.name);
    }
    async create(createInvitationDto) {
        this.logger.log(`Creating invitation: ${createInvitationDto.title}`);
        this.logger.debug('Invitation data:', JSON.stringify(createInvitationDto, null, 2));
        try {
            const result = await this.prisma.invitation.create({
                data: createInvitationDto
            });
            this.logger.log(`Invitation created successfully with ID: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to create invitation:', error);
            throw error;
        }
    }
    async findAll() {
        return await this.prisma.invitation.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { id }
        });
        if (!invitation) {
            throw new Error('Invitation not found');
        }
        return invitation;
    }
    async remove(id) {
        const invitation = await this.findOne(id);
        await this.prisma.invitation.delete({
            where: { id }
        });
        return { message: 'Invitation deleted successfully' };
    }
    async findActive() {
        return await this.prisma.invitation.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    getTemplateImageUrl(templateName, providedImageUrl) {
        if (providedImageUrl)
            return providedImageUrl;
        if (!templateName)
            return undefined;
        const safe = templateName.trim().toLowerCase().replace(/\s+/g, '_');
        return `/invitations/${safe}.png`;
    }
    async generateInvitationHtml(id) {
        const invitation = await this.findOne(id);
        if (!invitation) {
            throw new Error('Invitation not found');
        }
        const imageUrl = this.getTemplateImageUrl(invitation.templateName, invitation.imageUrl);
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${invitation.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow-x: hidden;
        }

        .envelope-container {
            position: relative;
            width: 100%;
            max-width: 700px;
            margin: 20px auto;
        }

        .envelope {
            position: relative;
            width: 100%;
            height: 450px;
            background: linear-gradient(145deg, #f5e6d3 0%, #e6d5c3 50%, #d4c4b0 100%);
            border-radius: 25px;
            box-shadow: 
                0 30px 60px rgba(139, 115, 85, 0.3),
                0 15px 30px rgba(0,0,0,0.2),
                inset 0 2px 4px rgba(255,255,255,0.3);
            border: 3px solid #c4b5a0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background-image: 
                linear-gradient(145deg, #f5e6d3 0%, #e6d5c3 50%, #d4c4b0 100%),
                repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(255,255,255,0.1) 2px,
                    rgba(255,255,255,0.1) 4px
                );
        }

        .envelope.open {
            transform: scale(0.95);
            box-shadow: 
                0 15px 30px rgba(139, 115, 85, 0.2),
                0 8px 15px rgba(0,0,0,0.1),
                inset 0 2px 4px rgba(255,255,255,0.3);
        }

        .envelope::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60%;
            background: linear-gradient(135deg, #d4a574 0%, #b8860b 100%);
            clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%);
            z-index: 1;
            transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-origin: bottom center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .envelope.open::before {
            transform: rotateX(180deg);
            background: linear-gradient(135deg, #b8860b 0%, #d4a574 100%);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        .envelope::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
            z-index: 2;
            transition: opacity 0.3s ease;
        }

        .envelope.open::after {
            opacity: 0;
        }

        .envelope-header {
            background: transparent;
            padding: 25px 20px 15px 20px;
            text-align: center;
            border-bottom: none;
            position: relative;
            z-index: 3;
        }

        .envelope-seal {
            width: 80px;
            height: 80px;
            background: linear-gradient(145deg, #8b9dc3 0%, #6b7b9a 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin: 0 auto 20px;
            box-shadow: 
                0 15px 30px rgba(139, 157, 195, 0.4),
                inset 0 2px 4px rgba(255,255,255,0.3);
            border: 4px solid #f5e6d3;
            position: relative;
            z-index: 3;
        }

        .envelope-seal::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #f5e6d3, #e6d5c3);
            border-radius: 50%;
            z-index: -1;
        }

        @keyframes pulse {
            0%, 100% { 
                transform: scale(1);
                box-shadow: 0 15px 30px rgba(139, 157, 195, 0.4);
            }
            50% { 
                transform: scale(1.05);
                box-shadow: 0 20px 40px rgba(139, 157, 195, 0.6);
            }
        }

        .envelope-title {
            font-size: 32px;
            font-weight: 700;
            color: #2c3e50;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            font-family: 'Playfair Display', 'Georgia', serif;
            margin-bottom: 8px;
            letter-spacing: 1px;
            position: relative;
            z-index: 3;
        }

        .envelope-subtitle {
            font-size: 18px;
            color: #5d6d7e;
            opacity: 0.9;
            font-style: italic;
            font-weight: 500;
            letter-spacing: 0.5px;
            position: relative;
            z-index: 3;
        }

        .envelope-body {
            flex: 1;
            padding: 40px 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: #2c3e50;
            position: relative;
            z-index: 3;
        }

        .open-button {
            background: linear-gradient(145deg, #d4a574 0%, #b8860b 100%);
            color: white;
            padding: 18px 50px;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 
                0 20px 40px rgba(212, 165, 116, 0.4),
                inset 0 2px 4px rgba(255,255,255,0.2);
            border: 3px solid rgba(255,255,255,0.3);
            margin-bottom: 25px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            position: relative;
            overflow: hidden;
        }

        .open-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        .open-button:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 
                0 25px 50px rgba(212, 165, 116, 0.6),
                inset 0 2px 4px rgba(255,255,255,0.2);
            background: linear-gradient(145deg, #b8860b 0%, #d4a574 100%);
        }

        .open-button:hover::before {
            left: 100%;
        }

        .envelope-footer {
            background: linear-gradient(145deg, #e6d5c3 0%, #d4c4b0 100%);
            padding: 20px;
            text-align: center;
            border-top: 2px solid #c4b5a0;
            position: relative;
            z-index: 3;
        }

        .invitation-preview {
            color: #5d6d7e;
            font-size: 16px;
            line-height: 1.6;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
        }

        .invitation-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%);
            border-radius: 25px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            overflow: visible;
            z-index: 1000;
            margin-top: 40px;
            box-shadow: 
                0 30px 60px rgba(0,0,0,0.15),
                0 15px 30px rgba(0,0,0,0.1),
                inset 0 1px 3px rgba(255,255,255,0.8);
            border: 3px solid #e9ecef;
            transform: translateY(100%) scale(0.9);
        }

        .invitation-content.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        .invitation-card {
            width: 100%;
            height: auto;
            background: transparent;
            border-radius: 25px;
            overflow: visible;
            text-align: center;
            position: relative;
            padding: 0;
        }

        .invitation-image {
            width: 100%;
            height: auto;
            max-height: 650px;
            object-fit: cover;
            border-radius: 25px 25px 0 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-bottom: 3px solid #f1f3f4;
        }

        .invitation-text-content {
            padding: 40px 50px 50px 50px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 0 0 25px 25px;
            position: relative;
        }

        .invitation-text-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: linear-gradient(90deg, #d4a574, #b8860b, #d4a574);
            border-radius: 2px;
        }

        .invitation-title {
            font-size: 36px;
            color: #2c3e50;
            margin-bottom: 25px;
            font-weight: 700;
            line-height: 1.2;
            font-family: 'Playfair Display', 'Georgia', serif;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.05);
            letter-spacing: 1px;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .invitation-message {
            font-size: 18px;
            color: #5a6c7d;
            line-height: 1.8;
            margin-bottom: 35px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            word-wrap: break-word;
            font-weight: 400;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
        }

        .rsvp-button {
            background: linear-gradient(135deg, #d4a574 0%, #b8860b 50%, #d4a574 100%);
            color: white;
            padding: 18px 50px;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 
                0 15px 35px rgba(212, 165, 116, 0.4),
                inset 0 2px 4px rgba(255,255,255,0.3);
            border: 3px solid rgba(255,255,255,0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
        }

        .rsvp-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.6s ease;
        }

        .rsvp-button:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 
                0 20px 40px rgba(212, 165, 116, 0.6),
                inset 0 2px 4px rgba(255,255,255,0.3);
            background: linear-gradient(135deg, #b8860b 0%, #d4a574 50%, #b8860b 100%);
        }

        .rsvp-button:hover::before {
            left: 100%;
        }

        .close-button {
            position: absolute;
            top: 25px;
            right: 25px;
            background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%);
            color: #6c757d;
            border: 2px solid #e9ecef;
            border-radius: 50%;
            width: 55px;
            height: 55px;
            font-size: 28px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 10;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }

        .close-button:hover {
            background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,249,250,1) 100%);
            color: #495057;
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 12px 25px rgba(0,0,0,0.15);
            border-color: #d4a574;
        }

        .invitation-decoration {
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 24px;
            opacity: 0.7;
            color: #d4a574;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .invitation-decoration.right {
            left: auto;
            right: 20px;
        }

        /* Add decorative corner elements */
        .invitation-card::before,
        .invitation-card::after {
            content: '';
            position: absolute;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #d4a574 0%, #b8860b 100%);
            border-radius: 50%;
            opacity: 0.1;
            z-index: 1;
        }

        .invitation-card::before {
            top: 20px;
            left: 20px;
        }

        .invitation-card::after {
            bottom: 20px;
            right: 20px;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .envelope-container {
                max-width: 95%;
                margin: 10px auto;
            }
            
            .envelope {
                height: 400px;
                border-radius: 20px;
            }
            
            .envelope-header {
                padding: 20px 15px 10px 15px;
            }
            
            .envelope-seal {
                width: 70px;
                height: 70px;
                font-size: 28px;
                margin-bottom: 15px;
            }
            
            .envelope-title {
                font-size: 28px;
            }
            
            .envelope-subtitle {
                font-size: 16px;
            }
            
            .envelope-body {
                padding: 30px 20px;
            }
            
            .open-button {
                padding: 15px 40px;
                font-size: 16px;
                margin-bottom: 20px;
            }
            
            .envelope-footer {
                padding: 15px;
            }
            
            .invitation-content {
                margin-top: 35px;
                border-radius: 20px;
            }
            
            .invitation-card {
                border-radius: 20px;
            }
            
            .invitation-image {
                max-height: 550px;
                border-radius: 20px 20px 0 0;
            }
            
            .invitation-text-content {
                padding: 30px 35px 40px 35px;
                border-radius: 0 0 20px 20px;
            }
            
            .invitation-title {
                font-size: 30px;
                margin-bottom: 20px;
            }
            
            .invitation-message {
                font-size: 16px;
                max-width: 100%;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            
            .rsvp-button {
                padding: 15px 40px;
                font-size: 16px;
            }
        }

        @media (max-width: 480px) {
            .envelope {
                height: 350px;
                border-radius: 18px;
            }
            
            .envelope-header {
                padding: 15px 12px 8px 12px;
            }
            
            .envelope-seal {
                width: 60px;
                height: 60px;
                font-size: 24px;
                margin-bottom: 12px;
            }
            
            .envelope-title {
                font-size: 24px;
            }
            
            .envelope-subtitle {
                font-size: 14px;
            }
            
            .envelope-body {
                padding: 25px 15px;
            }
            
            .open-button {
                padding: 12px 35px;
                font-size: 14px;
                margin-bottom: 18px;
            }
            
            .envelope-footer {
                padding: 12px;
            }
            
            .invitation-content {
                margin-top: 30px;
                border-radius: 18px;
            }
            
            .invitation-card {
                border-radius: 18px;
            }
            
            .invitation-image {
                max-height: 450px;
                border-radius: 18px 18px 0 0;
            }
            
            .invitation-text-content {
                padding: 25px 25px 35px 25px;
                border-radius: 0 0 18px 18px;
            }
            
            .invitation-title {
                font-size: 26px;
                margin-bottom: 18px;
            }
            
            .invitation-message {
                font-size: 15px;
                max-width: 100%;
                margin-bottom: 25px;
                line-height: 1.6;
            }
            
            .rsvp-button {
                padding: 12px 35px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="envelope-container">
        <!-- Envelope -->
        <div class="envelope" id="envelope">
            <div class="envelope-header">
                <div class="envelope-seal">✨</div>
                <h1 class="envelope-title">Wedding Invitation</h1>
                <p class="envelope-subtitle">A special invitation awaits you</p>
            </div>
            
            <div class="envelope-body">
                <button class="open-button" onclick="openInvitation()">Open Invitation Now</button>
            </div>
            
            <div class="envelope-footer">
                <div class="invitation-preview">
                    <strong>${invitation.title}</strong><br>
                    ${invitation.message ? invitation.message.substring(0, 100) + '...' : 'Click to view the full invitation'}
                </div>
            </div>
        </div>
        
        <!-- Invitation Content (Hidden initially) -->
        <div class="invitation-content" id="invitationContent">
            <div class="invitation-card">
                <button class="close-button" onclick="closeInvitation()">×</button>
                ${imageUrl ? `<img src="${imageUrl}" alt="Wedding Invitation" class="invitation-image">` : ''}
                <div class="invitation-text-content">
                    <h1 class="invitation-title">${invitation.title}</h1>
                    <p class="invitation-message">${invitation.message}</p>
                    <a href="${invitation.formUrl}" class="rsvp-button">${invitation.buttonText}</a>
                </div>
            </div>
        </div>
    </div>

    <script>
        function openInvitation() {
            const envelope = document.getElementById('envelope');
            const invitationContent = document.getElementById('invitationContent');
            
            // First, animate the envelope opening (flap lifting)
            envelope.classList.add('open');
            
            // After envelope opens, slide out the invitation
            setTimeout(() => {
                invitationContent.classList.add('show');
            }, 400); // Half of the envelope animation time
        }

        function closeInvitation() {
            const envelope = document.getElementById('envelope');
            const invitationContent = document.getElementById('invitationContent');
            
            // First hide the invitation
            invitationContent.classList.remove('show');
            
            // Then close the envelope
            setTimeout(() => {
                envelope.classList.remove('open');
            }, 300); // Wait for invitation to slide back
        }

        // Add some interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            const envelope = document.getElementById('envelope');
            
            // Add hover sound effect (optional)
            envelope.addEventListener('mouseenter', function() {
                // You could add a subtle sound here
            });
            
            // Add click sound effect (optional)
            envelope.addEventListener('click', function() {
                // You could add a paper rustling sound here
            });
        });
    </script>
</body>
</html>`;
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = InvitationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], InvitationsService);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InvitationsController_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvitationsController = void 0;
const common_1 = __webpack_require__(3);
const express_1 = __webpack_require__(19);
const invitations_service_1 = __webpack_require__(26);
const create_invitation_dto_1 = __webpack_require__(28);
const fs = __webpack_require__(14);
const path = __webpack_require__(15);
let InvitationsController = InvitationsController_1 = class InvitationsController {
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
        this.logger = new common_1.Logger(InvitationsController_1.name);
    }
    async create(createInvitationDto) {
        this.logger.log(`Received invitation creation request: ${createInvitationDto.title}`);
        this.logger.debug('Invitation data:', JSON.stringify(createInvitationDto, null, 2));
        try {
            const result = await this.invitationsService.create(createInvitationDto);
            this.logger.log(`Invitation created successfully: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to create invitation:', error);
            throw error;
        }
    }
    async remove(id) {
        return await this.invitationsService.remove(id);
    }
    async findAll() {
        return await this.invitationsService.findAll();
    }
    async findActive() {
        return await this.invitationsService.findActive();
    }
    async listTemplates() {
        const candidates = [
            path.join(process.cwd(), 'frontend', 'public', 'invitations'),
            path.join(process.cwd(), 'public', 'invitations'),
        ];
        for (const dir of candidates) {
            try {
                const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.png'));
                if (files.length > 0) {
                    return files.map(f => ({
                        file: f,
                        templateName: path.parse(f).name,
                        imageUrl: `/invitations/${f}`,
                    }));
                }
            }
            catch { }
        }
        return [];
    }
    async findOne(id) {
        const invitation = await this.invitationsService.findOne(id);
        if (!invitation) {
            throw new common_1.HttpException('Invitation not found', common_1.HttpStatus.NOT_FOUND);
        }
        return invitation;
    }
    async previewInvitation(id, res) {
        try {
            const html = await this.invitationsService.generateInvitationHtml(id);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        }
        catch (error) {
            throw new common_1.HttpException('Invitation not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_invitation_dto_1.CreateInvitationDto !== "undefined" && create_invitation_dto_1.CreateInvitationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/preview'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "previewInvitation", null);
exports.InvitationsController = InvitationsController = InvitationsController_1 = __decorate([
    (0, common_1.Controller)('invitations'),
    __metadata("design:paramtypes", [typeof (_a = typeof invitations_service_1.InvitationsService !== "undefined" && invitations_service_1.InvitationsService) === "function" ? _a : Object])
], InvitationsController);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateInvitationDto = void 0;
const class_validator_1 = __webpack_require__(18);
class CreateInvitationDto {
}
exports.CreateInvitationDto = CreateInvitationDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "templateName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "buttonText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvitationDto.prototype, "formUrl", void 0);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GuestGroupsModule = void 0;
const common_1 = __webpack_require__(3);
const guest_groups_service_1 = __webpack_require__(31);
const guest_groups_controller_1 = __webpack_require__(32);
let GuestGroupsModule = class GuestGroupsModule {
};
exports.GuestGroupsModule = GuestGroupsModule;
exports.GuestGroupsModule = GuestGroupsModule = __decorate([
    (0, common_1.Module)({
        controllers: [guest_groups_controller_1.GuestGroupsController],
        providers: [guest_groups_service_1.GuestGroupsService],
        exports: [guest_groups_service_1.GuestGroupsService],
    })
], GuestGroupsModule);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GuestGroupsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
let GuestGroupsService = class GuestGroupsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(name) {
        return await this.prisma.guestGroup.create({ data: { name } });
    }
    async findAll() {
        return await this.prisma.guestGroup.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        return await this.prisma.guestGroup.findUnique({ where: { id } });
    }
};
exports.GuestGroupsService = GuestGroupsService;
exports.GuestGroupsService = GuestGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], GuestGroupsService);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GuestGroupsController_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GuestGroupsController = void 0;
const common_1 = __webpack_require__(3);
const guest_groups_service_1 = __webpack_require__(31);
const create_guest_group_dto_1 = __webpack_require__(33);
const jwt_auth_guard_1 = __webpack_require__(20);
let GuestGroupsController = GuestGroupsController_1 = class GuestGroupsController {
    constructor(guestGroupsService) {
        this.guestGroupsService = guestGroupsService;
        this.logger = new common_1.Logger(GuestGroupsController_1.name);
    }
    async findAll() {
        this.logger.log('Received request to fetch all guest groups');
        try {
            const groups = await this.guestGroupsService.findAll();
            this.logger.log(`Found ${groups.length} guest groups`);
            return groups;
        }
        catch (error) {
            this.logger.error('Failed to fetch guest groups:', error);
            throw error;
        }
    }
    async create(createGuestGroupDto) {
        this.logger.log(`Received request to create guest group: ${createGuestGroupDto.name}`);
        try {
            const result = await this.guestGroupsService.create(createGuestGroupDto.name.trim());
            this.logger.log(`Guest group created successfully: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to create guest group:', error);
            throw new common_1.HttpException('Failed to create group', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GuestGroupsController = GuestGroupsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestGroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_guest_group_dto_1.CreateGuestGroupDto !== "undefined" && create_guest_group_dto_1.CreateGuestGroupDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], GuestGroupsController.prototype, "create", null);
exports.GuestGroupsController = GuestGroupsController = GuestGroupsController_1 = __decorate([
    (0, common_1.Controller)('guest-groups'),
    __metadata("design:paramtypes", [typeof (_a = typeof guest_groups_service_1.GuestGroupsService !== "undefined" && guest_groups_service_1.GuestGroupsService) === "function" ? _a : Object])
], GuestGroupsController);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateGuestGroupDto = void 0;
const class_validator_1 = __webpack_require__(18);
class CreateGuestGroupDto {
}
exports.CreateGuestGroupDto = CreateGuestGroupDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGuestGroupDto.prototype, "name", void 0);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThankYouModule = void 0;
const common_1 = __webpack_require__(3);
const thank_you_service_1 = __webpack_require__(35);
const thank_you_controller_1 = __webpack_require__(36);
const prisma_module_1 = __webpack_require__(29);
const mailer_module_1 = __webpack_require__(24);
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


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ThankYouService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThankYouService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(8);
const mailer_service_1 = __webpack_require__(12);
let ThankYouService = ThankYouService_1 = class ThankYouService {
    constructor(prisma, mailer) {
        this.prisma = prisma;
        this.mailer = mailer;
        this.logger = new common_1.Logger(ThankYouService_1.name);
    }
    buildEmailHtml(guest) {
        const coupleNames = process.env.COUPLE_NAMES || 'We';
        const albumUrl = process.env.THANK_YOU_ALBUM_URL || '#';
        return `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
            <div style="text-align:center; padding: 24px 0;">
              <h2 style="margin:0; color:#333;">Thank You</h2>
            </div>
            <div style="background:#fff; border-radius:12px; padding:24px; border:1px solid #eee;">
              <p style="color:#333;">Dear ${guest.firstName},</p>
              <p style="color:#444; line-height:1.6;">${coupleNames} would like to thank you for being part of our special day. Your presence truly made it unforgettable.</p>
              <p style="color:#444; line-height:1.6;">We have started to collect some photos here:</p>
              <p><a href="${albumUrl}" style="background:#ec4899; color:white; padding:10px 16px; text-decoration:none; border-radius:8px;">View Photos</a></p>
              <p style="color:#666; font-size:12px; margin-top:24px;">If the button does not work, copy this link: ${albumUrl}</p>
            </div>
          </div>
        `;
    }
    async sendThankYouEmailsForAttendees() {
        const attendees = await this.prisma.guest.findMany({
            where: {
                status: 'CONFIRMED',
                checkedIn: true,
                thankYouSentAt: null,
            },
            select: { id: true, email: true, firstName: true, lastName: true },
        });
        for (const guest of attendees) {
            try {
                const messageId = await this.mailer.sendMail({
                    to: guest.email,
                    subject: 'Thank you for celebrating with us',
                    html: this.buildEmailHtml(guest),
                });
                await this.prisma.$transaction([
                    this.prisma.guest.update({ where: { id: guest.id }, data: { thankYouSentAt: new Date() } }),
                    this.prisma.emailLog.create({
                        data: {
                            messageId,
                            guestId: guest.id,
                            type: 'THANK_YOU',
                            status: 'SENT',
                            sentAt: new Date(),
                        }
                    })
                ]);
            }
            catch (error) {
                this.logger.error(`Failed to send thank-you to ${guest.email}: ${error?.message || error}`);
                await this.prisma.emailLog.create({
                    data: {
                        messageId: `failed_${guest.id}_${Date.now()}`,
                        guestId: guest.id,
                        type: 'THANK_YOU',
                        status: 'FAILED',
                        error: error?.message || String(error),
                        sentAt: new Date(),
                    }
                });
            }
        }
    }
    async sendIfAfterWedding() {
        const weddingDateStr = process.env.WEDDING_DATE;
        if (!weddingDateStr)
            return;
        const weddingDate = new Date(weddingDateStr + 'T00:00:00Z');
        const now = new Date();
        const msInDay = 24 * 60 * 60 * 1000;
        if (now.getTime() - weddingDate.getTime() >= 2 * msInDay) {
            await this.sendThankYouEmailsForAttendees();
        }
    }
};
exports.ThankYouService = ThankYouService;
exports.ThankYouService = ThankYouService = ThankYouService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof mailer_service_1.MailerService !== "undefined" && mailer_service_1.MailerService) === "function" ? _b : Object])
], ThankYouService);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThankYouController = void 0;
const common_1 = __webpack_require__(3);
const thank_you_service_1 = __webpack_require__(35);
const jwt_auth_guard_1 = __webpack_require__(20);
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
    __metadata("design:paramtypes", [typeof (_a = typeof thank_you_service_1.ThankYouService !== "undefined" && thank_you_service_1.ThankYouService) === "function" ? _a : Object])
], ThankYouController);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(38);
const auth_controller_1 = __webpack_require__(41);
const prisma_module_1 = __webpack_require__(29);
const jwt_1 = __webpack_require__(39);
const config_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(21);
const jwt_strategy_1 = __webpack_require__(44);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '60m' },
                }),
                inject: [config_1.ConfigService],
            }),
            config_1.ConfigModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
    })
], AuthModule);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(39);
const prisma_service_1 = __webpack_require__(8);
const bcrypt = __webpack_require__(40);
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerUserDto) {
        const { username, password } = registerUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        const { password: _, ...result } = user;
        return result;
    }
    async login(loginUserDto) {
        const { username, password } = loginUserDto;
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async validateUser(username, password) {
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 39 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 40 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(38);
const register_user_dto_1 = __webpack_require__(42);
const login_user_dto_1 = __webpack_require__(43);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerUserDto) {
        return this.authService.register(registerUserDto);
    }
    async login(loginUserDto) {
        return this.authService.login(loginUserDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof register_user_dto_1.RegisterUserDto !== "undefined" && register_user_dto_1.RegisterUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof login_user_dto_1.LoginUserDto !== "undefined" && login_user_dto_1.LoginUserDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterUserDto = void 0;
const class_validator_1 = __webpack_require__(18);
class RegisterUserDto {
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginUserDto = void 0;
const class_validator_1 = __webpack_require__(18);
class LoginUserDto {
}
exports.LoginUserDto = LoginUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginUserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(21);
const passport_jwt_1 = __webpack_require__(45);
const config_1 = __webpack_require__(4);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
    }
    async validate(payload) {
        return { userId: payload.sub, username: payload.username };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(3);
const health_controller_1 = __webpack_require__(47);
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
    })
], HealthModule);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(3);
const express_1 = __webpack_require__(19);
const prisma_service_1 = __webpack_require__(8);
let HealthController = class HealthController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async check(res) {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return res.status(common_1.HttpStatus.OK).json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                database: 'connected',
                environment: process.env.NODE_ENV || 'development',
                cors: 'enabled',
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.SERVICE_UNAVAILABLE).json({
                status: 'error',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: error.message,
                environment: process.env.NODE_ENV || 'development',
            });
        }
    }
    async databaseCheck(res) {
        try {
            const result = await this.prisma.$queryRaw `SELECT version() as version, current_database() as database, current_user as user`;
            return res.status(common_1.HttpStatus.OK).json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                database: 'connected',
                details: result[0],
                environment: process.env.NODE_ENV || 'development',
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.SERVICE_UNAVAILABLE).json({
                status: 'error',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: error.message,
                environment: process.env.NODE_ENV || 'development',
            });
        }
    }
    async testPost(res) {
        return res.status(common_1.HttpStatus.OK).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'POST request successful',
            environment: process.env.NODE_ENV || 'development',
            cors: 'enabled',
        });
    }
    async corsTest(res) {
        return res.status(common_1.HttpStatus.OK).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'CORS test successful',
            environment: process.env.NODE_ENV || 'development',
            cors: 'enabled',
            allowedOrigins: process.env.NODE_ENV === 'production'
                ? ['https://rsvp-fe-lovat.vercel.app', process.env.FRONTEND_URL].filter(Boolean)
                : ['http://localhost:3000', 'http://localhost:3001'],
        });
    }
    async ping(res) {
        return res.status(common_1.HttpStatus.OK).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Pong! Backend is reachable',
            environment: process.env.NODE_ENV || 'development',
            cors: 'enabled',
            requestHeaders: res.req.headers,
        });
    }
    async echo(res, body) {
        return res.status(common_1.HttpStatus.OK).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Echo endpoint working',
            receivedData: body,
            environment: process.env.NODE_ENV || 'development',
            cors: 'enabled',
        });
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('db'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "databaseCheck", null);
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "testPost", null);
__decorate([
    (0, common_1.Get)('cors'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "corsTest", null);
__decorate([
    (0, common_1.Get)('ping'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "ping", null);
__decorate([
    (0, common_1.Post)('echo'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object, Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "echo", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], HealthController);


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCorsConfig = exports.corsConfig = void 0;
exports.corsConfig = {
    development: {
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
        credentials: true,
        optionsSuccessStatus: 200,
        preflightContinue: false,
    },
    production: {
        origin: [
            'https://rsvp-fe-lovat.vercel.app',
            process.env.FRONTEND_URL,
        ].filter(Boolean),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
        credentials: true,
        optionsSuccessStatus: 200,
        preflightContinue: false,
    }
};
const getCorsConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    const config = exports.corsConfig[env] || exports.corsConfig.development;
    console.log('🔧 CORS Configuration Debug:');
    console.log('   Environment:', env);
    console.log('   Allowed Origins:', config.origin);
    console.log('   Methods:', config.methods);
    console.log('   Headers:', config.allowedHeaders);
    console.log('   Credentials:', config.credentials);
    return config;
};
exports.getCorsConfig = getCorsConfig;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const cors_config_1 = __webpack_require__(48);
async function bootstrap() {
    const logLevel = (process.env.LOG_LEVEL || 'debug');
    const logLevels = ['log', 'error', 'warn', 'debug', 'verbose'];
    console.log(`🔧 Starting application with log level: ${logLevel}`);
    console.log(`📝 Available log levels: ${logLevels.join(', ')}`);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: logLevels,
        bufferLogs: true,
    });
    const corsOptions = (0, cors_config_1.getCorsConfig)();
    console.log('🌍 CORS Configuration:', corsOptions);
    app.enableCors(corsOptions);
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            const origin = req.headers.origin;
            const allowedOrigins = corsOptions.origin;
            console.log('🚁 CORS Preflight Request:');
            console.log('   Origin:', origin);
            console.log('   Allowed Origins:', allowedOrigins);
            if (origin && allowedOrigins.includes(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
                res.header('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
                res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
                res.header('Access-Control-Allow-Credentials', 'true');
                res.status(200).end();
                return;
            }
        }
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
            target: false,
            value: false,
        },
        exceptionFactory: (errors) => {
            console.log('❌ Validation errors:', JSON.stringify(errors, null, 2));
            return new Error('Validation failed');
        },
    }));
    app.setGlobalPrefix('api');
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        const userAgent = req.get('User-Agent') || 'Unknown';
        const origin = req.get('Origin') || 'No Origin';
        const referer = req.get('Referer') || 'No Referer';
        console.log(`📡 [${timestamp}] ${method} ${url}`);
        console.log(`   👤 User-Agent: ${userAgent}`);
        console.log(`   🌍 Origin: ${origin}`);
        console.log(`   🔗 Referer: ${referer}`);
        if (method === 'OPTIONS') {
            console.log(`   🚁 CORS Preflight Request`);
            console.log(`   📋 Request Headers:`, req.headers);
        }
        next();
    });
    const port = process.env.PORT || 8080;
    await app.listen(port);
    const logger = new common_1.Logger('Bootstrap');
    logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
    logger.log(`📝 Logging level: ${logLevel.toUpperCase()}`);
    logger.log(`🔍 Validation pipe: ENABLED with detailed error logging`);
    logger.log(`📡 Request logging: ENABLED`);
    logger.log(`🌍 CORS: ENABLED`);
}
bootstrap();

})();

/******/ })()
;