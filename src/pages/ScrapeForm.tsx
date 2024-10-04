import { useState, FormEvent, ChangeEvent } from 'react';
import './ScrapeForm.scss';
import { processHtmlContent } from '../utils/processHtmlContent';

interface ScrapeFormProps {
  onScrapedContent: (content: string) => void;
}

export function ScrapeForm({ onScrapedContent }: ScrapeFormProps) {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const scrapingAntApiKey = process.env.REACT_APP_SCRAPINGANT_API_KEY;
    if (!scrapingAntApiKey) {
      setError('ScrapingAnt API key is not set');
      setIsLoading(false);
      return;
    }

    const apiEndpoint = `https://api.scrapingant.com/v2/general?url=${encodeURIComponent(
      url
    )}&x-api-key=${scrapingAntApiKey}&browser=false&block_resource=stylesheet&block_resource=image&block_resource=media&block_resource=font&block_resource=texttrack&block_resource=xhr&block_resource=fetch&block_resource=eventsource&block_resource=websocket&block_resource=manifest`;

    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const htmlContent = await response.text();
      const textContent = processHtmlContent(htmlContent);
      console.log('🚀 ~ handleSubmit ~ textContent:', textContent);
      onScrapedContent(textContent);
    } catch (error) {
      console.error('Error while calling ScrapingAnt:', error);
      setError('An error occurred during scraping');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="Enter URL to scrape"
          required
          className="url-input"
        />
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Scraping...' : 'Scrape'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {!error && (
        <p className="instruction">
          Enter a URL and click 'Scrape' to get started.
        </p>
      )}
    </div>
  );
}
