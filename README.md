<div align="center">
  <img src="frontend/public/Chat-Ai.png" alt="Nexus AI Logo" width="120" />
  <h1>Nexus AI RAG Platform</h1>
  <p>A modern, privacy-first Retrieval-Augmented Generation (RAG) platform.</p>
</div>

Nexus AI allows users to upload documents and interactively chat with them. It leverages local Large Language Models (LLMs) via Ollama, ensuring absolute privacy and speed, while providing a beautiful, responsive user interface.

## 📸 Screenshots

<details open>
<summary><b>Landing Page</b></summary>
<img src="frontend/public/landing-page.png" alt="Landing Page" width="800" />
</details>

<details>
<summary><b>Chat Interface</b></summary>
<img src="frontend/public/chat-page.png" alt="Chat Interface" width="800" />
</details>

<details>
<summary><b>API Documentation (Swagger UI)</b></summary>
<img src="frontend/public/swagger-ui.png" alt="Swagger UI" width="800" />
</details>

## 🌟 Features

- **Document Ingestion**: Upload various document formats (PDF, DOCX, CSV, TXT, Markdown).
- **Interactive Chat**: A sleek, real-time chat interface to ask questions about your documents.
- **Local LLMs**: Powered by [Ollama](https://ollama.com/), meaning your data and queries never leave your infrastructure.
- **Authentication**: Secure user authentication powered by Supabase.
- **Modern UI**: Built with Next.js, Tailwind CSS, and shadcn/ui for a premium user experience.

## 🏗️ Architecture & Advanced Systems

Nexus AI isn't just a simple wrapper; it incorporates enterprise-grade architectural patterns to ensure reliability, security, and performance.

### 🛡️ Security Pipeline (`SecurityPipeline`)
Every input and output goes through a rigorous security check. The pipeline guards against prompt injections, malicious inputs, and jailbreak attempts before they ever reach the LLM. It also validates the AI's output to ensure no sensitive or harmful content is returned to the user.

### ⚡ Response Caching (`ResponseCache`)
To improve speed and reduce unnecessary compute load on local LLMs, Nexus AI implements an intelligent response caching layer. If a user asks the exact same question with the same document context, the system instantly returns the cached response instead of running a full retrieval and generation pass.

### 🧠 Production Agent System (`ProductionAgent`)
Instead of a basic API call, the backend uses an Agent orchestration system built on LangChain. This handles context building, prompt formatting, dynamic context injection, and LLM invocation robustly, ensuring high-quality and well-cited answers.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **AI/LLM Orchestration**: [LangChain](https://python.langchain.com/) & [LangChain-Ollama](https://python.langchain.com/docs/integrations/providers/ollama/)
- **Database/Auth**: [Supabase](https://supabase.com/) (PostgreSQL & pgvector)
- **Package Manager**: [uv](https://github.com/astral-sh/uv)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [uv](https://github.com/astral-sh/uv) (Python package manager)
- [Ollama](https://ollama.com/) (Running locally)
- A [Supabase](https://supabase.com/) project

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Rag-Project
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies using `uv`:
   ```bash
   uv sync
   ```
3. Create a `.env` file in the `backend` directory and configure your Supabase credentials:
   ```env
   SUPABASE_URL="your-supabase-url"
   SUPABASE_KEY="your-supabase-service-role-key"
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

## 💡 Usage

1. Ensure Ollama is running and you have pulled the required model (e.g., `ollama run llama3`).
2. Open `http://localhost:3000` in your browser.
3. Sign up or log in.
4. Upload your documents in the chat interface.
5. Ask questions and get cited answers directly from your data!

## 📜 License

This project is licensed under the MIT License.
