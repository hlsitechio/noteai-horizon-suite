
# Online Note AI - Full-Stack AI-Powered Note Taking App

A comprehensive note-taking application with AI assistance, built with React, Chakra UI, and modern web technologies.

## 🚀 Features

- **AI-Powered Assistant**: Get intelligent suggestions and help with your notes
- **Rich Text Editor**: Create and format notes with ease
- **Smart Organization**: Categorize and tag your notes automatically
- **Real-time Search**: Find your notes instantly with powerful search
- **Beautiful UI**: Modern, responsive design with Chakra UI components
- **Authentication**: Secure user authentication and session management
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Chakra UI** for component library and theming
- **React Router** for navigation
- **TanStack Query** for state management and data fetching
- **Lucide React** for beautiful icons
- **Tailwind CSS** for additional styling
- **Framer Motion** for smooth animations

### Backend (Ready for Integration)
- **Node.js** with Express
- **JWT Authentication**
- **SQLite/PostgreSQL** database support
- **RESTful API** architecture

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url> online-note-ai
   cd online-note-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Demo Credentials
- **Email**: demo@example.com
- **Password**: password

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── Header.tsx          # Top header with search
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── pages/
│   ├── Dashboard.tsx           # Main dashboard
│   ├── Chat.tsx               # AI chat interface
│   ├── Editor.tsx             # Note editor
│   ├── Notes.tsx              # Notes browser
│   ├── Settings.tsx           # User settings
│   └── Auth/
│       ├── Login.tsx          # Login page
│       └── Register.tsx       # Registration page
├── theme/
│   └── theme.ts               # Chakra UI theme configuration
└── index.css                  # Global styles and animations
```

## 🎨 Design System

### Colors
- **Primary (Brand)**: Blue spectrum (#6366f1)
- **Secondary**: Purple spectrum (#d946ef)
- **Gray Scale**: Slate colors for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- Custom Chakra UI theme with consistent spacing and border radius
- Smooth hover animations and transitions
- Beautiful gradient backgrounds

## 🔧 Customization

### Adding New Pages
1. Create component in `src/pages/`
2. Add route to `src/pages/Index.tsx`
3. Add navigation item to `src/components/Layout/Sidebar.tsx`

### Theming
- Modify colors in `src/theme/theme.ts`
- Update CSS variables in `src/index.css`
- Customize component styles in theme configuration

### AI Integration
Replace the mock AI responses in `src/pages/Chat.tsx` with your preferred AI service:
- OpenAI GPT
- Google Gemini
- Anthropic Claude
- Local AI models

## 🚀 Deployment

### Frontend (Vercel - Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Full-Stack Deployment
1. **Backend**: Deploy to Railway, Heroku, or DigitalOcean
2. **Database**: PostgreSQL on Railway or Supabase
3. **Frontend**: Vercel or Netlify

## 🔐 Environment Variables

Create a `.env.local` file for local development:
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_API_KEY=your_ai_api_key
```

## 📝 Backend Integration

To connect with a backend API:

1. **Update API calls** in `src/contexts/AuthContext.tsx`
2. **Configure endpoints** in your environment variables
3. **Add API utilities** in `src/lib/api.ts`

Example API integration:
```typescript
const apiClient = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Real AI integration (OpenAI/Gemini)
- [ ] Collaborative editing
- [ ] File attachments
- [ ] Export to PDF/Markdown
- [ ] Mobile app (React Native)
- [ ] Offline support
- [ ] Voice notes
- [ ] Advanced search with filters

## 💡 Tips for Development

- Use the demo credentials for testing
- Check browser console for helpful logs
- Customize the AI responses in Chat.tsx
- Add your own color schemes in theme.ts
- Use Chakra UI components for consistency

---

Built with ❤️ using React, Chakra UI, and modern web technologies.
