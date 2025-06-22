# 🏗️ Campus Dabba - Technical Architecture Overview

## 📋 System Overview

Campus Dabba is a modern full-stack web application built with Next.js 14, TypeScript, and Supabase that connects students with local home cooks for authentic, homemade meal delivery. The platform supports three distinct user roles with role-based access control and real-time features.

## 🎯 Actual System Architecture (What You Really Have)

```mermaid
graph TB
    subgraph "Frontend Layer"
        WEB[Next.js 14 Web App<br/>React + TypeScript]
        MOBILE[Future: React Native<br/>Not Implemented Yet]
    end
    
    subgraph "Middleware & Routing"
        MW[Next.js Middleware<br/>Session Management]
        ROUTER[App Router<br/>File-based Routing]
        API[API Routes<br/>Serverless Functions]
    end
    
    subgraph "Supabase Backend"
        AUTH[Supabase Auth<br/>JWT + Session]
        DB[(PostgreSQL<br/>with RLS Policies)]
        STORAGE[Supabase Storage<br/>File Upload]
        REALTIME[Supabase Realtime<br/>Live Subscriptions]
    end
    
    subgraph "External Services"
        RAZORPAY[Razorpay Payment API<br/>Payment Processing]
        MAPS[Google Maps API<br/>Location Services]
        EMAIL[Email Verification<br/>Built into Supabase]
    end
    
    subgraph "User Interfaces"
        STUDENT[Student Pages<br/>Browse & Order]
        COOK[Cook Dashboard<br/>Menu & Orders]
        ADMIN[Admin Panel<br/>Platform Management]
    end
    
    WEB --> MW
    MW --> ROUTER
    ROUTER --> API
    API --> AUTH
    API --> DB
    API --> STORAGE
    API --> REALTIME
    
    API --> RAZORPAY
    API --> MAPS
    AUTH --> EMAIL
    
    WEB --> STUDENT
    WEB --> COOK
    WEB --> ADMIN
```

## 🖥️ Frontend Architecture (What You Actually Built)

```mermaid
graph TB
    subgraph "Next.js 14 App Structure"
        ROOT[app/layout.tsx<br/>Root Layout + Providers]
        PAGES[Page Components<br/>Student/Cook/Admin]
        API_ROUTES[app/api/*<br/>Serverless Functions]
    end
    
    subgraph "Component Architecture"
        PROVIDERS[React Context Providers<br/>Auth, Cart, Theme]
        SHARED[Shared Components<br/>UI Components]
        ROLE_SPECIFIC[Role-Based Components<br/>Student/Cook/Admin]
        UI_LIB[ShadCN/UI Components<br/>Radix + Tailwind]
    end
    
    subgraph "State Management"
        CONTEXT[React Context<br/>Global State]
        HOOKS[Custom Hooks<br/>use-auth, use-cart]
        FORMS[React Hook Form<br/>Form Management]
        LOCAL_STATE[Component State<br/>useState/useEffect]
    end
    
    subgraph "Actual Pages You Have"
        S_BROWSE[app/browse/page.tsx<br/>Browse Cooks]
        S_CART[app/cart/page.tsx<br/>Shopping Cart]
        S_CHECKOUT[app/checkout/page.tsx<br/>Checkout Flow]
        S_ORDERS[app/orders/page.tsx<br/>Order History]
        
        C_DASHBOARD[app/cook/dashboard/<br/>Cook Dashboard]
        C_MENU[app/cook/menu/<br/>Menu Management]
        C_ORDERS[app/cook/orders/<br/>Order Management]
        C_REGISTER[app/cook/register/<br/>Registration Flow]
        
        A_DASHBOARD[app/admin/dashboard/<br/>Admin Overview]
        A_USERS[app/admin/users/<br/>User Management]
        A_COOKS[app/admin/cooks/<br/>Cook Management]
        A_ORDERS[app/admin/orders/<br/>Order Oversight]
    end
    
    ROOT --> PROVIDERS
    PROVIDERS --> SHARED
    SHARED --> ROLE_SPECIFIC
    ROLE_SPECIFIC --> UI_LIB
    
    CONTEXT --> HOOKS
    HOOKS --> FORMS
    FORMS --> LOCAL_STATE
    
    PAGES --> S_BROWSE
    PAGES --> S_CART
    PAGES --> S_CHECKOUT
    PAGES --> S_ORDERS
    PAGES --> C_DASHBOARD
    PAGES --> C_MENU
    PAGES --> C_ORDERS
    PAGES --> C_REGISTER
    PAGES --> A_DASHBOARD
    PAGES --> A_USERS
    PAGES --> A_COOKS
    PAGES --> A_ORDERS
```

## 🏗️ Backend Architecture (What's Actually There)

```mermaid
graph TB
    subgraph "Next.js API Layer"
        MIDDLEWARE[middleware.ts<br/>Route Protection]
        ADMIN_API[app/api/admin/<br/>Admin Operations]
        PAYMENT_API[app/api/razorpay/<br/>Payment Processing]
        EMAIL_API[app/api/verify-email.ts<br/>Email Verification]
    end
    
    subgraph "Supabase Services"
        CLIENT[Supabase Client<br/>Client-side Operations]
        SERVER[Supabase Server<br/>Server-side Operations]
        ADMIN_CLIENT[Supabase Admin<br/>Service Role Client]
        MIDDLEWARE_CLIENT[Supabase Middleware<br/>Session Updates]
    end
    
    subgraph "Database Layer"
        POSTGRES[(PostgreSQL Database<br/>15+ Tables)]
        RLS[Row Level Security<br/>User-based Access]
        TRIGGERS[Database Triggers<br/>Auto-calculations]
        FUNCTIONS[Stored Functions<br/>is_admin and others]
    end
    
    subgraph "File Structure You Actually Have"
        UTILS[utils/supabase/<br/>Client Configurations]
        LIB[lib/supabase-admin.ts<br/>Admin Operations]
        RAZORPAY_UTILS[utils/razorpay.ts<br/>Payment Utilities]
        TYPES[types/<br/>TypeScript Definitions]
    end
    
    MIDDLEWARE --> CLIENT
    ADMIN_API --> ADMIN_CLIENT
    PAYMENT_API --> SERVER
    EMAIL_API --> SERVER
    
    CLIENT --> POSTGRES
    SERVER --> POSTGRES
    ADMIN_CLIENT --> POSTGRES
    MIDDLEWARE_CLIENT --> POSTGRES
    
    POSTGRES --> RLS
    POSTGRES --> TRIGGERS
    POSTGRES --> FUNCTIONS
    
    UTILS --> CLIENT
    LIB --> ADMIN_CLIENT
    RAZORPAY_UTILS --> PAYMENT_API
```

## 🏛️ Architectural Layers

### 1. Frontend Layer
```
├── app/                          # Next.js 14 App Router
│   ├── (static)/                # Static pages (about, FAQ, etc.)
│   ├── admin/                   # Admin panel routes
│   ├── auth/                    # Authentication flows
│   ├── cook/                    # Cook dashboard & features
│   ├── student/                 # Student dashboard & features
│   ├── api/                     # API route handlers
│   └── layout.tsx               # Root layout with providers
├── components/                   # Reusable UI components
│   ├── admin/                   # Admin-specific components
│   ├── auth/                    # Authentication components
│   ├── cook/                    # Cook dashboard components
│   ├── student/                 # Student interface components
│   ├── shared/                  # Cross-role shared components
│   ├── providers/               # Context providers
│   └── ui/                      # Base UI components (shadcn/ui)
```

**Key Technologies:**
- **Next.js 14** with App Router for modern React development
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for utility-first styling
- **ShadCN UI** for consistent, accessible component library
- **React Hook Form** for efficient form handling
- **Zustand/Context API** for state management

### 2. Middleware & API Layer
```
├── middleware.ts                 # Route protection & session management
├── app/api/                     # Custom API endpoints
│   ├── admin/                   # Admin operations
│   │   ├── users/              # User management
│   │   ├── cooks/              # Cook verification & management
│   │   ├── orders/             # Order oversight
│   │   └── stats/              # Analytics & reporting
│   ├── razorpay/               # Payment processing
│   │   ├── create-order/       # Order creation
│   │   ├── verify-payment/     # Payment verification
│   │   └── test/               # Test endpoints
│   └── verify-email.ts         # Email verification
```

**Responsibilities:**
- Authentication & authorization middleware
- Business logic not suitable for client-side
- Third-party service integrations
- Payment processing and verification
- File upload handling
- Email notifications

### 3. Database & Backend Services

