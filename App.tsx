
import React, { useState, useEffect, useMemo } from 'react';
import { 
  StickyNote, 
  Wallet, 
  CreditCard, 
  Plus, 
  Search, 
  LogOut, 
  Trash2, 
  Save, 
  Paperclip, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  User,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  X
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- AUTH & CONFIG PLACEHOLDERS ---
const SUPABASE_URL = "https://qlzqhbxynfardhfdpscj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsenFoYnh5bmZhcmRoZmRwc2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDAwMTMsImV4cCI6MjA4NjI3NjAxM30.5UeR01E-ch1732dkoSU5SYU9JE1Tsoafqlesag9hDAs
";

// Initialize Supabase
const supabase = (SUPABASE_URL !== "https://qlzqhbxynfardhfdpscj.supabase.co") 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

// --- TYPES ---
type Tab = 'notes' | 'budget' | 'payment';

interface Note {
  id: string;
  title: string;
  content: string;
  media_url?: string;
  created_at: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  created_at: string;
}

// --- COMPONENTS ---

const AuthScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!supabase) {
      alert("Supabase credentials not configured.");
      onLogin({ email: "guest@studio.com", full_name: "Guest User" });
      return;
    }
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!supabase) {
      // Mock login for development
      setTimeout(() => {
        onLogin({ email });
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { data, error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (data.user) onLogin(data.user);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-xl border border-gray-100 animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Shield className="text-white" size={28} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-1">Welcome to Studio</h1>
        <p className="text-slate-500 text-center mb-10 text-sm">Elevated management for your digital life.</p>
        
        

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold tracking-widest">Or email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                placeholder="Email Address"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <button 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? "Processing..." : isLogin ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors underline underline-offset-4"
          >
            {isLogin ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [budget, setBudget] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    // Initial data load
    setNotes([
      { id: '1', title: 'Creative Session Notes', content: 'Focus on minimalistic design for the new dashboard. Bright colors, lots of white space, and clear typography.', created_at: new Date().toISOString() },
      { id: '2', title: 'Project Roadmap', content: '1. Auth Integration\n2. Note Editor\n3. Budget Tracker\n4. Payment Gateways.', created_at: new Date().toISOString() }
    ]);
    setBudget([
      { id: '1', type: 'income', amount: 4500, category: 'Consultancy', description: 'Web redesign project', created_at: new Date().toISOString() },
      { id: '2', type: 'expense', amount: 80, category: 'Supplies', description: 'Stationary and ink', created_at: new Date().toISOString() }
    ]);

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setUser(session.user);
      });
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
    }
  }, []);

  const totalBalance = useMemo(() => {
    return budget.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
  }, [budget]);

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900">
      {/* Sidebar */}
      <nav className="w-20 md:w-64 flex flex-col border-r border-gray-100 h-full p-6 bg-gray-50/50">
        <div className="mb-12 flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
            <Shield size={18} className="text-white" />
          </div>
          <span className="hidden md:block font-extrabold text-lg tracking-tight text-slate-900">STUDIO</span>
        </div>

        <div className="flex-1 space-y-1.5">
          <SidebarItem 
            icon={<StickyNote size={20} />} 
            label="Journals" 
            active={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')} 
          />
          <SidebarItem 
            icon={<Wallet size={20} />} 
            label="Finances" 
            active={activeTab === 'budget'} 
            onClick={() => setActiveTab('budget')} 
          />
          <SidebarItem 
            icon={<CreditCard size={20} />} 
            label="Payments" 
            active={activeTab === 'payment'} 
            onClick={() => setActiveTab('payment')} 
          />
        </div>

        <div className="pt-6 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-3 p-2 mb-4">
             <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <User size={18} className="text-indigo-600" />
             </div>
             <div className="hidden md:block overflow-hidden">
                <p className="text-xs font-bold truncate text-slate-800">{user.email?.split('@')[0]}</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Business Tier</p>
             </div>
          </div>
          <button 
            onClick={() => supabase ? supabase.auth.signOut() : setUser(null)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut size={20} />
            <span className="hidden md:block font-semibold text-sm">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white p-6 md:p-10 custom-scrollbar relative">
        <div className="max-w-6xl mx-auto h-full">
          {activeTab === 'notes' && (
            <div className="animate-fade-in-up h-full flex flex-col">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Journals</h2>
                  <p className="text-slate-500 mt-2 font-medium">Your sanctuary for thoughts and digital assets.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Find a memory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 w-full md:w-80 transition-all font-medium"
                    />
                  </div>
                  <button 
                    onClick={() => setEditingNote({ id: Date.now().toString(), title: '', content: '', created_at: new Date().toISOString() })}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 rounded-2xl text-white font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
                  >
                    <Plus size={20} />
                    <span>Create</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.content.toLowerCase().includes(searchTerm.toLowerCase())).map(note => (
                  <div 
                    key={note.id} 
                    onClick={() => setEditingNote(note)}
                    className="studio-card p-6 rounded-3xl cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{note.title || 'Untitled'}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-4 leading-relaxed font-medium">
                      {note.content || <span className="italic opacity-50">Empty thought...</span>}
                    </p>
                    {note.media_url && (
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 py-1 px-2 rounded-lg w-fit">
                            <Paperclip size={12} /> media attached
                        </div>
                    )}
                  </div>
                ))}
                {notes.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                    <StickyNote size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">Your journal is empty.</p>
                  </div>
                )}
              </div>

              {/* Note Editor Overlay */}
              {editingNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95 backdrop-blur-md animate-in fade-in duration-300">
                  <div className="w-full max-w-4xl h-full max-h-[90vh] flex flex-col bg-white border border-gray-100 rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="p-8 flex items-center justify-between border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <StickyNote size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Journal Entry</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Editing Mode</p>
                            </div>
                        </div>
                        <button onClick={() => setEditingNote(null)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                            <X size={20} className="text-slate-900" />
                        </button>
                    </div>

                    <div className="flex-1 p-10 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                        <input 
                        className="w-full bg-transparent text-4xl font-extrabold border-none focus:ring-0 placeholder:text-gray-100 text-slate-900 tracking-tight"
                        placeholder="Project Genesis"
                        value={editingNote.title}
                        onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                        />
                        
                        <textarea 
                        className="w-full flex-1 bg-transparent border-none focus:ring-0 text-slate-600 text-lg leading-relaxed placeholder:text-gray-200 resize-none"
                        placeholder="Capture your brilliance..."
                        value={editingNote.content}
                        onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                        />
                    </div>
                    
                    <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                          <Paperclip size={18} />
                          <span>Attach Asset</span>
                        </button>
                        <button 
                          onClick={() => {
                            setNotes(notes.filter(n => n.id !== editingNote.id));
                            setEditingNote(null);
                          }}
                          className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest"
                        >
                          <Trash2 size={18} />
                          <span>Delete</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => {
                          const exists = notes.find(n => n.id === editingNote.id);
                          if (exists) {
                            setNotes(notes.map(n => n.id === editingNote.id ? editingNote : n));
                          } else {
                            setNotes([editingNote, ...notes]);
                          }
                          setEditingNote(null);
                        }}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-white font-extrabold shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all active:scale-[0.98]"
                      >
                        <Save size={20} />
                        Save Entry
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="animate-fade-in-up">
              <div className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Capital</h2>
                <p className="text-slate-500 mt-2 font-medium">Smart flow analysis for your studio resources.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <StatCard 
                  label="Available Capital" 
                  value={`$${totalBalance.toLocaleString()}`} 
                  icon={<Wallet size={24} />} 
                  trend="+12%" 
                  color="indigo" 
                />
                <StatCard 
                  label="Studio Income" 
                  value={`$${budget.filter(b => b.type === 'income').reduce((a,c) => a+c.amount, 0).toLocaleString()}`} 
                  icon={<TrendingUp size={24} />} 
                  trend="+5.4%" 
                  color="green" 
                />
                <StatCard 
                  label="Operational Costs" 
                  value={`$${budget.filter(b => b.type === 'expense').reduce((a,c) => a+c.amount, 0).toLocaleString()}`} 
                  icon={<TrendingDown size={24} />} 
                  trend="-2.1%" 
                  color="red" 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="font-bold text-xl text-slate-900">Ledger</h3>
                    <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Audit History</button>
                  </div>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                    {budget.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[24px] hover:border-indigo-100 transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {item.type === 'income' ? <Plus size={20} /> : <TrendingDown size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.category}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-extrabold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                          </p>
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-[40px] p-8 h-fit sticky top-20">
                  <h3 className="font-extrabold text-2xl text-slate-900 mb-8">Record Flow</h3>
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Classification</label>
                      <input className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600/30" placeholder="e.g. Licensing" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Value (USD)</label>
                      <input type="number" className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600/30" placeholder="0.00" />
                    </div>
                    <div className="flex gap-2 p-1 bg-white border border-gray-100 rounded-2xl">
                      <button className="flex-1 py-3 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100">Income</button>
                      <button className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Expense</button>
                    </div>
                    <button className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-xl transition-all active:scale-[0.98] mt-4">
                      Execute Entry
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="animate-fade-in-up h-full flex flex-col items-center justify-center pb-20">
              <div className="w-full max-w-lg bg-white rounded-[48px] overflow-hidden shadow-2xl border border-gray-100">
                <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-indigo-400 text-[10px] font-bold uppercase tracking-[6px] mb-4">Official Service Tier</h3>
                        <h2 className="text-4xl font-extrabold text-white tracking-tight">Chin Cheong Ghee</h2>
                        <div className="w-12 h-1 bg-indigo-600 mx-auto mt-6 rounded-full"></div>
                        <p className="text-slate-400 text-sm mt-4 font-medium italic">Strategic Consultation Partnership</p>
                    </div>
                </div>
                
                <div className="p-12 space-y-10">
                    <div className="flex items-center justify-between bg-gray-50 p-6 rounded-3xl">
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Invoice Amount</span>
                        <span className="text-3xl font-black text-slate-900">$450.00</span>
                    </div>

                    <div className="space-y-4">
                        <button className="w-full py-5 bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-3xl flex items-center justify-center gap-3 font-extrabold transition-all shadow-xl shadow-[#0070ba]/10 active:scale-[0.98]">
                            <span className="italic font-black text-2xl tracking-tighter">PayPal</span>
                            <span className="text-sm font-bold uppercase tracking-widest">Express</span>
                        </button>
                        
                        <button className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl flex items-center justify-center gap-4 font-extrabold transition-all shadow-xl shadow-slate-200 active:scale-[0.98]">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                <CreditCard size={18} />
                            </div>
                            <span className="uppercase tracking-widest">Stripe Secure</span>
                        </button>
                    </div>

                    <div className="pt-2 text-center">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[3px] leading-relaxed">
                            Global Secure Settlement System<br/> 
                            Studio Protection Enabled
                        </p>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 group
        ${active 
          ? 'bg-white text-indigo-600 shadow-md border border-gray-100' 
          : 'text-slate-400 hover:text-slate-900 hover:bg-gray-100/50'}
      `}
    >
      <div className={`${active ? 'text-indigo-600 scale-110' : 'group-hover:text-slate-900 transition-all'}`}>
        {icon}
      </div>
      <span className={`hidden md:block font-bold text-sm tracking-tight ${active ? 'text-slate-900' : ''}`}>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 hidden md:block"></div>}
    </button>
  );
}

function StatCard({ label, value, icon, trend, color }: { label: string, value: string, icon: React.ReactNode, trend: string, color: 'indigo' | 'green' | 'red' }) {
  const colorScheme = {
    indigo: { 
      bg: 'bg-indigo-50', 
      text: 'text-indigo-600', 
      border: 'border-indigo-100', 
      glow: 'shadow-indigo-50' 
    },
    green: { 
      bg: 'bg-green-50', 
      text: 'text-green-600', 
      border: 'border-green-100', 
      glow: 'shadow-green-50' 
    },
    red: { 
      bg: 'bg-red-50', 
      text: 'text-red-600', 
      border: 'border-red-100', 
      glow: 'shadow-red-50' 
    }
  };

  const scheme = colorScheme[color];

  return (
    <div className={`bg-white border ${scheme.border} rounded-[32px] p-8 relative overflow-hidden group shadow-sm ${scheme.glow}`}>
        <div className={`absolute -top-4 -right-4 w-24 h-24 ${scheme.bg} rounded-full opacity-50 transition-transform duration-700 group-hover:scale-150`}></div>
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${scheme.bg} ${scheme.text}`}>
                    {icon}
                </div>
                <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full ${scheme.bg} ${scheme.text} uppercase tracking-widest`}>
                    {trend}
                </span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px] mb-2">{label}</p>
            <h4 className="text-3xl font-black text-slate-900">{value}</h4>
        </div>
    </div>
  );
}
