# Firebase Studio

To get started, take a look at src/app/page.tsx.

https://6000-firebase-studio-1749624433602.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev/

# 🩺 AI-Powered Health Checker App

An intelligent, full-stack health checker application built entirely with **Next.js**. The app uses **BERT-based NLP models** to analyze natural language symptom input and return probable health conditions, medical insights, and suggestions.

This project empowers users to better understand their health while demonstrating how AI and modern web technologies can be integrated for real-world impact.

---

## 🚀 Features

- 🧠 **AI Symptom Analysis** – Input free-text symptoms and receive intelligent predictions using BERT-based models.
- 💬 **Interactive Chat Interface** – Seamless chatbot-like UX for health Q&A.
- 📈 **User Dashboard** – Visualize symptom history and AI analysis over time.
- 👤 **Authentication System** – Secure sign-up, login, and session handling.
- 🧾 **Health Recommendations** – Receive tips and alerts based on your inputs.
- 🌐 **Single Next.js Codebase** – Unified frontend and backend using Next.js API routes.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS / CSS Modules
- **Backend**: Next.js API routes (Node.js + Express-like structure)
- **AI/NLP**: Hugging Face Transformers (BERT, Med7, ClinicalBERT)
- **Data Storage**: MongoDB / PostgreSQL / SQLite (based on your setup)
- **Auth**: JWT / NextAuth.js
- **State Management**: React Context / Zustand / Redux (optional)

---

🔥 Firebase Services Used
Firebase Authentication – Secure login/signup using email or third-party providers.

Firestore Database – Real-time storage and retrieval of user health records and interactions.

Firebase Hosting – Fast, secure hosting for the Next.js web app.

Firebase Functions (optional) – Serverless logic for backend tasks or AI API calls.

Firebase Studio – For visualizing and managing app data easily.

## 🧪 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+ (for running the AI model if not hosted separately)
- MongoDB/PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/health-checker-app.git
cd health-checker-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to open the app.

### 4. AI Model Setup

If using a Python-based API for BERT:

- Create a Python backend (e.g. Flask/FastAPI) that runs the BERT model.
- Connect the Next.js frontend to this Python API.

Alternatively, use a hosted Hugging Face model via their API.

---

## 🤖 AI Integration (BERT Models)

This project integrates pretrained NLP models via Hugging Face such as:

- `bert-base-uncased`
- `med7`
- `Bio_ClinicalBERT`

Sample API usage:

```js
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({ symptomText }),
});
const result = await response.json();
```

---

## 🧠 Example Usage

> **Input**: "I've had fever, chills, and a sore throat for two days."

> **Output**:  
Possible conditions:  
- Viral Infection  
- Influenza  
- Common Cold  

> **Advice**: Stay hydrated and consult a doctor if symptoms persist beyond 3 days.

---

## 📂 Project Structure

```
.
├── pages/              # Next.js pages (UI + API routes)
│   ├── index.tsx
│   ├── api/
│       └── analyze.ts  # API route for symptom analysis
├── components/         # UI components
├── utils/              # AI helper functions
├── public/             # Static assets
└── styles/             # CSS files
```

---

## ✅ Future Improvements

- Wearable integration (Fitbit, Apple Health)
- Voice symptom input (speech-to-text)
- Appointment booking with doctors
- Multilingual symptom input support

---

## 📃 License

MIT License – See the [LICENSE](LICENSE) file for details.

---

## ✨ Author

**SAYANTAN MUKHERJEE** 
📬 sayantanmukherjee000@gmail.com

---

## 🤝 Contributing

Open to feature suggestions, issue reporting, and pull requests!
