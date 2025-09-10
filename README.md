# Xeno Assignment - Campaign Management System

A modern campaign management system built with Next.js 15, featuring user authentication, audience segmentation, campaign creation, and message delivery tracking.

**Live Demo**: [https://xeno-assignment-green.vercel.app/](https://xeno-assignment-green.vercel.app/)

**GitHub Repository**: [https://github.com/aditya22arya/xeno-assignment](https://github.com/aditya22arya/xeno-assignment)

## Features

- Authentication with Google OAuth and Email/Password
- Audience Segmentation and Management
- Campaign Creation and Management
- Real-time Campaign Analytics
- Responsive Design with Dark/Light Mode
- Message Delivery Tracking
- API Documentation with Swagger
- Rate Limiting with Upstash Redis
- Modern UI with Radix UI Components
- Data Ingestion Capabilities

## Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **Caching & Rate Limiting**: Upstash Redis
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form, Zod
- **Styling**: TailwindCSS with CSS Animations
- **API Documentation**: Swagger UI
- **Type Safety**: TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance
- Google OAuth credentials (for authentication)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

\`\`\`env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB
MONGODB_URI=your-mongodb-connection-string

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
\`\`\`

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/aditya22arya/xeno-assignment.git
   cd xeno-assignment/web
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

\`\`\`
web/
├── src/
│   ├── app/                 # Next.js 15 app router
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions and configurations
│   ├── models/             # MongoDB models
│   └── auth.ts             # Authentication configuration
├── public/                 # Static assets
├── middleware.ts           # Edge middleware for auth & API protection
└── package.json           # Project dependencies
\`\`\`

## Key Features Explained

### Authentication
- Supports both Google OAuth and email/password authentication
- Protected routes using Edge Middleware
- Persistent sessions with MongoDB adapter

### Audience Management
- Create and manage audience segments
- Import customer data via CSV
- AI-powered segment rule generation
- Preview audience segments before saving

### Campaign Management
- Create and manage marketing campaigns
- Target specific audience segments
- Schedule campaign delivery
- Track delivery status and engagement

### Message Delivery
- Real-time message delivery tracking
- Delivery receipts via webhooks
- Rate limiting to prevent abuse
- Automated message suggestions using AI

### API Documentation
- Interactive Swagger documentation
- Test API endpoints directly from the docs
- Authentication support in API testing

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/audiences/*` - Audience management
- `/api/campaigns/*` - Campaign operations
- `/api/customers/*` - Customer data management
- `/api/ai/*` - AI-powered features
- `/api/webhooks/*` - Webhook endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email your queries to [ece22117@iiitkalyani.ac.in](mailto:ece22117@iiitkalyani.ac.in) or open an issue in the repository.
