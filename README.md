# Bluescan - Ocean Pollution Detection Platform

A comprehensive web application for detecting and analyzing ocean pollution patterns using satellite and drone imagery. The platform leverages advanced image processing and machine learning techniques to identify various types of ocean pollution, including microplastics, chemical contamination, and oil spills.

## 🌊 Features

- **Real-time Pollution Detection**
  - Advanced image analysis
  - Pattern recognition
  - Pollution hotspot identification

- **Interactive Dashboard**
  - Pollution mapping
  - Trend analysis
  - Real-time monitoring

- **Data Management**
  - Upload and process satellite images
  - Historical data tracking
  - Export capabilities

- **Analysis Tools**
  - Pollution concentration metrics
  - Environmental impact assessment
  - Predictive analytics

## 🛠️ Technology Stack

- **Frontend**
  - React.js
  - Tailwind CSS
  - Chart.js/D3.js
  - Leaflet Maps
  - Lucide Icons

- **Key Libraries**
  - react-router-dom
  - react-leaflet
  - react-chartjs-2
  - axios

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ocean-pollution-detection.git
cd ocean-pollution-detection
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   ├── InputField.jsx
│   │   └── SocialLogin.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── dashboard/
│   │   ├── PollutionMap.jsx
│   │   ├── PollutionTrends.jsx
│   │   ├── HotspotsList.jsx
│   │   └── ImageUploader.jsx
│   ├── analysis/
│   │   ├── AnalysisResults.jsx
│   │   ├── DataFilters.jsx
│   │   └── ExportTools.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Loading.jsx
├── pages/
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Analysis.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── contexts/
│   └── AuthContext.js
├── utils/
│   ├── api.js
│   └── helpers.js
└── App.jsx
```

## 🚀 Getting Started

1. Set up your development environment
2. Install project dependencies
3. Configure environment variables
4. Run the development server
5. Access the application at `http://localhost:3000`

## 💻 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 📄 API Documentation

The application interacts with a backend API for:
- Image analysis
- Data storage
- User authentication
- Report generation

API endpoints are configured in `src/utils/api.js`

## 🔐 Authentication

The platform uses JWT-based authentication with:
- User registration
- Social login options
- Secure session management
- Protected routes

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Responsive design
- Custom components
- Consistent theme

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

<!-- ## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

<!-- ## 📧 Contact

For questions or support, please contact:
- Email: your.email@example.com
- GitHub: [Your GitHub Profile](https://github.com/yourusername) -->

## 🙏 Acknowledgments

- OpenStreetMap for map data
- Chart.js for visualizations
- Tailwind CSS for styling
- React team for the framework

---
Made with 💙 for cleaner oceans
