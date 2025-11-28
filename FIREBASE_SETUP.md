# Firebase Firestore Setup Guide

The game is currently failing to create rooms because the connection to Firestore is timing out. This is likely because the Firestore Database has not been created or the Security Rules are blocking writes.

## Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **imposter-fc91c**.

## Step 2: Create Firestore Database
1. In the left sidebar, click on **Build** > **Firestore Database**.
2. If you see a "Create Database" button, click it.
   - **Location**: Choose a location close to you (e.g., `us-central1` or `eur3`).
   - **Security Rules**: Start in **Test mode** (this allows read/write for 30 days) OR **Production mode** (we will change the rules in the next step anyway).
3. Click **Enable**.

## Step 3: Update Security Rules
1. Once the database is created, click on the **Rules** tab at the top of the Firestore panel.
2. You will see the current rules. Replace them with the following **Development Rules** to allow everyone to read and write:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**.

> **Warning**: These rules allow anyone with your project ID to read and write to your database. This is fine for development, but you should secure them before releasing the game publicly.

## Step 4: Verify Connection
1. Restart your local development server if needed (usually not required).
2. Try creating a room in the app again.
3. If it works, you should see a new `rooms` collection appear in the **Data** tab of the Firestore Console.

## Troubleshooting
- **Timeout Persists**: If you still get a timeout, check your internet connection and ensure no firewall is blocking `firestore.googleapis.com`.
- **Quota Exceeded**: Unlikely for a new project, but check the **Usage** tab if you have been running heavy tests.
