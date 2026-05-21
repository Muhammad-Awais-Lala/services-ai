# ServiceLink - React Native Expo App

A React Native Expo application built with TypeScript, NativeWind (Tailwind CSS for React Native), and Firebase authentication.

## Prerequisites

- Node.js 18 or higher
- Expo CLI: `npm install -g eas-cli`
- iOS: Xcode (for iOS development)
- Android: Android Studio (for Android development)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
EXPO_PUBLIC_API_BASE=https://services-agent.vercel.app
```

## Development

### Start the development server:

```bash
npm start
```

This will show you options to:
- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Press `w` to run on web
- Press `j` to open the debugger

### Run on iOS:
```bash
npm run ios
```

### Run on Android:
```bash
npm run android
```

### Run on Web:
```bash
npm run web
```

## Building

### Build for iOS:
```bash
npm run build -- --platform ios
```

### Build for Android:
```bash
npm run build -- --platform android
```

## Project Structure

```
├── app/                    # Expo Router app structure
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   ├── (app)/             # Main app screens
│   │   ├── chat.tsx       # Customer chat with service agent
│   │   └── dashboard.tsx  # Provider booking dashboard
│   ├── _layout.tsx        # Root navigation layout
│   └── index.tsx          # Root redirect screen
├── src/
│   ├── context/           # React context (Auth)
│   ├── hooks/             # Custom hooks (useServiceAgent)
│   ├── components/        # Reusable components
│   ├── pages/             # Original React pages (archived)
│   ├── types.ts           # TypeScript types
│   ├── lib/               # Utility functions
│   └── index.css          # Global styles (archived)
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration for NativeWind
├── tailwind.config.js     # Tailwind CSS configuration for NativeWind
└── tsconfig.json          # TypeScript configuration
```

## Key Features

- **Authentication**: Email/password login and signup with role-based access (customer/provider)
- **Chat Interface**: Real-time messaging with service agent via SSE
- **Booking System**: Customers can request services, providers manage bookings
- **Mobile-First Design**: Built with NativeWind for responsive mobile UI
- **Type-Safe**: Full TypeScript support
- **Dark Theme**: Modern dark UI with gradient accents

## Architecture

### Navigation Structure

- **Auth Stack**: Login, Signup, Forgot Password, Reset Password (shown when user is not authenticated)
- **App Stack**: Chat (for customers), Dashboard (for providers) (shown when user is authenticated)

### State Management

- **AuthContext**: Manages user authentication state and API calls
- **Custom Hooks**: `useServiceAgent` handles service agent interaction

### API Integration

- Base URL: `https://services-agent.vercel.app`
- Authentication: Bearer token in Authorization header
- Endpoints:
  - `/auth/login` - User login
  - `/auth/signup` - User registration
  - `/auth/forgot-password` - Forgot password
  - `/auth/reset-password` - Reset password
  - `/request` - Send message to service agent
  - `/threads/{email}` - Get user's conversation threads
  - `/threads/{threadId}/messages` - Get thread messages
  - `/bookings` - Get provider bookings
  - `/bookings/{id}/accept` - Accept booking
  - `/bookings/{id}/reject` - Reject booking

## Styling

This app uses **NativeWind**, which brings Tailwind CSS to React Native. Classes like `className="flex-1 bg-neutral-950 text-white"` work directly on React Native components.

### NativeWind Benefits

- Familiar Tailwind CSS API
- Responsive design utilities
- Consistent styling across platforms
- Easy customization via tailwind.config.js

## Environment Variables

Create a `.env` file:

```
EXPO_PUBLIC_API_BASE=https://services-agent.vercel.app
```

## Troubleshooting

### Clear cache:
```bash
npm start -- --clear
```

### Reset Expo:
```bash
expo start --clear
```

### Common Issues

1. **Metro bundler error**: Clear cache with `npm start -- --clear`
2. **Module not found**: Run `npm install` again
3. **AsyncStorage issues**: Ensure `@react-native-async-storage/async-storage` is installed

## Development Notes

- The API base URL is hardcoded in the context/hooks. Consider moving to `.env` for flexibility.
- The app uses Expo Router for file-based routing.
- All network requests use axios for consistency.
- Authentication state persists using AsyncStorage.

## Contributing

Follow these guidelines:
- Use TypeScript for all new code
- Follow the existing code style
- Use NativeWind classes for styling
- Keep components focused and reusable

## License

MIT
