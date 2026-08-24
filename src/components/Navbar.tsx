import React, { useState } from 'react';
import { Home, PlusCircle, Bookmark, Search, Users, ShieldCheck, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import brandLogoImg from '../assets/images/app_brand_logo_1787301050975.jpg';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: 'EXPLORE' | 'SAVED';
  onTabChange: (tab: 'EXPLORE' | 'SAVED') => void;
  savedCount: number;
  onOpenPostModal: () => void;
  onOpenAuthModal: () => void;
  onClearSamples?: () => void;
  onRestoreSamples?: () => void;
  hasSamples?: boolean;
  totalListingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  savedCount,
  onOpenPostModal,
  onOpenAuthModal,
  totalListingsCount,
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => onTabChange('EXPLORE')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img
                src={brandLogoImg}
                alt="የቤት ኪራይ ተባባሪ Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-xl font-black bg-gradient-to-r from-white via-slate-100 to-amber-300 bg-clip-text text-transparent font-sans tracking-tight">
                  የቤት ኪራይ ተባባሪ
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-400/30 text-amber-300">
                  አዲስ
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                ቀላልና ዘመናዊ የቤት ኪራይ ተባባሪ መድረክ
              </p>
            </div>
          </div>

          {/* Search Bar (Desktop & Tablet) */}
          <div className="flex-1 max-w-md hidden md:block mx-2 lg:mx-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="በከተማ፣ ሰፈር፣ ስራ ወይም ባህሪ ፈልግ (ቦሌ፣ ተማሪ፣ ጸጥታ...)"
                className="w-full pl-10 pr-9 py-2.5 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 text-white placeholder-slate-400 text-sm rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-700 hover:bg-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Explore Tab */}
            <button
              onClick={() => onTabChange('EXPLORE')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'EXPLORE'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">ማውጫ</span>
              <span className="sm:hidden">ሁሉ</span>
            </button>

            {/* Saved Bookmarks Tab */}
            <button
              onClick={() => onTabChange('SAVED')}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'SAVED'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">የተቀመጡ</span>
              {savedCount > 0 && (
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Post Button */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">ማስታወቂያ ልቀቅ</span>
              <span className="sm:hidden">ልቀቅ</span>
            </button>

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-7 h-7 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline text-xs font-bold max-w-[100px] truncate text-slate-200">
                    {user.displayName || user.email?.split('@')[0] || 'ተጠቃሚ'}
                  </span>
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl z-50 p-2 text-xs animate-fade-in">
                      <div className="p-3 border-b border-slate-800 mb-1">
                        <p className="font-bold text-white truncate">{user.displayName || 'ተጠቃሚ'}</p>
                        <p className="text-slate-400 text-[11px] truncate">{user.email || 'የእንግዳ መግቢያ'}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-300 font-bold transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>ውጣ (Sign Out)</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-indigo-400" />
                <span>ይግቡ</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="በቦታ፣ በስራ ወይም በባህሪ ይፈልጉ..."
              className="w-full pl-10 pr-8 py-2 bg-slate-800 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center text-slate-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

