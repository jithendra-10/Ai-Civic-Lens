# CivicLens: AI-Powered Global Civic Issue Reporting

CivicLens is a modern, AI-driven web application designed to empower citizens worldwide to report civic issues such as potholes, illegal waste dumping, flooding, and public safety concerns. By bridging the gap between citizens and authorities, CivicLens streamlines issue reporting, management, and resolution for communities everywhere.

---
## 🚀 Application Link

Try CivicLens live: [https://aiciviclens.netlify.app/](https://aiciviclens.netlify.app/)

---

## ✨ Key Features

CivicLens offers a powerful, role-based experience tailored for both **citizens** and **authorities**, ensuring accessibility and efficiency in addressing civic issues globally.

### For Citizens

- **🤖 AI-Assisted Reporting:**  
  Easily report civic issues by snapping a photo (e.g., potholes, graffiti, flooding). Our AI, powered by Google Gemini 2.5 Flash, automatically analyzes the image to suggest issue type, severity, and details.

- **📸 Webcam & Upload:**  
  Submit reports by uploading photos from your device or capturing them directly via webcam.

- **📍 Automatic Geolocation:**  
  The app automatically captures your location using GPS for precise issue mapping, adaptable to both urban and rural settings.

- **🔍 Smart Duplicate Detection:**  
  AI generates an "image fingerprint" to identify and flag potential duplicate reports, allowing users to upvote existing ones and reduce redundancy.

- **📊 Personal Dashboard:**  
  Track the status of your submitted reports ("Submitted," "In Progress," "Resolved") through a user-friendly interface.

- **🔔 Real-Time Notifications:**  
  Receive simulated email or SMS notifications (via Twilio) when authorities update your report status.

- **🌍 Multilingual Support:**  
  Supports multiple languages (e.g., English, Spanish, Hindi, Arabic) and includes offline mode for low-connectivity areas, ensuring inclusivity for diverse populations.

---

### For Authorities

- **📈 Analytics Dashboard:**  
  Get a high-level overview of reported issues with statistics on totals, pending, and resolved reports, customizable for local governance needs.

- **💬 Conversational AI Analytics:**  
  Ask natural language questions (e.g., "What are the most common issues in this region?") and receive instant, AI-generated insights.

- **📊 Data Visualizations:**  
  Interactive charts break down issues by type and status, with heatmaps showing report distribution over time.

- **📋 Comprehensive Report Management:**  
  View, filter, and sort reports in a detailed data table, optimized for municipal workflows.

- **🛠️ Efficient Resolution Workflow:**  
  Update report statuses, upload "resolved" photos as proof, and automatically notify the reporting citizen.

---

## 🚀 Technology Stack

CivicLens is built with a modern, scalable technology stack to ensure performance and adaptability across global contexts.

- **Framework:** Next.js (App Router) – robust, server-side rendered web application.
- **Language:** TypeScript – type-safe, maintainable code.
- **Backend & Database:** Firebase
  - **Authentication:** Manages user sign-up, login, and role-based access (citizens vs. authorities).
  - **Firestore:** NoSQL database for profiles, reports, and data.
  - **Storage:** User-uploaded images stored as Data URIs in Firestore (prototype).
- **Generative AI:** Genkit (Google Gemini 2.5 Flash) – image analysis, report generation, conversational analytics.
- **UI:** ShadCN UI – accessible, customizable components.
- **Styling:** Tailwind CSS – responsive, utility-first styling.
- **Icons:** Lucide React – lightweight, modern icons.
- **State Management:** React Hooks & Context API – seamless Firebase integration.
- **Form Handling:** React Hook Form & Zod – robust form validation.

**Additional Integrations:**
- Google Maps API – geolocation.
- Twilio – SMS notifications.
- Google Cloud Translate – multilingual support.

---

## ⚙️ Getting Started

Follow these steps to set up and run CivicLens on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm, Yarn, or pnpm
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/))
- Firebase project & credentials

### 1. Clone the Repository

```sh
git clone https://github.com/jithendra-10/Ai-Civic-Lens.git
cd Ai-Civic-Lens
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root to store your Google Gemini API key and Firebase configuration.

```env
# .env.local
GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
```

### 3. Install Dependencies

```sh
npm install
# or
yarn install
# or
pnpm install
```

### 4. Start the Development Server

```sh
npm run dev
# or
yarn dev
# or
pnpm dev
```

---

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Genkit Documentation](https://github.com/google/genkit)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI](https://ui.shadcn.com/)

---

## 🤝 Contributing

We welcome contributions! Please open issues for bugs, feature requests, or questions.  
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 💬 Contact

For support or inquiries, reach out via [GitHub Issues](https://github.com/jithendra-10/Ai-Civic-Lens/issues).

---

## 🌐 Connect

<p align="left">
  <a href="https://github.com/jithendra-10/" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Profile-informational?style=for-the-badge&logo=github" alt="GitHub Profile"/>
  </a>
  <a href="https://www.linkedin.com/in/jithendra10/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Profile-blue?style=for-the-badge&logo=linkedin" alt="LinkedIn Profile"/>
  </a>
</p>

---

## 🖼️ Screenshots

**1.Landing page**

<img width="954" height="719" alt="landing page" src="https://github.com/user-attachments/assets/7921b19c-a32b-45a2-af43-d84b4df9efe3" />

**2.Login page**

<img width="1851" height="872" alt="login page" src="https://github.com/user-attachments/assets/373167b1-4864-4a8d-be4d-4b050c79c411" />

**3.Citizen Dashboard**

<img width="1854" height="856" alt="citizen dashboard" src="https://github.com/user-attachments/assets/5d7e7e2a-1042-47e2-bd21-2b8fe1a0fe1a" />

<img width="1849" height="861" alt="report submission" src="https://github.com/user-attachments/assets/c7667cff-c5d1-4017-8035-622bed9f959c" />

<img width="1642" height="770" alt="submitted reports" src="https://github.com/user-attachments/assets/f3f2fc43-7130-4e84-9203-2f43c75f587f" />

**4.Authority Dashboard**

<img width="1835" height="855" alt="Authority dashboard" src="https://github.com/user-attachments/assets/b65cc2b4-9e57-4092-889e-54a15170f458" />

<img width="1851" height="876" alt="AD1" src="https://github.com/user-attachments/assets/c006ffb1-1923-473e-8982-f8867d3bde38" />

<img width="1847" height="871" alt="recent reposts" src="https://github.com/user-attachments/assets/7b3f36ab-ae95-461b-85bd-faff8f156f7a" />

<img width="1035" height="796" alt="report details" src="https://github.com/user-attachments/assets/7eb26406-cecf-437f-b1a3-6080e5d33b87" />

**5.Settings**

<img width="1116" height="864" alt="setting" src="https://github.com/user-attachments/assets/998225a0-ed76-4ed0-8cfe-215c0345b6a4" />


- **Landing Page**: Entry point showcasing CivicLens’s mission and quick access to features.
- **Login Page**: Secure sign-in and registration for citizens and authorities.
- **Citizen Dashboard**: Personalized panel to report and track civic issues.
- **Authority Dashboard**: Administrative hub for authorities to manage, analyze, and resolve reports.

---

*Empowering communities, one report at a time.*
