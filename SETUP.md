# Setup Instructions

## Google Generative AI API Key Setup

To use the cybersecurity chat feature, you need to set up a Google Generative AI API key.

### Steps:

1. **Get your API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Set up environment variables:**
   - Create a `.env.local` file in the root directory of your project
   - Add the following line:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   - Replace `your_actual_api_key_here` with the API key you copied

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### Alternative: Using environment variables directly

You can also set the environment variable directly when running the server:

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_actual_api_key_here"; npm run dev
```

**Windows (Command Prompt):**
```cmd
set GEMINI_API_KEY=your_actual_api_key_here && npm run dev
```

**macOS/Linux:**
```bash
GEMINI_API_KEY=your_actual_api_key_here npm run dev
```

### Troubleshooting

- Make sure the API key is valid and active
- Ensure there are no extra spaces or quotes around the API key
- The `.env.local` file should be in the root directory (same level as `package.json`)
- Restart your development server after adding the environment variable

### Security Note

Never commit your `.env.local` file to version control. It's already included in `.gitignore` to prevent accidental commits.