#### Database Schema (PostgreSQL via Supabase)
```mermaid
erDiagram
    users ||--o{ cooks : "has profile"
    users ||--o{ student_profiles : "has profile"
    users ||--o{ admins : "has admin role"
    
    cooks ||--o{ cook_profiles : "has profile"
    cooks ||--o{ cook_bank_details : "has banking"
    cooks ||--o{ dabba_menu : "creates menu"
    cooks ||--o{ cook_orders : "receives orders"
    cooks ||--o{ cook_payments : "receives payments"
    cooks ||--o{ cook_ratings : "receives ratings"
    
    users ||--o{ orders : "places orders"
    orders ||--o{ order_items : "contains items"
    orders ||--o{ payments : "has payment"
    
    dabba_menu ||--o{ order_items : "ordered as"
    
    users {
        uuid id PK
        string email UK
        string role
        timestamp created_at
        timestamp updated_at
    }
    
    cooks {
        uuid id PK
        uuid user_id FK
        uuid auth_user_id FK
        string name
        string location
        numeric rating
        boolean is_verified
        timestamp created_at
    }
    
    orders {
        uuid id PK
        uuid user_id FK
        uuid cook_id FK
        string status
        numeric total_amount
        timestamp created_at
        timestamp updated_at
    }
    
    order_items {
        uuid id PK
        uuid order_id FK
        uuid menu_item_id FK
        uuid cook_id FK
        integer quantity
        numeric price
    }
    
    dabba_menu {
        uuid id PK
        uuid cook_id FK
        string name
        string description
        numeric price
        boolean available
        integer prep_time
        timestamp created_at
    }
```

**Key Database Features:**
- **Row Level Security (RLS)** for data protection
- **Foreign Key Relationships** for data integrity
- **Triggers** for automated updates (cook stats, order counts)
- **Indexes** for optimized queries
- **Unique Constraints** for data consistency

#### Row Level Security Policies
```sql
-- Example policies from policies.json
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Cooks can manage their menu" ON dabba_menu
  FOR ALL USING (auth.uid() = cook_id);

CREATE POLICY "Admin full access" ON ALL TABLES
  FOR ALL USING (is_admin(auth.uid()));
```

### 4. Authentication & Authorization

**Authentication Flow:**
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Middleware
    participant Supabase
    participant Database
    
    User->>Frontend: Login Request
    Frontend->>Supabase: Auth Request
    Supabase->>Database: Validate User
    Database-->>Supabase: User Data + Role
    Supabase-->>Frontend: JWT Token + Session
    Frontend->>Middleware: Protected Route Access
    Middleware->>Supabase: Verify Token
    Supabase-->>Middleware: Token Valid + User Context
    Middleware-->>Frontend: Route Access Granted
```

**Role-Based Access Control:**
- **Student/Customer**: Browse cooks, place orders, track orders, rate meals
- **Cook**: Manage menu, view orders, update status, track earnings
- **Admin**: Platform oversight, user management, analytics, system settings

### 5. Payment Processing Architecture

```mermaid
sequenceDiagram
    participant Student
    participant Frontend
    participant API
    participant Razorpay
    participant Database
    
    Student->>Frontend: Place Order
    Frontend->>API: Create Payment
    API->>Razorpay: Create Order
    Razorpay-->>API: Order ID
    API-->>Frontend: Payment Details
    Frontend->>Razorpay: Initiate Payment
    Razorpay-->>Student: Payment Interface
    Student->>Razorpay: Complete Payment
    Razorpay->>API: Payment Webhook
    API->>Database: Update Order Status
    API->>Database: Record Payment
```

## 📁 Detailed Code Architecture

### Frontend Component Hierarchy
```
src/
├── app/                                    # Next.js 14 App Router
│   ├── layout.tsx                         # Root layout with providers
│   ├── page.tsx                           # Landing page
│   ├── loading.tsx                        # Global loading UI
│   ├── error.tsx                          # Global error boundary
│   ├── not-found.tsx                      # 404 page
│   │
│   ├── globals.css                        # Global styles & Tailwind
│   │
│   ├── (static)/                          # Static marketing pages
│   │   ├── layout.tsx                     # Static pages layout
│   │   ├── about/page.tsx                 # About page
│   │   ├── careers/page.tsx               # Careers page
│   │   ├── faq/page.tsx                   # FAQ page
│   │   ├── help/page.tsx                  # Help center
│   │   └── support/page.tsx               # Support page
│   │
│   ├── auth/                              # Authentication flows
│   │   ├── login/page.tsx                 # Login form
│   │   ├── register/page.tsx              # Registration form
│   │   ├── admin-register/page.tsx        # Admin registration
│   │   ├── verify/page.tsx                # Email verification
│   │   └── registration/page.tsx          # Registration success
│   │
│   ├── student/                           # Student interface
│   │   ├── layout.tsx                     # Student layout wrapper
│   │   ├── dashboard/page.tsx             # Student dashboard
│   │   ├── browse/page.tsx                # Browse cooks
│   │   ├── menu/[cookId]/page.tsx         # Cook menu view
│   │   ├── cart/page.tsx                  # Shopping cart
│   │   ├── checkout/page.tsx              # Checkout process
│   │   ├── orders/page.tsx                # Order history
│   │   ├── orders/[orderId]/page.tsx      # Order details
│   │   ├── profile/page.tsx               # Profile management
│   │   └── settings/page.tsx              # Account settings
│   │
│   ├── cook/                              # Cook interface
│   │   ├── layout.tsx                     # Cook layout wrapper
│   │   ├── register/page.tsx              # Cook registration flow
│   │   ├── registration/page.tsx          # Registration steps
│   │   ├── dashboard/page.tsx             # Cook dashboard
│   │   ├── menu/page.tsx                  # Menu management
│   │   ├── menu/create/page.tsx           # Add menu item
│   │   ├── menu/edit/[itemId]/page.tsx    # Edit menu item
│   │   ├── orders/page.tsx                # Order management
│   │   ├── orders/[orderId]/page.tsx      # Order details
│   │   ├── orderprog/page.tsx             # Order progress tracking
│   │   ├── payments/page.tsx              # Payment history
│   │   ├── profile/page.tsx               # Cook profile
│   │   └── settings/page.tsx              # Account settings
│   │
│   ├── admin/                             # Admin panel
│   │   ├── layout.tsx                     # Admin layout wrapper
│   │   ├── dashboard/page.tsx             # Admin dashboard
│   │   ├── users/page.tsx                 # User management
│   │   ├── users/[userId]/page.tsx        # User details
│   │   ├── cooks/page.tsx                 # Cook management
│   │   ├── cooks/[cookId]/page.tsx        # Cook verification
│   │   ├── orders/page.tsx                # Order oversight
│   │   ├── orders/[orderId]/page.tsx      # Order details
│   │   ├── payments/page.tsx              # Payment management
│   │   └── settings/page.tsx              # System settings
│   │
│   └── api/                               # API route handlers
│       ├── auth/                          # Authentication endpoints
│       ├── admin/                         # Admin operations
│       │   ├── users/route.ts             # User management API
│       │   ├── cooks/route.ts             # Cook management API
│       │   ├── orders/route.ts            # Order oversight API
│       │   └── stats/route.ts             # Analytics API
│       ├── razorpay/                      # Payment integration
│       │   ├── create-order/route.ts      # Create payment order
│       │   ├── verify-payment/route.ts    # Verify payment
│       │   └── test/route.ts              # Test endpoints
│       ├── student/                       # Student operations
│       ├── cook/                          # Cook operations
│       └── verify-email.ts                # Email verification
│
├── components/                            # Reusable UI components
│   ├── providers/                         # Context providers
│   │   ├── auth-provider.tsx              # Authentication context
│   │   ├── cart-provider.tsx              # Shopping cart state
│   │   ├── theme-provider.tsx             # Theme management
│   │   └── toast-provider.tsx             # Notification system
│   │
│   ├── layout/                            # Layout components
│   │   ├── main-nav.tsx                   # Main navigation
│   │   ├── cook-nav.tsx                   # Cook navigation
│   │   ├── admin-nav.tsx                  # Admin navigation
│   │   ├── mobile-nav.tsx                 # Mobile navigation
│   │   ├── sidebar.tsx                    # Dashboard sidebar
│   │   └── footer.tsx                     # Site footer
│   │
│   ├── auth/                              # Authentication components
│   │   ├── login-form.tsx                 # Login form component
│   │   ├── register-form.tsx              # Registration form
│   │   ├── verify-email.tsx               # Email verification
│   │   └── protected-route.tsx            # Route protection
│   │
│   ├── student/                           # Student-specific components
│   │   ├── cook-card.tsx                  # Cook listing card
│   │   ├── menu-item.tsx                  # Menu item display
│   │   ├── cart-item.tsx                  # Cart item component
│   │   ├── order-card.tsx                 # Order history card
│   │   ├── rating-form.tsx                # Rating submission
│   │   └── order-tracking.tsx             # Order status tracker
│   │
│   ├── cook/                              # Cook-specific components
│   │   ├── registration-wizard.tsx        # Multi-step registration
│   │   ├── menu-form.tsx                  # Menu item form
│   │   ├── order-list.tsx                 # Order management list
│   │   ├── earnings-chart.tsx             # Earnings visualization
│   │   ├── order-status-updater.tsx       # Status update component
│   │   └── profile-form.tsx               # Profile editing
│   │
│   ├── admin/                             # Admin-specific components
│   │   ├── user-table.tsx                 # User management table
│   │   ├── cook-verification.tsx          # Cook verification form
│   │   ├── order-overview.tsx             # Order oversight dashboard
│   │   ├── analytics-dashboard.tsx        # Analytics visualization
│   │   └── system-settings.tsx            # Configuration panel
│   │
│   ├── shared/                            # Cross-role shared components
│   │   ├── image-upload.tsx               # File upload component
│   │   ├── search-bar.tsx                 # Search functionality
│   │   ├── filter-panel.tsx               # Filtering interface
│   │   ├── pagination.tsx                 # Data pagination
│   │   ├── loading-spinner.tsx            # Loading indicators
│   │   ├── error-boundary.tsx             # Error handling
│   │   └── confirmation-modal.tsx         # Action confirmations
│   │
│   ├── ui/                                # Base UI components (shadcn/ui)
│   │   ├── button.tsx                     # Button component
│   │   ├── input.tsx                      # Input field
│   │   ├── textarea.tsx                   # Text area
│   │   ├── select.tsx                     # Select dropdown
│   │   ├── modal.tsx                      # Modal dialog
│   │   ├── card.tsx                       # Card container
│   │   ├── table.tsx                      # Data table
│   │   ├── toast.tsx                      # Toast notifications
│   │   └── ...                            # Other UI primitives
│   │
│   └── theme-provider.tsx                 # Theme context provider
│
├── hooks/                                 # Custom React hooks
│   ├── use-auth.ts                        # Authentication hook
│   ├── use-auth-role.ts                   # Role-based access
│   ├── use-cart.ts                        # Shopping cart hook
│   ├── use-orders.ts                      # Order management
│   ├── use-realtime.ts                    # Real-time subscriptions
│   ├── use-mobile.tsx                     # Mobile detection
│   ├── use-toast.ts                       # Toast notifications
│   └── use-debounce.ts                    # Input debouncing
│
├── lib/                                   # Utility libraries
│   ├── supabase-admin.ts                  # Admin Supabase client
│   ├── utils.ts                           # General utilities
│   ├── validations.ts                     # Form validation schemas
│   ├── constants.ts                       # Application constants
│   └── types.ts                           # TypeScript type definitions
│
├── utils/                                 # Utility functions
│   ├── supabase/                          # Supabase configurations
│   │   ├── client.ts                      # Client-side Supabase
│   │   ├── server.ts                      # Server-side Supabase
│   │   ├── middleware.ts                  # Middleware Supabase
│   │   └── service.ts                     # Service role Supabase
│   ├── razorpay.ts                        # Payment utilities
│   ├── load-script.ts                     # Dynamic script loading
│   └── debounce.ts                        # Debounce utility
│
├── types/                                 # TypeScript definitions
│   ├── index.ts                           # Main type exports
│   ├── database.ts                        # Database types
│   ├── auth.ts                            # Authentication types
│   ├── student.ts                         # Student-specific types
│   └── states.ts                          # State management types
│
└── styles/                                # Styling files
    ├── globals.css                        # Global CSS & Tailwind
    └── components.css                     # Component-specific styles
