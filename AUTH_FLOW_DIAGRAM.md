# Authentication Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Launch                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ ClerkProvider   │
                    │ checks auth     │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐         ┌──────────────────┐
        │  Signed In   │         │  Not Signed In   │
        └──────┬───────┘         └────────┬─────────┘
               │                          │
               ▼                          ▼
        ┌──────────────┐         ┌──────────────────┐
        │  Tabs Layout │         │  Auth Layout     │
        │  (Protected) │         │  (Routes Auth)   │
        └──────┬───────┘         └────────┬─────────┘
               │                          │
               ▼                          ▼
        ┌─────────────────────┐  ┌────────────────────────────┐
        │ • Index             │  │ Sign In Screen             │
        │ • Insights          │  │ • Email input              │
        │ • Subscriptions     │  │ • Password input           │
        │ • Settings (logout) │  │ • "Don't have account?" →  │
        └─────────────────────┘  │                            │
                                  └────────┬───────────────────┘
                                           │
                            ┌──────────────┴──────────────┐
                            │                             │
                            ▼                             ▼
                   ┌──────────────────┐      ┌──────────────────┐
                   │  Email/Pass      │      │  Sign Up Screen  │
                   │  Match Found     │      │  • Email input   │
                   └────────┬─────────┘      │  • Password      │
                            │                │  • Confirm Pass  │
                ┌───────────┴────────────┐   │  • Strength      │
                │                        │   │    indicators    │
                ▼                        ▼   └────────┬─────────┘
        ┌──────────────┐         ┌──────────────────┐ │
        │ MFA Required │         │ Email Verify     │ │
        │ (if enabled) │         │ Enter Code       │ │
        └────────┬─────┘         └────────┬─────────┘ │
                 │                        │           │
                 ▼                        ▼           ▼
        ┌──────────────┐         ┌──────────────────┐
        │ Enter Code   │         │ Code Verified    │
        │ (from email) │         │ Account Created  │
        └────────┬─────┘         └────────┬─────────┘
                 │                        │
                 └────────────┬───────────┘
                              │
                              ▼
                     ┌─────────────────────┐
                     │ Session Created     │
                     │ Token Stored        │
                     │ (expo-secure-store) │
                     └────────┬────────────┘
                              │
                              ▼
                     ┌─────────────────────┐
                     │  Redirect to Tabs   │
                     │  (isSignedIn = true)│
                     └────────┬────────────┘
                              │
                              ▼
                     ┌─────────────────────┐
                     │   App Loaded        │
                     │  Full Access        │
                     └─────────────────────┘
```

## Detailed Flows

### Sign-Up Flow

```
Sign Up Screen
│
├─ Validate Email
│  └─ RFC 5322 regex check
├─ Validate Password
│  ├─ 8+ characters
│  ├─ Uppercase letter
│  ├─ Lowercase letter
│  └─ Number
├─ Confirm Password Matches
│
└─ POST to Clerk API
   │
   ├─ Email valid ✓
   ├─ Unique email ✓
   │
   └─ Account Created
      │
      └─ Send Verification Email
         │
         └─ User enters code
            │
            └─ Code validated
               │
               └─ Email verified ✓
                  │
                  └─ Session created
                     │
                     └─ Redirect to Tabs
```

### Sign-In Flow

```
Sign In Screen
│
├─ Enter Email
├─ Enter Password
│
└─ POST to Clerk API
   │
   ├─ Email found ✓
   ├─ Password correct ✓
   │
   └─ Check MFA
      │
      ├─ MFA Enabled
      │  │
      │  └─ Send verification code
      │     │
      │     └─ User enters code
      │        │
      │        └─ Code validated ✓
      │           │
      │           └─ Session created
      │              │
      │              └─ Redirect to Tabs
      │
      └─ MFA Disabled
         │
         └─ Session created immediately
            │
            └─ Redirect to Tabs
```

### Sign-Out Flow

```
Settings Screen
│
└─ Tap "Sign Out" button
   │
   └─ Show confirmation dialog
      │
      ├─ User cancels → Stay in app
      │
      └─ User confirms
         │
         └─ Call signOut()
            │
            └─ Clerk clears session
               │
               └─ Token deleted from secure store
                  │
                  └─ isSignedIn = false
                     │
                     └─ ClerkProvider detects state change
                        │
                        └─ Redirect to Sign In screen
