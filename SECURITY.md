# 🔐 Security Documentation

## Environment Variables Security

### ✅ SECURE (Server-side only)
- `GEMINI_API_KEY` - Google Gemini API key (server-side only)
- `RAZORPAY_KEY_SECRET` - Razorpay secret key (server-side only)

### ⚠️ PUBLIC (Client-side accessible)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (read-only)
- `NEXT_PUBLIC_MAPTILER_API_KEY` - MapTiler API for maps
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay public key ID

## Security Best Practices

### ✅ Implemented
1. **API Keys Protection**: Gemini API key is server-side only (`GEMINI_API_KEY`)
2. **Git Ignore**: `.env*` files are properly ignored by git
3. **No Hardcoding**: No API keys hardcoded in source code
4. **Example File**: `.env.example` provided for setup guidance

### 🔍 Security Checks
- ✅ Gemini API key is NOT prefixed with `NEXT_PUBLIC_`
- ✅ `.env` file is in `.gitignore`
- ✅ No API keys in git history
- ✅ Server-side validation in API routes

## Setup Instructions

1. Copy `.env.example` to `.env`
2. Fill in your actual API keys
3. Never commit `.env` files to git
4. Use server-side environment variables for sensitive keys

## Emergency Procedures

If an API key is accidentally exposed:
1. Immediately revoke the exposed key from the provider's dashboard
2. Generate a new API key
3. Update the `.env` file with the new key
4. If committed to git, contact the provider to revoke and rotate immediately
