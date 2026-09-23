# Product Admin Dashboard

A responsive Admin Dashboard web application built using React, Vite, React Router DOM, and Axios fetching data from the DummyJSON API.

---

## Setup Steps

Follow these steps to run the project locally:

1. Clone the Repository:
   git clone https://github.com/dhruv3140/my-admin-dashboard.git
   cd my-admin-dashboard

2. Install Dependencies:
   npm install

3. Start Development Server:
   npm run dev

4. Access Application:
   Open http://localhost:5173 in your browser.

---

## Completed Features

- JWT Authentication Flow: Login page (/login) with error handling, token persistence in localStorage, logout feature, and protected routes.
- Shared Axios Interceptor: Single configured Axios instance (axiosInstance.js) that auto-attaches authorization headers and handles request logic centrally.
- Product Dashboard List: Displays product thumbnail, title, category, price, rating, stock, and management actions.
- Custom Pagination: Server-side limit and skip integration with page navigation controls, dynamic count indicators, and customizable page sizes (10, 20, 50).
- Debounced Search: Immediate input feedback with a custom debounce mechanism to prevent redundant API calls while typing.
- Category Filter & Client Sorting: Filter products by categories and sort locally by price, rating, or title in ascending/descending order.
- Product Details View (/products/:id): Deep-dive page showing image preview grids, product specifications, customer reviews, and a custom 404 page for non-existent IDs.
- Local CRUD Simulation: Optimistic local state updates for Add, Edit, and Delete actions with user confirmation popups.
- UI State Handling: Clear loading states, error boundary states with retry triggers, and empty result placeholders.

---

## Demo Credentials

- Username: emilys
- Password: emilyspass

---

## Submission Notes

### 1. Architectural Choices
- Minimal Dependencies: Built the application using pure React hooks (useState, useEffect) and native logic without relying on external libraries like React Query, SWR, or pre-built pagination packages.
- Separation of Concerns: API calls are completely decoupled from UI components and centralized inside src/api/api.js.

### 2. Problem Faced & Solution
- Problem: DummyJSON API endpoints do not support simultaneous searching and category filtering. Additionally, mock backend endpoints do not actually persist newly created/edited items, returning 404 errors when performing actions on custom items.
- Solution: Implemented optimistic local state management. Newly added items receive a unique local identifier (isCustom: true). Local CRUD operations update the React state immediately while gracefully handling backend API fallbacks. To resolve query conflicts, executing a search automatically resets active category filters.

### 3. Where AI Helped
- AI tools assisted in structuring cleaner Axios interceptors, designing resilient local state fallbacks for mock API limitations, and organizing logical step-by-step Git commit histories for submission compliance.