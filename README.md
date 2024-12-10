# sshSharedOrdering

Groceries Ordering Application for the existing SSH Company with a delivery fee split feature.

---

## **Features**

- Browse supermarkets and their categories.
- Add items to the basket and view the total cost.
- Select a delivery date for your order.
- Collaborate with others for shared delivery fees.

---

## **Getting Started**

Follow these steps to set up and launch the project locally.

### **Prerequisites**

Make sure you have the following installed on your machine:

- **Node.js** (v16.x or higher) – [Download here](https://nodejs.org/)
- **npm** or **yarn** (npm comes with Node.js)
- **PostgreSQL** – [Download here](https://www.postgresql.org/download/)
- A **Git** client – [Download here](https://git-scm.com/)

## **Important Notes**

### **Testing Information**

For testing purposes, the following user and household data has been pre-populated in the database:

### **Household Login**

1. **Household ID:** 1  
   **PIN Code:** 1111  
   **Users:**

   - **Name:** John Doe | **Email:** johndoe@mail.com | **Password:** johndoe | **Personal pin:** 1111
   - **Name:** Jane Smith | **Email:** janesmith@mail.com | **Password:** janesmith | **Personal pin:** 1111
   - **Name:** Jack Brown | **Email:** jackbrown@mail.com | **Password:** jackbrown | **Personal pin:** 1111

2. **Household ID:** 2  
   **PIN Code:** 2222  
   **Users:**

   - **Name:** Emily Davis | **Email:** emilydavis@mail.com | **Password:** emilydavis | **Personal pin:** 2222
   - **Name:** Ethan White | **Email:** ethanwhite@mail.com | **Password:** ethanwhite | **Personal pin:** 2222
   - **Name:** Ella Black | **Email:** ellablack@mail.com | **Password:** ellablack | **Personal pin:** 2222

3. **Household ID:** 3  
   **PIN Code:** 3333  
   **Users:**
   - **Name:** Michael Green | **Email:** michaelgreen@mail.com | **Password:** michaelgreen | **Personal pin:** 3333
   - **Name:** Mia Taylor | **Email:** miataylor@mail.com | **Password:** miataylor | **Personal pin:** 3333
   - **Name:** Matthew Wilson | **Email:** matthewwilson@mail.com | **Password:** matthewwilson | **Personal pin:** 3333

### **Household and User Login**

- To log in as a **household**, use the **Household ID** and **PIN Code** listed above.
- To log in as an **individual user**, use the email and password corresponding to the user account.

---

### **1. Clone the Repository**

First, clone the repository to your local machine:

```bash
git clone https://github.com/emperaspera/sshSharedOrdering.git
```

Navigate to the project folder:

```bash
cd sshSharedOrdering
```

---

### **2. Install Dependencies**

Install the required dependencies using `npm` or `yarn`:

```bash
npm install
# OR
yarn install
```

---

### **3. Configure Database**

#### **Step 1: Modify `initDatabase.js`**

- Open the `initDatabase.js` file.
- Update the `DB_CONFIG` object with your PostgreSQL credentials:
  ```javascript
  const DB_CONFIG = {
    user: "your_username", // Your PostgreSQL username
    host: "localhost", // Hostname
    password: "your_password", // Your PostgreSQL password
    port: 5432, // Default port
    defaultDatabase: "postgres", // Default "postgres" database
    targetDatabase: "ssh", // Target database to create
  };
  ```

#### **Step 2: Run `initDatabase.js` to Create the Database and Schema**

Run the following command to execute the database initialization script:

```bash
node initDatabase.js
```

This script will:

1. Create the `ssh` database if it doesn't exist.
2. Initialize the required tables and schema.
3. Populate the database with test household data.

---

### **4. Start the Server**

Once the database is set up, start the backend server by running:

```bash
node server.js
```

This will start the server, and it will be accessible at:

```
http://localhost:5000/
```

---

### **5. Start the Frontend Development Server**

Run the following command to start the React application:

```bash
npm run dev
# OR
yarn dev
```

This will start the development server. Open your browser and navigate to the link provided in the terminal, typically:

```
http://localhost:5173/
```

---

## **Workflow for Contributing**

### **Step-by-Step Guide for Submitting Your Work to GitHub**

### **1. Create a Branch**

Always create a new branch for your work. **Do not work directly on the `main` branch.**

```bash
git checkout -b feature/your-feature-name
```

### **2. Make Your Changes**

Make the necessary changes to the codebase. Once you're done, save your work and prepare it for submission.

### **3. Stage and Commit Your Changes**

Stage your changes:

```bash
git add .
```

Commit your changes with a descriptive message:

```bash
git commit -m "Add a description of your changes"
```

### **4. Push Your Branch**

Push your branch to GitHub:

```bash
git push origin feature/your-feature-name
```

### **5. Create a Pull Request**

1. Go to the repository on GitHub: [sshSharedOrdering](https://github.com/emperaspera/sshSharedOrdering).
2. Click on the **"Pull Requests"** tab.
3. Click the **"New Pull Request"** button.
4. Select your branch (`feature/your-feature-name`) as the source and `main` as the target branch.
5. Add a title and description for your pull request and click **"Create Pull Request"**.

### **6. Wait for Review**

Your pull request will be reviewed by the repository owner. If changes are requested, make them and push to the same branch.

### **7. Merge Approval**

Once your changes are approved, the repository owner will merge your pull request into the `main` branch.

---

## **Tech Stack**

- **React**: For building the user interface.
- **Vite**: Development tooling.
- **Tailwind CSS**: For styling.
- **Node.js**: Backend runtime environment.
- **PostgreSQL**: Database management.

---

## **Project Structure**

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

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**

If you encounter any issues or have questions, feel free to open an issue in the repository or contact the project owner:

- GitHub: [emperaspera](https://github.com/emperaspera)

Happy Coding! 🚀
