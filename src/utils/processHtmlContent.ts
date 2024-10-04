export const processHtmlContent = (html: string): string => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
  
      const scriptElements = doc.getElementsByTagName('script');
      const styleElements = doc.getElementsByTagName('style');
  
      // Remove script and style elements
      Array.from(scriptElements).forEach((element) => element.remove());
      Array.from(styleElements).forEach((element) => element.remove());
  
      let contentElement: Element | null = null;
  
      const articleElement = doc.querySelector('article');
      const mainElement = doc.querySelector('main');
  
      if (articleElement) {
        contentElement = articleElement;
      } else if (mainElement) {
        contentElement = mainElement;
      } else {
        contentElement = doc.body;
      }
  
      if (contentElement) {
        ['header', 'footer', 'nav'].forEach((selector) => {
          const elements = contentElement!.querySelectorAll(selector);
          elements.forEach((element) => element.remove());
        });
  
        let text = contentElement.textContent || '';
  
        // Normalize spaces and remove any remaining inline CSS or scripts that might have been missed
        text = text.replace(/\s\s+/g, ' ').trim();
  
        // Limit the text to the first 2000 words
        const words = text.split(/\s+/);
        const limitedWords = words.slice(0, 2000);
        const limitedText = limitedWords.join(' ');
  
        return limitedText;
      }
  
      return '';
    } catch (error) {
      console.error('Error while processing HTML content:', error);
      return 'An error occurred while processing the content.';
    }
  };