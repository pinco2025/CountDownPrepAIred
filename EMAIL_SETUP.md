# 🚀 Automatic Email Setup Guide

This guide will help you set up automatic welcome emails with PDF attachments for your prepAIred waitlist.

## 📋 Prerequisites

1. ✅ Supabase project (you already have this)
2. ✅ Supabase CLI installed (we just did this)
3. 📧 Resend account (free tier available)
4. 🌐 Your website deployed and accessible

## 🛠️ Setup Steps

### Step 1: Sign up for Resend Email Service

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address
4. Go to **API Keys** section
5. Create a new API key and copy it

### Step 2: Connect to Your Supabase Project

```bash
# Link your local project to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Get your project ref from your Supabase dashboard URL:
# https://supabase.com/dashboard/project/[PROJECT_REF]
```

### Step 3: Configure Environment Variables

1. Create environment file:
```bash
cp supabase/.env.example supabase/.env
```

2. Edit `supabase/.env` with your actual values:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SITE_URL=https://your-deployed-site.vercel.app
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**How to get your Service Role Key:**
- Go to your Supabase Dashboard
- Settings → API
- Copy the `service_role` key (not the `anon` key!)

### Step 4: Update the Migration File

Edit `supabase/migrations/20250915012529_add_email_trigger.sql`:

Replace line 34:
```sql
webhook_url := 'https://your-project-ref.supabase.co/functions/v1/send-welcome-email';
```

With your actual project reference:
```sql
webhook_url := 'https://YOUR_ACTUAL_PROJECT_REF.supabase.co/functions/v1/send-welcome-email';
```

### Step 5: Deploy Everything

```bash
# Deploy the Edge Function
supabase functions deploy send-welcome-email

# Run the database migrations
supabase db push

# Set environment variables in Supabase
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set SITE_URL=https://your-site.com
```

### Step 6: Configure Resend Domain (Optional but Recommended)

1. In Resend dashboard, go to **Domains**
2. Add your custom domain (e.g., `prepaired.tech`)
3. Add the DNS records they provide
4. Update the `from` field in the Edge Function:
   ```typescript
   from: 'prepAIred Team <noreply@your-domain.com>',
   ```

## 🧪 Testing

### Test 1: Manual Function Test
```bash
# Test the function directly
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-welcome-email' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "INSERT",
    "table": "waitlist",
    "record": {
      "id": 999,
      "email": "test@example.com",
      "created_at": "2025-01-15T12:00:00Z"
    }
  }'
```

### Test 2: End-to-End Test
1. Go to your website
2. Submit the waitlist form with your email
3. Check your email inbox
4. Verify you received the welcome email with PDF attachment

## 📧 Email Content

The welcome email includes:
- 🎉 Personalized welcome message
- 📚 Information about prepAIred platform
- 🔗 Links to Reddit and Discord communities
- 📅 Launch date (September 21st, 2025)
- 📎 PDF attachment (`iter8.pdf` renamed to `prepAIred-Welcome-Guide.pdf`)
- 🎨 Beautiful HTML design matching your brand colors

## 🔧 Troubleshooting

### Email Not Sending?
1. Check Supabase function logs: `supabase functions logs send-welcome-email`
2. Verify environment variables are set correctly
3. Ensure your Resend API key is valid
4. Check your site URL is accessible

### PDF Not Attaching?
1. Verify `iter8.pdf` exists in your `public` folder
2. Check your `SITE_URL` environment variable
3. Ensure the PDF URL is publicly accessible

### Database Issues?
1. Check if the waitlist table exists: `supabase db inspect`
2. Verify the trigger was created successfully
3. Check database logs for errors

## 🚀 Go Live!

Once everything is working:
1. Deploy your website to production
2. Update `SITE_URL` to your production domain
3. Set up a custom domain in Resend
4. Monitor the function logs for any issues

## 📊 Monitoring

You can monitor your email automation through:
- **Supabase Dashboard**: Function logs and database activity
- **Resend Dashboard**: Email delivery status and analytics
- **Your Email**: Test the flow regularly

---

🎉 **Congratulations!** Your automatic welcome email system is now set up! Every new waitlist signup will automatically receive a beautiful welcome email with your PDF guide.

Need help? Check the logs or reach out for support! 🤝