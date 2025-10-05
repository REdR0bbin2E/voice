# MongoDB Atlas Setup Guide

## Step 1: Create a Free MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Choose the **FREE** tier (M0 Sandbox)

## Step 2: Create a Cluster

1. After signing in, click **"Build a Database"**
2. Choose **M0 FREE** tier
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Name your cluster (e.g., "EchoCluster")
6. Click **"Create Cluster"**
   - This will take 1-3 minutes

## Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username (e.g., `echouser`)
5. Create a strong password (save it!)
6. Under "Database User Privileges", select **"Read and write to any database"**
7. Click **"Add User"**

## Step 4: Whitelist Your IP Address

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - IP: `0.0.0.0/0`
   - ⚠️ For production, use specific IP addresses
4. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Python"** as driver and version **3.12 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://echouser:<password>@echocluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open `backend/.env`
2. Replace `<password>` in the connection string with your actual password
3. Add the database name at the end:
   ```env
   MONGO_URI=mongodb+srv://echouser:YourPassword123@echocluster.xxxxx.mongodb.net/echo_db?retryWrites=true&w=majority
   ```

## Example Complete .env File

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://echouser:MySecurePass123@echocluster.ab1cd.mongodb.net/echo_db?retryWrites=true&w=majority

# Fish.Audio API Configuration (paid service)
FISH_AUDIO_API_KEY=0d7e687ed6d74da6b1dbef82437367b8
FISH_AUDIO_API_URL=https://api.fish.audio/v1

# API Server Configuration
API_HOST=0.0.0.0
API_PORT=5000
```

## Step 7: Test Your Connection

Run the test script:
```bash
python test_mongodb.py
```

If successful, you should see:
```
✅ MongoDB connection successful!
Database: echo_db
Collections: users, echos, messages
```

## Troubleshooting

### "Authentication failed"
- Check that your username and password are correct
- Make sure you replaced `<password>` with your actual password

### "Network timeout"
- Check that you whitelisted your IP address (0.0.0.0/0)
- Wait a few minutes after creating the cluster

### "Connection refused"
- Make sure your cluster is fully deployed (green status)
- Check your internet connection

## Quick Start (TL;DR)

1. Sign up at https://www.mongodb.com/cloud/atlas/register
2. Create FREE M0 cluster
3. Create database user with password
4. Whitelist IP: 0.0.0.0/0
5. Get connection string
6. Update `backend/.env` with your connection string
7. Run `python test_mongodb.py`
