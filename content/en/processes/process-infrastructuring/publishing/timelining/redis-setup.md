# Redis Setup Guide
The purpose of this page is to onboard the reader on installing Redis database into their vercel account and obtain the connection information to use it directly on the propagate apps that require it.

## Why Do We Need Redis?

Redis is a fast database that serves two critical purposes for our platform:

### 1. **Caching** 
Redis stores frequently accessed data in memory, making your application load faster.

### 2. **Timeline & Interaction Storage**
Every interaction on the platform from text messages, voice recordings, user actions is saved to Redis for the later processing. This creates a complete timeline of activities that can be:
- Processed for insights on your community
- Retrieved for user history

## Where Do We Need Redis?

Timelining and Evaluate apps use redis to save and read all data gathered during a [Action-learning journeys](/patterns/action-learning%20journeys.md) (ALJs) Action Learning Journey.

## Setting Up Redis with Upstash (Step-by-Step)

### Step 1: Access Your Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Log in to your account
3. Select your Team from the dashboard

### Step 2: Create a Redis Database

1. In your Vercel, click on the **"Storage"** tab in the top menu
2. Click the **"Add New..."** or **"Create Database"** button
3. From the dropdown menu, select **"Store"** or in the pop-up UI scroll to marketplace section.
4. Scroll down to find **"Upstash"** in the "Marketplace Database Providers" section
5. Click on **"Upstash for Redis"**

### Step 3: Configure Your Database

1. **Primary Region**: Choose the region closest to most of your users.
2. **Read Regions**: Optionally add read regions closer to other user groups.
3. **Eviction**: Leave this OFF unless you understand data eviction policies
4. **Plan**: Select "Free" plan (500,000 monthly commands, perfect for getting started)

### Step 4: Name Your Database

1. Enter a unique name for your database (e.g., `upstash-kv-blue-tree`)
   - Use lowercase letters and hyphens only
2. Click **"Create"**

### Step 5: Get Your Environment Variables

After creation, you'll see a screen with several environment variables. Here's what you need:

**Important Variables:**

```bash
KV_REST_API_URL="https://your-region.upstash.io"
KV_REST_API_TOKEN="your-secret-token-here"
```

### Step 6: Copy the Environment Variables

You have two options:

#### **Copy Individual Variables**

1. Click **"Show secret"** (👁️ icon) to reveal the actual values
2. Click **"Copy Snippet"** next to each variable you need
3. The two most critical ones are:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

#### **If Using Local Development**

1. In your project root, create or open the `.env.local` file
2. Paste the copied variables:

```bash
KV_URL="your-kv-url"
KV_REST_API_READ_ONLY_TOKEN="your-read-only-token"
REDIS_URL="your-redis-url"
KV_REST_API_TOKEN="your-api-token"
KV_REST_API_URL="your-api-url"
```

3. Save the file
4. **Never commit this file to Git** (it should be in `.gitignore`) as they are sensitive.

### Step 8: Verify the Connection

After deploying or running locally:

1. Your application should now connect to Redis automatically

---

## Understanding the Environment Variables

Here's what each variable does:

| Variable | Purpose | When to Use |
|----------|---------|-------------|
| `KV_REST_API_URL` | The URL endpoint for your Redis database | **Required** - Your app uses this to know where Redis is |
| `KV_REST_API_TOKEN` | Secret key for full read/write access | **Required** - Proves your app has permission to use Redis |
| `KV_REST_API_READ_ONLY_TOKEN` | Secret key for read-only access | Optional - Use for public-facing features that only need to read data |
| `REDIS_URL` | Connection string for traditional Redis clients | Optional - Some Redis libraries prefer this format |
| `KV_URL` | Alternative connection URL | Optional - Legacy or alternative connection method |

### The Two Most Important Variables

For most Propagate Apps, you primarily need:

1. **`KV_REST_API_URL`**: Where your Redis database lives
2. **`KV_REST_API_TOKEN`**: Your secret password to access it

---

## Resources:

- **Upstash Documentation**: [https://upstash.com/docs](https://upstash.com/docs)
- **Vercel Storage Docs**: [https://vercel.com/docs/storage](https://vercel.com/docs/storage)
