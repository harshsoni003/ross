This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup (Required)

This application requires environment variables to work properly. For security reasons, the webhook URL is not hardcoded in the application:

1. Create a `.env` file in the root directory based on `.env.example`
2. Add your n8n webhook URL:

```
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url_here
```

**Important security note:** 
- The `.env` file should never be committed to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- For production, set environment variables through your hosting platform (Vercel, Netlify, etc.)

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- **Travel Planning Chat Interface**: Interactive chat interface with n8n integration
- **Secure Webhook Integration**: Connect to n8n workflows through environment variables
- **Customizable Preferences**: Set travel preferences and customize airline selections

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
