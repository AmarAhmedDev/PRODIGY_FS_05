<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/TanStack-Router-FF4154?style=for-the-badge&logo=reactrouter&logoColor=white" alt="TanStack Router" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
</p>

# ⚡ Pulse — A Modern Real-Time Social Network

**Pulse** is a premium, full-stack social networking application built with React 19, TypeScript, Firebase, and TanStack Start. It features real-time feeds, media uploads, nested comments, user profiles, and a beautifully crafted dark UI inspired by modern social platforms like X (Twitter).

> Built as **Task 5** of the Prodigy InfoTech Full-Stack Web Development Internship.

---

## ✨ Features

### 🔐 Authentication
- **Email/Password** sign-up and sign-in with input validation
- **Google OAuth** one-click sign-in via Firebase Auth popup
- Automatic user profile creation in Firestore on first login
- Protected routes with automatic redirect for unauthenticated users

### 📝 Posts & Feed
- **Real-time feed** powered by Firestore `onSnapshot` — new posts appear instantly
- **Create posts** with text (up to 500 characters) and/or image/video uploads
- **Media uploads** handled securely via ImageKit (signed upload with server-side HMAC)
- **Delete** your own posts with confirmation dialog

### ❤️ Likes & Comments
- **Like** posts from other users (self-like prevention)
- **Threaded comments** — top-level comments and owner-only replies
- **Real-time comment streaming** — comments appear without page refresh
- Comment count tracked per post

### 🔍 Explore
- **Search** posts and users by text content or username
- **Trending view** — posts sorted by most likes for content discovery

### 🔔 Notifications
- Aggregated notifications derived from likes and comments on your posts
- Visual indicators with like (heart) and comment (bubble) icons
- Click to navigate back to the feed

### 💬 Messages
- Interactive chat interface with an auto-reply demo bot
- Message bubbles with distinct styling for sent/received messages
- Real-time input with Enter-to-send support

### 📌 Bookmarks
- Posts you've liked are automatically saved to your Bookmarks page
- Powered by Firestore `array-contains` query for efficient retrieval

### 👤 Profile
- View your post count, total likes received, and join date
- **Edit profile** — update your display name and bio via a modal dialog
- Changes sync to both Firebase Auth (`displayName`) and Firestore profile document

### ⚙️ Settings
- Update display name with real-time save to Firebase
- View account details (email, user ID)
- Appearance section with theme preview
- Privacy & Security information
- Danger zone with sign-out button

