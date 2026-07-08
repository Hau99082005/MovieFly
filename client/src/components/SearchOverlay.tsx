import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, TrendingUp, Star, Film, Loader2 } from "lucide-react";
import { moviesApi } from "@/lib/api";

interface Movie {
  _id: string;
  title: string;
  original_title?: string;
  poster_url?: string;
  backdrop_url?: string;
  poster_path?: string;
  backdrop_path?: string;
  imdb_score?: number;
  rating?: number;
  release_date?: string;
  type?: string;
  synopsis?: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_KEY = "moviefly_recent_searches";
const MAX_RECENT = 6;

function getRecentSearches(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); }
  catch { return []; }
}

function saveRecentSearch(q: string) {
  const recent = getRecentSearches().filter((r) => r !== q);
  recent.unshift(q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function removeRecentSearch(q: string) {
  const recent = getRecentSearches().filter((r) => r !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setIsLoading(true);
    try {
      const data = await moviesApi.getAll({ search: q, limit: 8 });
      setResults(data.data || []);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setIsLoading(false); return; }
    setIsLoading(true);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  const handleSelect = (movie: Movie) => {
    if (query.trim()) saveRecentSearch(query.trim());
    onClose();
    navigate(`/movies/${movie._id}`);
    scrollTo(0, 0);
  };

  const handleRecentClick = (q: string) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  const handleRemoveRecent = (q: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(q);
    setRecentSearches(getRecentSearches());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0]);
    else if (query.trim()) saveRecentSearch(query.trim());
  };

  if (!isOpen) return null;

  const showRecent = !query.trim() && recentSearches.length > 0;
  const showEmpty = !isLoading && query.trim() && results.length === 0;
  const showResults = !isLoading && results.length > 0;

  const getPoster = (m: Movie) => m.poster_url || m.backdrop_url || m.poster_path || m.backdrop_path || "";
  const getYear = (m: Movie) => m.release_date ? new Date(m.release_date).getFullYear() : "";
  const getScore = (m: Movie) => m.imdb_score || m.rating || 0;

  return (
    <div
      className="fixed inset-0 z-[1200] flex flex-col"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", animation: "soFadeIn 0.2s ease forwards" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Search bar */}
      <div className="flex items-center px-4 md:px-8 pt-6 pb-2 gap-3">
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-3 max-w-3xl mx-auto relative">
          <div
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
            style={{
              background: focused ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
              border: focused ? "1px solid rgba(0,212,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: focused ? "0 0 0 3px rgba(0,212,255,0.1)" : "none",
            }}
          >
            {isLoading
              ? <Loader2 className="w-5 h-5 text-[#00d4ff] shrink-0 animate-spin" />
              : <Search className="w-5 h-5 text-white/40 shrink-0" />
            }
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Tim kiem phim, phim bo, show..."
              className="flex-1 bg-transparent text-white text-base placeholder-white/30 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button type="button" onClick={() => setQuery("")}
                className="w-5 h-5 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white/60 hover:text-white transition-all duration-150 shrink-0">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all duration-150 shrink-0"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Huy</span>
            <span className="hidden sm:inline text-[10px] text-white/25 ml-0.5">ESC</span>
          </button>
        </form>
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full px-4 md:px-8 pb-10">

        {/* Recent searches */}
        {showRecent && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-white/30" />
              <span className="text-xs font-semibold text-white/35 uppercase tracking-widest">Tim kiem gan day</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRecentClick(r)}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-white/60 hover:text-white transition-all duration-150"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Clock className="w-3 h-3 text-white/30" />
                  {r}
                  <span
                    onClick={(e) => handleRemoveRecent(r, e)}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/10 transition-all"
                  >
                    <X className="w-2.5 h-2.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending placeholder when no query */}
        {!query.trim() && recentSearches.length === 0 && (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)" }}>
              <TrendingUp className="w-8 h-8 text-[#00d4ff]/60" />
            </div>
            <p className="text-sm text-white/40">Nhap ten phim ban muon tim kiem...</p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="w-12 h-16 rounded-lg shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="flex-1 flex flex-col gap-2 justify-center">
                  <div className="h-3 rounded w-3/4" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-2.5 rounded w-1/2" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <div className="h-2 rounded w-1/3" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-4 h-4 text-white/30" />
              <span className="text-xs font-semibold text-white/35 uppercase tracking-widest">Ket qua ({results.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {results.map((movie) => {
                const poster = getPoster(movie);
                const year = getYear(movie);
                const score = getScore(movie);
                return (
                  <button
                    key={movie._id}
                    onClick={() => handleSelect(movie)}
                    className="group flex gap-3 p-3 rounded-xl text-left transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(0,212,255,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.06)";
                    }}
                  >
                    {/* Poster */}
                    <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                      {poster ? (
                        <img src={poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-5 h-5 text-white/20" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                      <p className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-[#00d4ff] transition-colors duration-150">
                        {movie.title}
                      </p>
                      {movie.original_title && movie.original_title !== movie.title && (
                        <p className="text-xs text-white/35 truncate">{movie.original_title}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        {score > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-yellow-400">
                            <Star className="w-3 h-3 fill-yellow-400" />{score.toFixed(1)}
                          </span>
                        )}
                        {year && <span className="text-[11px] text-white/30">{year}</span>}
                        {movie.type && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded text-[#00d4ff]/80"
                            style={{ background: "rgba(0,212,255,0.08)" }}>
                            {movie.type === "series" ? "Phim bo" : "Phim le"}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3l5 5-5 5" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {showEmpty && (
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Search className="w-7 h-7 text-white/20" />
            </div>
            <p className="text-sm font-semibold text-white/40">Khong tim thay ket qua</p>
            <p className="text-xs text-white/25">Thu tim voi tu khoa khac</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes soFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SearchOverlay;