```

### Backend Service Architecture
```
Backend Services/
├── Authentication Service                 # User authentication & authorization
│   ├── JWT Token Management              # Token generation & validation
│   ├── Session Management                # User session handling
│   ├── Role-Based Access Control         # Permission checking
│   └── Multi-factor Authentication       # Enhanced security (future)
│
├── User Management Service               # User profile & account management
│   ├── Profile CRUD Operations           # Create, read, update, delete profiles
│   ├── Role Assignment                   # User role management
│   ├── Account Verification              # Email/phone verification
│   └── Account Deactivation              # Account lifecycle management
│
├── Order Management Service              # Order processing & lifecycle
│   ├── Order Creation                    # New order processing
│   ├── Order Status Tracking            # Status updates & notifications
│   ├── Order History                     # Historical order data
│   ├── Order Cancellation               # Order cancellation logic
│   └── Order Analytics                   # Order performance metrics
│
├── Menu Management Service               # Cook menu & inventory
│   ├── Menu CRUD Operations              # Menu item management
│   ├── Inventory Tracking                # Stock & availability
│   ├── Price Management                  # Dynamic pricing
│   └── Menu Analytics                    # Popular items & trends
│
├── Payment Processing Service            # Financial transactions
│   ├── Payment Gateway Integration       # Razorpay API integration
│   ├── Transaction Processing            # Payment flow management
│   ├── Refund Processing                 # Refund & chargeback handling
│   ├── Payment Verification              # Security & fraud prevention
│   └── Financial Reporting               # Transaction reporting
│
├── Cook Management Service               # Cook onboarding & management
│   ├── Cook Registration                 # Multi-step onboarding
│   ├── Verification Process              # Document & credential verification
│   ├── Performance Tracking              # Ratings & performance metrics
│   ├── Payout Management                 # Cook payment processing
│   └── Cook Analytics                    # Cook performance insights
│
├── Notification Service                  # Real-time communications
│   ├── Real-time Messaging               # WebSocket/SSE connections
│   ├── Email Notifications               # Transactional emails
│   ├── SMS Notifications                 # SMS alerts & OTP
│   ├── Push Notifications                # Browser/mobile push
│   └── Notification Templates            # Message templating
│
├── Analytics & Reporting Service         # Business intelligence
│   ├── User Analytics                    # User behavior tracking
│   ├── Order Analytics                   # Order pattern analysis
│   ├── Revenue Analytics                 # Financial performance
│   ├── Cook Performance                  # Cook success metrics
│   └── Platform Health                   # System performance metrics
│
├── File Storage Service                  # Media & document management
│   ├── Image Upload & Processing         # Profile & menu images
│   ├── Document Storage                  # Verification documents
│   ├── File Compression                  # Optimization & CDN
│   └── Security & Access Control         # Secure file access
│
├── Location Service                      # Geographic & delivery
│   ├── Address Validation                # Address verification
│   ├── Delivery Zone Management          # Service area definition
│   ├── Distance Calculation              # Delivery fee calculation
│   └── Map Integration                   # Google Maps API
│
├── Search & Discovery Service            # Content discovery
│   ├── Cook Search                       # Find cooks by criteria
│   ├── Menu Search                       # Find dishes & cuisines
│   ├── Recommendation Engine             # Personalized suggestions
│   └── Content Filtering                 # Dietary & preference filters
│
├── Security Service                      # Platform security
│   ├── Input Validation                  # SQL injection prevention
│   ├── Rate Limiting                     # API abuse prevention
│   ├── Audit Logging                     # Security event tracking
│   └── Threat Detection                  # Anomaly detection
│
└── Admin Service                         # Platform administration
    ├── User Management                   # Admin user operations
    ├── System Configuration              # Platform settings
    ├── Content Moderation                # Review management
    ├── Support Tools                     # Customer support features
    └── System Monitoring                 # Health & performance monitoring