### 🎨 Design & UX
- **Dark, immersive theme** using custom OKLCH color palette
- **Glassmorphism** effects with backdrop blur
- **3-column responsive layout** — Left sidebar, Center feed, Right sidebar
- Smooth micro-animations (fade-in, slide-up) for premium feel
- Gradient buttons with glow shadows
- Responsive: 3-col → 2-col → 1-col across breakpoints
- Custom 404 and error pages with recovery actions

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) (SSR-capable React meta-framework) |
| **UI Library** | [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Routing** | [TanStack Router](https://tanstack.com/router) — file-based, type-safe routing |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + custom OKLCH design tokens |
| **Component Library** | [Radix UI](https://www.radix-ui.com/) primitives + [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) (Email/Password + Google OAuth) |
| **Database** | [Cloud Firestore](https://firebase.google.com/docs/firestore) (real-time NoSQL) |
| **Media Storage** | [ImageKit](https://imagekit.io/) (signed uploads with server-side auth) |
| **Build Tool** | [Vite 7](https://vite.dev/) |
| **Deployment Target** | [Cloudflare Workers](https://workers.cloudflare.com/) (via Wrangler) |
| **Linting** | ESLint 9 + Prettier |

---

## 📁 Project Structure

```
Task_5/
├── src/
│   ├── components/
│   │   ├── ui/              # Radix/shadcn primitives (Button, Dialog, Input, etc.)
│   │   ├── AppHeader.tsx    # Sticky top navigation bar
│   │   ├── AuthForm.tsx     # Shared login/register form component
│   │   ├── CreatePost.tsx   # Post composer with media upload
│   │   ├── Feed.tsx         # Real-time Firestore feed listener
│   │   ├── LeftSidebar.tsx  # Navigation sidebar with post dialog
│   │   ├── PostCard.tsx     # Post display with likes, comments, replies
│   │   └── RightSidebar.tsx # Trending topics & suggested users widget
│   ├── hooks/
│   │   └── use-mobile.tsx   # Responsive breakpoint hook
│   ├── lib/
│   │   ├── auth-context.tsx # React Context for Firebase Auth state
│   │   ├── firebase.ts      # Firebase app initialization & exports
│   │   ├── imagekit-upload.ts       # Client-side ImageKit upload function
│   │   ├── imagekit.functions.ts    # Server-side ImageKit auth (HMAC signing)
│   │   └── utils.ts         # Tailwind merge utility
│   ├── routes/
│   │   ├── __root.tsx       # Root layout (HTML shell, AuthProvider, SEO meta)
│   │   ├── index.tsx        # Landing page (hero, features, CTA)
│   │   ├── login.tsx        # Sign-in page
│   │   ├── register.tsx     # Sign-up page
│   │   └── _authenticated/  # Protected route group
│   │       ├── feed.tsx         # Home feed
│   │       ├── explore.tsx      # Search & trending posts
│   │       ├── notifications.tsx # Activity notifications
│   │       ├── messages.tsx     # Chat interface
│   │       ├── bookmarks.tsx    # Liked/saved posts
│   │       ├── profile.tsx      # User profile & edit
│   │       └── settings.tsx     # Account settings
│   ├── router.tsx           # TanStack Router configuration
│   ├── routeTree.gen.ts     # Auto-generated route tree (do not edit)
│   └── styles.css           # Global styles, design tokens, animations
├── package.json
├── tsconfig.json
├── vite.config.ts
├── wrangler.jsonc           # Cloudflare Workers deployment config
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or Bun)
- A **Firebase project** with Authentication and Firestore enabled
- An **ImageKit account** (for media uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/AmarAhmedDev/PRODIGY_FS_05.git
cd PRODIGY_FS_05
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

The Firebase configuration is located in `src/lib/firebase.ts`. Update the `firebaseConfig` object with your own Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

#### Firebase Setup Checklist

1. Enable **Email/Password** and **Google** sign-in providers in the Firebase Console → Authentication
2. Create a **Firestore Database** in production or test mode
3. Set up Firestore Security Rules as needed

### 4. Configure ImageKit (for Media Uploads)

Set the following environment variables for server-side ImageKit authentication:

```bash
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Production build |
| `npm run build:dev` | Development build (unminified) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on the codebase |
| `npm run format` | Format code with Prettier |

---

## 🗄️ Firestore Data Model

### `posts` Collection

| Field | Type | Description |
|---|---|---|
| `uid` | `string` | Author's Firebase UID |
| `author` | `object` | `{ username, photoURL }` |
| `text` | `string` | Post body (max 500 chars) |
| `media` | `object \| null` | `{ url, type }` from ImageKit |
| `likes` | `string[]` | Array of UIDs who liked the post |
| `commentCount` | `number` | Total comment count |
| `createdAt` | `Timestamp` | Server-generated timestamp |

### `posts/{postId}/comments` Subcollection

| Field | Type | Description |
|---|---|---|
| `uid` | `string` | Commenter's Firebase UID |
| `username` | `string` | Commenter's display name |
| `text` | `string` | Comment body (max 300 chars) |
| `parentId` | `string \| null` | Parent comment ID for replies |
| `createdAt` | `Timestamp` | Server-generated timestamp |

### `profiles` Collection

| Field | Type | Description |
|---|---|---|
| `uid` | `string` | Firebase UID |
| `email` | `string` | User email |
| `username` | `string` | Display username |
| `displayName` | `string` | Full display name |
| `photoURL` | `string \| null` | Profile photo URL |
| `bio` | `string` | User biography (max 160 chars) |
| `createdAt` | `Timestamp` | Account creation date |

---

## 🌐 Deployment

### Cloudflare Workers

The project is pre-configured for deployment to Cloudflare Workers:

```bash
npx wrangler deploy
```

### Other Platforms

Since TanStack Start supports multiple adapters, you can also deploy to:
- Vercel
- Netlify
- AWS Lambda
- Any Node.js hosting

---

## 📸 Screenshots

| Landing Page | Feed |
|---|---|
| Dark, immersive landing with hero section and feature cards | 3-column layout with real-time post feed |

| Profile | Settings |
|---|---|
| User profile with stats and editable bio | Account management and appearance settings |

---

## 👨‍💻 Author

**Amar Ahmed**
- GitHub: [@AmarAhmedDev](https://github.com/AmarAhmedDev)
- Email: amarselmansudeys@gmail.com

---

## 📄 License

This project was built as part of the **Prodigy InfoTech Full-Stack Web Development Internship Program**.

---

<p align="center">
  Made with ❤️ using React, Firebase & TanStack
</p>
