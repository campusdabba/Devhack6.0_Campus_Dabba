# Campus Dabba Deployment Checklist

## 🚀 Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env.local` in production environment
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` to your Supabase project URL
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your Supabase anon key
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` to your Supabase service role key (keep secure!)
- [ ] Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` to your Razorpay key ID
- [ ] Set `RAZORPAY_KEY_SECRET` to your Razorpay secret key
- [ ] Set `NEXTAUTH_SECRET` to a secure random string
- [ ] Update `NEXTAUTH_URL` to your production domain

### 2. Database Setup
- [ ] Run the SQL migrations in `/supabase/migrations/` if not already applied
- [ ] Apply the fixed RLS policies from `/sql/fix_rls_admin_policies_clean.sql`
- [ ] Verify admin user exists in the database with proper role
- [ ] Test database connectivity from production environment

### 3. Supabase Configuration
- [ ] Enable Row Level Security on all tables
- [ ] Configure authentication providers (email, social, etc.)
- [ ] Set up email templates for authentication
- [ ] Configure CORS settings for your domain
- [ ] Set up proper backup and monitoring

### 4. Build and Deploy
- [ ] Run `npm run build` to ensure no compilation errors
- [ ] Deploy to your hosting platform (Vercel, Netlify, etc.)
- [ ] Configure build commands: `npm run build`
- [ ] Configure start command: `npm start`
- [ ] Set up custom domain and SSL certificate

### 5. Post-Deployment Testing
- [ ] Test user registration and login
- [ ] Test admin dashboard access and functionality
- [ ] Test cook registration and dashboard
- [ ] Verify all API routes are working
- [ ] Test role-based navigation and access control
- [ ] Test payment integration with Razorpay
- [ ] Verify email notifications are working

### 6. Monitoring and Maintenance
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Google Analytics, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure automated backups
- [ ] Set up CI/CD pipeline for future deployments

## 🔧 Quick Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
```

### Database Management
```bash
# Apply SQL migrations (if using Supabase CLI)
supabase db push

# Reset database (development only)
supabase db reset
```

## 🚨 Important Notes

### Security
- **Never commit** `.env.local` or `.env` files to version control
- Keep the `SUPABASE_SERVICE_ROLE_KEY` secure - it has admin privileges
- Use HTTPS in production
- Regularly rotate API keys and secrets

### Performance
- The app uses dynamic API routes which is expected behavior
- Consider implementing caching strategies for frequently accessed data
- Monitor API response times and optimize database queries if needed

### Scaling
- The current architecture supports horizontal scaling
- Consider implementing Redis for session storage if scaling beyond single instance
- Monitor database performance and consider read replicas for high traffic

## 📞 Support

If you encounter any issues during deployment:

1. Check the build logs for compilation errors
2. Verify all environment variables are set correctly
3. Test database connectivity and RLS policies
4. Check browser console for client-side errors
5. Review server logs for API errors

The application is production-ready and should deploy successfully with proper configuration.
