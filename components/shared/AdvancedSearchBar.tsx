"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, MapPin, Clock, Star, TrendingUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { quickSearch } from '@/lib/enhanced-ai';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'menu_item' | 'cook' | 'suggestion';
  href: string;
  price?: number;
  rating?: number;
  cuisine?: string;
  cook_name?: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'trending' | 'recent' | 'quick';
  icon?: React.ReactNode;
}

const AdvancedSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { user } = useAuth();
  const debouncedQuery = useDebounce(query, 300);

  // Trending searches based on user role
  const getTrendingSuggestions = useCallback((): SearchSuggestion[] => {
    const timeOfDay = new Date().getHours();
    let suggestions: SearchSuggestion[] = [];

    if (timeOfDay >= 6 && timeOfDay < 11) {
      suggestions = [
        { id: '1', text: 'Breakfast combos', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
        { id: '2', text: 'Poha and upma', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
        { id: '3', text: 'South Indian breakfast', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
      ];
    } else if (timeOfDay >= 11 && timeOfDay < 16) {
      suggestions = [
        { id: '1', text: 'Thali meals', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
        { id: '2', text: 'Biryani', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
        { id: '3', text: 'North Indian lunch', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
      ];
    } else {
      suggestions = [
        { id: '1', text: 'Light dinner', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
        { id: '2', text: 'Roti sabzi', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
        { id: '3', text: 'Chinese food', type: 'trending', icon: <TrendingUp className="w-4 h-4" /> },
      ];
    }

    // Add quick actions
    suggestions.push(
      { id: '4', text: 'Find cooks near me', type: 'quick', icon: <MapPin className="w-4 h-4" /> },
      { id: '5', text: 'Top rated dishes', type: 'quick', icon: <Star className="w-4 h-4" /> }
    );

    return suggestions;
  }, []);

  // Load initial suggestions
  useEffect(() => {
    setSuggestions(getTrendingSuggestions());
    
    // Load recent searches from localStorage
    const saved = localStorage.getItem('campus-dabba-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, [getTrendingSuggestions]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      // Use the real search API instead of enhanced AI search
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
      
      if (response.ok) {
        const searchResults = await response.json();
        setResults(searchResults);
      } else {
        console.error('Search API error:', response.status);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('campus-dabba-recent-searches', JSON.stringify(updated));
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      saveRecentSearch(finalQuery.trim());
      router.push(`/search?q=${encodeURIComponent(finalQuery.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length + suggestions.length + recentSearches.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          // Handle selection based on active index
          if (activeIndex < results.length) {
            router.push(results[activeIndex].href);
          } else if (activeIndex < results.length + suggestions.length) {
            const suggestion = suggestions[activeIndex - results.length];
            handleSearch(suggestion.text);
          } else {
            const recentIndex = activeIndex - results.length - suggestions.length;
            handleSearch(recentSearches[recentIndex]);
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('campus-dabba-recent-searches');
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for dishes, cuisines, cooks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-12 py-3 text-base border-2 rounded-xl focus:border-primary transition-all duration-200 shadow-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
        )}
        {query && !isLoading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-xl z-50 max-h-[80vh] overflow-hidden"
        >
          <div className="max-h-[70vh] overflow-y-auto">
            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground px-3 py-2 flex items-center">
                  <Search className="w-3 h-3 mr-1" />
                  Search Results
                </div>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => router.push(result.href)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-muted transition-colors ${
                      activeIndex === index ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{result.title}</div>
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {result.subtitle}
                        </div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {result.description}
                          </div>
                        )}
                      </div>
                      {result.price && (
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          ₹{result.price}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query.trim().length >= 2 && results.length === 0 && !isLoading && (
              <div className="p-6 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found for "{query}"</p>
                <p className="text-xs mt-1">Try searching for dishes, cuisines, or cook names</p>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.trim().length === 0 && (
              <>
                <Separator />
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-xs font-medium text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Recent Searches
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs h-auto p-1 text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </Button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className={`w-full text-left p-3 rounded-lg hover:bg-muted transition-colors ${
                        activeIndex === results.length + suggestions.length + index ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span className="text-sm">{search}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && query.trim().length === 0 && (
              <>
                <Separator />
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground px-3 py-2 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending & Quick Actions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSearch(suggestion.text)}
                      className={`w-full text-left p-3 rounded-lg hover:bg-muted transition-colors ${
                        activeIndex === results.length + index ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        {suggestion.icon}
                        <span className="text-sm ml-3">{suggestion.text}</span>
                        <Badge 
                          variant={suggestion.type === 'trending' ? 'default' : 'secondary'} 
                          className="ml-auto text-xs"
                        >
                          {suggestion.type}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchBar;
