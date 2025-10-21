CivicLens: AI-Powered Global Civic Issue Reporting

CivicLens is a modern, AI-driven web application designed to empower citizens worldwide to report civic issues such as potholes, illegal waste dumping, flooding, and public safety concerns. By bridging the gap between citizens and local authorities, it provides an intuitive platform for reporting issues via photos and a robust dashboard for authorities to manage, track, and resolve them efficiently. Inspired by global sustainable urban development goals like UN-Habitat, CivicLens leverages advanced AI to foster civic engagement and accountability across diverse communities.



✨ Key Features

CivicLens offers a two-pronged, role-based experience tailored for citizens and authorities, ensuring accessibility and efficiency in addressing civic issues globally.

For Citizens:





🤖 AI-Assisted Reporting: Snap a photo of a civic issue (e.g., potholes, graffiti, or flooding), and AI (powered by Google Gemini 2.5 Flash) analyzes it to suggest issue type, severity, and a detailed description.



📸 Webcam & Upload: Submit reports by uploading photos from a device or capturing them directly via webcam.



📍 Automatic Geolocation: Automatically captures issue locations using GPS for precise mapping, adaptable to urban and rural settings.



🔍 Smart Duplicate Detection: AI generates an "image fingerprint" to identify and flag potential duplicate reports, allowing users to upvote existing ones to reduce redundancy.



📊 Personal Dashboard: Track the status of submitted reports ("Submitted," "In Progress," "Resolved") through a user-friendly interface.



🔔 Real-Time Notifications: Receive simulated email or SMS notifications (via Twilio) when report statuses are updated by authorities.



🌍 Multilingual Support: Supports multiple languages (e.g., English, Spanish, Hindi, Arabic) and offline mode for low-connectivity areas, ensuring inclusivity for diverse populations.

For Authorities:





📈 Analytics Dashboard: Provides a high-level overview of reported issues with statistics on total, pending, and resolved reports, customizable for local governance needs.



💬 Conversational AI Analytics: Enables authorities to ask natural language questions (e.g., "What are the most common issues in this region?") for instant, AI-generated insights.



📊 Data Visualizations: Interactive charts display issue breakdowns by type and status, with heatmaps showing report distribution over time.



📋 Comprehensive Report Management: View, filter, and sort reports in a detailed data table, optimized for municipal workflows.



🛠️ Efficient Resolution Workflow: Update report statuses and upload "resolved" photos as proof, automatically notifying the reporting citizen.

🚀 Technology Stack

CivicLens is built with a modern, scalable technology stack to ensure performance and adaptability across global contexts.





Framework: Next.js (with App Router) for a robust, server-side rendered web application.



Language: TypeScript for type-safe, maintainable code.



Backend & Database: Firebase





Authentication: Manages user sign-up, login, and role-based access (citizens vs. authorities).



Firestore: NoSQL database for storing user profiles, reports, and application data.



Storage: Stores user-uploaded images (as Data URIs in Firestore for this prototype).



Generative AI: Genkit (by Google)





Model: Google Gemini 2.5 Flash for image analysis, report generation, and conversational analytics.



UI Components: ShadCN UI for accessible, customizable components.



Styling: Tailwind CSS for responsive, utility-first styling.



Icons: Lucide React for lightweight, modern icons.



State Management: React Hooks & Context API for seamless Firebase integration.



Form Handling: React Hook Form with Zod for robust form validation.



Additional Integrations:





Google Maps API for geolocation.



Twilio for SMS notifications.



Google Cloud Translate for multilingual support.

⚙️ Getting Started

Follow these steps to set up and run CivicLens on your local machine.

Prerequisites





Node.js (v18 or later)



npm or a compatible package manager (e.g., Yarn, pnpm)



A Google Gemini API key from Google AI Studio

1. Clone the Repository

Clone the CivicLens repository to your local machine:

git clone https://github.com/your-repo/civiclens-global.git
cd civiclens-global

2. Set Up Environment Variables

Create a .env.local file in the project root to store your Google Gemini API key and Firebase configuration.





Create a file named .env.local.



Add the following environment variables:

