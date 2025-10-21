# CivicLens: AI-Powered Global Civic Issue Reporting

CivicLens is a modern, AI-driven web application designed to empower citizens worldwide to report civic issues such as potholes, illegal waste dumping, flooding, and public safety concerns. By bridging the gap between citizens and authorities, CivicLens streamlines issue reporting, management, and resolution for communities everywhere.

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

*Empowering communities, one report at a time.*
