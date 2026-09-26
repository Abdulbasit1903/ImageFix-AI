# ImageFix AI

**See the problem. Find the fix.**

ImageFix AI is a full-stack web application I built to explore how AI and image analysis can be used to help troubleshoot computers and electronic devices.

Users can upload a photo of a device, describe the problem they are experiencing, and receive AI-assisted troubleshooting suggestions. The application analyzes both the image and the user's description to provide visual observations, possible causes, recommended checks, safety warnings, and troubleshooting steps.

## Features

- Upload an image of a computer or electronic device
- Describe the problem or symptoms
- AI-powered image and text analysis
- Possible causes ranked by likelihood
- Step-by-step troubleshooting guidance
- Safety warnings for potentially dangerous issues
- Follow-up questions for additional troubleshooting
- Interactive AI troubleshooting chat
- User sign-up and sign-in
- Diagnosis history
- Saved devices
- Mark diagnoses as resolved
- Responsive design for desktop and mobile
-
- <img width="1875" height="863" alt="image" src="https://github.com/user-attachments/assets/dd6bd3f4-ad15-4288-9b92-dc2ddb7c3b79" />


## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript

### Database & Authentication
- Supabase
- PostgreSQL
- Supabase Authentication

### AI
- Google Gemini API
- Multimodal image and text analysis

### Development & Deployment
- Git
- GitHub
- Render

## How It Works

1. The user creates an account or signs in.
2. The user uploads an image of their device.
3. They select the device category and describe the problem.
4. The React frontend sends the diagnosis request to the Express backend.
5. The backend securely sends the image and problem description to the Gemini API.
6. Gemini analyzes the provided information and returns structured troubleshooting information.
7. The results are displayed to the user and the diagnosis can be saved to their account.

## Project Architecture

```text
User
  |
  v
React + TypeScript Frontend
  |
  |----> Supabase Authentication
  |----> Supabase / PostgreSQL
  |
  v
Express / Node.js Backend
  |
  v
Google Gemini API
```

The Gemini API key is handled on the server rather than being exposed in the frontend.

## AI & Safety

ImageFix AI is designed as a troubleshooting assistant and does not claim to provide a guaranteed diagnosis.

The AI separates its response into areas such as:

- Visual observations
- Possible causes
- Recommended checks
- Safety warnings
- Troubleshooting steps

For potentially dangerous situations involving electricity, damaged batteries, overheating, fire, or exposed power components, the application prioritizes safety and may recommend disconnecting power or contacting a qualified technician.

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Abdulbasit1903/ImageFix-AI.git
cd ImageFix-AI
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure the required environment variables.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Do not commit real API keys or credentials to GitHub.

### 4. Start the development server

```bash
npm run dev
```

## What I Learned

Building ImageFix AI helped me gain more experience with:

- Building full-stack applications with React and Node.js
- Working with TypeScript
- Creating REST API endpoints with Express
- Integrating an AI API into a web application
- Working with multimodal AI inputs
- Implementing authentication with Supabase
- Storing and retrieving user-specific data
- Using environment variables to protect API credentials
- Using Git and GitHub for version control
- Deploying a full-stack application

One of the biggest parts of this project was learning how the frontend, backend, database, authentication system, and AI service work together as one application.

## Future Improvements

Some features I would like to explore in the future include:

- Improving AI diagnosis reliability
- Supporting more device categories
- Improving image handling and storage
- Adding automated testing
- Improving accessibility
- Adding more detailed troubleshooting history
- Improving error handling when the AI service is unavailable

## Disclaimer

ImageFix AI provides AI-assisted troubleshooting suggestions for educational and informational purposes. AI-generated results may be inaccurate and should not replace professional repair or safety advice.

## Author

**Abdulbasit Fatai Akande**

Software Development Student — Seneca Polytechnic

GitHub: https://github.com/Abdulbasit1903