```

### API Endpoint Structure
```
API Endpoints (/api/*)
├── Authentication (/auth)
│   ├── POST /auth/login                  # User login
│   ├── POST /auth/register               # User registration
│   ├── POST /auth/logout                 # User logout
│   ├── POST /auth/refresh                # Token refresh
│   ├── POST /auth/forgot-password        # Password reset
│   └── GET  /auth/verify-email           # Email verification
│
├── Student Operations (/student)
│   ├── GET    /student/profile           # Get student profile
│   ├── PUT    /student/profile           # Update student profile
│   ├── GET    /student/cooks             # Browse available cooks
│   ├── GET    /student/cooks/:id/menu    # Get cook menu
│   ├── POST   /student/orders            # Place new order
│   ├── GET    /student/orders            # Get order history
│   ├── GET    /student/orders/:id        # Get order details
│   ├── POST   /student/ratings           # Submit cook rating
│   └── DELETE /student/orders/:id        # Cancel order
│
├── Cook Operations (/cook)
│   ├── POST /cook/register               # Cook registration
│   ├── GET  /cook/profile                # Get cook profile
│   ├── PUT  /cook/profile                # Update cook profile
│   ├── GET  /cook/menu                   # Get cook menu
│   ├── POST /cook/menu                   # Add menu item
│   ├── PUT  /cook/menu/:id               # Update menu item
│   ├── DELETE /cook/menu/:id             # Delete menu item
│   ├── GET  /cook/orders                 # Get cook orders
│   ├── PUT  /cook/orders/:id/status      # Update order status
│   ├── GET  /cook/analytics              # Get cook analytics
│   └── GET  /cook/payments               # Get payment history
│
├── Admin Operations (/admin)
│   ├── GET  /admin/dashboard             # Admin dashboard data
│   ├── GET  /admin/users                 # List all users
│   ├── GET  /admin/users/:id             # Get user details
│   ├── PUT  /admin/users/:id             # Update user
│   ├── DELETE /admin/users/:id           # Deactivate user
│   ├── GET  /admin/cooks                 # List all cooks
│   ├── PUT  /admin/cooks/:id/verify      # Verify cook
│   ├── GET  /admin/orders                # List all orders
│   ├── GET  /admin/payments              # Payment oversight
│   ├── GET  /admin/analytics             # Platform analytics
│   └── PUT  /admin/settings              # Update system settings
│
├── Payment Operations (/razorpay)
│   ├── POST /razorpay/create-order       # Create payment order
│   ├── POST /razorpay/verify-payment     # Verify payment
│   ├── POST /razorpay/refund             # Process refund
│   └── GET  /razorpay/test               # Test payment flow
│
├── File Operations (/upload)
│   ├── POST /upload/profile-image        # Upload profile image
│   ├── POST /upload/menu-image           # Upload menu image
│   ├── POST /upload/verification-doc     # Upload verification document
│   └── DELETE /upload/:fileId            # Delete uploaded file
│
└── Utility Operations (/utils)
    ├── GET  /utils/health                # Health check
    ├── POST /utils/send-email            # Send transactional email
    ├── POST /utils/send-sms              # Send SMS notification
    ├── GET  /utils/locations             # Get location data
    └── POST /utils/feedback              # Submit platform feedback
```

## 🔄 Complete User Flow Diagrams

### Student/Customer Complete Flow
```mermaid
flowchart TD
    START([Student Visits Platform]) --> GUEST_CHECK{Is User Logged In?}
    
    GUEST_CHECK -->|No| REGISTER[Register Account]
    GUEST_CHECK -->|Yes| BROWSE[Browse Available Cooks]
    
    REGISTER --> EMAIL_VERIFY{Email Verified?}
    EMAIL_VERIFY -->|No| VERIFY_EMAIL[Check Email and Verify]
    EMAIL_VERIFY -->|Yes| PROFILE_SETUP[Complete Student Profile]
    VERIFY_EMAIL --> PROFILE_SETUP
    
    PROFILE_SETUP --> COLLEGE_INFO[Add College Course Info]
    COLLEGE_INFO --> DIETARY_PREF[Set Dietary Preferences]
    DIETARY_PREF --> ADDRESSES[Add Delivery Addresses]
    ADDRESSES --> BROWSE
    
    BROWSE --> LOCATION_CHECK{Location Services?}
    LOCATION_CHECK -->|Enabled| NEARBY_COOKS[Show Nearby Cooks]
    LOCATION_CHECK -->|Disabled| ALL_COOKS[Show All Cooks]
    
    NEARBY_COOKS --> FILTER_OPTIONS[Apply Filters]
    ALL_COOKS --> FILTER_OPTIONS
    FILTER_OPTIONS --> CUISINE_FILTER[Filter by Cuisine]
    CUISINE_FILTER --> RATING_FILTER[Filter by Rating]
    RATING_FILTER --> PRICE_FILTER[Filter by Price Range]
    PRICE_FILTER --> COOK_LIST[Display Cook List]
    
    COOK_LIST --> SELECT_COOK[Select Cook]
    SELECT_COOK --> COOK_VERIFY_CHECK{Cook Verified?}
    COOK_VERIFY_CHECK -->|No| UNVERIFIED_MSG[Show Unverified Warning]
    COOK_VERIFY_CHECK -->|Yes| VIEW_MENU[View Cook Menu]
    UNVERIFIED_MSG --> VIEW_MENU
    
    VIEW_MENU --> MENU_AVAILABLE{Items Available?}
    MENU_AVAILABLE -->|No| NO_ITEMS[Show No Items Message]
    MENU_AVAILABLE -->|Yes| SELECT_ITEMS[Select Menu Items]
    
    SELECT_ITEMS --> QUANTITY[Choose Quantity]
    QUANTITY --> CUSTOMIZATION[Add Special Instructions]
    CUSTOMIZATION --> ADD_TO_CART[Add to Cart]
    ADD_TO_CART --> CONTINUE_SHOPPING{Continue Shopping?}
    
    CONTINUE_SHOPPING -->|Yes| COOK_LIST
    CONTINUE_SHOPPING -->|No| VIEW_CART[View Cart]
    
    VIEW_CART --> CART_EMPTY{Cart Empty?}
    CART_EMPTY -->|Yes| BROWSE
    CART_EMPTY -->|No| MODIFY_CART{Modify Cart?}
    
    MODIFY_CART -->|Yes| UPDATE_QUANTITIES[Update Item Quantities]
    MODIFY_CART -->|No| PROCEED_CHECKOUT[Proceed to Checkout]
    UPDATE_QUANTITIES --> REMOVE_ITEMS[Remove Items if Needed]
    REMOVE_ITEMS --> VIEW_CART
    
    PROCEED_CHECKOUT --> ADDRESS_CHECK{Delivery Address Set?}
    ADDRESS_CHECK -->|No| ADD_ADDRESS[Add Delivery Address]
    ADDRESS_CHECK -->|Yes| DELIVERY_ZONE{In Delivery Zone?}
    ADD_ADDRESS --> DELIVERY_ZONE
    
    DELIVERY_ZONE -->|No| OUT_OF_ZONE[Show Out of Zone Message]
    DELIVERY_ZONE -->|Yes| CALCULATE_TOTAL[Calculate Total plus Delivery Fee]
    
    CALCULATE_TOTAL --> PAYMENT_METHOD[Choose Payment Method]
    PAYMENT_METHOD --> CREATE_ORDER[Create Order in Database]
    CREATE_ORDER --> RAZORPAY_ORDER[Create Razorpay Order]
    RAZORPAY_ORDER --> PAYMENT_UI[Show Payment Interface]
    
    PAYMENT_UI --> PAYMENT_PROCESS{Payment Successful?}
    PAYMENT_PROCESS -->|No| PAYMENT_FAILED[Payment Failed]
    PAYMENT_PROCESS -->|Yes| VERIFY_PAYMENT[Verify Payment with Razorpay]
    
    PAYMENT_FAILED --> RETRY_PAYMENT{Retry Payment?}
    RETRY_PAYMENT -->|Yes| PAYMENT_UI
    RETRY_PAYMENT -->|No| CANCEL_ORDER[Cancel Order]
    
    VERIFY_PAYMENT --> UPDATE_ORDER_STATUS[Update Order Status to Paid]
    UPDATE_ORDER_STATUS --> NOTIFY_COOK[Send Real-time Notification to Cook]
    NOTIFY_COOK --> ORDER_CONFIRMATION[Show Order Confirmation]
    ORDER_CONFIRMATION --> TRACK_ORDER[Track Order Status]
    
    TRACK_ORDER --> ORDER_STATUS_CHECK{Check Order Status}
    ORDER_STATUS_CHECK --> PENDING[Pending - Waiting for Cook]
    ORDER_STATUS_CHECK --> ACCEPTED[Accepted - Cook Confirmed]
    ORDER_STATUS_CHECK --> PREPARING[Preparing - Cooking in Progress]
    ORDER_STATUS_CHECK --> READY[Ready - Pickup or Delivery]
    ORDER_STATUS_CHECK --> DELIVERED[Delivered - Order Complete]
    
    DELIVERED --> RATE_COOK{Rate Cook?}
    RATE_COOK -->|Yes| SUBMIT_RATING[Submit Rating and Review]
    RATE_COOK -->|No| ORDER_HISTORY[View Order History]
    SUBMIT_RATING --> ORDER_HISTORY
    
    ORDER_HISTORY --> REORDER{Reorder Same Items?}
    REORDER -->|Yes| ADD_TO_CART
    REORDER -->|No| PROFILE_MANAGE[Manage Profile]
    
    PROFILE_MANAGE --> UPDATE_INFO[Update Personal Info]
    UPDATE_INFO --> CHANGE_PASSWORD[Change Password]
    CHANGE_PASSWORD --> MANAGE_ADDRESSES[Manage Delivery Addresses]
    MANAGE_ADDRESSES --> VIEW_PAST_ORDERS[View Past Orders]
    VIEW_PAST_ORDERS --> LOGOUT[Logout]
    
    NO_ITEMS --> BROWSE
    OUT_OF_ZONE --> BROWSE
    CANCEL_ORDER --> BROWSE
    LOGOUT --> START
```

### Cook Complete Flow
```mermaid
flowchart TD
    COOK_START([Cook Visits Platform]) --> COOK_LOGIN_CHECK{Is Cook Logged In?}
    
    COOK_LOGIN_CHECK -->|No| COOK_REGISTER[Cook Registration]
    COOK_LOGIN_CHECK -->|Yes| COOK_VERIFIED{Is Cook Verified?}
    
    COOK_REGISTER --> BASIC_INFO[Enter Basic Information]
    BASIC_INFO --> BUSINESS_DETAILS[Add Business Details]
    BUSINESS_DETAILS --> CUISINE_TYPE[Select Cuisine Specialization]
    CUISINE_TYPE --> LOCATION_SETUP[Set Location & Delivery Areas]
    LOCATION_SETUP --> UPLOAD_DOCS[Upload Verification Documents]
    
    UPLOAD_DOCS --> AADHAAR_UPLOAD[Upload Aadhaar Card]
    AADHAAR_UPLOAD --> PAN_UPLOAD[Upload PAN Card]
    PAN_UPLOAD --> FOOD_CERT[Upload Food Safety Certificate]
    FOOD_CERT --> PROFILE_PHOTO[Upload Profile Photo]
    PROFILE_PHOTO --> BANK_DETAILS[Add Bank Account Details]
    
    BANK_DETAILS --> ACCOUNT_HOLDER[Account Holder Name]
    ACCOUNT_HOLDER --> ACCOUNT_NUMBER[Account Number]
    ACCOUNT_NUMBER --> IFSC_CODE[IFSC Code]
    IFSC_CODE --> BANK_NAME[Bank Name]
    BANK_NAME --> SUBMIT_APPLICATION[Submit for Verification]
    
    SUBMIT_APPLICATION --> PENDING_VERIFICATION[Pending Admin Verification]
    PENDING_VERIFICATION --> WAIT_APPROVAL[Wait for Approval]
    WAIT_APPROVAL --> COOK_VERIFIED
    
    COOK_VERIFIED -->|No| VERIFICATION_STATUS[Check Verification Status]
    COOK_VERIFIED -->|Yes| COOK_DASHBOARD[Access Cook Dashboard]
    
    VERIFICATION_STATUS --> DOCS_REJECTED{Documents Rejected?}
    DOCS_REJECTED -->|Yes| RESUBMIT_DOCS[Resubmit Documents]
    DOCS_REJECTED -->|No| WAIT_APPROVAL
    RESUBMIT_DOCS --> UPLOAD_DOCS
    
    COOK_DASHBOARD --> DASHBOARD_OPTIONS{Choose Action}
    DASHBOARD_OPTIONS --> MENU_MANAGEMENT[Manage Menu]
    DASHBOARD_OPTIONS --> ORDER_MANAGEMENT[Manage Orders]
    DASHBOARD_OPTIONS --> ANALYTICS_VIEW[View Analytics]
    DASHBOARD_OPTIONS --> PROFILE_SETTINGS[Profile Settings]
    DASHBOARD_OPTIONS --> PAYMENT_HISTORY[Payment History]
    
    MENU_MANAGEMENT --> MENU_EXISTS{Menu Items Exist?}
    MENU_EXISTS -->|No| CREATE_FIRST_ITEM[Create First Menu Item]
    MENU_EXISTS -->|Yes| MENU_ACTIONS{Menu Action}
    
    CREATE_FIRST_ITEM --> ITEM_NAME[Enter Item Name]
    MENU_ACTIONS --> ADD_NEW_ITEM[Add New Item]
    MENU_ACTIONS --> EDIT_EXISTING[Edit Existing Item]
    MENU_ACTIONS --> DELETE_ITEM[Delete Item]
    MENU_ACTIONS --> TOGGLE_AVAILABILITY[Toggle Availability]
    
    ADD_NEW_ITEM --> ITEM_NAME
    ITEM_NAME --> ITEM_DESCRIPTION[Add Description]
    ITEM_DESCRIPTION --> ITEM_PRICE[Set Price]
    ITEM_PRICE --> PREP_TIME[Set Preparation Time]
    PREP_TIME --> UPLOAD_IMAGE[Upload Item Image]
    UPLOAD_IMAGE --> NUTRITIONAL_INFO[Add Nutritional Info Optional]
    NUTRITIONAL_INFO --> SAVE_ITEM[Save Menu Item]
    SAVE_ITEM --> MENU_MANAGEMENT
    
    EDIT_EXISTING --> UPDATE_DETAILS[Update Item Details]
    UPDATE_DETAILS --> SAVE_CHANGES[Save Changes]
    SAVE_CHANGES --> MENU_MANAGEMENT
    
    DELETE_ITEM --> CONFIRM_DELETE{Confirm Deletion?}
    CONFIRM_DELETE -->|Yes| REMOVE_ITEM[Remove from Menu]
    CONFIRM_DELETE -->|No| MENU_MANAGEMENT
    REMOVE_ITEM --> MENU_MANAGEMENT
    
    TOGGLE_AVAILABILITY --> UPDATE_STATUS[Update Available Status]
    UPDATE_STATUS --> MENU_MANAGEMENT
    
    ORDER_MANAGEMENT --> NEW_ORDERS{New Orders Available?}
    NEW_ORDERS -->|No| NO_NEW_ORDERS[No New Orders]
    NEW_ORDERS -->|Yes| ORDER_NOTIFICATION[Real-time Order Notification]
    
    ORDER_NOTIFICATION --> VIEW_ORDER_DETAILS[View Order Details]
    VIEW_ORDER_DETAILS --> ORDER_DECISION{Accept Order?}
    
    ORDER_DECISION -->|No| REJECT_ORDER[Reject Order]
    ORDER_DECISION -->|Yes| ACCEPT_ORDER[Accept Order]
    
    REJECT_ORDER --> REJECTION_REASON[Provide Rejection Reason]
    REJECTION_REASON --> NOTIFY_CUSTOMER[Notify Customer]
    NOTIFY_CUSTOMER --> ORDER_MANAGEMENT
    
    ACCEPT_ORDER --> UPDATE_STATUS_ACCEPTED[Update Status to Accepted]
    UPDATE_STATUS_ACCEPTED --> START_PREPARATION[Start Food Preparation]
    START_PREPARATION --> UPDATE_PREPARING[Update Status to Preparing]
    UPDATE_PREPARING --> COOKING_PROCESS[Cooking in Progress]
    
    COOKING_PROCESS --> FOOD_READY{Food Ready?}
    FOOD_READY -->|No| CONTINUE_COOKING[Continue Cooking]
    FOOD_READY -->|Yes| UPDATE_READY[Update Status to Ready]
    CONTINUE_COOKING --> COOKING_PROCESS
    
    UPDATE_READY --> DELIVERY_METHOD{Delivery Method}
    DELIVERY_METHOD --> PICKUP[Customer Pickup]
    DELIVERY_METHOD --> DELIVERY[Home Delivery]
    
    PICKUP --> CUSTOMER_ARRIVED{Customer Arrived?}
    CUSTOMER_ARRIVED -->|No| WAIT_PICKUP[Wait for Customer]
    CUSTOMER_ARRIVED -->|Yes| HAND_OVER[Hand Over Order]
    WAIT_PICKUP --> CUSTOMER_ARRIVED
    
    DELIVERY --> DELIVERY_PERSON[Assign Delivery Person]
    DELIVERY_PERSON --> OUT_FOR_DELIVERY[Out for Delivery]
    OUT_FOR_DELIVERY --> DELIVERED_STATUS[Mark as Delivered]
    
    HAND_OVER --> DELIVERED_STATUS
    DELIVERED_STATUS --> PAYMENT_PROCESSING[Process Cook Payment]
    PAYMENT_PROCESSING --> ORDER_COMPLETE[Order Complete]
    ORDER_COMPLETE --> ORDER_MANAGEMENT
    
    ANALYTICS_VIEW --> EARNINGS_CHART[View Earnings Chart]
    EARNINGS_CHART --> ORDER_STATS[Order Statistics]
    ORDER_STATS --> POPULAR_ITEMS[Popular Items Analysis]
    POPULAR_ITEMS --> CUSTOMER_FEEDBACK[Customer Feedback Summary]
    CUSTOMER_FEEDBACK --> PERFORMANCE_METRICS[Performance Metrics]
    PERFORMANCE_METRICS --> COOK_DASHBOARD
    
    PROFILE_SETTINGS --> UPDATE_PROFILE[Update Cook Profile]
    UPDATE_PROFILE --> CHANGE_CUISINE[Change Cuisine Type]
    CHANGE_CUISINE --> UPDATE_LOCATION[Update Location]
    UPDATE_LOCATION --> DELIVERY_AREAS[Update Delivery Areas]
    DELIVERY_AREAS --> BUSINESS_HOURS[Set Business Hours]
    BUSINESS_HOURS --> AVAILABILITY_CALENDAR[Set Availability Calendar]
    AVAILABILITY_CALENDAR --> COOK_DASHBOARD
    
    PAYMENT_HISTORY --> VIEW_PAYMENTS[View Payment History]
    VIEW_PAYMENTS --> PENDING_PAYMENTS[Check Pending Payments]
    PENDING_PAYMENTS --> COMPLETED_PAYMENTS[View Completed Payments]
    COMPLETED_PAYMENTS --> PAYMENT_DETAILS[Payment Details]
    PAYMENT_DETAILS --> COOK_DASHBOARD
    
    NO_NEW_ORDERS --> REFRESH_ORDERS[Refresh Order List]
    REFRESH_ORDERS --> ORDER_MANAGEMENT
```

### Admin Complete Flow
```mermaid
flowchart TD
    ADMIN_START([Admin Accesses Platform]) --> ADMIN_AUTH{Admin Authenticated?}
    
    ADMIN_AUTH -->|No| ADMIN_LOGIN[Admin Login]
    ADMIN_AUTH -->|Yes| ADMIN_ROLE_CHECK{Valid Admin Role?}
    
    ADMIN_LOGIN --> ADMIN_KEY[Enter Admin Key]
    ADMIN_KEY --> KEY_VALIDATION{Valid Admin Key?}
    KEY_VALIDATION -->|No| INVALID_KEY[Invalid Key Message]
    KEY_VALIDATION -->|Yes| CREATE_ADMIN[Create Admin Account]
    CREATE_ADMIN --> ADMIN_ROLE_CHECK
    
    ADMIN_ROLE_CHECK -->|No| UNAUTHORIZED[Unauthorized Access]
    ADMIN_ROLE_CHECK -->|Yes| ADMIN_DASHBOARD[Admin Dashboard]
    
    ADMIN_DASHBOARD --> ADMIN_ACTIONS{Choose Admin Action}
    ADMIN_ACTIONS --> USER_MANAGEMENT[User Management]
    ADMIN_ACTIONS --> COOK_MANAGEMENT[Cook Management]
    ADMIN_ACTIONS --> ORDER_OVERSIGHT[Order Oversight]
    ADMIN_ACTIONS --> PAYMENT_MANAGEMENT[Payment Management]
    ADMIN_ACTIONS --> SYSTEM_ANALYTICS[System Analytics]
    ADMIN_ACTIONS --> PLATFORM_SETTINGS[Platform Settings]
    
    USER_MANAGEMENT --> VIEW_ALL_USERS[View All Users]
    VIEW_ALL_USERS --> USER_FILTERS[Apply User Filters]
    USER_FILTERS --> FILTER_BY_ROLE[Filter by Role Student or Cook]
    FILTER_BY_ROLE --> FILTER_BY_STATUS[Filter by Status Active or Inactive]
    FILTER_BY_STATUS --> FILTER_BY_DATE[Filter by Registration Date]
    FILTER_BY_DATE --> USER_LIST[Display User List]
    
    USER_LIST --> SELECT_USER[Select Specific User]
    SELECT_USER --> USER_DETAILS[View User Details]
    USER_DETAILS --> USER_ACTIONS{User Action}
    
    USER_ACTIONS --> VIEW_USER_PROFILE[View Full Profile]
    USER_ACTIONS --> EDIT_USER[Edit User Details]
    USER_ACTIONS --> DEACTIVATE_USER[Deactivate User]
    USER_ACTIONS --> DELETE_USER[Delete User Account]
    USER_ACTIONS --> RESET_PASSWORD[Reset User Password]
    USER_ACTIONS --> VIEW_USER_ORDERS[View User Orders]
    
    EDIT_USER --> UPDATE_USER_INFO[Update User Information]
    UPDATE_USER_INFO --> SAVE_USER_CHANGES[Save Changes]
    SAVE_USER_CHANGES --> USER_MANAGEMENT
    
    DEACTIVATE_USER --> DEACTIVATION_REASON[Provide Deactivation Reason]
    DEACTIVATION_REASON --> CONFIRM_DEACTIVATION{Confirm Deactivation?}
    CONFIRM_DEACTIVATION -->|Yes| DEACTIVATE_ACCOUNT[Deactivate Account]
    CONFIRM_DEACTIVATION -->|No| USER_MANAGEMENT
    DEACTIVATE_ACCOUNT --> NOTIFY_USER[Notify User of Deactivation]
    NOTIFY_USER --> USER_MANAGEMENT
    
    COOK_MANAGEMENT --> COOK_VERIFICATION_QUEUE[Cook Verification Queue]
    COOK_VERIFICATION_QUEUE --> PENDING_COOKS{Pending Verifications?}
    PENDING_COOKS -->|No| NO_PENDING[No Pending Verifications]
    PENDING_COOKS -->|Yes| REVIEW_COOK[Review Cook Application]
    
    REVIEW_COOK --> COOK_DOCUMENTS[Review Documents]
    COOK_DOCUMENTS --> AADHAAR_VERIFICATION[Verify Aadhaar Card]
    AADHAAR_VERIFICATION --> PAN_VERIFICATION[Verify PAN Card]
    PAN_VERIFICATION --> FOOD_CERT_VERIFICATION[Verify Food Safety Certificate]
    FOOD_CERT_VERIFICATION --> BANK_DETAILS_CHECK[Verify Bank Details]
    BANK_DETAILS_CHECK --> PROFILE_REVIEW[Review Cook Profile]
    
    PROFILE_REVIEW --> VERIFICATION_DECISION{Approve Cook?}
    VERIFICATION_DECISION -->|No| REJECT_COOK[Reject Cook Application]
    VERIFICATION_DECISION -->|Yes| APPROVE_COOK[Approve Cook]
    
    REJECT_COOK --> REJECTION_FEEDBACK[Provide Rejection Reasons]
    REJECTION_FEEDBACK --> NOTIFY_COOK_REJECTION[Notify Cook of Rejection]
    NOTIFY_COOK_REJECTION --> COOK_MANAGEMENT
    
    APPROVE_COOK --> SET_VERIFIED_STATUS[Set Cook as Verified]
    SET_VERIFIED_STATUS --> NOTIFY_COOK_APPROVAL[Notify Cook of Approval]
    NOTIFY_COOK_APPROVAL --> COOK_MANAGEMENT
    
    ORDER_OVERSIGHT --> ALL_ORDERS[View All Orders]
    ALL_ORDERS --> ORDER_FILTERS[Apply Order Filters]
    ORDER_FILTERS --> FILTER_BY_STATUS[Filter by Order Status]
    FILTER_BY_STATUS --> FILTER_BY_COOK[Filter by Cook]
    FILTER_BY_COOK --> FILTER_BY_CUSTOMER[Filter by Customer]
    FILTER_BY_CUSTOMER --> FILTER_BY_DATE_RANGE[Filter by Date Range]
    FILTER_BY_DATE_RANGE --> ORDER_LIST[Display Order List]
    
    ORDER_LIST --> SELECT_ORDER[Select Specific Order]
    SELECT_ORDER --> ORDER_DETAILS[View Order Details]
    ORDER_DETAILS --> ORDER_ADMIN_ACTIONS{Order Actions}
    
    ORDER_ADMIN_ACTIONS --> VIEW_FULL_ORDER[View Full Order Details]
    ORDER_ADMIN_ACTIONS --> CANCEL_ORDER[Cancel Order]
    ORDER_ADMIN_ACTIONS --> REFUND_ORDER[Process Refund]
    ORDER_ADMIN_ACTIONS --> CONTACT_PARTIES[Contact Cook/Customer]
    ORDER_ADMIN_ACTIONS --> ORDER_DISPUTE[Handle Order Dispute]
    
    CANCEL_ORDER --> CANCELLATION_REASON[Provide Cancellation Reason]
    CANCELLATION_REASON --> NOTIFY_PARTIES[Notify Cook and Customer]
    NOTIFY_PARTIES --> PROCESS_REFUND_AUTO[Auto Process Refund]
    PROCESS_REFUND_AUTO --> ORDER_OVERSIGHT
    
    PAYMENT_MANAGEMENT --> PAYMENT_OVERVIEW[Payment Overview]
    PAYMENT_OVERVIEW --> FAILED_PAYMENTS[View Failed Payments]
    FAILED_PAYMENTS --> PENDING_REFUNDS[View Pending Refunds]
    PENDING_REFUNDS --> COOK_PAYOUTS[View Cook Payouts]
    COOK_PAYOUTS --> TRANSACTION_LOGS[View Transaction Logs]
    
    TRANSACTION_LOGS --> PAYMENT_DISPUTES[Handle Payment Disputes]
    PAYMENT_DISPUTES --> MANUAL_REFUND[Process Manual Refund]
    MANUAL_REFUND --> REFUND_CONFIRMATION[Confirm Refund Processing]
    REFUND_CONFIRMATION --> PAYMENT_MANAGEMENT
    
    SYSTEM_ANALYTICS --> PLATFORM_STATS[Platform Statistics]
    PLATFORM_STATS --> USER_GROWTH[User Growth Analytics]
    USER_GROWTH --> ORDER_ANALYTICS[Order Analytics]
    ORDER_ANALYTICS --> REVENUE_ANALYTICS[Revenue Analytics]
    REVENUE_ANALYTICS --> COOK_PERFORMANCE[Cook Performance Metrics]
    COOK_PERFORMANCE --> POPULAR_CUISINES[Popular Cuisines Analysis]
    POPULAR_CUISINES --> GEOGRAPHIC_DATA[Geographic Data Analysis]
    GEOGRAPHIC_DATA --> GENERATE_REPORTS[Generate Business Reports]
    GENERATE_REPORTS --> ADMIN_DASHBOARD
    
    PLATFORM_SETTINGS --> SYSTEM_CONFIG[System Configuration]
    SYSTEM_CONFIG --> DELIVERY_FEES[Configure Delivery Fees]
    DELIVERY_FEES --> COMMISSION_RATES[Set Commission Rates]
    COMMISSION_RATES --> PLATFORM_POLICIES[Update Platform Policies]
    PLATFORM_POLICIES --> EMAIL_TEMPLATES[Manage Email Templates]
    EMAIL_TEMPLATES --> NOTIFICATION_SETTINGS[Notification Settings]
    NOTIFICATION_SETTINGS --> ADMIN_USERS[Manage Admin Users]
    ADMIN_USERS --> ADMIN_DASHBOARD
    
    NO_PENDING --> COOK_MANAGEMENT
    INVALID_KEY --> ADMIN_START
    UNAUTHORIZED --> ADMIN_START
```

## 🔄 Advanced Data Flow Architecture

### Order Processing Data Flow
```mermaid
sequenceDiagram
    participant S as Student App
    participant F as Frontend State
    participant M as Middleware
    participant A as API Routes
    participant DB as Database
    participant R as Razorpay
    participant C as Cook App
    participant N as Notification Service
    
    S->>F: Browse Cooks & Menu
    F->>A: Fetch Available Cooks
    A->>DB: Query cooks WITH location filter
    DB-->>A: Return cook list + menu items
    A-->>F: Cook data + availability
    F-->>S: Display cook options
    
    S->>F: Add items to cart
    F->>F: Update cart state (local)
    
    S->>F: Proceed to checkout
    F->>A: Create order (POST /api/orders)
    A->>DB: Insert order + order_items
    A->>A: Calculate total + fees
    A->>R: Create payment order
    R-->>A: Payment order ID
    A-->>F: Order created + payment details
    
    F->>R: Initialize Razorpay checkout
    S->>R: Complete payment
    R->>A: Payment webhook (POST /api/razorpay/verify)
    A->>DB: Update order status = paid
    A->>DB: Insert payment record
    
    A->>N: Trigger cook notification
    N->>C: Real-time order notification
    A-->>F: Payment success confirmation
    F-->>S: Order confirmation page
    
    C->>A: Accept order (PATCH /api/cook/orders)
    A->>DB: Update order status = accepted
    A->>N: Notify student of acceptance
    N->>S: Real-time status update
    
    loop Order Status Updates
        C->>A: Update status (preparing → ready → delivered)
        A->>DB: Update order status
        A->>N: Broadcast status change
        N->>S: Real-time update to student
    end
    
    S->>A: Submit rating (POST /api/ratings)
    A->>DB: Insert cook_rating
    A->>DB: Trigger: Update cook average rating
```

### Authentication & Authorization Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant M as Middleware
    participant S as Supabase Auth
    participant DB as Database
    participant P as Protected Route
    
    U->>F: Login/Register Request
    F->>S: Auth request with credentials
    S->>DB: Validate user + fetch profile
    DB-->>S: User data + role information
    S-->>F: JWT token + session
    F->>F: Store auth state in context
    
    U->>F: Access protected route
    F->>M: Route request with token
    M->>S: Verify JWT token
    S-->>M: Token valid + user context
    M->>DB: Check user role & permissions
    DB-->>M: Role verification
    
    alt User has access
        M-->>P: Grant access + user context
        P-->>F: Render protected content
    else User lacks access
        M-->>F: Redirect to unauthorized
    end
    
    loop Token Refresh (background)
        F->>S: Refresh token request
        S-->>F: New JWT token
        F->>F: Update auth context
    end
```

### Real-time Data Synchronization
```mermaid
sequenceDiagram
    participant C as Cook Dashboard
    participant S as Student App
    participant RT as Realtime Service
    participant DB as Database
    participant T as Database Triggers
    
    Note over C,T: New Order Flow
    DB->>T: Order inserted
    T->>RT: Trigger realtime event
    RT->>C: Broadcast new order notification
    C->>C: Update order list UI
    
    Note over C,S: Order Status Update
    C->>DB: Update order status
    DB->>T: Status change trigger
    T->>RT: Broadcast status change
    RT->>S: Send status update
    S->>S: Update order tracking UI
    
    Note over C,DB: Menu Availability Update
    C->>DB: Update menu item availability
    DB->>T: Menu change trigger
    T->>RT: Broadcast menu update
    RT->>S: Update available items
    S->>S: Refresh menu display
    
    Note over S,C: Live Chat/Support
    S->>RT: Send chat message
    RT->>C: Deliver message
    C->>RT: Send response
    RT->>S: Deliver response
```

## 📊 Database Architecture Deep Dive

### Complete Entity Relationship Diagram
```mermaid
erDiagram
    users ||--o{ student_profiles : "has"
    users ||--o{ cooks : "registers_as"
    users ||--o{ admins : "elevated_to"
    users ||--o{ orders : "places"
    users ||--o{ cook_ratings : "submits"
    users ||--o{ payments : "makes"
    users ||--o{ subscriptions : "subscribes"
    
    cooks ||--|| cook_profiles : "has_profile"
    cooks ||--|| cook_bank_details : "has_banking"
    cooks ||--o{ dabba_menu : "creates"
    cooks ||--|| cook_orders : "tracks"
    cooks ||--o{ cook_payments : "receives"
    cooks ||--o{ cook_ratings : "receives"
    cooks ||--o{ orders : "fulfills"
    cooks ||--o{ subscriptions : "offers"
    
    orders ||--o{ order_items : "contains"
    orders ||--|| payments : "has_payment"
    
    dabba_menu ||--o{ order_items : "ordered_as"
    
    admin_keys ||--o{ users : "used_by"
    
    users {
        uuid id PK "Primary identifier"
        string email UK "Unique email address"
        string role "customer|cook|admin"
        string name "Full name"
        string phone "Contact number"
        timestamp created_at "Account creation"
        timestamp updated_at "Last modification"
        boolean email_verified "Email verification status"
        json metadata "Additional user data"
    }
    
    cooks {
        uuid id PK "Cook identifier"
        uuid user_id FK "Reference to users table"
        uuid auth_user_id FK "Supabase auth user"
        string name "Business/Cook name"
        string location "Operating location"
        text address "Full address"
        numeric rating "Average rating (0-5)"
        integer total_orders "Total orders fulfilled"
        boolean is_verified "Verification status"
        boolean is_active "Currently accepting orders"
        timestamp created_at "Registration date"
        json delivery_areas "Supported delivery zones"
    }
    
    cook_profiles {
        uuid cook_id PK "Reference to cooks"
        string cuisine_type "Specialization"
        text bio "Cook description"
        string food_certification "Safety certifications"
        string aadhaar UK "Government ID"
        string pan UK "Tax ID"
        boolean verification_status "Profile verified"
        json certifications "Additional certifications"
        string profile_image "Profile photo URL"
    }
    
    cook_bank_details {
        uuid cook_id PK "Reference to cooks"
        string account_holder_name "Bank account name"
        string account_number UK "Account number"
        string ifsc_code "Bank routing code"
        string bank_name "Bank institution"
        boolean verified "Bank verification status"
    }
    
    dabba_menu {
        uuid id PK "Menu item identifier"
        uuid cook_id FK "Reference to cooks"
        string name "Dish name"
        text description "Dish description"
        numeric price "Item price"
        boolean available "Currently available"
        integer prep_time "Preparation time (minutes)"
        string image_url "Dish photo"
        json nutritional_info "Nutrition data"
        timestamp created_at "Item added date"
        timestamp updated_at "Last modification"
    }
    
    orders {
        uuid id PK "Order identifier"
        uuid user_id FK "Customer reference"
        uuid cook_id FK "Cook reference"
        string status "pending|accepted|preparing|ready|delivered|cancelled"
        numeric total_amount "Total order value"
        numeric delivery_fee "Delivery charges"
        text delivery_address "Delivery location"
        text special_instructions "Customer notes"
        timestamp created_at "Order placement time"
        timestamp updated_at "Last status change"
        timestamp delivery_time "Expected delivery"
    }
    
    order_items {
        uuid id PK "Order item identifier"
        uuid order_id FK "Reference to orders"
        uuid menu_item_id FK "Reference to dabba_menu"
        uuid cook_id FK "Reference to cooks"
        integer quantity "Item quantity"
        numeric price "Item price at time of order"
        text customizations "Special requests"
    }
    
    payments {
        uuid id PK "Payment identifier"
        uuid student_id FK "Customer reference"
        uuid cook_id FK "Cook reference"
        uuid order_id FK "Order reference"
        numeric amount "Payment amount"
        string status "pending|completed|failed|refunded"
        string payment_method "razorpay|upi|card|wallet"
        string razorpay_order_id "Gateway order ID"
        string razorpay_payment_id "Gateway payment ID"
        timestamp created_at "Payment initiation"
        timestamp updated_at "Last status change"
    }
    
    cook_payments {
        uuid id PK "Cook payment identifier"
        uuid cook_id FK "Reference to cooks"
        uuid order_id FK "Reference to cook_orders"
        numeric amount "Payout amount"
        string status "pending|processing|completed|failed"
        timestamp created_at "Payout initiation"
        timestamp processed_at "Payout completion"
    }
    
    cook_ratings {
        uuid id PK "Rating identifier"
        uuid cook_id FK "Reference to cooks"
        uuid customer_id FK "Reference to users"
        uuid order_id FK "Reference to orders"
        numeric rating "Rating value (1-5)"
        text review "Written review"
        timestamp created_at "Review submission"
    }
    
    cook_orders {
        uuid id PK "Cook order tracking"
        uuid cook_id UK "Reference to cooks"
        integer total_orders "Lifetime order count"
        integer pending_orders "Current pending count"
        integer completed_orders "Successfully completed"
        numeric earnings "Total earnings"
        timestamp created_at "Record creation"
    }
    
    student_profiles {
        uuid student_id PK "Reference to users"
        string college "Educational institution"
        string course "Study program"
        integer year "Academic year"
        text dietary_preferences "Food preferences"
        json delivery_addresses "Saved addresses"
    }
    
    subscriptions {
        uuid id PK "Subscription identifier"
        uuid student_id FK "Customer reference"
        uuid cook_id FK "Cook reference"
        string plan_type "daily|weekly|monthly"
        string status "active|paused|cancelled"
        numeric price "Subscription cost"
        date start_date "Subscription start"
        date end_date "Subscription end"
        timestamp created_at "Subscription creation"
    }
    
    admin_keys {
        uuid id PK "Admin key identifier"
        string key UK "Unique admin key"
        boolean used "Key usage status"
        uuid used_by FK "Reference to users"
        timestamp created_at "Key generation"
        timestamp expires_at "Key expiration"
    }
    
    admins {
        uuid id PK "Reference to users"
        boolean is_active "Admin status"
        timestamp created_at "Admin privileges granted"
    }
```

## 🛡️ Security Architecture

### Authentication Security
- **JWT Tokens** with automatic refresh
- **Row Level Security (RLS)** on all database tables
- **Server-side session validation**
- **Protected API routes** with role verification

### Data Protection
- **Input validation** on all forms
- **SQL injection prevention** via Supabase
- **File upload restrictions** and validation
- **CORS configuration** for API security

### Payment Security
- **PCI DSS compliant** payment processing via Razorpay
- **Webhook signature verification**
- **Secure payment state management**
- **Transaction audit trails**

## 📈 Scalability Considerations

### Performance Optimizations
- **Next.js App Router** for optimal loading
- **Image optimization** with Next.js Image component
- **Database indexing** for fast queries
- **Caching strategies** for frequently accessed data

### Scalability Features
- **Serverless API routes** auto-scale with demand
- **Supabase backend** handles database scaling
- **CDN integration** for static assets
- **Real-time subscriptions** with connection pooling

## 🚀 Simple Deployment Architecture (Reality Check)

### Your Actual Current Setup
```mermaid
graph TB
    subgraph "Hosting"
        NETLIFY[Netlify<br/>Static Site Hosting]
        DOMAIN[Custom Domain<br/>campusdabba.com]
    end
    
    subgraph "Next.js App"
        BUILD[Next.js Build<br/>Static + Serverless]
        PAGES[Static Pages<br/>Pre-rendered]
        API[API Routes<br/>Netlify Functions]
    end
    
    subgraph "Supabase Cloud"
        DB[(PostgreSQL Database<br/>Managed by Supabase)]
        AUTH[Supabase Auth<br/>JWT Tokens]
        STORAGE[Supabase Storage<br/>File Uploads]
        REALTIME[Supabase Realtime<br/>WebSocket]
    end
    
    subgraph "External APIs"
        RAZORPAY[Razorpay<br/>Payment Gateway]
        MAPS[Google Maps<br/>Location Services]
    end
    
    NETLIFY --> BUILD
    BUILD --> PAGES
    BUILD --> API
    
    API --> DB
    API --> AUTH
    API --> STORAGE
    API --> REALTIME
    
    API --> RAZORPAY
    API --> MAPS
    
    DOMAIN --> NETLIFY
```

### Environment Configuration (What You Actually Have)
```yaml
Development:
  - npm run dev: Local development server
  - localhost:3000: Development URL
  - .env.local: Local environment variables

Production:
  - Netlify Build: Automatic deployment
  - netlify.toml: Build configuration
  - Environment Variables: Set in Netlify dashboard

Configuration Files:
  - next.config.mjs: Next.js settings
  - tailwind.config.ts: Tailwind configuration
  - tsconfig.json: TypeScript settings
  - components.json: ShadCN configuration
```

### Simple Security Model (No Over-Engineering)
```yaml
Authentication:
  - Supabase Auth: Handles everything
  - JWT Tokens: Automatic management
  - Row Level Security: Database-level protection

Data Protection:
  - RLS Policies: User can only see their data
  - Environment Variables: Secure API keys
  - HTTPS: Automatic via Netlify

Payment Security:
  - Razorpay: PCI compliant gateway
  - Webhook verification: Payment confirmation
  - Test mode: Safe development
```

### What You're Planning vs Reality
```yaml
CURRENT REALITY:
  ✅ Next.js 14 with App Router
  ✅ Supabase for backend
  ✅ Razorpay for payments
  ✅ Netlify for hosting
  ✅ Basic authentication
  ✅ File uploads
  ✅ Real-time updates

FUTURE PLANS (Not Built Yet):
  🔄 React Native mobile app
  🔄 AI chatbot integration
  🔄 Advanced analytics
  🔄 SMS notifications
  🔄 Advanced admin features
  🔄 Performance optimizations
  🔄 Load balancing
  🔄 Caching layers
```

## 📊 Actual Technology Stack (What You Really Use)

### Frontend Technology Stack
```yaml
Core Framework:
  - Next.js 14: React framework with App Router
  - React 18: UI library 
  - TypeScript: Type-safe development

Styling & UI:
  - Tailwind CSS: Utility-first CSS framework
  - ShadCN UI: Accessible component library
  - Radix UI: Primitive components (@radix-ui/*)
  - Lucide React: Icon library
  - Tailwind Animate: Animation utilities
  - Next Themes: Theme management

State Management:
  - React Context: Global state (auth, cart, theme)
  - React Hook Form: Form state management
  - React Hooks: Built-in state management

Charts & Visualization:
  - Recharts: Chart library for analytics
  - Embla Carousel: Carousel component

Form & Input:
  - React Hook Form: Form handling
  - Zod: Schema validation
  - Input OTP: OTP input component
  - React Day Picker: Date selection

Development Tools:
  - TypeScript: Type checking
  - PostCSS: CSS processing
  - Autoprefixer: CSS vendor prefixes
```

### Backend Technology Stack
```yaml
Backend Services:
  - Supabase: Complete backend platform
  - PostgreSQL: Database (via Supabase)
  - Supabase Auth: Authentication system
  - Supabase Storage: File storage
  - Supabase Realtime: Live updates

Payment Processing:
  - Razorpay: Payment gateway SDK
  - Webhook Verification: Payment confirmation

API Layer:
  - Next.js API Routes: Serverless functions
  - Next.js Middleware: Route protection

File Structure:
  - utils/supabase/: Client configurations
  - lib/supabase-admin.ts: Admin operations
  - types/: TypeScript definitions
```

### Infrastructure & Deployment (Current)
```yaml
Hosting:
  - Netlify: Frontend hosting (based on netlify.toml)
  - Supabase Cloud: Backend infrastructure

Configuration:
  - Environment Variables: Secure config
  - netlify.toml: Deployment configuration
  - next.config.mjs: Next.js configuration

Development:
  - Local Development: next dev
  - Build Process: next build
  - TypeScript: Compile-time checking
```

### What You DON'T Have (Yet)
```yaml
NOT IMPLEMENTED:
  - Redis: No caching layer
  - Microservices: Monolithic Next.js app
  - Kubernetes: Simple hosting setup
  - Docker: No containerization
  - CI/CD Pipeline: Basic deployment
  - Advanced Monitoring: Basic error tracking
  - Load Balancers: Single instance
  - Multiple Environments: Simple dev/prod
  - SMS Service: Email only
  - AI Chatbot: Not implemented yet
  - Mobile App: Web only
```

## 🔮 Future Enhancements

### Planned Features
- **React Native Mobile App** for enhanced mobile experience
- **Advanced AI Chatbot** with natural language processing
- **Analytics Dashboard** with business intelligence
- **Multi-language Support** for broader accessibility
- **Advanced Search & Filtering** with location-based recommendations

### Technical Improvements
- **Edge Functions** for geo-distributed processing
- **Advanced Caching** with Redis integration
- **Microservices Architecture** for complex business logic
- **GraphQL API** for more efficient data fetching
- **WebSocket Integration** for enhanced real-time features

---

This architecture supports a robust, scalable food delivery platform that can handle thousands of concurrent users while maintaining data security and providing an excellent user experience across all stakeholder roles.
