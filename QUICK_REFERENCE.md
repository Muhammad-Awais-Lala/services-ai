# Quick Reference: React → React Native Conversion

## Installation & Running

```bash
# Install dependencies
npm install

# Start development
npm start

# Run on iOS
npm run ios
# OR press 'i'

# Run on Android  
npm run android
# OR press 'a'

# Run on Web
npm run web
# OR press 'w'

# Clear cache if issues
npm start -- --clear
```

## File Structure Changes

```
OLD (React Web)                  NEW (React Native)
───────────────────────────────────────────────────
src/pages/Login.tsx       →      app/(auth)/login.tsx
src/pages/Signup.tsx      →      app/(auth)/signup.tsx
src/pages/Chat.tsx        →      app/(app)/chat.tsx
src/pages/Dashboard.tsx   →      app/(app)/dashboard.tsx
src/App.tsx               →      app/_layout.tsx
src/main.tsx              →      app/index.tsx

styles with Tailwind      →      NativeWind className
localStorage              →      AsyncStorage
react-router-dom routing  →      Expo Router (file-based)
```

## Code Conversions

### Navigation
```tsx
// Before (Web)
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/login')

// After (Mobile)
import { useRouter } from 'expo-router'
const router = useRouter()
router.push('/(auth)/login')
```

### Storage
```tsx
// Before (Web)
localStorage.setItem('key', value)
const data = localStorage.getItem('key')

// After (Mobile)
import AsyncStorage from '@react-native-async-storage/async-storage'
await AsyncStorage.setItem('key', value)
const data = await AsyncStorage.getItem('key')
```

### Components
```tsx
// Before (Web)
<div className="p-4">
  <input type="email" placeholder="Email" />
  <button onClick={() => {}}>Submit</button>
</div>

// After (Mobile)
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
<View className="p-4">
  <TextInput 
    className="..." 
    keyboardType="email-address" 
    placeholder="Email" 
  />
  <TouchableOpacity onPress={() => {}}>
    <Text>Submit</Text>
  </TouchableOpacity>
</View>
```

### Styling
```tsx
// Before (Web)
className="bg-white text-black p-4 rounded-lg shadow"

// After (Mobile) - Same classes with NativeWind!
className="bg-white text-black p-4 rounded-lg shadow"
```

## Common React Native Components

| Web HTML | React Native |
|----------|--------------|
| `<div>` | `<View>` |
| `<p>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` + `<Text>` |
| `<img>` | `<Image>` |
| `<scroll>` | `<ScrollView>` |
| `<list>` | `<FlatList>` |
| `<select>` | Custom picker |

## API Calls (Unchanged!)
```tsx
// Same as before - no changes needed!
import axios from 'axios'

const res = await axios.post(
  'https://services-agent.vercel.app/auth/login',
  { email, password }
)
```

## Authentication Flow (Preserved)
```tsx
import { useAuth } from '../src/context/AuthContext'

const { user, login, logout, loading } = useAuth()

// All methods work the same!
await login(email, password)
await logout()
```

## Screen Navigation Patterns

### In `app/_layout.tsx` - Root navigation
```tsx
{user ? (
  <Stack.Group>
    <Stack.Screen name="(app)" />  // Main app
  </Stack.Group>
) : (
  <Stack.Group>
    <Stack.Screen name="(auth)" />  // Auth screens
  </Stack.Group>
)}
```

### In screens - Navigate between pages
```tsx
import { useRouter } from 'expo-router'

const router = useRouter()
router.push('/(app)/chat')        // Navigate
router.replace('/(auth)/login')   // Replace current
router.back()                      // Go back
```

## Dark Theme (Default)

Colors configured in `tailwind.config.js`:
```tsx
className="bg-neutral-950"      // Dark background
className="text-neutral-50"     // Light text
className="bg-indigo-600"       // Accent color
className="border-white/10"     // Subtle borders
```

## Debugging

```bash
# Clear all cache
npm start -- --clear

# Reload app
Press 'r' in terminal

# Open debugger
Press 'j' in terminal

# View logs
npm start -- --raw
```

## Environment Variables

Create `.env` file:
```
EXPO_PUBLIC_API_BASE=https://services-agent.vercel.app
```

Access in code:
```tsx
const apiBase = process.env.EXPO_PUBLIC_API_BASE
```

## Mobile-Specific Hooks

```tsx
// Screen orientation
import { useWindowDimensions } from 'react-native'
const { width, height } = useWindowDimensions()

// Navigation
import { useRouter, useLocalSearchParams } from 'expo-router'
const router = useRouter()
const params = useLocalSearchParams()

// Safe area (notches)
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const insets = useSafeAreaInsets()
```

## Common Patterns

### Form Input
```tsx
<TextInput
  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
  placeholder="Enter text..."
  value={text}
  onChangeText={setText}
  keyboardType="email-address"
/>
```

### Button
```tsx
<TouchableOpacity 
  className="bg-indigo-600 rounded-lg px-4 py-3"
  onPress={() => handlePress()}
>
  <Text className="text-white font-semibold">Press Me</Text>
</TouchableOpacity>
```

### Loading State
```tsx
{loading ? (
  <ActivityIndicator color="#6366f1" size="large" />
) : (
  <Text>Content loaded</Text>
)}
```

### List
```tsx
<FlatList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  keyExtractor={item => item.id}
/>
```

## Testing Checklist

- [ ] `npm start` works without errors
- [ ] Can press `i` and launch iOS simulator
- [ ] Can press `a` and launch Android emulator  
- [ ] Login/signup screens load correctly
- [ ] Can submit forms
- [ ] Chat screen loads and sends messages
- [ ] Provider dashboard shows bookings
- [ ] Navigation between screens works
- [ ] Logout clears authentication

## Resources

- Expo Docs: https://docs.expo.dev
- React Native: https://reactnative.dev
- NativeWind: https://www.nativewind.dev
- Your API: https://services-agent.vercel.app

## Emergency Reset

If things are broken:
```bash
# Kill dev server (Ctrl+C)

# Remove node_modules
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

# Start fresh
npm start -- --clear
```

---

**That's it!** You now have a fully functional React Native mobile app. 🎉
