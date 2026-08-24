/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { RoommateListing, FilterOptions } from './types';
import { SAMPLE_PRESETS } from './data';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PostModal } from './components/PostModal';
import { AuthModal } from './components/AuthModal';
import {
  subscribeToListings,
  saveListingToFirestore,
  deleteListingFromFirestore,
} from './services/listingsService';
import { testFirestoreConnection } from './firebase';
import {
  SearchX,
  Sparkles,
  ShieldCheck,
  Zap,
  HeartHandshake,
  PlusCircle,
  Trash2,
  RotateCcw,
  Loader2,
  Database,
} from 'lucide-react';

const STORAGE_KEY_SAVED = 'bet_kiray_saved_clean_v1';

export default function App() {
  // --- STATE ---
  const [listings, setListings] = useState<RoommateListing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved ids', e);
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'SAVED'>('EXPLORE');
  const [selectedListing, setSelectedListing] = useState<RoommateListing | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    role: 'ALL',
    location: 'ሁሉም ቦታዎች (All Locations)',
    maxBudget: 15000,
    gender: 'ALL',
  });

  // Test connection & Subscribe to Realtime Firestore database
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = subscribeToListings(
      (items) => {
        setListings(items);
        setIsLoading(false);
        setDbError(null);
      },
      (err) => {
        console.error('Database connection error:', err);
        setDbError('የዳታቤዝ ግንኙነት ችግር አጋጥሟል');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  const handleToggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddListing = async (newListing: RoommateListing) => {
    try {
      // Optimistically add to state
      setListings((prev) => [newListing, ...prev]);
      // Persist to Cloud Firestore
      await saveListingToFirestore(newListing);
    } catch (error) {
      console.error('Failed to save listing to database:', error);
      alert('ማስታወቂያውን በዳታቤዝ ለማስቀመጥ አልተቻለም፣ እባክዎ እንደገና ይሞክሩ።');
    }
  };

  const handleDeleteListing = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      setListings((prev) => prev.filter((item) => item.id !== id));
      setSavedIds((prev) => prev.filter((savedId) => savedId !== id));
      if (selectedListing?.id === id) {
        setSelectedListing(null);
      }
      await deleteListingFromFirestore(id);
    } catch (error) {
      console.error('Failed to delete listing from database:', error);
    }
  };

  const handleClearAllSampleListings = async () => {
    if (window.confirm('ሁሉንም የሙከራ (sample) ማስታወቂያዎች ማጥፋት ይፈልጋሉ?')) {
      const sampleItems = listings.filter((item) => item.isSample);
      setListings((prev) => prev.filter((item) => !item.isSample));
      for (const sample of sampleItems) {
        try {
          await deleteListingFromFirestore(sample.id);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handleRestoreSampleListings = async () => {
    for (const sample of SAMPLE_PRESETS) {
      try {
        await saveListingToFirestore(sample);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFilterChange = (updates: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      role: 'ALL',
      location: 'ሁሉም ቦታዎች (All Locations)',
      maxBudget: 15000,
      gender: 'ALL',
    });
  };

  const hasSampleListings = useMemo(() => listings.some((l) => l.isSample), [listings]);

  // --- FILTERING LOGIC ---
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // If tab is SAVED, check if ID is in savedIds
      if (activeTab === 'SAVED' && !savedIds.includes(item.id)) {
        return false;
      }

      // Role filter
      if (filters.role !== 'ALL' && item.role !== filters.role) {
        return false;
      }

      // Location filter
      if (
        filters.location !== 'ሁሉም ቦታዎች (All Locations)' &&
        item.location !== filters.location
      ) {
        return false;
      }

      // Gender filter
      if (filters.gender !== 'ALL' && item.gender !== filters.gender) {
        return false;
      }

      // Budget filter
      if (item.budget > filters.maxBudget) {
        return false;
      }

      // Search query filter
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchOcc = item.occupation.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLife = item.lifestyle.some((t) => t.toLowerCase().includes(q));

        if (!matchName && !matchLoc && !matchOcc && !matchDesc && !matchLife) {
          return false;
        }
      }

      return true;
    });
  }, [listings, activeTab, savedIds, filters]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        searchQuery={filters.search}
        onSearchChange={(q) => handleFilterChange({ search: q })}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedIds.length}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        totalListingsCount={listings.length}
      />


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Hero Welcome Section (Only on Explore tab) */}
        {activeTab === 'EXPLORE' && (
          <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl border border-indigo-900/40">
            <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute left-1/4 top-0 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  የቤት ኪራይ ተባባሪ (Roommate Platform)
                </span>
                
                {hasSampleListings && (
                  <button
                    onClick={handleClearAllSampleListings}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                    title="ሁሉንም የናሙና ማስታወቂያዎች በአንዴ ያጥፉ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>የናሙና ማስታወቂያዎችን አጽዳ</span>
                  </button>
                )}

                {!hasSampleListings && listings.length === 0 && (
                  <button
                    onClick={handleRestoreSampleListings}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>የሙከራ ማስታወቂያዎችን መልስ</span>
                  </button>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
                የሚፈልጉትን የቤት ኪራይ ተባባሪ{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-indigo-300">
                  በቀላሉና በፍጥነት
                </span>{' '}
                ያግኙ ወይም ይልቀቁ።
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                ክፍል ፈልገው ወይም አብሮዎት የሚኖር ታማኝ ተባባሪ አጥተው ተቸግረዋል? አሁኑኑ ማስታወቂያዎን በነጻ ይልቀቁ ወይም ከተለጠፉት ውስጥ ይምረጡ።
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 hover:from-indigo-400 hover:to-amber-400 text-white font-black text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>ማስታወቂያ አሁን ልቀቅ</span>
                </button>
              </div>

              {/* Trust Value Props */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-slate-800/80 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">ፈጣን ግንኙነት</p>
                    <p className="text-[11px] text-slate-400">በቀጥታ ስልክና ቴሌግራም</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">የባህሪ ማጣሪያ</p>
                    <p className="text-[11px] text-slate-400">አያጨስም፣ ጸጥታ...</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">100% ነፃ</p>
                    <p className="text-[11px] text-slate-400">ምንም የአገናኝ ኮሚሽን የለም</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Title header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{activeTab === 'EXPLORE' ? 'አሁን ያሉ ክፍት ማስታወቂያዎች' : 'አስቀምጠው የያዙት ዝርዝር'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700 font-bold">
                {isLoading ? '...' : filteredListings.length}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 flex items-center gap-2">
              <span>
                {activeTab === 'EXPLORE'
                  ? 'በአዲስ አበባ እና ዙሪያው አብሮ ለመኖር የሚፈልጉ ወይም ክፍል ያላቸው'
                  : 'በኋላ ለመደወል ምልክት ያደረጉባቸው ተባባሪዎች'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ቀጥታ ዳታቤዝ (Live)
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'SAVED' && savedIds.length > 0 && (
              <button
                onClick={() => setSavedIds([])}
                className="text-xs font-bold text-rose-300 hover:text-rose-200 bg-rose-950/60 border border-rose-800/60 px-3 py-1.5 rounded-xl hover:bg-rose-900/60 transition-colors cursor-pointer"
              >
                ሁሉንም አጽዳ ({savedIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar (Only shown on Explore tab) */}
        {activeTab === 'EXPLORE' && (
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredListings.length}
          />
        )}

        {/* Loading indicator */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
            <p className="text-sm font-medium">ማስታወቂያዎችን ከዳታቤዝ በማምጣት ላይ...</p>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={setSelectedListing}
                isSaved={savedIds.includes(listing.id)}
                onToggleSave={handleToggleSave}
                onDelete={handleDeleteListing}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-3xl p-8 sm:p-12 text-center my-8 max-w-lg mx-auto shadow-xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 font-sans">
              {activeTab === 'SAVED' ? 'ምንም የተቀመጠ ዝርዝር የለም' : 'ምንም ማስታወቂያ አልተገኘም'}
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {activeTab === 'SAVED'
                ? 'በማውጫው ላይ ያሉትን ካርዶች ምልክት (⭐) በማድረግ እዚህ ጋር ማጠራቀም ይችላሉ።'
                : listings.length === 0
                ? 'ሁሉንም የሙከራ ማስታወቂያዎች አጥፍተዋል። አሁን አዲስ እውነተኛ ማስታወቂያ በመልቀቅ መጀመር ይችላሉ!'
                : 'የመረጡትን የአካባቢ ወይም የበጀት ማጣሪያ በማስተካከል እንደገና ይሞክሩ።'}
            </p>
            {activeTab === 'EXPLORE' ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {listings.length === 0 ? (
                  <>
                    <button
                      onClick={() => setIsPostModalOpen(true)}
                      className="bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-400 hover:to-amber-400 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>የመጀመሪያውን ማስታወቂያ ልቀቁ</span>
                    </button>
                    <button
                      onClick={handleRestoreSampleListings}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>የሙከራዎችን መልስ</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleResetFilters}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                    >
                      ማጣሪያዎችን አጽዳ
                    </button>
                    <button
                      onClick={() => setIsPostModalOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>ማስታወቂያ ልቀቅ</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('EXPLORE')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                ወደ ማውጫው ተመለስ
              </button>
            )}
          </div>
        )}

      </main>

      {/* Listing Detail Modal Popup */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        isSaved={selectedListing ? savedIds.includes(selectedListing.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Post New Listing Modal Form */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleAddListing}
      />

      {/* Authentication Modal (Sign In / Sign Up / Guest) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

