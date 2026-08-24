import React from 'react';
import { FilterOptions } from '../types';
import { CITIES, LOCATIONS_BY_CITY, HOUSE_TYPES } from '../data';
import { SlidersHorizontal, MapPin, UserCheck, Wallet, RotateCcw, Building2, BedDouble, Sparkles } from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const hasActiveFilters =
    filters.role !== 'ALL' ||
    filters.city !== 'ሁሉም ከተሞች (All Cities)' ||
    filters.location !== 'ሁሉም ሰፈሮች (All Sefers)' ||
    filters.houseType !== 'ሁሉም የቤት አይነቶች (All Types)' ||
    filters.roomsCount !== 'ALL' ||
    filters.maxBudget < 15000 ||
    filters.gender !== 'ALL';

  const availableLocations = LOCATIONS_BY_CITY[filters.city] || ['ሁሉም ሰፈሮች (All Sefers)'];

  const handleCityChange = (newCity: string) => {
    onFilterChange({
      city: newCity,
      location: 'ሁሉም ሰፈሮች (All Sefers)',
    });
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 mb-8 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm sm:text-base">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <span>ማጣሪያዎች (Filter Roommates)</span>
          <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {totalResults} ማስታወቂያዎች
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            አጽዳ (Reset All)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        
        {/* Role Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            የፍላጎት አይነት (Role)
          </label>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange({ role: e.target.value as any })}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-medium text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="ALL">ሁሉንም አሳይ (All)</option>
            <option value="ክፍል አለኝ (Have a Room)">🏠 ክፍል አለኝ (Have Room)</option>
            <option value="ፈልጋለሁ (Looking for Room)">🔍 ክፍል ፈልጋለሁ (Looking for)</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            ከተማ (City)
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-medium text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-all"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sefer/Location Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            ሰፈር (Sefer)
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-medium text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-all"
          >
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* House Type Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            የቤት አይነት (Type)
          </label>
          <select
            value={filters.houseType}
            onChange={(e) => onFilterChange({ houseType: e.target.value })}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-medium text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-all"
          >
            {HOUSE_TYPES.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Rooms Count Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5 text-indigo-600" />
            የክፍል ብዛት (Rooms)
          </label>
          <select
            value={filters.roomsCount === 'ALL' ? 'ALL' : String(filters.roomsCount)}
            onChange={(e) => onFilterChange({ roomsCount: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value) })}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-medium text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="ALL">ማንኛውም ብዛት (All)</option>
            <option value="1">1 ክፍል (1 Room)</option>
            <option value="2">2 ክፍሎች (2 Rooms)</option>
            <option value="3">3 ክፍሎች (3 Rooms)</option>
            <option value="4">4+ ክፍሎች (4+ Rooms)</option>
          </select>
        </div>

        {/* Budget Filter */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-amber-500" />
              ከፍተኛ በጀት
            </label>
            <span className="text-xs font-black text-amber-900 bg-amber-100/80 border border-amber-300/60 px-2 py-0.5 rounded-lg">
              {filters.maxBudget >= 15000 ? '15k+ ብር' : `${filters.maxBudget.toLocaleString()} ብር`}
            </span>
          </div>
          <input
            type="range"
            min={2000}
            max={15000}
            step={500}
            value={filters.maxBudget}
            onChange={(e) => onFilterChange({ maxBudget: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono font-medium">
            <span>2k ብር</span>
            <span>8.5k ብር</span>
            <span>15k+ ብር</span>
          </div>
        </div>

      </div>

      {/* Quick Location Pills for current City */}
      {availableLocations.length > 1 && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            ፈጣን ሰፈር:
          </span>
          {availableLocations.slice(1, 10).map((loc) => {
            const isSelected = filters.location === loc;
            return (
              <button
                key={loc}
                onClick={() => onFilterChange({ location: isSelected ? 'ሁሉም ሰፈሮች (All Sefers)' : loc })}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-100 hover:bg-slate-200/90 text-slate-700'
                }`}
              >
                {loc.split(' ')[0]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
