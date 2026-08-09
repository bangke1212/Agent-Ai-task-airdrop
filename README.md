# 🚀 AI Airdrop Agent

AI-powered airdrop automation console for managing and executing airdrop tasks across multiple blockchain networks and wallets.

## Features

- 📊 **Dashboard** — Real-time stats, active airdrops, agent activity logs
- 🤖 **Task Console** — Define and execute automated airdrop tasks (follow Twitter, join Discord/Telegram, daily check-ins, swaps, bridges, etc.)
- 👛 **Wallet Manager** — Manage multiple wallets across chains with proxy support
- 🔍 **Airdrop Discovery** — Trending airdrops and AI-powered recommendations
- 📝 **Agent Live Log** — Real-time terminal-style log of all agent actions

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Server Actions
- **Database**: SQLite (via Prisma ORM)
- **UI**: Lucide Icons + Radix UI + Recharts
- **Automation**: Built-in agent engine (extendable to Puppeteer/Playwright)

## Getting Started

```bash
# Install dependencies
npm install

# Setup database
npx prisma db push
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bangke1212/Agent-Ai-task-airdrop)

Make sure to set environment variables in Vercel dashboard.

## Project Structure

```
src/
├── app/
│   ├── api/          # API Routes (airdrop, wallet, task, agent, stats)
│   ├── dashboard/    # Dashboard page
│   ├── tasks/        # Task Console page
│   ├── wallets/      # Wallet Manager page
│   └── discovery/    # Airdrop Discovery page
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Sidebar, Navbar, AppLayout
│   ├── dashboard/    # Dashboard-specific components
│   ├── tasks/        # Task-specific components
│   └── wallets/      # Wallet-specific components
├── lib/              # Utilities, Prisma client, Auth
└── generated/        # Generated Prisma client
```

## License

MIT
