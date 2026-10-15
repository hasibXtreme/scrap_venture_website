# scrap_venture_website
# Scrap Venture — Full Web Application Development Plan

## Project Goal & Strategic Overview
The primary objective is to build **Scrap Venture** as a complete Digital Waste Supply Chain Platform connecting **Waste Generators → Verified Collectors → Scrap Venture Operations → Recyclers → Sustainable Products**.

The application operates on a **hybrid model**:
1. **Waste Collection (Decentralized P2P):** Operates via a direct, area-broadcasted peer-to-peer network featuring Google Maps location pinning, upfront payment method declaration, direct on-site settlement, and dual-ticker mutual confirmation.
2. **Eco-Product Marketplace (Centralized E-Commerce):** Operates as a standard online marketplace managed directly by Scrap Venture administrators for selling recycled consumer products.

---

## 1. System Architecture & Workflows

### Waste Collection Workflow (Decentralized P2P)

---

## 2. User Roles & Capabilities

### A. Customer
* **Authentication & Profile:** Register, login, manage user profile, and review transaction/earnings history.
* **Submit Pickup Request:** Select Thana/Area, pin exact pickup location via **Google Maps API** (with text address fallback), specify waste types (*Plastic, Paper, Cardboard, Metal, E-Waste, Glass, Textile, Other*), enter estimated quantities (kg), and select preferred payment mode (*Cash, bKash, Nagad, Bank Transfer*).
* **Dual-Ticker Confirmation:** Verify weights/payout on-site and tick *"Payment Received"* (`customer_ticked = TRUE`) to complete the transaction.
* **Dashboard & Metrics:** Track personal recycling statistics, earnings, and calculated environmental impact (*CO₂ reduction, landfill diversion*).
* **Marketplace:** Browse recycled products, manage shopping cart, place orders, and track fulfillment status.

### B. Scrap Collector / Feriwala
* **Verification & Profile:** Register and upload NID/identification documents for admin verification.
* **Service Area & Availability:** Set primary operating **Thana** (*e.g., Mirpur-1, Gulshan*) and toggle active/duty status.
* **Area Job Feed:** Receive localized broadcast notifications, view Google Maps pin and preferred payment method, and claim open requests via **"Take Order"**.
* **On-Site Logging:** Record actual measured weights per category and total payout made on-site.
* **Dual-Ticker Confirmation:** Tick *"Payment Completed"* (`collector_ticked = TRUE`) after settling payout with the customer.
* **Collector Dashboard:** View completed pickups, ratings, and total earnings history.

### C. Admin
* **User & Collector Oversight:** Approve, reject, or suspend collectors; verify NID records; monitor collector ratings and service areas.
* **Dynamic Price Control:** Update baseline buying prices per kg across all waste categories from the admin dashboard.
* **Real-Time Transaction Panel:** Monitor all transaction records across the platform, filtered by state (`Completed`, `Incomplete`, `Disputed`) and Thana.
* **Marketplace Operations:** Manage product listings, price, stock inventory, and order dispatch.
* **Content & Campaign Hub:** Publish sustainability campaigns (*Clean Campus, Green Campus, Plastic Exchange*), blog posts, news, and organizational awards.
* **Platform Analytics:** Review real-time KPI cards and charts for city-wide waste volume, user growth, revenue, and environmental metrics.

---

## 3. Operational Systems & Modules

### Dynamic Waste Pricing System
Admins maintain benchmark rates per kg per category (*Plastic, Paper, Cardboard, Metal, E-Waste, Glass*). The system provides customers with estimated total earnings upon request creation and allows collectors to log actual payouts on-site.

### Payment Architecture
* **Waste Collection (P2P):** Settled directly on-site between customer and collector via Cash or Mobile Financial Services (*bKash/Nagad*) as requested by the customer.
* **Eco-Marketplace (Centralized):** Processed through online payment gateways (*bKash, Nagad, Credit Card*) or Cash on Delivery (*COD*).

### Environmental Impact Engine
System automatically aggregates platform-wide statistics upon reaching `status = 'Completed'`:
* Total Waste Recycled & Plastic Collected (kg)
* Estimated Landfill Diversion (Tons)
* Estimated CO₂ Emissions Reduction (kg)
* Number of Households Served & Collectors Supported

### Eco-Product Marketplace
Features catalog listing for sustainable goods (*recycled bags, plastic boards, benches, tables, flower tubs*). Includes product details, shopping cart, online checkout, order tracking, and admin stock management.

---

## 4. System Data Models (Logical Entities)

* **`users`:** Stores user identity, contact details, password hash, and assigned role (*Customer, Collector, Admin*).
* **`collectors`:** Stores collector profile, primary operating Thana, NID verification details, active status, and average rating.
* **`waste_categories`:** Contains category names and admin-controlled per-kg buying prices.
* **`pickup_requests`:** Stores customer request details including Thana area, Google Maps coordinates (*latitude, longitude*), address text fallback, estimated items JSON, preferred payment method, assigned collector, and request status.
* **`transactions`:** Records actual weights logged on-site, total money paid, boolean flags for `collector_ticked` and `customer_ticked`, and the 3-state status (*Incomplete, Completed, Disputed*).
* **`marketplace_products`:** Holds title, description, price, inventory stock, and image URL for eco-products.
* **`marketplace_orders`:** Stores order items, total payment, payment status, and fulfillment state (*Processing, Shipped, Delivered*).
* **`campaigns` & `blog_posts`:** Stores platform campaigns, event details, participant counts, news, and educational content.

---

## 5. Public Web Pages & Technology Stack

### Public Web Pages
1. Home
2. About Us
3. How It Works
4. Book a Pickup (Google Maps interface)
5. Become a Collector
6. Business Solutions
7. Marketplace
8. Campaigns
9. Environmental Impact
10. Blog & News
11. Our Team & Awards
12. Contact Us
13. Login / Registration

### Suggested Technology Stack
* **Frontend:** React.js / Next.js, HTML5, CSS3, Tailwind CSS, JavaScript/TypeScript.
* **Backend:** Node.js (Express.js / NestJS), REST API.
* **Database:** PostgreSQL / MySQL Cloud Database.
* **Maps API:** Google Maps JavaScript API & Geocoding API.
* **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).
* **Deployment:** Vercel / Netlify (Frontend), Render / Railway / AWS (Backend).

---

## 6. Final Acceptance Criteria
The application will be considered complete when:
1. Users can register and log in under specific roles (`Customer`, `Collector`, `Admin`).
2. Customers can submit pickup requests by selecting Thana, pinning location on Google Maps, and specifying preferred payment methods.
3. Area-specific broadcast notifications trigger for collectors in that Thana, and collectors can claim open orders.
4. On-site collection data (actual weights and money paid) can be recorded by the collector.
5. Transactions shift to `'Completed'` automatically **only** when both `collector_ticked` and `customer_ticked` evaluate to `TRUE`.
6. Admins can monitor all `Completed`, `Incomplete`, and `Disputed` transactions in real time.
7. Customers can purchase products from the Eco-Product Marketplace, and admins can fulfill orders.
8. Impact metrics update automatically upon transaction completion.
9. The platform is fully mobile-responsive, secure, deployed, and accessible online.