```

## Component Hierarchy

```
ClerkProvider
│
├─ Layout (_layout.tsx)
│  │
│  ├─ (auth) route group
│  │  ├─ _layout.tsx (Auth Protection)
│  │  │  ├─ Check isSignedIn
│  │  │  ├─ If yes → Redirect to /(tabs)
│  │  │  └─ If no → Show Stack
│  │  │
│  │  ├─ signin.tsx
│  │  │  ├─ FormInput (email)
│  │  │  ├─ FormInput (password)
│  │  │  ├─ FormButton (Sign In)
│  │  │  ├─ VerificationCodeInput (if MFA)
│  │  │  ├─ ErrorMessage
│  │  │  └─ Link to signup
│  │  │
│  │  └─ signup.tsx
│  │     ├─ FormInput (email)
│  │     ├─ FormInput (password)
│  │     ├─ FormInput (confirm)
│  │     ├─ Password Requirements
│  │     ├─ FormButton (Create Account)
│  │     ├─ VerificationCodeInput
│  │     ├─ FormButton (Verify Email)
│  │     ├─ ErrorMessage
│  │     └─ Link to signin
│  │
│  └─ (tabs) route group
│     ├─ _layout.tsx (Tabs Protection)
│     │  ├─ Check isSignedIn
│     │  ├─ If no → Redirect to /(auth)/signin
│     │  └─ If yes → Show Tabs
│     │
│     ├─ index.tsx (Index Tab)
│     ├─ insights.tsx (Insights Tab)
│     ├─ subscriptions.tsx (Subscriptions Tab)
│     │
│     └─ settings.tsx (Settings Tab)
│        ├─ useUser() → Display user info
│        ├─ User email card
│        ├─ Account creation date
│        ├─ 2FA status indicator
│        ├─ FormButton (Sign Out)
│        └─ Logout handler
│
└─ useAuth() hook
   ├─ isSignedIn (boolean)
   ├─ isLoaded (boolean)
   └─ userId (string)
```

## State Management

```
Clerk Internal State
│
├─ Session
│  ├─ token (in secure store)
│  ├─ user object
│  └─ expires at
│
├─ Authentication Status
│  ├─ isSignedIn
│  ├─ isLoaded
│  └─ currentUser
│
└─ Form State (per screen)
   ├─ Email
   ├─ Password
   ├─ Verification Code
   ├─ Validation Errors
   ├─ API Error
   └─ isLoading
```

## Error Handling Flow

```
User Action
│
└─ Submit Form
   │
   └─ Validate Input
      │
      ├─ Invalid
      │  └─ Show validation error message
      │     └─ User corrects and retries
      │
      └─ Valid
         │
         └─ Send to Clerk API
            │
            ├─ API Error
            │  └─ Parse error from Clerk
            │     └─ Show user-friendly message
            │        └─ User retries
            │
            └─ Success
               └─ Process response
                  └─ Update state
```

## File Interactions

```
Root Layout (_layout.tsx)
│
└─ Imports ClerkProvider
   │
   └─ Auth Layout (_layout.tsx)
      │
      ├─ Uses useAuth() from Clerk
      │
      ├─ Sign In Screen (signin.tsx)
      │  ├─ Uses useSignIn() from Clerk
      │  ├─ FormInput component
      │  ├─ FormButton component
      │  ├─ ErrorMessage component
      │  ├─ VerificationCodeInput component
      │  └─ auth-utils for validation
      │
      └─ Sign Up Screen (signup.tsx)
         ├─ Uses useSignUp() from Clerk
         ├─ FormInput component
         ├─ FormButton component
         ├─ ErrorMessage component
         ├─ VerificationCodeInput component
         └─ auth-utils for validation

Tabs Layout (_layout.tsx)
│
├─ Uses useAuth() from Clerk
│
└─ Settings Screen (settings.tsx)
   ├─ Uses useClerk() for signOut()
   ├─ Uses useUser() to get user info
   └─ FormButton component
```

This diagram shows how all pieces fit together to create a secure, user-friendly authentication system! 🔐
