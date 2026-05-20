# ServiceLink AI Development Plan

## Phase 1: Infrastructure & Setup
1.  [ ] **Firebase Setup**: Initialize Firebase using `set_up_firebase`.
2.  [ ] **Project Structure**: Create the required directory structure.
3.  [ ] **Utils**: Create a `cn` utility function for Tailwind class merging.
4.  [ ] **Firebase Service**: Implement the Firebase initialization in `src/services/firebase.ts`.

## Phase 2: Authentication
1.  [ ] **Auth Context**: Create `AuthContext.tsx` to handle user state and roles.
2.  [ ] **Signup Page**: Implement signup with role selection (Customer/Provider).
3.  [ ] **Login Page**: Implement login with redirect logic based on user role.

## Phase 3: Customer Interface (Chat)
1.  [ ] **Layout (Sidebar + Main)**: Set up the responsive chat layout.
2.  [ ] **Sidebar**: List providers and search functionality.
3.  [ ] **Chat Window**: Message list, input box, and auto-scroll.
4.  [ ] **Booking Card**: Implement the interactive booking card within the chat.

## Phase 4: Provider Interface (Dashboard)
1.  [ ] **Provider Dashboard**: View and manage booking requests.
2.  [ ] **Provider Booking Card**: Actionable card for accepting/rejecting requests.
3.  [ ] **Acceptance Flow**: Logic to send confirmation messages back to the customer.

## Phase 5: Polish & Refinement
1.  [ ] **Styling**: Ensure full responsiveness and apply a modern "Service Landing" aesthetic.
2.  [ ] **Dummy Data**: Populate providers and initial messages for demo purposes.
3.  [ ] **Loading/Error States**: Add robust handling for all async operations.
