# 🛍️ E-commerce Admin Dashboard  

This repository contains the **admin dashboard** for managing all backend operations of an e-commerce platform. It empowers store owners and managers to efficiently handle products, orders, customers, and reports from a single interface.

---

## ✨ Key Features  
- **Product Management**: Add, edit, and delete products and manage categories.  
- **Inventory Tracking**: Monitor stock levels in real time.  
- **Order Management**: Process orders, update statuses, and track shipments.  
- **Customer Management**: Oversee user accounts, roles, and permissions.  
- **Sales Analytics**: View business performance and generate reports.  
- **User Roles & Access Control**: Control access through authentication and role-based permissions.  

---

## 🔧 Tech Stack Overview  
- **React.js** – Interactive and dynamic UI development  
- **Next.js** – Full-stack solution with server-side rendering (SSR)  
- **Prisma** – ORM for efficient database management  
- **Supabase** – Real-time data handling and seamless integration  
- **Clerk** – User authentication and access control  
- **Zustand** – Lightweight and flexible state management  
- **Tailwind CSS** – Mobile-first, fully responsive UI design  
- **shadcn/UI** – Pre-built modern UI components  
- **Query Strings** – Dynamic data filtering and fetching  

---

## 🛠️ Installation & Setup  

### Prerequisites  
- **Node.js** installed  
- **Git** installed  
- **Supabase** and **Clerk** accounts set up  

### Steps to Run Locally  

#### 1. Clone the Repository  
```bash
git clone https://github.com/abdulrehman104/Ecommerce-Admin-Dashboard.git
cd Ecommerce-Admin-Dashboard
```

#### 2. Install Dependencies  
```bash
npm install
```

#### 3. Set Up Environment Variables  
Create a `.env` file at the root of the project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CLERK_FRONTEND_API=your_clerk_frontend_api
```

#### 4. Start the Development Server  
```bash
npm run dev
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure  
```
/public       – Static assets  
/pages        – Next.js pages  
/components   – Reusable React components  
/styles       – Global and component-level CSS  
/utils        – Helper functions and utilities  
```

---

## 📝 Contributing  
1. **Fork** the repository.  
2. Create a new branch: `git checkout -b feature/your-feature-name`.  
3. Commit your changes: `git commit -m "Add your feature"`.  
4. Push to the branch: `git push origin feature/your-feature-name`.  
5. Open a **pull request** for review.

---

## 📧 Contact  
If you have any questions or feedback, feel free to reach out:  
**Abdul Rehman**  
[GitHub Profile](https://github.com/abdulrehman104)  

