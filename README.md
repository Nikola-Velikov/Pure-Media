# Pure Media

## Overview
This project is designed to analyze and classify Bulgarian online news media based on their credibility. The system scrapes news articles, compares them against trusted sources, and determines their reliability by computing a 'fakeness coefficient.' The goal is to detect sensationalist journalism and provide an objective rating.

## Features
- Scrapes news from multiple media sources daily
- Matches news articles against a trusted source
- Computes a "fakeness coefficient" based on sensational language
- AI-powered sentiment and emotional language analysis
- Frontend dashboard for data visualization
- Backend API for data processing and AI model integration

## Tech Stack
- **Backend:** Express.js, Node.js, MongoDB
- **Frontend:** React.js (separate repository)
- **AI Model:** Fine-tuned XML-RoBERTa model
- **Scraping:** Puppeteer
- **Data Storage:** MongoDB

## Repositories
- **Frontend Repository:** [GitHub Link](https://github.com/Nikola-Velikov/pure-media-front-end)
- **Backend Repository:** [GitHub Link](https://github.com/Nikola-Velikov/pure-media-backend)
- **Fine-tuned AI Model Repository:** [GitHub Link](https://github.com/Nikola-Velikov/PureMediaAI)

## Installation & Setup

### Backend Setup
1. Clone the backend repository:
   ```sh
   git clone https://github.com/Nikola-Velikov/pure-media-backend.git
   ```
2. Navigate into the project folder:
   ```sh
   cd backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   npm run start
   ```

### Frontend Setup
1. Clone the frontend repository:
   ```sh
   git clone https://github.com/Nikola-Velikov/pure-media-front-end.git
   ```
2. Navigate into the project folder:
   ```sh
   cd frontend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Data Collection & Processing
- News articles are scraped daily at 00:00
- The AI model processes news to detect emotional language and sensationalism
- Data is stored in MongoDB for historical analysis


## Future Improvements
- Expand scraping to 30+ media sources
- Improve AI model accuracy with more training data
- Implement user authentication for customized dashboards
- Introduce NLP-based sentiment classification

## License
MIT License
