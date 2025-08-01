# ChatGPT Clone

A modern, full-featured ChatGPT clone built with Next.js, Supabase, and Stripe. This application provides a complete chat experience with user authentication, subscription management, and a beautiful, responsive UI.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive interface similar to ChatGPT
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Real-time Chat**: Interactive chat interface with message history
- **Subscription Management**: Integrated Stripe payments with multiple tiers
- **Database Storage**: Persistent chat history and user data with Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- A Supabase account
- A Stripe account

## 🚀 Quick Start

### 1. Clone the repository

\`\`\`bash
git clone <your-repo-url>
cd chatgpt-clone
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables

Copy the example environment file and update it with your credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update `.env.local` with your actual values:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
\`\`\`

### 4. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL schema from `supabase/schema.sql`

### 5. Set up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create products and prices in your Stripe dashboard
3. Update the price IDs in `src/app/subscription/page.tsx`
4. Set up webhooks pointing to `your-domain.com/api/webhooks/stripe`

### 6. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
chatgpt-clone/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── chat/           # Chat pages
│   │   ├── settings/       # Settings page
│   │   ├── subscription/   # Subscription page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # UI components
│   │   ├── chat-interface.tsx
│   │   └── sidebar.tsx
│   └── lib/               # Utility functions
│       ├── supabase.ts    # Supabase client
│       ├── stripe.ts      # Stripe configuration
│       └── utils.ts       # Helper functions
├── supabase/
│   └── schema.sql         # Database schema
├── .env.example           # Environment variables template
└── README.md
\`\`\`

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User profiles and subscription status
- **chats**: Chat conversations
- **messages**: Individual chat messages
- **subscriptions**: Stripe subscription records

## 💳 Subscription Tiers

- **Free**: 10 messages per day, basic AI responses
- **Pro ($20/month)**: Unlimited messages, advanced AI responses, priority support
- **Premium ($50/month)**: Everything in Pro + GPT-4 access, API access, team collaboration

## 🔧 Configuration

### Supabase Setup

1. Enable Row Level Security (RLS) on all tables
2. Set up authentication providers as needed
3. Configure email templates for auth flows

### Stripe Setup

1. Create products for each subscription tier
2. Set up webhook endpoints
3. Configure customer portal settings

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/chatgpt-clone/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible including error messages and steps to reproduce

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Lucide](https://lucide.dev/) for the beautiful icons

---

Built with ❤️ by [Your Name]
