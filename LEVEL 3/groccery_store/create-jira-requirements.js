#!/usr/bin/env node

/**
 * Jira Requirements Creator for Fresh Grocery Store Project
 * Creates 40-50 requirements and stories in Jira using Cloud REST API v3
 */

const https = require('https');
const http = require('http');

// Configuration
const JIRA_DOMAIN = 'mueenakram4.atlassian.net';
const JIRA_EMAIL = 'mueenakram4@gmail.com';
const JIRA_API_TOKEN = 'ATATT3xFfGF05zQsH9mlA2YbX7RqXb9byqL9osZJxTQe7DAl2iHUfdv8cLGY8vpEk27I8mjbhrklowvp8RVy5Xo8iRT3WlIZhTYOF-ZIiJdfA0LAPHTS8T6bEaROoLnSKQGnhQFetD-oJZfEzWIYxte_aHOkFLZ9N7iH3b8NOoKfcqEI6XYG9X8=55D1584C';
const PROJECT_KEY = 'OGS'; // Online Grocery Store

// Comprehensive Requirements List (40+ items)
const requirements = [
  // ===== 1. USER AUTHENTICATION (7 items) =====
  {
    summary: 'User Registration with Email Validation',
    description: 'Allow users to register with email, password, name, phone, and address. Validate email format and ensure unique emails.',
    issueType: 'Story',
    labels: ['auth', 'user-management', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'User Authentication',
    acceptanceCriteria: [
      'User can enter valid email and password',
      'System validates email format',
      'Password must be at least 8 characters',
      'User receives confirmation email',
      'Duplicate email shows error'
    ]
  },
  {
    summary: 'User Login and JWT Token Generation',
    description: 'Implement secure login with JWT token generation and refresh token mechanism.',
    issueType: 'Story',
    labels: ['auth', 'security', 'backend'],
    storyPoints: 5,
    epic: 'User Authentication',
    acceptanceCriteria: [
      'User can login with email and password',
      'JWT token issued on successful login',
      'Token expires after 7 days',
      'Refresh token mechanism available',
      'Failed login shows appropriate error'
    ]
  },
  {
    summary: 'Password Reset and Recovery',
    description: 'Allow users to reset forgotten passwords via email verification link.',
    issueType: 'Story',
    labels: ['auth', 'email', 'security'],
    storyPoints: 5,
    epic: 'User Authentication',
    acceptanceCriteria: [
      'User can request password reset',
      'Reset link sent via email',
      'Link valid for 1 hour only',
      'User can set new password',
      'Old password invalidated'
    ]
  },
  {
    summary: 'Role-Based Access Control (RBAC)',
    description: 'Implement role-based authorization for Admin, Staff, Rider, and Customer roles.',
    issueType: 'Story',
    labels: ['auth', 'security', 'backend'],
    storyPoints: 8,
    epic: 'User Authentication',
    acceptanceCriteria: [
      'Four roles defined: Admin, Staff, Rider, Customer',
      'Protected routes check user role',
      'Unauthorized users receive 403 error',
      'Role-based middleware implemented',
      'Admin only endpoints secured'
    ]
  },
  {
    summary: 'Email Verification on Registration',
    description: 'Send verification email to confirm user account during registration.',
    issueType: 'Story',
    labels: ['auth', 'email', 'backend'],
    storyPoints: 5,
    epic: 'User Authentication',
    acceptanceCriteria: [
      'Verification email sent after registration',
      'Email contains verification link',
      'Link valid for 24 hours',
      'User must verify before full access',
      'Resend option available'
    ]
  },
  {
    summary: 'Social Login Integration (Optional)',
    description: 'Allow users to login via Google OAuth and Facebook.',
    issueType: 'Story',
    labels: ['auth', 'third-party', 'optional'],
    storyPoints: 8,
    epic: 'User Authentication',
    acceptanceCriteria: [
      'Google OAuth integration',
      'Facebook login integration',
      'Link social account to existing user',
      'First-time social login creates account',
      'User can disconnect social account'
    ]
  },
  {
    summary: 'Session Management and Logout',
    description: 'Implement secure session handling and logout functionality.',
    issueType: 'Story',
    labels: ['auth', 'backend', 'security'],
    storyPoints: 3,
    epic: 'User Authentication',
    acceptanceCriteria: [
      'User can logout',
      'Token invalidated on logout',
      'Session cleared from browser',
      'Cannot use expired token',
      'Multiple device session handling'
    ]
  },

  // ===== 2. PRODUCT MANAGEMENT (10 items) =====
  {
    summary: 'View All Products with Pagination',
    description: 'Display product catalog with pagination support (10, 20, 50 items per page).',
    issueType: 'Story',
    labels: ['products', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Products displayed with image, name, price',
      'Pagination controls visible',
      'Default 10 items per page',
      'User can change page size',
      'Total products count shown'
    ]
  },
  {
    summary: 'Search Products by Name and Keywords',
    description: 'Implement full-text search functionality for products.',
    issueType: 'Story',
    labels: ['products', 'search', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Real-time search as user types',
      'Search by product name',
      'Search by keywords and description',
      'Results filtered by relevance',
      'Clear search button available'
    ]
  },
  {
    summary: 'Filter Products by Category',
    description: 'Allow users to filter products by category (Dairy, Vegetables, Fruits, etc.).',
    issueType: 'Story',
    labels: ['products', 'filter', 'frontend'],
    storyPoints: 4,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Category list displayed on sidebar',
      'Multiple categories can be selected',
      'Products filtered based on selected categories',
      'Show product count per category',
      'Clear filters option available'
    ]
  },
  {
    summary: 'Filter Products by Price Range',
    description: 'Implement price range slider for filtering products.',
    issueType: 'Story',
    labels: ['products', 'filter', 'frontend'],
    storyPoints: 4,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Min and max price inputs available',
      'Drag slider to select price range',
      'Products filtered by price',
      'Show price range on slider',
      'Clear price filter button'
    ]
  },
  {
    summary: 'Sort Products by Various Criteria',
    description: 'Sort products by price (ASC/DESC), name, rating, newest.',
    issueType: 'Story',
    labels: ['products', 'sort', 'frontend'],
    storyPoints: 3,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Sort by price ascending',
      'Sort by price descending',
      'Sort by name A-Z',
      'Sort by rating high to low',
      'Sort by newest first'
    ]
  },
  {
    summary: 'Admin: Create New Product',
    description: 'Admin can add new product with details, images, and pricing.',
    issueType: 'Story',
    labels: ['admin', 'products', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Admin can upload product image',
      'Enter product name, description',
      'Set price, discount, category',
      'Set stock quantity',
      'Product created in database',
      'Success message shown'
    ]
  },
  {
    summary: 'Admin: Update Product Details',
    description: 'Admin can edit existing product information.',
    issueType: 'Story',
    labels: ['admin', 'products', 'frontend', 'backend'],
    storyPoints: 4,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Admin can edit product details',
      'Update images',
      'Modify pricing and discount',
      'Update stock quantity',
      'Changes saved to database'
    ]
  },
  {
    summary: 'Admin: Delete Product',
    description: 'Admin can remove products from catalog.',
    issueType: 'Story',
    labels: ['admin', 'products', 'backend'],
    storyPoints: 2,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Admin can delete product',
      'Confirmation dialog shown',
      'Product removed from catalog',
      'Related data cleaned up',
      'Success notification'
    ]
  },
  {
    summary: 'Product Categories Management',
    description: 'Admin can create, edit, and delete product categories.',
    issueType: 'Story',
    labels: ['admin', 'products', 'backend'],
    storyPoints: 4,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Admin can create new category',
      'Category name and icon/image',
      'Edit existing categories',
      'Delete unused categories',
      'Categories display on frontend'
    ]
  },
  {
    summary: 'Product Stock Management',
    description: 'Track product inventory and prevent overselling.',
    issueType: 'Story',
    labels: ['products', 'inventory', 'backend'],
    storyPoints: 5,
    epic: 'Product Management',
    acceptanceCriteria: [
      'Track stock for each product',
      'Cannot add out-of-stock to cart',
      'Stock reduced on order',
      'Low stock warning (< 5 units)',
      'Admin notified when out of stock'
    ]
  },

  // ===== 3. SHOPPING CART (6 items) =====
  {
    summary: 'Add Products to Shopping Cart',
    description: 'User can add products to cart with quantity selection.',
    issueType: 'Story',
    labels: ['cart', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Shopping Cart',
    acceptanceCriteria: [
      'User can select quantity',
      'Add to cart button works',
      'Product added to cart',
      'Cart count updated',
      'Success notification shown'
    ]
  },
  {
    summary: 'Update Cart Item Quantity',
    description: 'User can modify product quantity in cart.',
    issueType: 'Story',
    labels: ['cart', 'frontend', 'backend'],
    storyPoints: 3,
    epic: 'Shopping Cart',
    acceptanceCriteria: [
      'Quantity increase/decrease buttons',
      'Quantity input field',
      'Minimum quantity is 1',
      'Stock limit respected',
      'Cart total recalculated'
    ]
  },
  {
    summary: 'Remove Items from Cart',
    description: 'User can remove products from shopping cart.',
    issueType: 'Story',
    labels: ['cart', 'frontend'],
    storyPoints: 2,
    epic: 'Shopping Cart',
    acceptanceCriteria: [
      'Remove button visible on each item',
      'Confirmation shown',
      'Item removed from cart',
      'Cart total updated',
      'Undo option available'
    ]
  },
  {
    summary: 'View Cart Summary and Totals',
    description: 'Display cart items, subtotal, tax, and final total.',
    issueType: 'Story',
    labels: ['cart', 'frontend'],
    storyPoints: 3,
    epic: 'Shopping Cart',
    acceptanceCriteria: [
      'Cart items displayed with details',
      'Subtotal calculated',
      'Tax calculated (percentage based)',
      'Delivery charges added',
      'Final total shown'
    ]
  },
  {
    summary: 'Persist Cart Data in Local Storage',
    description: 'Cart data persists across browser sessions.',
    issueType: 'Story',
    labels: ['cart', 'frontend', 'storage'],
    storyPoints: 3,
    epic: 'Shopping Cart',
    acceptanceCriteria: [
      'Cart saved to localStorage',
      'Cart restored on page reload',
      'Synced with database on login',
      'Expired items removed',
      'Cart cleared on logout'
    ]
  },
  {
    summary: 'Apply Coupon and Discount Codes',
    description: 'User can apply coupon codes to reduce cart total.',
    issueType: 'Story',
    labels: ['cart', 'discounts', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Shopping Cart',
    acceptanceCriteria: [
      'Coupon code input field',
      'Validate coupon code',
      'Apply discount on total',
      'Show discount amount',
      'Remove coupon option'
    ]
  },

  // ===== 4. ORDER MANAGEMENT (10 items) =====
  {
    summary: 'Place Order from Cart',
    description: 'User can checkout and place order with delivery and payment details.',
    issueType: 'Story',
    labels: ['orders', 'checkout', 'frontend', 'backend'],
    storyPoints: 8,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Checkout page shows cart items',
      'Delivery address selection/entry',
      'Payment method selection',
      'Order summary shown',
      'Confirm order button',
      'Order created in database'
    ]
  },
  {
    summary: 'View Order History',
    description: 'User can view all past orders with details and status.',
    issueType: 'Story',
    labels: ['orders', 'frontend'],
    storyPoints: 4,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Orders listed with order ID, date',
      'Order status displayed',
      'Total amount shown',
      'Pagination for multiple orders',
      'Search/filter orders'
    ]
  },
  {
    summary: 'Track Order Status in Real-time',
    description: 'User receives real-time updates on order status.',
    issueType: 'Story',
    labels: ['orders', 'realtime', 'frontend', 'backend'],
    storyPoints: 6,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Order status shows: Placed, Processing, Ready, Shipped, Delivered',
      'Real-time status updates via Socket.IO',
      'Estimated delivery time shown',
      'Notification on status change',
      'Delivery person location map'
    ]
  },
  {
    summary: 'Order Details and Invoice',
    description: 'Display complete order information and generate downloadable invoice.',
    issueType: 'Story',
    labels: ['orders', 'frontend'],
    storyPoints: 4,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Full order details displayed',
      'Items listed with prices',
      'Delivery address shown',
      'Invoice can be downloaded as PDF',
      'Print invoice option'
    ]
  },
  {
    summary: 'Cancel Order',
    description: 'User can cancel order before it ships (with refund).',
    issueType: 'Story',
    labels: ['orders', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Cancel button visible for eligible orders',
      'Cancellation reason input',
      'Refund initiated automatically',
      'Order status changed to Cancelled',
      'Confirmation sent to user'
    ]
  },
  {
    summary: 'Admin: View All Orders',
    description: 'Admin can view and manage all customer orders.',
    issueType: 'Story',
    labels: ['admin', 'orders', 'frontend'],
    storyPoints: 5,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Orders displayed in table format',
      'Filter by status, date, customer',
      'Search by order ID',
      'Sort by date, amount',
      'Pagination for large datasets'
    ]
  },
  {
    summary: 'Admin: Update Order Status',
    description: 'Admin can manually update order status.',
    issueType: 'Story',
    labels: ['admin', 'orders', 'frontend', 'backend'],
    storyPoints: 3,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Admin can select new status',
      'Status changed in database',
      'User notified of change',
      'Timestamp recorded',
      'Change log maintained'
    ]
  },
  {
    summary: 'Assign Order to Staff/Rider',
    description: 'Admin assigns order to staff for processing and rider for delivery.',
    issueType: 'Story',
    labels: ['admin', 'orders', 'staff', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Available staff list shown',
      'Assign to staff for processing',
      'Assign to rider for delivery',
      'Staff/Rider notified',
      'Assignment recorded'
    ]
  },
  {
    summary: 'Refund and Return Management',
    description: 'Process refunds for cancelled orders and handle returns.',
    issueType: 'Story',
    labels: ['orders', 'payments', 'backend'],
    storyPoints: 6,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Refund calculation based on cancellation',
      'Refund initiated to original payment method',
      'Return reason tracking',
      'Refund status shown to user',
      'Refund report for admin'
    ]
  },
  {
    summary: 'Order Notifications and Emails',
    description: 'Send automated emails for order updates.',
    issueType: 'Story',
    labels: ['orders', 'email', 'backend'],
    storyPoints: 4,
    epic: 'Order Management',
    acceptanceCriteria: [
      'Order confirmation email',
      'Status update emails',
      'Delivery notification email',
      'Invoice attached to email',
      'Email templates customizable'
    ]
  },

  // ===== 5. USER PROFILE (5 items) =====
  {
    summary: 'View and Edit User Profile',
    description: 'User can view and update their profile information.',
    issueType: 'Story',
    labels: ['user-profile', 'frontend', 'backend'],
    storyPoints: 4,
    epic: 'User Profile',
    acceptanceCriteria: [
      'Profile page shows user details',
      'Edit buttons for each field',
      'Update name, phone, address',
      'Changes saved to database',
      'Success confirmation'
    ]
  },
  {
    summary: 'Profile Picture/Avatar Upload',
    description: 'User can upload and change profile picture.',
    issueType: 'Story',
    labels: ['user-profile', 'frontend', 'backend', 'file-upload'],
    storyPoints: 4,
    epic: 'User Profile',
    acceptanceCriteria: [
      'File upload input',
      'Image preview before upload',
      'Upload via Cloudinary or local',
      'Image cropped/resized',
      'Old image replaced'
    ]
  },
  {
    summary: 'Manage Saved Addresses',
    description: 'User can save multiple delivery addresses.',
    issueType: 'Story',
    labels: ['user-profile', 'frontend', 'backend'],
    storyPoints: 4,
    epic: 'User Profile',
    acceptanceCriteria: [
      'List of saved addresses',
      'Add new address',
      'Edit existing address',
      'Delete address',
      'Set default address'
    ]
  },
  {
    summary: 'Change Password',
    description: 'User can change their account password.',
    issueType: 'Story',
    labels: ['user-profile', 'security', 'frontend', 'backend'],
    storyPoints: 3,
    epic: 'User Profile',
    acceptanceCriteria: [
      'Current password verification',
      'New password requirements shown',
      'Confirm new password field',
      'Password updated securely',
      'User logged out after change'
    ]
  },
  {
    summary: 'User Preferences and Notification Settings',
    description: 'User can customize notification preferences.',
    issueType: 'Story',
    labels: ['user-profile', 'notifications', 'frontend', 'backend'],
    storyPoints: 3,
    epic: 'User Profile',
    acceptanceCriteria: [
      'Email notification toggle',
      'SMS notification toggle',
      'Order update notifications',
      'Promotional emails toggle',
      'Settings saved'
    ]
  },

  // ===== 6. ADMIN FEATURES (8 items) =====
  {
    summary: 'Admin Dashboard with Key Metrics',
    description: 'Admin dashboard showing sales, orders, customers, and revenue metrics.',
    issueType: 'Story',
    labels: ['admin', 'dashboard', 'frontend', 'backend'],
    storyPoints: 8,
    epic: 'Admin Features',
    acceptanceCriteria: [
      'Total sales chart',
      'Total orders count',
      'Revenue this month',
      'New customers count',
      'Top selling products',
      'Charts use Chart.js',
      'Real-time data updates'
    ]
  },
  {
    summary: 'Admin: Manage Customers',
    description: 'Admin can view, search, and manage customer accounts.',
    issueType: 'Story',
    labels: ['admin', 'customers', 'frontend'],
    storyPoints: 5,
    epic: 'Admin Features',
    acceptanceCriteria: [
      'Customer list with details',
      'Search by name, email, phone',
      'Filter by registration date',
      'View customer orders',
      'Block/Unblock customers',
      'Edit customer details'
    ]
  },
  {
    summary: 'Admin: View Reports and Analytics',
    description: 'Generate sales, inventory, and customer reports.',
    issueType: 'Story',
    labels: ['admin', 'reports', 'analytics', 'frontend', 'backend'],
    storyPoints: 6,
    epic: 'Admin Features',
    acceptanceCriteria: [
      'Sales report by date range',
      'Inventory report',
      'Customer acquisition report',
      'Export reports to CSV/PDF',
      'Filter by category, period',
      'Charts and visualizations'
    ]
  },
  {
    summary: 'Admin: Manage Staff and Riders',
    description: 'Admin can add, edit, and manage staff and delivery riders.',
    issueType: 'Story',
    labels: ['admin', 'staff', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Admin Features',
    acceptanceCriteria: [
      'Staff list with details',
      'Add new staff member',
      'Edit staff information',
      'Deactivate staff',
      'Assign roles (Processing/Delivery)',
      'Set commission rates'
    ]
  },
  {
    summary: 'Admin: Manage System Settings',
    description: 'Admin can configure system settings like tax, delivery charges.',
    issueType: 'Story',
    labels: ['admin', 'settings', 'frontend', 'backend'],
    storyPoints: 4,
    epic: 'Admin Features',
    acceptanceCriteria: [
      'Tax rate configuration',
      'Delivery charge settings',
      'Minimum order amount',
      'Operating hours',
      'Email settings',
      'Payment gateway settings'
    ]
  },
  {
    summary: 'Admin: Manage Coupons and Promotions',
    description: 'Create and manage discount coupons and promotional offers.',
    issueType: 'Story',
    labels: ['admin', 'promotions', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Admin Features',
    acceptanceCriteria: [
      'Create coupon code',
      'Set discount amount/percentage',
      'Set validity period',
      'Set minimum order amount',
      'Set usage limit',
      'View coupon usage report'
    ]
  },
  {
    summary: 'Admin: Audit Log and Activity Tracking',
    description: 'Track admin and staff activities for audit purposes.',
    issueType: 'Story',
    labels: ['admin', 'audit', 'security', 'backend'],
    storyPoints: 4,
    epic: 'Admin Features',
    acceptanceCriteria: [
      'Log all admin actions',
      'Track user changes',
      'Record timestamp and user',
      'Audit log searchable',
      'Export audit logs',
      ' 6-month retention policy'
    ]
  },
  {
    summary: 'Admin: Email and SMS Templates',
    description: 'Customize email and SMS templates for notifications.',
    issueType: 'Story',
    labels: ['admin', 'email', 'frontend', 'backend'],
    storyPoints: 4,
    epic: 'Admin Features',
    acceptanceCriteria: [
      'Email template editor',
      'SMS template editor',
      'Template variables support',
      'Preview functionality',
      'Save and reuse templates',
      'Test send option'
    ]
  },

  // ===== 7. STAFF/RIDER FEATURES (5 items) =====
  {
    summary: 'Staff Dashboard and Order Assignment',
    description: 'Staff can view assigned orders and update processing status.',
    issueType: 'Story',
    labels: ['staff', 'dashboard', 'frontend'],
    storyPoints: 5,
    epic: 'Staff Features',
    acceptanceCriteria: [
      'Assigned orders list',
      'Order details view',
      'Update order status',
      'Add order notes',
      'Complete order button',
      'Performance metrics'
    ]
  },
  {
    summary: 'Rider Delivery Management',
    description: 'Riders can view assigned deliveries and update delivery status.',
    issueType: 'Story',
    labels: ['rider', 'delivery', 'frontend', 'mobile'],
    storyPoints: 6,
    epic: 'Staff Features',
    acceptanceCriteria: [
      'Delivery list with addresses',
      'Navigation to delivery location',
      'Mark delivery as complete',
      'Collect payment on delivery',
      'Capture delivery signature',
      'Generate delivery receipt'
    ]
  },
  {
    summary: 'Real-time Location Tracking for Delivery',
    description: 'Customer can track rider location in real-time on map.',
    issueType: 'Story',
    labels: ['delivery', 'realtime', 'frontend', 'backend', 'maps'],
    storyPoints: 8,
    epic: 'Staff Features',
    acceptanceCriteria: [
      'GPS location from rider device',
      'Map shows rider location',
      'Live location updates',
      'Estimated arrival time',
      'Rider contact button',
      'Route optimization'
    ]
  },
  {
    summary: 'Staff/Rider Messaging and Notifications',
    description: 'Staff and riders receive order and customer messages.',
    issueType: 'Story',
    labels: ['staff', 'rider', 'messaging', 'frontend'],
    storyPoints: 5,
    epic: 'Staff Features',
    acceptanceCriteria: [
      'Inbox for messages',
      'Customer message notifications',
      'Reply to customer',
      'Send delivery status',
      'Push notifications',
      'Message history'
    ]
  },
  {
    summary: 'Staff/Rider Performance and Analytics',
    description: 'Track staff and rider performance metrics.',
    issueType: 'Story',
    labels: ['staff', 'rider', 'analytics', 'frontend'],
    storyPoints: 4,
    epic: 'Staff Features',
    acceptanceCriteria: [
      'Orders processed count',
      'Delivery completed count',
      'Average rating',
      'Customer feedback',
      'Performance dashboard',
      'Incentive calculation'
    ]
  },

  // ===== 8. PAYMENT & DELIVERY (6 items) =====
  {
    summary: 'Payment Method Selection and Integration',
    description: 'Support multiple payment methods: Card, COD, Digital Wallets.',
    issueType: 'Story',
    labels: ['payments', 'frontend', 'backend'],
    storyPoints: 6,
    epic: 'Payment & Delivery',
    acceptanceCriteria: [
      'Credit/Debit card payment',
      'Cash on Delivery option',
      'Digital wallet support',
      'Save card for future use',
      'Payment gateway integration',
      'Secure payment processing'
    ]
  },
  {
    summary: 'Stripe Payment Processing',
    description: 'Integrate Stripe for secure online payments.',
    issueType: 'Story',
    labels: ['payments', 'stripe', 'backend', 'third-party'],
    storyPoints: 6,
    epic: 'Payment & Delivery',
    acceptanceCriteria: [
      'Stripe API integration',
      'Secure card processing',
      'Payment confirmation',
      'Webhook for payment status',
      'Refund processing',
      'PCI DSS compliance'
    ]
  },
  {
    summary: 'Payment History and Receipt',
    description: 'User can view payment history and download receipts.',
    issueType: 'Story',
    labels: ['payments', 'frontend'],
    storyPoints: 3,
    epic: 'Payment & Delivery',
    acceptanceCriteria: [
      'Payment history list',
      'Filter by date, status',
      'View payment details',
      'Download receipt',
      'Print receipt',
      'Email receipt'
    ]
  },
  {
    summary: 'Delivery Zone and Charge Calculation',
    description: 'Calculate delivery charges based on delivery zone/distance.',
    issueType: 'Story',
    labels: ['delivery', 'backend'],
    storyPoints: 5,
    epic: 'Payment & Delivery',
    acceptanceCriteria: [
      'Define delivery zones',
      'Zone-based delivery charges',
      'Distance-based calculation',
      'Free delivery threshold',
      'Display charges at checkout',
      'Admin zone management'
    ]
  },
  {
    summary: 'Delivery Address Validation',
    description: 'Validate delivery address and show if deliverable.',
    issueType: 'Story',
    labels: ['delivery', 'backend'],
    storyPoints: 4,
    epic: 'Payment & Delivery',
    acceptanceCriteria: [
      'Address format validation',
      'Check if address is serviceable',
      'Zip code validation',
      'Map location validation',
      'Clear error messages',
      'Suggest correct address'
    ]
  },
  {
    summary: 'Scheduled Delivery and Time Slots',
    description: 'Allow users to schedule delivery for specific time slots.',
    issueType: 'Story',
    labels: ['delivery', 'frontend', 'backend'],
    storyPoints: 5,
    epic: 'Payment & Delivery',
    acceptanceCriteria: [
      'Available time slots display',
      'Select preferred slot',
      'Next-day delivery option',
      'Slot availability management',
      'Reminder notification',
      'Reschedule option'
    ]
  },

  // ===== 9. MESSAGING & SUPPORT (4 items) =====
  {
    summary: 'Real-time Customer Support Chat',
    description: 'Customer can chat with support team in real-time.',
    issueType: 'Story',
    labels: ['messaging', 'support', 'frontend', 'backend', 'realtime'],
    storyPoints: 6,
    epic: 'Messaging & Support',
    acceptanceCriteria: [
      'Chat interface in web app',
      'Real-time message updates via Socket.IO',
      'Support agent assignment',
      'Chat history saved',
      'Offline message support',
      'Typing indicators',
      'File attachment support'
    ]
  },
  {
    summary: 'Contact Us and Support Form',
    description: 'Contact form for general inquiries and support.',
    issueType: 'Story',
    labels: ['support', 'frontend', 'backend'],
    storyPoints: 3,
    epic: 'Messaging & Support',
    acceptanceCriteria: [
      'Contact form with fields',
      'Subject and message input',
      'Email address capture',
      'Form submission validation',
      'Confirmation email sent',
      'Admin notification'
    ]
  },
  {
    summary: 'In-app Notifications and Bell Icon',
    description: 'Show in-app notifications for orders and messages.',
    issueType: 'Story',
    labels: ['notifications', 'frontend'],
    storyPoints: 4,
    epic: 'Messaging & Support',
    acceptanceCriteria: [
      'Notification bell on navbar',
      'Unread count display',
      'Notification dropdown list',
      'Mark as read',
      'Clear notifications',
      'Notification history'
    ]
  },
  {
    summary: 'Push Notifications Setup',
    description: 'Enable push notifications for mobile and web.',
    issueType: 'Story',
    labels: ['notifications', 'backend', 'mobile'],
    storyPoints: 5,
    epic: 'Messaging & Support',
    acceptanceCriteria: [
      'Service Worker setup',
      'Request permission from user',
      'Send order updates',
      'Send promotion notifications',
      'Click notification to navigate',
      'Batch notification handling'
    ]
  },

  // ===== 10. NON-FUNCTIONAL REQUIREMENTS (7 items) =====
  {
    summary: 'API Response Caching with Redis',
    description: 'Implement Redis caching for frequently accessed data.',
    issueType: 'Story',
    labels: ['nfr', 'performance', 'cache', 'backend'],
    storyPoints: 5,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'Redis integration',
      'Cache product list',
      'Cache category data',
      'Cache invalidation on updates',
      'Configurable TTL',
      'Monitoring and stats'
    ]
  },
  {
    summary: 'Database Query Optimization',
    description: 'Optimize MongoDB queries for performance.',
    issueType: 'Story',
    labels: ['nfr', 'performance', 'backend'],
    storyPoints: 5,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'Database indexing strategy',
      'Query optimization review',
      'N+1 query elimination',
      'Batch operations',
      'Connection pooling',
      'Query execution monitoring'
    ]
  },
  {
    summary: 'Security: Input Validation and Sanitization',
    description: 'Validate and sanitize all user inputs.',
    issueType: 'Story',
    labels: ['nfr', 'security', 'backend'],
    storyPoints: 5,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'Input validation middleware',
      'SQL injection prevention',
      'XSS prevention',
      'CSRF token implementation',
      'File upload validation',
      'Regular expression patterns'
    ]
  },
  {
    summary: 'Error Handling and Logging',
    description: 'Comprehensive error handling and centralized logging.',
    issueType: 'Story',
    labels: ['nfr', 'logging', 'backend'],
    storyPoints: 4,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'Global error handler',
      'Error logging to file/service',
      'Error tracking (Sentry)',
      'User-friendly error messages',
      'Error response codes',
      'Request/Response logging'
    ]
  },
  {
    summary: 'API Rate Limiting and DDoS Protection',
    description: 'Implement rate limiting to prevent abuse.',
    issueType: 'Story',
    labels: ['nfr', 'security', 'backend'],
    storyPoints: 4,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'Rate limit by IP',
      'Rate limit by user',
      'Configure limits per endpoint',
      'Return 429 when limit exceeded',
      'DDoS protection headers',
      'Whitelist trusted IPs'
    ]
  },
  {
    summary: 'Mobile Responsiveness and Performance',
    description: 'Ensure app works smoothly on mobile devices.',
    issueType: 'Story',
    labels: ['nfr', 'performance', 'frontend', 'mobile'],
    storyPoints: 5,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'Mobile-first design',
      'Touch-friendly buttons',
      'Image optimization',
      'Lazy loading implementation',
      'Performance < 3s load time',
      'LightHouse score > 80'
    ]
  },
  {
    summary: 'SSL/TLS and HTTPS Encryption',
    description: 'Secure all communications with HTTPS.',
    issueType: 'Story',
    labels: ['nfr', 'security', 'devops'],
    storyPoints: 3,
    epic: 'Non-Functional Requirements',
    acceptanceCriteria: [
      'SSL certificate installed',
      'Redirect HTTP to HTTPS',
      'HSTS header enabled',
      'No mixed content',
      'Certificate auto-renewal',
      'TLS 1.2+ only'
    ]
  }
];

