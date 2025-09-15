# 📧 SendGrid Setup Instructions

## Step 1: Create SendGrid Account
1. Go to [sendgrid.com](https://sendgrid.com)
2. Click "Start for free" 
3. Sign up with your email (`ishansrivastavaintraq1@gmail.com`)
4. Verify your email address

## Step 2: Create API Key
1. Go to **Settings → API Keys** in SendGrid dashboard
2. Click **"Create API Key"**
3. Choose **"Restricted Access"**
4. Give it permissions for **"Mail Send"** (full access)
5. Copy the API key (starts with `SG.`)

## Step 3: Set up Sender Authentication
1. Go to **Settings → Sender Authentication → Single Sender Verification**
2. Click **"Create New Sender"**
3. Fill in your details:
   - From Email: `ishansrivastavaintraq1@gmail.com`
   - From Name: `prepAIred Team`
   - Reply To: `ishansrivastavaintraq1@gmail.com`
4. Click **"Create"**
5. Check your email and click the verification link

## Step 4: Set Environment Variables
Once you have your API key, run these commands:

```bash
# Set your SendGrid API key
supabase secrets set SENDGRID_API_KEY=SG.your_api_key_here

# Set your verified sender email
supabase secrets set SENDGRID_FROM_EMAIL=ishansrivastavaintraq1@gmail.com
```

## Step 5: Deploy the Function
```bash
supabase functions deploy send-welcome-email-sendgrid
```

## Step 6: Update Database Trigger
Update the webhook URL in your database to point to the new SendGrid function:

```sql
-- Update the trigger to use the new SendGrid function
UPDATE pg_trigger 
SET tgargs = ARRAY['https://pgtrazmbujllsogayvqn.supabase.co/functions/v1/send-welcome-email-sendgrid']
WHERE tgname = 'on_waitlist_insert';
```

## Benefits:
✅ **No domain verification required**
✅ **100 emails/day free forever**
✅ **Works with any email address**
✅ **Professional deliverability**
✅ **Supports attachments**

Let me know when you've completed steps 1-3, and I'll help you with the environment variables!