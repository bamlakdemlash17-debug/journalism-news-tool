import React from 'react';
import { RoommateListing } from '../types';
import { MapPin, Phone, MessageCircle, Bookmark, CheckCircle2, BedDouble, Building2, Trash2 } from 'lucide-react';

interface ListingCardProps {
  listing: RoommateListing;
  onSelect: (listing: RoommateListing) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
  onDelete?: (e: React.MouseEvent, id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  isSaved,
  onToggleSave,
  onDelete,
}) => {
  const isHaveRoom = listing.role === 'ክፍል አለኝ (Have a Room)';

  return (
    <div
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-indigo-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Top Image Banner */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={listing.photo}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20" />

        {/* Role Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-md backdrop-blur-md ${
              isHaveRoom
                ? 'bg-indigo-600/95 text-white border border-indigo-400/30'
                : 'bg-amber-500/95 text-slate-950 border border-amber-300/40'
            }`}
          >
            {isHaveRoom ? <BedDouble className="w-3.5 h-3.5" /> : <span>🔍</span>}
            {isHaveRoom ? 'ክፍል አለኝ' : 'ክፍል ፈልጋለሁ'}
          </span>

          {listing.isSample && (
            <span className="bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
              ናሙና
            </span>
          )}
        </div>

        {/* Top Right Action Buttons (Save & Delete) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('ይህን ማስታወቂያ በእርግጥ መሰረዝ ይፈልጋሉ?')) {
                  onDelete(e, listing.id);
                }
              }}
              className="p-2 rounded-full bg-slate-900/60 hover:bg-rose-600 text-slate-300 hover:text-white backdrop-blur-md transition-all duration-200 shadow-md cursor-pointer"
              title="ማስታወቂያውን ሰርዝ (Delete)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Save Bookmark Button */}
          <button
            onClick={(e) => onToggleSave(e, listing.id)}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md cursor-pointer ${
              isSaved
                ? 'bg-amber-500 text-slate-950 scale-105'
                : 'bg-slate-900/60 text-white hover:bg-white hover:text-indigo-600'
            }`}
            title={isSaved ? 'ከዝርዝር አውጣ' : 'አስቀምጥ (Save)'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Price & Posted Date */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <span className="text-xl sm:text-2xl font-black font-sans tracking-tight text-amber-400 drop-shadow-xs">
              {listing.budget.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-200 ml-1">ብር/ወር</span>
          </div>
          <span className="text-[11px] bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded-lg font-medium text-slate-300 border border-slate-700/50">
            {listing.postedDate}
          </span>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & City Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition-colors flex items-center gap-1.5 font-sans truncate">
                {listing.name}
                <CheckCircle2 className="w-4 h-4 text-indigo-500 inline shrink-0" />
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {listing.occupation} • {listing.age} ዓመት
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
                <MapPin className="w-3 h-3 text-indigo-600" />
                {listing.city ? listing.city.split(' ')[0] : 'አዲስ አበባ'}
              </span>
            </div>
          </div>

          {/* Sefer & House Type Pill info */}
          <div className="flex items-center gap-2 my-2.5 text-xs text-slate-600 bg-slate-50/90 p-2.5 rounded-xl border border-slate-100 font-medium">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              📍 {listing.location ? listing.location.split(' ')[0] : ''}
            </span>
            <span className="text-slate-300">•</span>
            <span className="truncate flex items-center gap-1 text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-slate-400 inline" />
              {listing.houseType ? listing.houseType.split(' ')[0] : 'ቤት'} ({listing.roomsCount || 1} ክፍል)
            </span>
          </div>

          {/* Bio Snippet */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 my-2 leading-relaxed">
            {listing.description}
          </p>

          {/* Lifestyle Tags */}
          <div className="flex flex-wrap gap-1.5 my-3">
            {listing.lifestyle && listing.lifestyle.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="bg-slate-100/90 border border-slate-200/80 text-slate-700 text-[11px] px-2 py-0.5 rounded-lg font-semibold"
              >
                {tag.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions (Direct Mobile Call & Telegram) */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 mt-auto">
          <a
            href={`tel:${listing.phone.replace(/\s+/g, '')}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition-all text-center active:scale-95 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>በቀጥታ ደውል</span>
          </a>
          {listing.telegram ? (
            <a
              href={`https://t.me/${listing.telegram.replace('@', '').trim()}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 text-xs font-bold py-2.5 px-3 rounded-xl transition-all text-center active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>ቴሌግራም</span>
            </a>
          ) : (
            <button
              onClick={() => onSelect(listing)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl transition-all text-center cursor-pointer"
            >
              ሙሉ መረጃ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
