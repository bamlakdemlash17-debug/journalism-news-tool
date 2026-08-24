import React, { useState, useEffect } from 'react';
import { RoommateListing } from '../types';
import { CITIES, LOCATIONS_BY_CITY, HOUSE_TYPES, LIFESTYLE_TAGS, AMENITIES_LIST } from '../data';
import { useAuth } from '../context/AuthContext';
import { X, PlusCircle, User, MapPin, Wallet, Phone, MessageCircle, FileText, CheckSquare, Sparkles, Building2, BedDouble } from 'lucide-react';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newListing: RoommateListing) => void;
}

export const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { user } = useAuth();

  const [role, setRole] = useState<'ፈልጋለሁ (Looking for Room)' | 'ክፍል አለኝ (Have a Room)'>('ክፍል አለኝ (Have a Room)');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(24);
  const [gender, setGender] = useState<'ወንድ (Male)' | 'ሴት (Female)'>('ወንድ (Male)');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('አዲስ አበባ (Addis Ababa)');
  const [location, setLocation] = useState('ቦሌ (Bole)');
  const [exactLocation, setExactLocation] = useState('');
  const [houseType, setHouseType] = useState('ኮንዶሚኒየም (Condominium)');
  const [roomsCount, setRoomsCount] = useState(2);
  const [budget, setBudget] = useState<number | ''>(6500);
  const [phone, setPhone] = useState('+251 ');
  const [telegram, setTelegram] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLifestyles, setSelectedLifestyles] = useState<string[]>(['አያጨስም (Non-smoker)', 'ሰራተኛ (Professional)']);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['ዋይፋይ (WiFi)', 'ውሃ ሁልጊዜ ያለ (24/7 Water)']);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);

  useEffect(() => {
    if (user?.displayName && !name) {
      setName(user.displayName);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;


  const toggleLifestyle = (tag: string) => {
    setSelectedLifestyles((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !occupation || !budget || !phone || !description) {
      alert('እባክዎ ዋና ዋና መረጃዎችን ይሙሉ (ስም፣ ስራ፣ በጀት፣ ስልክ፣ መግለጫ)');
      return;
    }

    const randomAvatar = gender === 'ወንድ (Male)' 
      ? `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80`
      : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80`;

    const newListing: RoommateListing = {
      id: Date.now().toString(),
      name,
      age: Number(age) || 22,
      gender,
      photo: randomAvatar,
      role,
      country: 'ኢትዮጵያ (Ethiopia)',
      city,
      location,
      exactLocation: exactLocation || `${location} ዋና መንገድ`,
      houseType,
      roomsCount: Number(roomsCount) || 1,
      budget: Number(budget) || 5000,
      occupation,
      lifestyle: selectedLifestyles,
      description,
      phone,
      telegram: telegram ? (telegram.startsWith('@') ? telegram : `@${telegram}`) : undefined,
      postedDate: 'አሁን (Just now)',
      roomDetails: role === 'ክፍል አለኝ (Have a Room)' ? {
        bedrooms,
        bathrooms,
        amenities: selectedAmenities,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        ]
      } : undefined
    };

    onSubmit(newListing);
    onClose();
  };

  const isHaveRoom = role === 'ክፍል አለኝ (Have a Room)';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-sans tracking-tight">አዲስ ማስታወቂያ ልቀቅ (Post Listing)</h2>
              <p className="text-xs text-indigo-300">የሚፈልጉትን የቤት ኪራይ ተባባሪ በፍጥነት ያግኙ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="overflow-y-auto p-5 sm:p-8 space-y-5 flex-1">
          
          {/* Role Choice Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              የማስታወቂያው አይነት ምንድን ነው? (Listing Type)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('ክፍል አለኝ (Have a Room)')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isHaveRoom 
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-sm' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span>🏠</span>
                <span>ክፍል አለኝ (ሸር ፈላጊ)</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ፈልጋለሁ (Looking for Room)')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  !isHaveRoom 
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 shadow-sm' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span>🔍</span>
                <span>ክፍል ፈልጋለሁ (ሩሜት ፈላጊ)</span>
              </button>
            </div>
          </div>

          {/* Personal Bio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600" /> ሙሉ ስም (Name) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ለምሳሌ: አበበ ከበደ"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ስራ / ትምህርት (Occupation) *</label>
              <input
                type="text"
                required
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="ለምሳሌ: ባንክ ሰራተኛ / ተማሪ"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ፆታ (Gender)</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-900"
              >
                <option value="ወንድ (Male)">ወንድ (Male)</option>
                <option value="ሴት (Female)">ሴት (Female)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ዕድሜ (Age)</label>
              <input
                type="number"
                min={18}
                max={70}
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="25"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* City & Sefer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" /> ከተማ (City) *
              </label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  const sefers = LOCATIONS_BY_CITY[e.target.value] || ['ቦሌ (Bole)'];
                  setLocation(sefers.filter(l => !l.includes('ሁሉም'))[0] || 'ቦሌ (Bole)');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-slate-900"
              >
                {CITIES.filter(c => !c.includes('ሁሉም')).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> ሰፈር (Sefer) *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-900"
              >
                {(LOCATIONS_BY_CITY[city] || []).filter((l) => !l.includes('ሁሉም')).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* House Type & Rooms & Exact Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" /> የቤት አይነት *
              </label>
              <select
                value={houseType}
                onChange={(e) => setHouseType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-900"
              >
                {HOUSE_TYPES.filter(h => !h.includes('ሁሉም')).map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-indigo-600" /> የክፍል ብዛት *
              </label>
              <select
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-900"
              >
                <option value={1}>1 ክፍል</option>
                <option value={2}>2 ክፍሎች</option>
                <option value={3}>3 ክፍሎች</option>
                <option value={4}>4+ ክፍሎች</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> የተለየ ቦታ (ህንጻ/መንገድ)
              </label>
              <input
                type="text"
                value={exactLocation}
                onChange={(e) => setExactLocation(e.target.value)}
                placeholder="ለምሳሌ: አትላስ ሆቴል አጠገብ"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-amber-500" />
              {isHaveRoom ? 'የአንድ ሰው የኪራይ ድርሻ (ብር/ወር) *' : 'የሚችሉት በጀት (ብር/ወር) *'}
            </label>
            <input
              type="number"
              required
              min={500}
              max={50000}
              value={budget}
              onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="ለምሳሌ: 6000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-bold text-amber-900"
            />
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-indigo-600" /> ስልክ ቁጥር *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 911 223344"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-sky-500" /> ቴሌግራም ዩዘርኔም (አማራጭ)
              </label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="ለምሳሌ: @myusername"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-600" /> ስለ ራስዎ ወይም ስለ ቤቱ ዝርዝር መግለጫ *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isHaveRoom 
                ? "ስለ ቤቱ ስፋት፣ የውሃ መስመር፣ በስንተኛ ፎቅ ላይ እንደሆነ እና ምን አይነት ሰው አብሮዎት እንዲኖር እንደሚፈልጉ ይጻፉ..."
                : "ምን አይነት ቤት እንደሚፈልጉ፣ ከአንዲት ሴት ወይም ወንድ ጋር መሆን እንደሚፈልጉ እና ማንነትዎን በአጭሩ ይጻፉ..."
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white leading-relaxed text-slate-900"
            />
          </div>

          {/* Lifestyle Tags Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> የሚወክሉዎትን ባህሪያት ይምረጡ (Habits)
            </label>
            <div className="flex flex-wrap gap-2">
              {LIFESTYLE_TAGS.map((tag) => {
                const checked = selectedLifestyles.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleLifestyle(tag)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all cursor-pointer ${
                      checked
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {checked ? '✓ ' : '+ '}{tag.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room amenities if Have Room */}
          {isHaveRoom && (
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-600" /> ቤቱ ውስጥ ያሉ አገልግሎቶች (Amenities)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES_LIST.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`text-left text-xs p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                        checked
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${checked ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'}`}>
                        {checked && '✓'}
                      </span>
                      <span className="truncate">{amenity.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ተወው (Cancel)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-sm shadow-lg shadow-indigo-600/30 cursor-pointer transition-transform active:scale-95"
            >
              ማስታወቂያውን ልቀቅ (Publish Now)
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
