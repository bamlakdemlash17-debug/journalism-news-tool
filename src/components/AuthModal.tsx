import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Sparkles, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'GUEST'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'በGoogle መግባት አልተሳካም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        if (!email || !password) {
          setError('እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ');
          setLoading(false);
          return;
        }
        await signInWithEmail(email, password);
      } else if (mode === 'SIGNUP') {
        if (!email || !password) {
          setError('እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
      } else if (mode === 'GUEST') {
        await signInAsGuest(guestName || 'እንግዳ ተጠቃሚ');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      let msg = 'የመግባት ሂደት አልተሳካም፤ እባክዎ እንደገና ይሞክሩ።';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'የተሳሳተ ኢሜይል ወይም የይለፍ ቃል ነው።';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'ይህ ኢሜይል ቀደም ብሎ ተመዝግቧል፤ እባክዎ "ይግቡ" የሚለውን ይምረጡ።';
      } else if (err.code === 'auth/weak-password') {
        msg = 'የይለፍ ቃሉ ጠንካራ መሆን አለበት (ቢያንስ 6 ቁምፊዎች)።';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ።';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient badge */}
        <div className="p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              {mode === 'SIGNUP' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {mode === 'LOGIN' && 'ይግቡ (Sign In)'}
                {mode === 'SIGNUP' && 'ይመዝገቡ (Sign Up)'}
                {mode === 'GUEST' && 'ቀጥታ መግቢያ (Quick Guest)'}
              </h2>
              <p className="text-xs text-slate-400">
                ማስታወቂያ ለመልቀቅና ለማስተዳደር
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 p-1.5 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'LOGIN'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ይግቡ (Login)
          </button>
          <button
            type="button"
            onClick={() => { setMode('SIGNUP'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'SIGNUP'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            አዲስ ምዝገባ (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => { setMode('GUEST'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center ${
              mode === 'GUEST'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            በስም ብቻ (Guest)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Error message */}
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Google Sign In */}
          {mode !== 'GUEST' && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-transform active:scale-98 cursor-pointer shadow-md disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>በ Google ይቀጥሉ (Continue with Google)</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">ወይም በኢሜይል</span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>
            </>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" /> ሙሉ ስም (Full Name)
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="ለምሳሌ: ዳዊት ተስፋዬ"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            {mode === 'GUEST' ? (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> የስም መጠሪያ (Nickname/Name)
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="ለምሳሌ: ሰላም"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  የይለፍ ቃል ሳያስፈልግዎት በቀላሉ ስምዎን አስገብተው ማስታወቂያ ለመለጠፍ ይችላሉ።
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> ኢሜይል አድራሻ (Email)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" /> የይለፍ ቃል (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-lg mt-2 disabled:opacity-50 ${
                mode === 'GUEST'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white shadow-indigo-600/30'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>በመፈተሽ ላይ...</span>
                </>
              ) : mode === 'LOGIN' ? (
                <span>ይግቡ (Sign In)</span>
              ) : mode === 'SIGNUP' ? (
                <span>ይመዝገቡ (Sign Up)</span>
              ) : (
                <span>ቀጥታ ግባ (Enter as Guest)</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
