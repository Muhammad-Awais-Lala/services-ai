# ServiceLink - React Native Expo App

This is a **React Native Expo** mobile application that connects customers with service providers through an AI-powered booking system.

**This is the mobile/Expo version of the application. It has been converted from React JS web to React Native.**

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (optional): `npm install -g expo-cli`

### Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Start development:**
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Press `w` for web
- Scan QR code with Expo Go app

### Build & Deploy

```bash
npm run android    # Build for Android
npm run ios        # Build for iOS
npm run build      # Full EAS build
```

## Project Structure

```
app/
├── (auth)/              # Authentication screens
│   ├── login.tsx
│   ├── signup.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx
├── (app)/              # Main app screens
│   ├── chat.tsx        # Customer chat interface
│   └── dashboard.tsx   # Provider booking dashboard
├── _layout.tsx         # Root navigation
└── index.tsx           # Root redirect

src/                    # Shared code
├── context/           # React Context (Auth)
├── hooks/             # Custom hooks
├── components/        # Reusable components
├── types.ts           # TypeScript types
└── lib/               # Utilities
```

## Features

✨ **AI-Powered Booking**
- Real-time chat with service agent
- Intelligent booking workflow
- Multi-step confirmation

👥 **Role-Based Access**
- Customers: Request and book services
- Providers: Manage booking requests

🔐 **Secure Auth**
- Email/password authentication
- Forgot password recovery
- Role-based navigation

📱 **Mobile Design**
- Built with React Native
- Styled with NativeWind (Tailwind for React Native)
- Dark theme with gradients

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **AsyncStorage** - Persistent storage
- **FastAPI Backend** - `https://services-agent.vercel.app`

## API Endpoints

All requests go to: `https://services-agent.vercel.app`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | User login |
| `/auth/signup` | POST | User registration |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/reset-password` | POST | Reset password |
| `/request` | POST | Send message to agent (SSE) |
| `/threads/{email}` | GET | Get user threads |
| `/threads/{id}/messages` | GET | Get thread messages |
| `/bookings` | GET | List bookings |
| `/bookings/{id}/accept` | POST | Accept booking |
| `/bookings/{id}/reject` | POST | Reject booking |

## Styling

Uses **NativeWind** for Tailwind CSS in React Native:

```tsx
<View className="flex-1 bg-neutral-950 p-6">
  <Text className="text-white font-bold">Hello</Text>
</View>
```

Color scheme (dark theme):
- Background: `neutral-950`, `neutral-900`
- Accent: `indigo-600`, `purple-600`
- Text: `neutral-50`, `neutral-300`

## Development

### Hot Reload
Changes automatically reload in development server. Press `r` in terminal to reload.

### Debugging
Use Expo DevTools or connect debugger:
```bash
npm start -- --dev-client
```

### Clear Cache
```bash
npm start -- --clear
```

## Conversion Notes

**Converted from:** React JS with Vite + React Router + TailwindCSS
**Converted to:** React Native with Expo + Expo Router + NativeWind

### Changes Made
- Replaced React Router with Expo Router
- Converted localStorage to AsyncStorage
- Changed TailwindCSS to NativeWind
- Replaced HTML/DOM components with React Native
- Updated navigation structure for mobile

### Preserved
- All API calls and authentication logic
- Context (AuthContext) and hooks (useServiceAgent)
- Business logic and data types
- TypeScript support

## Environment Variables

`.env`:
```
EXPO_PUBLIC_API_BASE=https://services-agent.vercel.app
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Metro bundler fails | `npm start -- --clear` |
| Modules not found | `npm install` |
| AsyncStorage error | Reinstall: `npm install @react-native-async-storage/async-storage` |
| iOS build error | `npx expo prebuild --clean` |

## Resources

- [Expo Docs](https://docs.expo.dev)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [NativeWind](https://www.nativewind.dev)
- [React Native](https://reactnative.dev)

## License

MIT
