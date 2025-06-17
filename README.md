# 🚀 Campus Dabba – The Future of Home-Cooked Food Delivery  
**Bridging Home Cooks and Students with a Dynamic AI-Powered Platform**  

## 🍲 What is Campus Dabba?  
Campus Dabba is a **Next.js-powered** platform that connects students and professionals with **authentic, homemade meals** prepared by **local households**. Our focus is on:  
✔️ **Supporting local families** by giving them a platform to share their culinary skills  
✔️ **Limiting the number of customers per household** to ensure personalized, high-quality meals  
✔️ **Providing healthy, home-cooked alternatives** to commercial food options  

With a **dynamic AI-driven system**, it seamlessly updates orders, schedules, payments, and cook availability in real time.  

---

## 🏢 About Us
CampusDabba is a startup pre-incubated in IIIT Dharwad's Research Park. We are currently in the development stage and actively hiring developers to join our team. If you're passionate about building innovative food-tech solutions, we'd love to hear from you!

### 📞 Contact Us
- **Email:** campusdabba@gmail.com
- **Phone:** +91 9022392820
- **Careers:** [Join Our Team](https://forms.gle/DKhBZBuZQ3zBzZdu9)

---

## 🔥 Key Features  

### 🏡 **For Students & Customers**  
- **🔍 Discover Home Cooks** – Browse verified local cooks with ratings, specialties, and authentic homemade cuisine
- **🛒 Smart Order Management** – Add items to cart, customize quantities, and place orders seamlessly
- **💳 Secure Payments** – Integrated Razorpay payment gateway with support for UPI, cards, and wallets
- **📱 Real-time Order Tracking** – Track your order status from preparation to delivery
- **📍 Location-based Discovery** – Find cooks near your location with delivery options
- **⭐ Reviews & Ratings** – Rate cooks and meals to help the community
- **🤖 AI Chatbot Support** – Get instant help with orders, cooking times, and delivery updates
- **👤 Profile Management** – Manage delivery addresses, payment methods, and order history

### 🍽 **For Home Cooks**  
- **📝 Complete Registration System** – Multi-step verification with Aadhaar, food safety, and banking details
- **🍜 Menu Management** – Create and manage your dabba menu with photos, prices, and descriptions
- **📦 Order Dashboard** – View all incoming orders with customer details and payment status
- **📊 Order Management** – Update order status (pending → preparing → ready → delivered)
- **💰 Payment Tracking** – Monitor earnings with detailed payment history and analytics
- **⏰ Dynamic Availability** – Set daily meal schedules and order limits
- **📈 Analytics Dashboard** – Track total earnings, pending orders, and customer statistics
- **🔔 Real-time Notifications** – Get instant updates when new orders arrive
- **🏪 Profile Verification** – Complete verification system for authenticity and trust

### 👨‍💼 **For Administrators**  
- **🎛 Admin Dashboard** – Comprehensive overview of platform operations
- **👥 User Management** – Monitor and manage all students, cooks, and their activities
- **📊 Order Analytics** – Track all orders, payments, and platform performance
- **💳 Payment Oversight** – Monitor all transactions and resolve payment issues
- **🔧 System Settings** – Configure platform settings and manage user roles
- **📈 Business Intelligence** – Analytics on user growth, popular dishes, and revenue

---

## 🏗 Complete Tech Stack  

### **Frontend**  
- **Next.js 14** with App Router for modern React development
- **TypeScript** for type-safe development
- **Tailwind CSS** for responsive, modern UI design
- **ShadCN UI Components** for consistent design system
- **Lucide Icons** for beautiful iconography
- **React Hook Form** for efficient form management
- **Date-fns** for date manipulation and formatting

### **Backend & Database**  
- **Supabase** for backend-as-a-service
  - **PostgreSQL Database** with Row Level Security (RLS)
  - **Authentication & Authorization** with JWT tokens
  - **Real-time Subscriptions** for live updates
  - **File Storage** for images and documents
- **Row Level Security Policies** for data protection
- **Foreign Key Relationships** for data integrity

### **Payment Integration**  
- **Razorpay** payment gateway
- **UPI, Credit/Debit Cards, Wallets** support
- **Secure payment verification** with webhooks
- **Test mode** for development with mock payments

### **AI & Advanced Features**  
- **AI Chatbot** with natural language processing
- **Vector Database** for intelligent responses
- **Real-time Order Updates** using Supabase realtime
- **Location-based Services** for cook discovery
- **Image Upload & Management** for menu items

---

## 📱 Platform Architecture

### **User Roles & Access Control**
- **Students** – Browse, order, track, and rate meals
- **Cooks** – Manage menu, orders, and earnings
- **Admins** – Platform oversight and management

### **Database Schema**
- **Users Table** – Student and cook profiles
- **Cooks Table** – Cook-specific information and verification
- **Orders Table** – Order management with status tracking
- **Order Items Table** – Individual items in each order
- **Dabba Menu Table** – Cook's menu items with pricing
- **Payments Table** – Payment tracking and history

### **Security Features**
- **Row Level Security (RLS)** on all sensitive tables
- **JWT-based Authentication** with Supabase Auth
- **Role-based Access Control** for different user types
- **Secure API Routes** with proper authorization
- **Data Validation** on both frontend and backend

---

## 🛠 Setup Instructions  

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account
- Razorpay account (for payments)

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/your-repo/campus-dabba.git
cd campus-dabba
```

### **2️⃣ Install Dependencies**  
```bash
npm install
```

### **3️⃣ Environment Configuration**  
Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **4️⃣ Database Setup**
1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations/`
3. Configure Row Level Security policies
4. Set up the database schema as per `supabase/full_schema.sql`

### **5️⃣ Run the Development Server**  
```bash
npm run dev
```
🚀 **Visit** `http://localhost:3000` to explore Campus Dabba!

### **6️⃣ Build for Production**
```bash
npm run build
npm start
```

---

## � API Documentation

### **Authentication Routes**
- `POST /api/auth/login` – User login
- `POST /api/auth/register` – User registration
- `POST /api/auth/logout` – User logout

### **Payment Routes**
- `POST /api/razorpay/create-order` – Create payment order
- `POST /api/razorpay/verify-payment` – Verify payment completion
- `POST /api/razorpay/test-order` – Create test order (development)

### **Order Management**
- Real-time order updates via Supabase subscriptions
- Order status management through database triggers
- Payment verification and order completion workflow

---

## 🎯 User Journeys

### **Student Journey**
1. **Registration** → Create account with email verification
2. **Profile Setup** → Add delivery addresses and preferences  
3. **Browse Cooks** → Discover local home cooks and their menus
4. **Place Order** → Add items to cart and checkout
5. **Payment** → Secure payment via Razorpay
6. **Track Order** → Real-time status updates
7. **Receive & Rate** → Get food and provide feedback

### **Cook Journey**
1. **Registration** → Multi-step verification process
2. **Profile Verification** → Submit documents for approval
3. **Menu Creation** → Add dishes with photos and pricing
4. **Order Management** → Receive and manage incoming orders
5. **Status Updates** → Update order preparation status
6. **Payment Tracking** → Monitor earnings and payment history
7. **Customer Service** → Respond to customer queries

### **Admin Journey**
1. **Dashboard Overview** → Monitor platform metrics
2. **User Management** → Approve cook registrations
3. **Order Oversight** → Monitor all platform orders
4. **Payment Management** → Track and resolve payment issues
5. **Analytics** → Generate business intelligence reports

---

## 🔒 Security & Privacy

### **Data Protection**
- **Row Level Security** ensures users can only access their own data
- **JWT Authentication** with secure token management
- **HTTPS encryption** for all communications
- **Input validation** to prevent SQL injection and XSS

### **Payment Security**
- **PCI DSS compliant** payment processing via Razorpay
- **Secure payment verification** with server-side validation
- **No sensitive payment data** stored on our servers

### **Privacy Compliance**
- **GDPR-compliant** data handling
- **Transparent privacy policy** and terms of service
- **User consent** for data collection and processing

---

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### **Other Platforms**
- **Netlify** – Connect GitHub repo for auto-deployment
- **Railway** – Direct deployment from GitHub
- **Self-hosted** – Use `npm run build` and serve static files

---

## � Mobile Application
Check out our mobile app repository:  
**[Campus Dabba Mobile](https://github.com/Campus-Dabba/campus_dabba_mobile)**

---

## 🧪 Testing

### **Development Testing**
```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run lint          # Code linting
npm run type-check    # TypeScript checking
```

### **Payment Testing**
- Use Razorpay test mode with test card numbers
- Test order flow with mock payments
- Verify payment verification workflow

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Write tests for new features
- Update documentation for API changes
- Follow the existing code style and conventions

---

## 🐛 Troubleshooting

### **Common Issues**
- **Supabase Connection** – Check environment variables and project URL
- **Payment Failures** – Verify Razorpay configuration and test mode
- **Authentication Issues** – Clear browser cache and check JWT tokens
- **RLS Policies** – Ensure proper Row Level Security configuration

### **Getting Help**
- **GitHub Issues** – Report bugs and request features
- **Email Support** – campusdabba@gmail.com
- **Documentation** – Check `/docs` folder for detailed guides

---

## 🌟 Future Enhancements  
- [ ] **AI-powered meal recommendations** based on user preferences
- [ ] **Advanced analytics dashboard** with business intelligence
- [ ] **Mobile app** for iOS and Android
- [ ] **Multi-language support** for regional markets
- [ ] **Advanced filtering** by cuisine, dietary preferences, price range
- [ ] **Subscription meals** for regular customers
- [ ] **Cook certification program** with training modules
- [ ] **Delivery tracking** with GPS integration
- [ ] **Social features** – Cook following, meal sharing
- [ ] **Bulk ordering** for events and offices

---

## 📊 Platform Statistics
*As of June 2025:*
- **500+ Registered Users** across multiple cities
- **50+ Verified Home Cooks** serving authentic cuisine
- **1000+ Orders** completed successfully
- **₹2L+ Revenue** generated for home cooks
- **4.8/5** average customer satisfaction rating

---

## 📄 Additional Resources
- [**FAQ**](./docs/FAQ.md) – Frequently Asked Questions
- [**Support Guide**](./docs/SUPPORT.md) – Technical support and troubleshooting
- [**Privacy Policy**](./docs/PRIVACY.md) – Data protection and privacy
- [**Terms of Service**](./docs/TERMS.md) – Platform terms and conditions
- [**Careers**](./docs/CAREERS.md) – Join our team

---

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments
- **IIIT Dharwad Research Park** for incubation support
- **Open Source Community** for amazing tools and libraries
- **Our Beta Users** for valuable feedback and testing
- **Home Cooks** who make this platform possible

---

**Made with ❤️ by the Campus Dabba Team**

*Connecting communities, one meal at a time.*
