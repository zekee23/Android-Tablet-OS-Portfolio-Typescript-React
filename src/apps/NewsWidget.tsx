import { useState, useEffect, useMemo, useCallback } from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

interface Article {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsResponse {
  articles: Article[];
  status: string;
  totalResults: number;
}

export function NewsWidget() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news only once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        console.log('API Key available:', !!apiKey);
        
        if (!apiKey) {
          throw new Error('News API key not found');
        }

        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`;
        
        
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: NewsResponse = await response.json();
        console.log('API Response:', data);
        
        if (isMounted) {
          if (data.status === 'ok' && data.articles && data.articles.length > 0) {
            setArticles(data.articles);
            setError(null);
          } else {
            console.error('Invalid API response:', data);
            setError('Invalid API response');
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNews();

    // Set up periodic refresh every 24 hours
    const interval = setInterval(fetchNews, 24 * 60 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Memoize the formatted articles to prevent unnecessary re-renders
  const formattedArticles = useMemo(() => {
    return articles.map(article => ({
      ...article,
      timeAgo: getTimeAgo(new Date(article.publishedAt))
    }));
  }, [articles]);

  // Memoize click handlers
  const handleArticleClick = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  if (loading) {
    return (
      <div className="fixed left-8 h-20top-20 w-80 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="w-5 h-5 text-white/80" />
          <h3 className="text-white font-semibold">Latest News in US</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-white/20 rounded mb-2"></div>
              <div className="h-2 bg-white/10 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed left-4 top-20 w-80 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Newspaper className="w-5 h-5 text-white/80" />
          <h3 className="text-white font-semibold">Latest News in US</h3>
        </div>
        <div className="space-y-2">
          <p className="text-red-400 text-sm">Unable to load news</p>
          <p className="text-white/60 text-xs">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-blue-400 text-xs hover:text-blue-300 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-4 top-20 w-80 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl select-none">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 text-white/80" />
        <h3 className="text-white font-semibold">Latest News in US</h3>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[450px]  overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {formattedArticles.map((article, index) => (
          <div
            key={`${article.url}-${index}`}
            className="group cursor-pointer transition-all duration-200 hover:bg-white/5 rounded-lg p-2"
            onClick={() => handleArticleClick(article.url)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium overflow-hidden group-hover:text-blue-300 transition-colors" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {article.title}
                </h4>
                {article.description && (
                  <p className="text-white/60 text-xs mt-1 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {article.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-white/50 text-xs">{article.source.name}</span>
                  <span className="text-white/30 text-xs">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-white/40" />
                    <span className="text-white/40 text-xs">{article.timeAgo}</span>
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          Updates daily
        </p>
      </div>
    </div>
  );
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
