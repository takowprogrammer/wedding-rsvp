# Wedding RSVP System

A comprehensive wedding RSVP management system with QR code verification, built with modern technologies.

## Features

- **Guest RSVP Form**: Beautiful, responsive form for guests to confirm attendance
- **Unique QR Codes**: Each guest receives a unique QR code and 8-digit alphanumeric code
- **Admin Dashboard**: Real-time dashboard to manage guests and track RSVPs
- **Mobile Check-in**: Flutter mobile app for wedding day guest verification
- **Invitation Templates**: Customizable invitation templates with embedded RSVP links
- **Backup Entry Method**: Manual code entry when QR scanning isn't available

## Tech Stack

### Backend
- **NestJS** - Node.js framework for building scalable server-side applications
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Robust relational database
- **TypeORM** - Object-relational mapping
- **QR Code Generation** - Unique QR codes for each guest

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **QR Code Display** - Guest QR code visualization

### Mobile App
- **Flutter** - Cross-platform mobile development
- **QR Code Scanner** - Camera-based QR code scanning
- **Provider** - State management
- **HTTP** - API communication

## Project Structure

```
wedding-rsvp/
├── src/                          # NestJS Backend
│   ├── modules/
│   │   ├── guests/              # Guest management
│   │   ├── qr-codes/            # QR code generation & verification
│   │   ├── invitations/         # Invitation templates
│   │   └── auth/                # Authentication (future)
│   ├── main.ts                  # Application entry point
│   └── app.module.ts            # Root module
├── frontend/                     # Next.js Frontend
│   ├── app/
│   │   ├── rsvp/               # Guest RSVP form
│   │   ├── admin/              # Admin dashboard
│   │   ├── scanner/            # Web-based scanner
│   │   └── invitation/[id]/    # Invitation templates
│   └── next.config.ts          # Next.js configuration
├── mobile_app/                  # Flutter Mobile App
│   ├── lib/
│   │   ├── screens/            # App screens
│   │   ├── widgets/            # Reusable widgets
│   │   ├── models/             # Data models
│   │   ├── services/           # API services
│   │   └── providers/          # State management
│   └── pubspec.yaml            # Flutter dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Flutter SDK (for mobile app)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wedding-rsvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb wedding_rsvp
   ```

5. **Start the backend**
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Mobile App Setup

1. **Navigate to mobile app directory**
   ```bash
   cd mobile_app
   ```

2. **Install Flutter dependencies**
   ```bash
   flutter pub get
   ```

3. **Update API URL**
   Edit `lib/services/api_service.dart` and update the `baseUrl` to point to your backend server.

4. **Run the app**
   ```bash
   flutter run
   ```

## Usage

### For Wedding Organizers

1. **Create Invitation Templates**
   - Access the admin dashboard
   - Create beautiful invitation templates with embedded RSVP links
   - Share invitation links with guests via WhatsApp, email, etc.

2. **Monitor RSVPs**
   - View real-time statistics on the admin dashboard
   - Track confirmed guests, dietary restrictions, and special requests
   - Export guest lists for planning purposes

3. **Wedding Day Check-in**
   - Use the mobile app to scan guest QR codes
   - Manual code entry as backup
   - Real-time guest verification and check-in tracking

### For Guests

1. **Receive Invitation**
   - Click on the invitation link received via WhatsApp/email
   - View the beautiful invitation template

2. **Fill RSVP Form**
   - Click the RSVP button in the invitation
   - Fill out the form with attendance details
   - Receive unique QR code and 8-digit code

3. **Wedding Day**
   - Present QR code or provide 8-digit code at the entrance
   - Quick and seamless check-in process

## API Endpoints

### Guests
- `POST /api/guests` - Create new guest RSVP
- `GET /api/guests` - Get all guests (admin)
- `GET /api/guests/stats` - Get RSVP statistics
- `GET /api/guests/:id` - Get specific guest

### QR Codes
- `POST /api/qr-codes/verify` - Verify a code without check-in
- `POST /api/qr-codes/checkin` - Check in a guest
- `GET /api/qr-codes/guest/:guestId` - Get QR code for guest

### Invitations
- `POST /api/invitations` - Create invitation template
- `GET /api/invitations` - Get all invitations
- `GET /api/invitations/:id` - Get specific invitation
- `GET /api/invitations/:id/preview` - Preview invitation HTML

## Database Schema

### Guests Table
- `id` (UUID) - Primary key
- `firstName` - Guest first name
- `lastName` - Guest last name
- `email` - Guest email (unique)
- `phone` - Guest phone number
- `numberOfGuests` - Number of attending guests
- `dietaryRestrictions` - Dietary requirements
- `specialRequests` - Special requests
- `status` - RSVP status (pending/confirmed/declined)
- `checkedIn` - Check-in status
- `createdAt` - RSVP timestamp
- `updatedAt` - Last update timestamp

### QR Codes Table
- `id` (UUID) - Primary key
- `alphanumericCode` - 8-digit unique code
- `qrCodeData` - QR code JSON data
- `used` - Whether code has been used for check-in
- `guestId` - Foreign key to guests table
- `createdAt` - Creation timestamp

### Invitations Table
- `id` (UUID) - Primary key
- `templateName` - Template identifier
- `title` - Invitation title
- `message` - Invitation message
- `imageUrl` - Optional background image
- `buttonText` - RSVP button text
- `formUrl` - RSVP form URL
- `isActive` - Whether template is active
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, Google Cloud, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform

### Mobile App Deployment
1. Build for Android: `flutter build apk`
2. Build for iOS: `flutter build ios`
3. Deploy to Google Play Store / Apple App Store

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the GitHub repository.

---

**Happy Wedding Planning! 💒✨**# Railway restart trigger
