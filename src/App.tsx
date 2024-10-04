import { useState } from 'react';
import { VoiceChat } from './pages/VoiceChat';
import { ScrapeForm } from './pages/ScrapeForm';
import './App.scss';

function App() {
  const [scrapedContent, setScrapedContent] = useState<string>('');

  const handleScrapedContent = (content: string) => {
    setScrapedContent(content);
  };

  return (
    <div className="app-container">
      {scrapedContent ? (
        <VoiceChat scrapedContent={scrapedContent} />
      ) : (
        <ScrapeForm onScrapedContent={handleScrapedContent} />
      )}
    </div>
  );
}

export default App;
