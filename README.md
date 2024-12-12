# SSH Shared Ordering

## Getting Started

### Prerequisites

1. Install **Node.js**:
   - [Download and Install Node.js](https://nodejs.org/)
2. Install **npm** along with **readline-sync**:
   - npm comes bundled with Node.js. Verify installation by running:
     ```bash
     node -v
     npm -v
     ```
3. Install **PostgreSQL**:
   - [Download PostgreSQL](https://www.postgresql.org/download/)

---

### Running the Application

1. **Set up the backend**:

   - Run the following command to initialize the backend and set up the database:
     ```bash
     node index.js
     ```
   - This will prompt you to input your PostgreSQL database credentials (username, password, host, port, database name).

2. **Start the frontend**:
   - Run the following command to start the frontend development server:
     ```bash
     npm run dev
     ```
   - The application will be available at:
     - Local: [http://localhost:5173](http://localhost:5173)
     - Network: [http://your-local-ip:5173](http://your-local-ip:5173)

---

### Households and Login Credentials

The project includes three test households and nine test users. Use these credentials to log in:

#### Household 1 (PIN: `1111`):

| First Name | Last Name | Email              | Password  | User PIN |
| ---------- | --------- | ------------------ | --------- | -------- |
| John       | Doe       | johndoe@mail.com   | johndoe   | 1111     |
| Jane       | Smith     | janesmith@mail.com | janesmith | 1111     |
| Jack       | Brown     | jackbrown@mail.com | jackbrown | 1111     |

#### Household 2 (PIN: `2222`):

| First Name | Last Name | Email               | Password   | User PIN |
| ---------- | --------- | ------------------- | ---------- | -------- |
| Emily      | Davis     | emilydavis@mail.com | emilydavis | 2222     |
| Ethan      | White     | ethanwhite@mail.com | ethanwhite | 2222     |
| Ella       | Black     | ellablack@mail.com  | ellablack  | 2222     |

#### Household 3 (PIN: `3333`):

| First Name | Last Name | Email                  | Password      | User PIN |
| ---------- | --------- | ---------------------- | ------------- | -------- |
| Michael    | Green     | michaelgreen@mail.com  | michaelgreen  | 3333     |
| Mia        | Taylor    | miataylor@mail.com     | miataylor     | 3333     |
| Matthew    | Wilson    | matthewwilson@mail.com | matthewwilson | 3333     |

---

## **Features**

- Browse supermarkets and their categories.
- Add items to the basket and view the total cost.
- Select a delivery date for your order.
- Collaborate with other household members for shared delivery fees.
- View and confirm orders as the courier.

---

## Project Structure

```
sshSharedOrdering/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/            # Application pages (MainScreen, BasketPage, etc.)
│   ├── context/          # Context providers (e.g., BasketContext)
│   ├── App.jsx           # Main App entry
│   └── index.jsx         # Application root
├── public/               # Static files
├── .gitignore            # Files and directories ignored by Git
├── package.json          # Project metadata and dependencies
├── README.md             # Project documentation
└── vite.config.js        # Vite configuration
```

---

## Tech Stack

- **React**: For building the user interface.
- **Vite**: Development tooling.
- **Tailwind CSS**: For styling.
- **Node.js**: Backend runtime environment.
- **PostgreSQL**: Database management.
