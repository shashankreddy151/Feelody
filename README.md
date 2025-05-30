# Feelody 🎵

Feelody is a mood-based music player that curates songs to match your emotions. Select a mood, feel the vibe, and let the music flow! Built to create a personalized musical journey based on how you feel — anytime, anywhere.

---

## 🚀 Features
- **Mood-based music discovery**: Choose a mood and get a curated playlist.
- **Audius streaming integration**: Stream music directly from the Audius decentralized platform.
- **Last.fm metadata**: Fetches track and artist info for a richer experience.
- **Favorites & Recent**: Save your favorite tracks and quickly access recently played songs.
- **Responsive UI**: Works beautifully on desktop and mobile.
- **Framer Motion animations**: Smooth transitions and delightful UI effects.
- **Tailwind CSS**: Modern, utility-first styling.
- **Keyboard shortcuts**: Power-user navigation for quick access.

---

## 🖥️ Demo
- **Live Demo**: _[Add your Netlify/Vercel/GitHub Pages link here]_  
- **Screenshots**: _[Add screenshots or GIFs here to showcase the UI]_  

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/feelody.git
cd feelody
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory (see `.env.example`):
```env
REACT_APP_LASTFM_API_KEY=your_lastfm_api_key_here
```
- Get your Last.fm API key from: https://www.last.fm/api/account/create

### 4. Start the development server
```bash
npm start
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Build & Deployment

### Build for production
```bash
npm run build
```
The production-ready files will be in the `build/` directory.

### Deploy to Netlify
1. **Set environment variable**: Add `REACT_APP_LASTFM_API_KEY` in the Netlify dashboard.
2. **Node.js version**: Ensure Netlify uses Node.js `20.18.0` (see `netlify.toml`).
3. **Build command**: `npm run build`
4. **Publish directory**: `build`
5. **Connect your repo and deploy!**

---

## 🧩 Project Structure
```
├── public/                # Static files
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   ├── services/          # API integrations (Audius, Last.fm)
│   ├── utils/             # Utility functions
│   ├── App.js             # Main app logic
│   └── index.js           # Entry point
├── .env.example           # Environment variable template
├── netlify.toml           # Netlify deployment config
├── package.json           # Project metadata & scripts
└── ...
```

---

## 🌐 Environment Variables
| Name                        | Description                |
|-----------------------------|----------------------------|
| REACT_APP_LASTFM_API_KEY    | Last.fm API key (required) |

---

## 🐞 Troubleshooting
- **Songs not showing on production (Netlify):**
  - Make sure `REACT_APP_LASTFM_API_KEY` is set in Netlify environment variables.
  - Check browser console for CORS or network errors.
  - Ensure Node.js version is set to `20.18.0` in Netlify.
- **Mobile view issues:**
  - Confirm the viewport meta tag is present in `public/index.html`.
  - Inspect with browser dev tools for responsive layout problems.
- **API errors:**
  - Verify your API key is valid and not rate-limited.

---

## 📝 Credits
- **Audius**: Decentralized music streaming API
- **Last.fm**: Music metadata and mood tagging
- **React**: UI library
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations

---

## 📄 License
[MIT](LICENSE)

---

## 💡 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 🙏 Acknowledgements
Thanks to the open-source community and all contributors who make projects like this possible!
