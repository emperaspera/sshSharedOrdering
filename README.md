
# sshSharedOrdering

Groceries Ordering Application for the existing SSH Company with delivery fee split feature.

## Features
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
- A **Git** client – [Download here](https://git-scm.com/)

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

### **3. Start the Development Server**
Run the following command to start the application:
```bash
npm run dev
# OR
yarn dev
```

This will start the development server. Open your browser and navigate to the link provided in the terminal. 
E.g.:
http://localhost:5173/

---

### **4. Build the Application for Production**
To build the application for production, run:
```bash
npm run build
# OR
yarn build
```

The build files will be generated in the `dist/` folder.

---

## **Submitting Your Work**

### Step-by-Step Guide for Submitting Your Work to GitHub

To contribute to this project, please follow these steps:

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

## **Collaborator Workflow**

### **1. Branching**
- Always use feature branches for changes (e.g., `feature/add-login`).

### **2. Pull Requests**
- All changes must go through a pull request and be reviewed before merging into `main`.

### **3. Branch Protection**
- Direct pushes to `main` are not allowed.
- Submit changes via pull requests and await approval.

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

## **Tech Stack**
- **React**: For building the user interface.
- **Vite**: Development tooling.
- **Tailwind CSS**: For styling.
- **Node.js**: Runtime environment.
- **npm/yarn**: Dependency management.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**
If you encounter any issues or have questions, feel free to open an issue in the repository or contact the project owner:
- GitHub: [emperaspera](https://github.com/emperaspera)

Happy Coding! 🚀
