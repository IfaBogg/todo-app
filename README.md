# Todo App

A full-stack Todo application where users can add, edit, delete, and manage tasks with timestamps and authentication.

## ✨ Features

- ✅ Add, update, and delete tasks
- ✅ Mark tasks as completed
- ✅ Task timestamps with start and end dates
- ✅ User authentication with NextAuth (or Appwrite)
- ✅ Responsive and modern UI
- ✅ Admin/user role handling
- ✅ Dark mode support

## 🎬 Demo

> Live preview: `https://your-app-link.vercel.app`

> Screenshot: `![Demo screenshot](./public/screenshot/)`

## 🚀 Installation

```bash
git clone https://github.com/ifa-bogale/todo-app.git
cd todo-app
npm install
```

## ⚙️ Usage

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 🧩 Tech Stack

- Frontend: `Next.js`, `React`, `Tailwind CSS`
- Backend: `Appwrite` / `Prisma + database`
- Authentication: `NextAuth`
- Deployment: `Vercel`

## 📁 Folder Structure

```text
.
├── app
│   ├── api
│   ├── auth
│   ├── dashboard
│   └── globals.css
├── components
├── lib
├── prisma
├── public
├── types
├── next.config.ts
├── package.json
└── README.md
```

## 🔐 Environment Variables

Create a `.env` or `.env.local` file:

```env
NEXTAUTH_SECRET=your_nextauth_secret
DATABASE_URL=postgresql://user:password@localhost:5432/todoapp
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Commit: `git commit -m "feat: add new feature"`
5. Push: `git push origin feature/my-feature`
6. Open a pull request

## 📄 License

This project is licensed under the `MIT License`.