// Helper function to make HTTP requests
function makeJiraRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

    const options = {
      hostname: JIRA_DOMAIN,
      path: path,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject(new Error(`Jira API Error (${res.statusCode}): ${JSON.stringify(response)}`));
          } else {
            resolve(response);
          }
        } catch (e) {
          if (res.statusCode >= 400) {
            reject(new Error(`Jira API Error (${res.statusCode}): ${body}`));
          } else {
            resolve(body);
          }
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Create issue in Jira using v2 API
async function createIssue(requirement) {
  try {
    // Build acceptance criteria text
    let descriptionText = requirement.description || requirement.summary;
    if (requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0) {
      descriptionText += '\n\nAcceptance Criteria:\n';
      requirement.acceptanceCriteria.forEach(ac => {
        descriptionText += `• ${ac}\n`;
      });
    }

    const issueData = {
      fields: {
        project: {
          key: PROJECT_KEY
        },
        summary: requirement.summary,
        description: descriptionText,
        issuetype: {
          name: requirement.issueType
        },
        labels: requirement.labels || [],
        customfield_10016: requirement.storyPoints || 0 // Story Points field (usually 10016)
      }
    };

    // Try v2 API endpoint first (more widely available)
    const response = await makeJiraRequest('POST', '/rest/api/2/issue', issueData);
    return response;
  } catch (error) {
    throw error;
  }
}

// Main function to create all requirements
async function createAllRequirements() {
  console.log('🚀 Starting Jira Requirements Creation');
  console.log(`📋 Project Key: ${PROJECT_KEY}`);
  console.log(`📊 Total Requirements to Create: ${requirements.length}\n`);

  let successCount = 0;
  let failureCount = 0;
  const createdIssues = [];
  const failedIssues = [];

  for (let i = 0; i < requirements.length; i++) {
    const req = requirements[i];
    process.stdout.write(`[${i + 1}/${requirements.length}] Creating: ${req.summary.substring(0, 50)}...`);

    try {
      const response = await createIssue(req);
      successCount++;
      createdIssues.push({
        key: response.key,
        summary: req.summary,
        type: req.issueType
      });
      console.log(` ✅ Created [${response.key}]\n`);

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      failureCount++;
      failedIssues.push({
        summary: req.summary,
        error: error.message
      });
      console.log(` ❌ Failed\n`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  // Print Summary Report
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY REPORT');
  console.log('='.repeat(80));
  console.log(`✅ Successfully Created: ${successCount}/${requirements.length}`);
  console.log(`❌ Failed: ${failureCount}/${requirements.length}`);
  console.log(`📈 Success Rate: ${((successCount / requirements.length) * 100).toFixed(2)}%\n`);

  if (createdIssues.length > 0) {
    console.log('✅ CREATED ISSUES:');
    console.log('-'.repeat(80));
    createdIssues.forEach(issue => {
      console.log(`[${issue.key}] ${issue.type}: ${issue.summary}`);
    });
  }

  if (failedIssues.length > 0) {
    console.log('\n❌ FAILED ISSUES:');
    console.log('-'.repeat(80));
    failedIssues.forEach(issue => {
      console.log(`❌ ${issue.summary}`);
      console.log(`   Error: ${issue.error}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ Requirements creation process completed!');
  console.log('='.repeat(80));
}

// Run the script
createAllRequirements().catch(error => {
  console.error('Fatal Error:', error);
  process.exit(1);
});
