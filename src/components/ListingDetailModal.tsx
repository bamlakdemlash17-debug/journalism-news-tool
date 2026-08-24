import React, { useState } from 'react';
import { RoommateListing } from '../types';
import { X, MapPin, Phone, MessageCircle, Bookmark, ShieldAlert, CheckCircle2, BedDouble, Bath, Sparkles, Calendar, User, Building2 } from 'lucide-react';

interface ListingDetailModalProps {
  listing: RoommateListing | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  if (!listing) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isHaveRoom = listing.role === 'ክፍል አለኝ (Have a Room)';
  const allImages = [listing.photo, ...(listing.roomDetails?.images || [])];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full p-2.5 transition-all cursor-pointer shadow-lg backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          
          {/* Gallery Carousel */}
          <div className="relative h-64 sm:h-80 w-full bg-slate-950">
            <img
              src={allImages[activeImageIndex]}
              alt={listing.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/30" />

            {/* Role & Save Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-black text-white shadow-lg backdrop-blur-md ${
                isHaveRoom ? 'bg-indigo-600 border border-indigo-400/40' : 'bg-amber-500 text-slate-950 border border-amber-300/40'
              }`}>
                {listing.role}
              </span>
            </div>

            <button
              onClick={(e) => onToggleSave(e, listing.id)}
              className={`absolute bottom-4 right-4 p-3 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                isSaved ? 'bg-amber-500 text-slate-950 scale-105' : 'bg-slate-900/70 text-white hover:bg-white hover:text-indigo-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Title & Price overlay */}
            <div className="absolute bottom-4 left-4 right-20 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-indigo-600/80 border border-indigo-400/40 text-white text-xs px-2.5 py-0.5 rounded-lg font-bold">
                  <MapPin className="w-3 h-3 inline mr-1 text-amber-400" />
                  {listing.city} • {listing.location}
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1 bg-slate-900/70 px-2 py-0.5 rounded-lg">
                  <Calendar className="w-3 h-3 text-indigo-300" /> {listing.postedDate}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans text-amber-400 drop-shadow-sm">
                {listing.budget.toLocaleString()} <span className="text-base font-bold text-slate-200">ብር/ወር</span>
              </h2>
            </div>
          </div>

          {/* Thumbnails switcher */}
          {allImages.length > 1 && (
            <div className="flex gap-2 p-3 bg-slate-900 border-b border-slate-800 overflow-x-auto">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details Body */}
          <div className="p-5 sm:p-8 space-y-6">
            
            {/* Person Profile Banner */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-50/80 via-slate-50 to-amber-50/50 border border-indigo-100/80 p-4 sm:p-5 rounded-2xl">
              <img src={listing.photo} alt={listing.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-1.5 font-sans truncate">
                  {listing.name}
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {listing.occupation} • {listing.gender} • {listing.age} ዓመት
                </p>
              </div>
            </div>

            {/* Exact Location & House Info */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                ትክክለኛ አድራሻ (Location Details)
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {listing.city}, {listing.location}
                {listing.exactLocation && ` — ${listing.exactLocation}`}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-medium text-slate-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  የቤት አይነት: {listing.houseType}
                </span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-medium text-slate-700 flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-indigo-600" />
                  የክፍል ብዛት: {listing.roomsCount}
                </span>
              </div>
            </div>

            {/* Room Specs if available */}
            {listing.roomDetails && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">መኝታ ቤቶች</p>
                    <p className="font-bold text-slate-900 text-sm">{listing.roomDetails.bedrooms} መኝታ</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">ሽንት ቤት</p>
                    <p className="font-bold text-slate-900 text-sm">{listing.roomDetails.bathrooms} መታጠቢያ</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3 col-span-2 sm:col-span-1">
                  <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-800">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">የሚፈለገው</p>
                    <p className="font-bold text-slate-900 text-sm">1 ተባባሪ ሰው</p>
                  </div>
                </div>
              </div>
            )}

            {/* Full Bio / Description */}
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                ስለ ማስታወቂያው ዝርዝር (Description)
              </h4>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80">
                {listing.description}
              </p>
            </div>

            {/* Lifestyle & Habits */}
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-2.5">የባህሪ እና የአኗኗር ሁኔታ (Lifestyle)</h4>
              <div className="flex flex-wrap gap-2">
                {listing.lifestyle.map((tag, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold text-xs px-3 py-1.5 rounded-xl">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities if available */}
            {listing.roomDetails?.amenities && listing.roomDetails.amenities.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-2.5">የቤቱ አገልግሎቶች (Amenities)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {listing.roomDetails.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200/70">
                      <span className="text-indigo-600 font-bold">✓</span> {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety & Security Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">ለደህንነትዎ ሲባል የተሰጠ ማሳሰቢያ:</p>
                <p className="text-amber-900/90 leading-normal">
                  ቤቱን በአካል ሳያዩ ወይም ውል ሳይዋዋሉ በስልክ ወይም በባንክ ምንም አይነት የቅድሚያ ክፍያ አይፈጽሙ። በአካል ሲገናኙ ህዝብ በሚበዛበት ቦታ ይሁን።
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Sticky Footer Contact Action */}
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${listing.phone}`}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm sm:text-base transition-transform active:scale-98 text-center cursor-pointer"
          >
            <Phone className="w-5 h-5 text-amber-400" />
            <span>በስልክ ደውል ({listing.phone})</span>
          </a>

          {listing.telegram && (
            <a
              href={`https://t.me/${listing.telegram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="sm:w-auto bg-sky-500 hover:bg-sky-400 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 text-sm sm:text-base transition-transform active:scale-98 text-center cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>በቴሌግራም አናግር ({listing.telegram})</span>
            </a>
          )}
        </div>

      </div>
    </div>
  );
};
