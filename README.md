# Tender-management-backend

# Backend Setup

### Prerequisites

- Ensure you have Node.js and npm installed on your machine.

### Steps to Run the Backend

1. **Install Dependencies:**

   Navigate to the root directory of the project and run the following command to install all necessary packages:

   ```bash
   npm install
   ```

2. **Start the Server:**

   You can start the backend using `nodemon` to automatically restart the server when file changes are detected. Ensure the `package.json` includes the following start script:

   ```json
   "scripts": {
     "start": "nodemon src/index.js"
   }
   ```

   Then run the following command to start the server:

   ```bash
   npm start
   ```

3. **Sockets for Notifications:**

   This project uses WebSockets to send and receive notifications. Ensure the socket is configured properly in the backend to handle notification-related events.

---

You can expand the **Sockets for Notifications** section with more details if you have additional instructions for configuring the socket events. Let me know if you'd like to modify anything!
