# Luctor: AI-Powered Soft Skill Training Web App

We are building **Luctor**, a visually appealing and user-friendly AI-powered web application designed to help **companies train employees in soft skills** such as sales, negotiation, and client communication.

The app consists of multiple screens and integrates two external AI agents:

- **Coach** (AI #1): Delivers lessons and supports learning.
- **Teacher** (AI #2): Enables practical application through interactive exercises.

Both agents are accessed via **external APIs** and are represented by **animated avatars** with **chat and voice output** capabilities.

---

## Pages & Functionality

### 1. Login Page

- Displays **"Luctor"** and logo at the top.
- Contains **username and password input fields**.
- Includes a **Login button**.
- Redirects based on credentials:
  - **Users** → Welcome Screen.
  - **Admins** → CMS Page.

---

### 2. Welcome Screen

Split into two columns:

- **Left Side**:
  - Shows all available **courses** as **circle icons** (2 per row).
  - Each course includes an **image** and **title** (e.g., "Sales").
  - Clicking a course redirects to the **Course Page**.

- **Right Side**:
  - One large **circle icon** with a Coach image and the text:
    > “Get help with a specific problem from your coach.”
  - Clicking it redirects to the **Specific Problem Page**.

---

### 3. Course Page

- Displays the **course title** and a **short description**.
- Shows **5 lessons** as circle icons:
  - First row: 3 lessons
  - Second row: 2 lessons
- Clicking a lesson opens the **Coach Lesson Page**.
- **Back button** (top-left): Returns to Welcome Screen.

---

### 4. Coach Lesson Page

Divided into three sections:

- **Top-left**: Animated **Coach avatar**.
- **Bottom-left**: **Graphs and tables** for the lesson.
- **Right side**: Chatbox (text and voice) with Coach.
  - Input: Text field + microphone button.
  - All chat history is **saved**.

#### Buttons:
- **Back** (top-left): Returns to Course Page.
- **Start Practice** (top-right): Goes to the **Practice Page**.

---

### 5. Practice Page

Similar layout to Coach Lesson Page:

- **Top-left**: Animated **Teacher avatar**.
- **Bottom-left**: Lesson materials (same as Coach Lesson).
- **Right side**: New chatbox (text and voice) with Teacher.
  - Separate from Coach chat.
  - All chat is **saved**.

#### Buttons:
- **Back** (top-left): Returns to Coach Lesson Page **without saving** chat.
- **Finish Practice** (top-right): Returns to Coach Lesson Page **with chat shared** to the Coach.

---

### 6. Coach Lesson Page (After Practice)

- Same layout as the original Coach Lesson Page.
- The Coach now has access to the **Teacher chat conversation data** from Practice Page.

---

### 7. Specific Problem Page

- Accessed via the **Welcome Screen** right-side icon.
- Two-column layout:
  - **Left side**: Animated **Coach avatar**.
  - **Right side**: Chatbox (text and voice input/output).
- **Back button** (top-left): Returns to Welcome Screen.
- All conversations are **saved**.

---

### 8. CMS Page (Admin Only)

- Accessed only with **admin credentials** via Login Page.
- Allows administrators to:
  - **Create/edit courses and lessons**.
  - **Add/edit lesson content** (invisible to users).
    - This content represents prior knowledge used by Coach and Teacher during lessons.
  - Manage AI training data that informs the lesson content.

---

## AI Behavior

- Both **Coach** and **Teacher**:
  - Are accessed via **external APIs**.
  - Communicate via **chat and voice output**.
  - Have **animated avatars**.
- **Chat histories are stored**, except when using the “Back” button on Practice Page.

---

## Notes

- All UI elements (e.g., circle icons, chatboxes, avatars, navigation buttons) should follow a **cohesive, modern design system**.
- All **redirects and state changes** between pages should be handled with smooth transitions.
- Initial AI knowledge (lesson content) is only accessible/administered via the **CMS Page**.