#  Money Tracker — Frontend

A modern Angular-based web application for tracking personal income and expenses, visualizing spending habits, and managing transactions easily.  
This is the **frontend** part of the Money Tracker project.

---

##  Features
- **User Authentication** (Register, Login, Logout)    
- **Transaction Management** (Add, Edit, Delete transactions)  
- **Pagination** for transaction lists  
- **Responsive UI** with a clean layout  
- **Real-time data** via REST API connection to the backend  

---

##  Tech Stack
- **Angular** — Frontend framework  
- **TypeScript** — Type-safe JavaScript  
- **Bootstrap / CSS** — UI styling  
- **RxJS & HttpClient** — API requests & async handling  

---

##  Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/money-tracker-frontend.git
cd money-tracker-frontend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables  
Create `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```
For production, edit `environment.prod.ts`.

### 4️⃣ Run the app
```bash
ng serve
```
Then visit:
```
http://localhost:4200
```
