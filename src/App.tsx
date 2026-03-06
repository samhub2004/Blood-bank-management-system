import React, { useState, useEffect, useMemo } from 'react';
import { 
  Droplet, 
  Users, 
  Activity, 
  Plus, 
  Search, 
  Bell, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  Heart,
  ArrowUpRight,
  Filter,
  Brain,
  Truck,
  MessageSquare,
  Send,
  Loader2,
  Navigation,
  LogOut,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Edit2,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BloodType, BloodStock, BloodRequest, Donor, ChatMessage, TransportRoute, AuthState, UserRole } from './types';
import { INITIAL_STOCK, MOCK_REQUESTS, MOCK_DONORS, HISTORICAL_DATA } from './constants';
import { geminiService } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Login = ({ onLogin }: { onLogin: (email: string, role: UserRole, name: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<UserRole>('user');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo credentials
    if (loginType === 'admin') {
      if (email === 'admin@vitalflow.com' && password === 'admin123') {
        onLogin(email, 'admin', 'System Administrator');
      } else {
        setError('Invalid admin credentials. (Use admin@vitalflow.com / admin123)');
      }
    } else if (loginType === 'hospital') {
      if (email === 'hospital@citymed.com' && password === 'hospital123') {
        onLogin(email, 'hospital', 'City Medical Center');
      } else {
        setError('Invalid hospital credentials. (Use hospital@citymed.com / hospital123)');
      }
    } else {
      if (email === 'user@example.com' && password === 'user123') {
        onLogin(email, 'user', 'John Donor');
      } else {
        setError('Invalid user credentials. (Use user@example.com / user123)');
      }
    }
  };

  return (
    <div className="min-h-screen cinematic-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-dark w-full max-w-md rounded-[2.5rem] overflow-hidden relative z-10"
      >
        <div className="p-10 text-center relative overflow-hidden border-b border-white/5">
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/40"
            >
              <Droplet className="w-12 h-12 text-white fill-current" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2 text-glow">VitalFlow</h2>
            <p className="text-slate-400 text-sm font-medium">Precision Blood Management System</p>
          </div>
        </div>

        <div className="p-10">
          <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 border border-white/5">
            {[
              { id: 'user', icon: UserIcon, label: 'Donor' },
              { id: 'hospital', icon: MapPin, label: 'Hospital' },
              { id: 'admin', icon: ShieldCheck, label: 'Admin' }
            ].map((type) => (
              <button 
                key={type.id}
                onClick={() => setLoginType(type.id as UserRole)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                  loginType === type.id 
                    ? "bg-white text-slate-900 shadow-xl" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <type.icon className="w-3.5 h-3.5" />
                {type.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={loginType === 'admin' ? "admin@vitalflow.com" : loginType === 'hospital' ? "hospital@citymed.com" : "user@example.com"}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              className={cn(
                "w-full py-4 rounded-2xl text-white font-bold shadow-2xl transition-all active:scale-[0.98]",
                loginType === 'admin' 
                  ? "bg-brand-600 hover:bg-brand-500 shadow-brand-500/20" 
                  : "bg-slate-800 hover:bg-slate-700 shadow-black/20"
              )}
            >
              Initialize Session
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
              {loginType === 'admin' 
                ? "Authorized Personnel Only" 
                : "Secure Access Gateway"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-6 rounded-3xl flex items-start justify-between group card-hover relative overflow-hidden"
  >
    <div className="relative z-10">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-3xl font-display font-bold text-white tracking-tight">{value}</h3>
      {trend && (
        <p className="text-xs mt-3 flex items-center text-emerald-400 font-bold">
          <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
          {trend}
        </p>
      )}
    </div>
    <div className={cn("p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", color)}>
      <Icon className="w-7 h-7" />
    </div>
    {/* Decorative background glow */}
    <div className={cn("absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-40", color.replace('bg-', 'bg-').replace('/20', ''))} />
  </motion.div>
);

const BloodTypeBadge = ({ type }: { type: BloodType }) => {
  const colors: Record<BloodType, string> = {
    'A+': 'bg-red-500/10 text-red-400 border-red-500/20',
    'A-': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'B+': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'B-': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'AB+': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'AB-': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'O+': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'O-': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  };
  return (
    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest backdrop-blur-md", colors[type])}>
      {type}
    </span>
  );
};

const StatusBadge = ({ status }: { status: BloodRequest['status'] }) => {
  const colors: Record<BloodRequest['status'], string> = {
    'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Approved': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Fulfilled': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest backdrop-blur-md", colors[status])}>
      {status}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ user: null });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [stock, setStock] = useState<BloodStock[]>(INITIAL_STOCK);
  const [requests, setRequests] = useState<BloodRequest[]>(MOCK_REQUESTS);
  const [donors, setDonors] = useState<Donor[]>(MOCK_DONORS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);

  // AI & New Features State
  const [aiForecast, setAiForecast] = useState<any>(null);
  const [isForecasting, setIsForecasting] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>([]);
  const [isOptimizingRoute, setIsOptimizingRoute] = useState(false);
  const [donorSearchQuery, setDonorSearchQuery] = useState('');
  const [donationApplications, setDonationApplications] = useState<any[]>([]);

  // Edit & Confirmation States
  const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(null);
  const [confirmingStatus, setConfirmingStatus] = useState<{ id: string, status: BloodRequest['status'] } | null>(null);

  // Form states
  const [newRequest, setNewRequest] = useState<Partial<BloodRequest>>({
    bloodType: 'O+',
    urgency: 'Normal',
    units: 1
  });

  const [newDonor, setNewDonor] = useState<Partial<Donor>>({
    bloodType: 'O+'
  });
  const [newDonationApp, setNewDonationApp] = useState({
    bloodType: 'O+',
    location: '',
    preferredDate: '',
    notes: ''
  });

  // Persist to localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('blood_auth');
    const savedStock = localStorage.getItem('blood_stock');
    const savedRequests = localStorage.getItem('blood_requests');
    const savedDonors = localStorage.getItem('blood_donors');

    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      setAuth(parsedAuth);
      if (parsedAuth.user) {
        setActiveTab(parsedAuth.user.role === 'admin' ? 'dashboard' : parsedAuth.user.role === 'hospital' ? 'requests' : 'donate');
      }
    }
    if (savedStock) setStock(JSON.parse(savedStock));
    if (savedRequests) setRequests(JSON.parse(savedRequests));
    if (savedDonors) setDonors(JSON.parse(savedDonors));
    const savedApps = localStorage.getItem('blood_apps');
    if (savedApps) setDonationApplications(JSON.parse(savedApps));
  }, []);

  useEffect(() => {
    localStorage.setItem('blood_auth', JSON.stringify(auth));
    localStorage.setItem('blood_stock', JSON.stringify(stock));
    localStorage.setItem('blood_requests', JSON.stringify(requests));
    localStorage.setItem('blood_donors', JSON.stringify(donors));
    localStorage.setItem('blood_apps', JSON.stringify(donationApplications));
  }, [auth, stock, requests, donors, donationApplications]);

  const handleLogin = (email: string, role: UserRole, name: string) => {
    setAuth({ user: { email, role, name } });
    setActiveTab(role === 'admin' ? 'dashboard' : role === 'hospital' ? 'requests' : 'donate');
  };

  const handleLogout = () => {
    setAuth({ user: null });
    localStorage.removeItem('blood_auth');
  };

  const totalUnits = useMemo(() => stock.reduce((acc, curr) => acc + curr.units, 0), [stock]);
  const pendingRequests = useMemo(() => requests.filter(r => r.status === 'Pending').length, [requests]);
  const criticalRequests = useMemo(() => requests.filter(r => r.urgency === 'Critical' && r.status === 'Pending').length, [requests]);

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const request: BloodRequest = {
      ...newRequest as BloodRequest,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      requestDate: new Date().toISOString(),
      hospital: auth.user?.role === 'hospital' ? auth.user.name : (newRequest.hospital || 'Unknown Hospital'),
    };
    setRequests([request, ...requests]);
    setIsRequestModalOpen(false);
    setNewRequest({ bloodType: 'O+', urgency: 'Normal', units: 1 });
  };

  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    const donor: Donor = {
      ...newDonor as Donor,
      id: Math.random().toString(36).substr(2, 9),
      lastDonationDate: new Date().toISOString().split('T')[0],
      frequency: 0,
    };
    setDonors([donor, ...donors]);
    setIsDonorModalOpen(false);
    setNewDonor({ bloodType: 'O+' });
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const application = {
      ...newDonationApp,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      date: new Date().toISOString(),
      donorName: auth.user?.name || 'Anonymous'
    };
    setDonationApplications([application, ...donationApplications]);
    setNewDonationApp({ bloodType: 'O+', location: '', preferredDate: '', notes: '' });
  };

  const updateDonationAppStatus = (id: string, status: string) => {
    setDonationApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };

  const updateRequestStatus = (id: string, status: BloodRequest['status']) => {
    setRequests(prev => prev.map(r => {
      if (r.id === id) {
        // If fulfilled, deduct from stock
        if (status === 'Fulfilled' && r.status !== 'Fulfilled') {
          setStock(s => s.map(item => 
            item.type === r.bloodType 
              ? { ...item, units: Math.max(0, item.units - r.units), lastUpdated: new Date().toISOString() }
              : item
          ));
        }
        return { ...r, status };
      }
      return r;
    }));
    setConfirmingStatus(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;
    setRequests(prev => prev.map(r => r.id === editingRequest.id ? editingRequest : r));
    setEditingRequest(null);
  };

  const handleForecast = async () => {
    setIsForecasting(true);
    try {
      const result = await geminiService.forecastDemand(stock, HISTORICAL_DATA);
      setAiForecast(result);
    } catch (error) {
      console.error("Forecasting failed:", error);
    } finally {
      setIsForecasting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const response = await geminiService.chatWithAssistant(chatInput, chatMessages);
      const modelMsg: ChatMessage = { role: 'model', text: response || "I'm sorry, I couldn't process that." };
      setChatMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat failed:", error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleOptimizeRoute = async (origin: string, dest: string) => {
    setIsOptimizingRoute(true);
    try {
      const path = await geminiService.optimizeRoute(origin, dest);
      const newRoute: TransportRoute = {
        id: Math.random().toString(36).substr(2, 9),
        origin,
        destination: dest,
        bloodType: 'O-',
        units: 2,
        status: 'In Transit',
        estimatedArrival: '35 mins',
        optimizedPath: [path || "Optimized Path Found"]
      };
      setTransportRoutes([newRoute, ...transportRoutes]);
    } catch (error) {
      console.error("Route optimization failed:", error);
    } finally {
      setIsOptimizingRoute(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, roles: ['admin'] },
    { id: 'requests', label: 'Blood Requests', icon: Bell, roles: ['admin', 'hospital'] },
    { id: 'applications', label: 'Donation Apps', icon: Heart, roles: ['admin'] },
    { id: 'donate', label: 'Donate Blood', icon: Heart, roles: ['user'] },
    { id: 'donors', label: 'Donors List', icon: Users, roles: ['admin'] },
    { id: 'inventory', label: 'Inventory', icon: Droplet, roles: ['admin', 'user', 'hospital'] },
    { id: 'ai', label: 'AI Insights', icon: Brain, roles: ['admin'] },
    { id: 'transport', label: 'Transport', icon: Truck, roles: ['admin', 'hospital'] },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, roles: ['admin', 'user', 'hospital'] },
  ].filter(item => item.roles.includes(auth.user?.role || ''));

  if (!auth.user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen cinematic-bg overflow-hidden text-slate-200">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="glass-dark border-r border-white/5 flex flex-col z-20"
      >
        <div className="p-8 flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-brand-600 p-2.5 rounded-2xl shadow-lg shadow-brand-500/20"
          >
            <Droplet className="w-6 h-6 text-white fill-current" />
          </motion.div>
          {isSidebarOpen && (
            <span className="font-display font-bold text-2xl tracking-tight text-white text-glow">VitalFlow</span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                activeTab === item.id 
                  ? "bg-white/10 text-white font-bold" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === item.id ? "text-brand-400" : "text-slate-500 group-hover:text-brand-400")} />
              {isSidebarOpen && <span className="text-sm tracking-wide uppercase font-bold">{item.label}</span>}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeNav" 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" 
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-3">
          {isSidebarOpen && auth.user && (
            <div className="px-4 py-4 bg-white/5 rounded-[1.5rem] mb-4 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center text-brand-400 border border-brand-500/20">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{auth.user.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold truncate">{auth.user.role}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all group",
                !isSidebarOpen && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">Logout</span>}
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:bg-white/5 transition-all group",
                !isSidebarOpen && "justify-center"
              )}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">Collapse</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 bg-[#0a0a0a]/60 backdrop-blur-2xl border-b border-white/5 px-10 py-6 flex items-center justify-between z-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight capitalize">{activeTab}</h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Operational Overview for {auth.user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            {auth.user?.role === 'admin' && (
              <button 
                onClick={() => setIsDonorModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all active:scale-95"
              >
                <Heart className="w-4 h-4 text-brand-500" />
                Register Donor
              </button>
            )}
            {(auth.user?.role === 'admin' || auth.user?.role === 'hospital') && (
              <button 
                onClick={() => setIsRequestModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-500 shadow-2xl shadow-brand-500/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                New Request
              </button>
            )}
            {auth.user?.role === 'user' && (
              <button 
                onClick={() => setActiveTab('donate')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-500 shadow-2xl shadow-brand-500/20 transition-all active:scale-95"
              >
                <Heart className="w-4 h-4" />
                Apply to Donate
              </button>
            )}
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    title="Total Stock" 
                    value={`${totalUnits} Units`} 
                    icon={Droplet} 
                    color="bg-brand-50 text-brand-600"
                    trend="+12% from last week"
                  />
                  <StatCard 
                    title="Pending Requests" 
                    value={pendingRequests} 
                    icon={Clock} 
                    color="bg-amber-50 text-amber-600"
                  />
                  <StatCard 
                    title="Critical Cases" 
                    value={criticalRequests} 
                    icon={AlertCircle} 
                    color="bg-red-50 text-red-600"
                  />
                  <StatCard 
                    title="Active Donors" 
                    value={donors.length} 
                    icon={Users} 
                    color="bg-blue-50 text-blue-600"
                    trend="+5 new today"
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="font-display font-bold text-xl text-white tracking-tight">Inventory Distribution</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Real-time stock levels across all blood groups</p>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        Live Units
                      </div>
                    </div>
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stock}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis 
                            dataKey="type" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                          />
                          <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                              borderRadius: '16px', 
                              border: '1px solid rgba(255,255,255,0.1)', 
                              backdropFilter: 'blur(10px)',
                              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' 
                            }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Bar dataKey="units" radius={[8, 8, 0, 0]} barSize={40}>
                            {stock.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.units < 5 ? '#f43f5e' : '#e11d48'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2">Urgency</h3>
                    <p className="text-xs text-slate-400 mb-8 font-medium">Request priority distribution</p>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Critical', value: requests.filter(r => r.urgency === 'Critical').length },
                              { name: 'Urgent', value: requests.filter(r => r.urgency === 'Urgent').length },
                              { name: 'Normal', value: requests.filter(r => r.urgency === 'Normal').length },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            { [0,1,2].map((_, index) => (
                              <Cell key={`cell-${index}`} fill={['#f43f5e', '#fb7185', '#fda4af'][index]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                              borderRadius: '16px', 
                              border: '1px solid rgba(255,255,255,0.1)', 
                              backdropFilter: 'blur(10px)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-6">
                      {[
                        { label: 'Critical', color: 'bg-red-500' },
                        { label: 'Urgent', color: 'bg-rose-400' },
                        { label: 'Normal', color: 'bg-rose-200' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]", item.color)}></div>
                            <span className="text-slate-400 font-bold uppercase tracking-widest">{item.label}</span>
                          </div>
                          <span className="font-display font-bold text-white text-lg">
                            {requests.filter(r => r.urgency === item.label).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Requests Table */}
                <div className="glass rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-xl text-white tracking-tight">Recent Requests</h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Latest blood requirements from medical facilities</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('requests')} 
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-brand-400 hover:bg-white/10 hover:text-brand-300 transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                      View Archive <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/5">
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Patient Profile</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Blood Group</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Medical Center</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Priority</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {requests.slice(0, 5).map((request) => (
                          <tr key={request.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-8 py-6">
                              <div className="font-bold text-white group-hover:text-brand-400 transition-colors">{request.patientName}</div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{request.contactNumber}</div>
                            </td>
                            <td className="px-8 py-6">
                              <BloodTypeBadge type={request.bloodType} />
                            </td>
                            <td className="px-8 py-6 text-sm text-slate-400 font-medium">{request.hospital}</td>
                            <td className="px-8 py-6">
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md",
                                request.urgency === 'Critical' ? "text-red-400 bg-red-400/10" : 
                                request.urgency === 'Urgent' ? "text-orange-400 bg-orange-400/10" : "text-slate-400 bg-slate-400/10"
                              )}>
                                {request.urgency}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <StatusBadge status={request.status} />
                            </td>
                            <td className="px-8 py-6 text-xs text-slate-500 font-medium">
                              {new Date(request.requestDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Donation Applications Table */}
                <div className="glass rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden mt-8">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-xl text-white tracking-tight">Recent Donation Applications</h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Latest donation intents from the community</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('applications')} 
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-brand-400 hover:bg-white/10 hover:text-brand-300 transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                      Manage All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/5">
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Donor Name</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Blood Group</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Location</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Preferred Date</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {donationApplications.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-8 py-10 text-center text-slate-500 text-sm font-medium">No recent applications</td>
                          </tr>
                        ) : (
                          donationApplications.slice(0, 5).map((app) => (
                            <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                              <td className="px-8 py-6 font-bold text-white group-hover:text-brand-400 transition-colors">{app.donorName}</td>
                              <td className="px-8 py-6">
                                <BloodTypeBadge type={app.bloodType} />
                              </td>
                              <td className="px-8 py-6 text-sm text-slate-400 font-medium">{app.location}</td>
                              <td className="px-8 py-6 text-xs text-slate-500 font-medium">{app.preferredDate}</td>
                              <td className="px-8 py-6">
                                <span className={cn(
                                  "px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest backdrop-blur-md",
                                  app.status === 'Pending' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                                  app.status === 'Approved' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                )}>
                                  {app.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div 
                key="requests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                  <div className="relative flex-1 max-w-xl group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search requests by patient or medical center..." 
                      className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                      <Filter className="w-5 h-5" />
                    </button>
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                      Total: {requests.length} Active
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {requests.map((request) => (
                    <motion.div 
                      layout
                      key={request.id} 
                      className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group card-hover relative overflow-hidden"
                    >
                      <div className="flex items-start gap-6 relative z-10">
                        <div className={cn(
                          "p-4 rounded-2xl shadow-2xl transition-all duration-500 group-hover:rotate-12",
                          request.urgency === 'Critical' ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/5 text-slate-400 border border-white/10"
                        )}>
                          <Droplet className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h4 className="font-display font-bold text-white text-xl tracking-tight group-hover:text-brand-400 transition-colors">{request.patientName}</h4>
                            <BloodTypeBadge type={request.bloodType} />
                            <StatusBadge status={request.status} />
                          </div>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-500" /> {request.hospital}</span>
                            <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-500" /> {request.contactNumber}</span>
                            <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-brand-500" /> {new Date(request.requestDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 self-end md:self-center relative z-10">
                        {auth.user?.role === 'admin' && (
                          <button 
                            onClick={() => setEditingRequest(request)}
                            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                            title="Edit Request"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        )}
                        {request.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => setConfirmingStatus({ id: request.id, status: 'Rejected' })}
                              className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => setConfirmingStatus({ id: request.id, status: 'Approved' })}
                              className="px-8 py-3 rounded-2xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/20 uppercase tracking-widest active:scale-95"
                            >
                              Approve
                            </button>
                          </>
                        )}
                        {request.status === 'Approved' && (
                          <button 
                            onClick={() => setConfirmingStatus({ id: request.id, status: 'Fulfilled' })}
                            className="px-8 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-2xl shadow-emerald-500/20 uppercase tracking-widest active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark Fulfilled
                          </button>
                        )}
                        {request.status === 'Fulfilled' && (
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            Completed
                          </div>
                        )}
                      </div>

                      {/* Background decoration */}
                      <div className={cn(
                        "absolute -right-10 -bottom-10 w-32 h-32 blur-3xl rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700",
                        request.urgency === 'Critical' ? "bg-red-500" : "bg-brand-500"
                      )} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'transport' && (
              <motion.div 
                key="transport"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                          <h3 className="font-display font-bold text-3xl text-white tracking-tight">Active Deliveries</h3>
                          <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Real-time logistics tracking</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-2xl shadow-brand-500/20">
                          <Truck className="w-7 h-7" />
                        </div>
                      </div>
                      
                      <div className="space-y-6 relative z-10">
                        {requests.filter(r => r.status === 'Approved').map((delivery, i) => (
                          <div key={delivery.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/item">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 border border-brand-500/20">
                                  <Navigation className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-white text-sm tracking-tight">{delivery.hospital}</h4>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Route ID: #TR-{delivery.id.slice(0, 6)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-brand-400 font-display font-bold text-lg leading-none">12 mins</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Estimated Arrival</div>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${40 + i * 20}%` }}
                                className="h-full bg-brand-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] rounded-full"
                              />
                            </div>
                            <div className="flex justify-between mt-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                              <span>Dispatch</span>
                              <span className="text-brand-500">In Transit</span>
                              <span>Destination</span>
                            </div>
                          </div>
                        ))}
                        {requests.filter(r => r.status === 'Approved').length === 0 && (
                          <div className="text-center py-20">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                              <Truck className="w-10 h-10 text-slate-700" />
                            </div>
                            <h4 className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Active Deliveries</h4>
                            <p className="text-slate-600 text-xs mt-2">All approved requests have been fulfilled.</p>
                          </div>
                        )}
                      </div>

                      {/* Background decoration */}
                      <div className="absolute -left-20 -top-20 w-64 h-64 bg-brand-500/5 blur-[100px] rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                      <h3 className="font-display font-bold text-xl text-white mb-8 tracking-tight">Fleet Status</h3>
                      <div className="space-y-6">
                        {[
                          { label: 'Vehicles Active', value: '08', total: '12', color: 'bg-brand-500' },
                          { label: 'On Standby', value: '04', total: '12', color: 'bg-emerald-500' },
                          { label: 'Maintenance', value: '00', total: '12', color: 'bg-slate-700' },
                        ].map((stat) => (
                          <div key={stat.label} className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                              <span className="text-slate-500">{stat.label}</span>
                              <span className="text-white">{stat.value} / {stat.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full", stat.color)} style={{ width: `${(parseInt(stat.value) / parseInt(stat.total)) * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl bg-gradient-to-br from-brand-600/10 to-transparent">
                      <div className="w-12 h-12 rounded-2xl bg-brand-600/20 flex items-center justify-center text-brand-400 mb-6 border border-brand-500/20">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-white mb-3 tracking-tight">Route Optimization</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                        AI is currently optimizing 4 active routes to reduce delivery time by an average of 18.4%.
                      </p>
                      <button className="w-full py-3.5 rounded-2xl bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/20">
                        View Network Map
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'donate' && (
              <motion.div 
                key="donate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                          <h3 className="font-display font-bold text-3xl text-white tracking-tight">Apply for Donation</h3>
                          <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Register your donation intent</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-2xl shadow-brand-500/20">
                          <Heart className="w-7 h-7" />
                        </div>
                      </div>

                      <form onSubmit={handleDonateSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Blood Type</label>
                            <select 
                              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all appearance-none cursor-pointer"
                              value={newDonationApp.bloodType}
                              onChange={e => setNewDonationApp({...newDonationApp, bloodType: e.target.value})}
                            >
                              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                                <option key={t} value={t} className="bg-slate-900">{t}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Preferred Date</label>
                            <input 
                              required
                              type="date" 
                              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                              value={newDonationApp.preferredDate}
                              onChange={e => setNewDonationApp({...newDonationApp, preferredDate: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Preferred Location</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. City Blood Bank, West Wing"
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                            value={newDonationApp.location}
                            onChange={e => setNewDonationApp({...newDonationApp, location: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Additional Notes</label>
                          <textarea 
                            rows={3}
                            placeholder="Any medical history or specific requirements..."
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all resize-none"
                            value={newDonationApp.notes}
                            onChange={e => setNewDonationApp({...newDonationApp, notes: e.target.value})}
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/20 active:scale-[0.98] uppercase tracking-widest text-sm"
                        >
                          Submit Application
                        </button>
                      </form>

                      {/* Background decoration */}
                      <div className="absolute -left-20 -top-20 w-64 h-64 bg-brand-500/5 blur-[100px] rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                      <h3 className="font-display font-bold text-2xl text-white mb-8 tracking-tight">My Applications</h3>
                      <div className="space-y-6">
                        {donationApplications.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                              <Heart className="w-8 h-8 text-slate-700" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">No active applications</p>
                          </div>
                        ) : (
                          donationApplications.map((app) => (
                            <div key={app.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 border border-brand-500/20">
                                    <Droplet className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-white text-sm tracking-tight">{app.bloodType} Donation</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{app.location}</p>
                                  </div>
                                </div>
                                <span className={cn(
                                  "px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest backdrop-blur-md",
                                  app.status === 'Pending' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                )}>
                                  {app.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span>Preferred: {app.preferredDate}</span>
                                <span>ID: #{app.id.slice(0, 6)}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl bg-gradient-to-br from-emerald-600/10 to-transparent">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                        <Info className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-white mb-3 tracking-tight">Preparation Guide</h3>
                      <ul className="space-y-4">
                        {[
                          'Hydrate well (at least 500ml water)',
                          'Eat a healthy, low-fat meal',
                          'Bring a valid ID for verification',
                          'Ensure you had 7-8 hours of sleep'
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-xs text-slate-400 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'donors' && (
              <motion.div 
                key="donors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                  <div className="relative flex-1 max-w-xl group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                    <input 
                      type="text"
                      placeholder="Identify donors by name or blood group..."
                      value={donorSearchQuery}
                      onChange={(e) => setDonorSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                      Registry: {donors.filter(d => 
                        d.name.toLowerCase().includes(donorSearchQuery.toLowerCase()) || 
                        d.bloodType.toLowerCase().includes(donorSearchQuery.toLowerCase())
                      ).length} Active
                    </div>
                    {auth.user?.role === 'admin' && (
                      <button 
                        onClick={() => setIsDonorModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/20 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        New Entry
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {donors.filter(donor => 
                    donor.name.toLowerCase().includes(donorSearchQuery.toLowerCase()) || 
                    donor.bloodType.toLowerCase().includes(donorSearchQuery.toLowerCase())
                  ).map((donor) => (
                    <motion.div 
                      layout
                      key={donor.id} 
                      className="glass p-8 rounded-[2.5rem] border border-white/5 group card-hover relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-brand-400 transition-colors">
                          <Users className="w-7 h-7" />
                        </div>
                        <BloodTypeBadge type={donor.bloodType} />
                      </div>
                      <h4 className="font-display font-bold text-white text-xl mb-1 tracking-tight group-hover:text-brand-400 transition-colors">{donor.name}</h4>
                      <p className="text-xs text-slate-500 mb-6 flex items-center gap-2 font-bold uppercase tracking-widest">
                        <MapPin className="w-3.5 h-3.5 text-brand-500" /> {donor.location}
                      </p>
                      
                      <div className="space-y-4 border-t border-white/5 pt-6 relative z-10">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-500">Last Donation</span>
                          <span className="text-white">{donor.lastDonationDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-500">Contact</span>
                          <span className="text-white">{donor.contactNumber}</span>
                        </div>
                      </div>
                      
                      <button className="w-full mt-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-[0.98]">
                        <Phone className="w-4 h-4 text-brand-400" />
                        Initiate Contact
                      </button>

                      {/* Decorative background glow */}
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {stock.map((item) => (
                  <motion.div 
                    whileHover={{ y: -10, scale: 1.02 }}
                    key={item.type} 
                    className="glass p-8 rounded-[2.5rem] border border-white/5 group relative overflow-hidden shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-12",
                        item.units < 5 ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-red-500/20" : "bg-brand-600/20 text-brand-400 border border-brand-500/30 shadow-brand-500/20"
                      )}>
                        <Droplet className="w-7 h-7 fill-current" />
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-display font-black text-white tracking-tighter group-hover:text-brand-400 transition-colors">{item.type}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-1">Blood Group</span>
                      </div>
                    </div>
                    <div className="mb-8 relative z-10">
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-5xl font-display font-bold text-white tracking-tighter">{item.units}</span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Units</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (item.units / 25) * 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            item.units < 5 ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]" : "bg-brand-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]"
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] flex items-center gap-2">
                        <Clock className="w-3 h-3 text-brand-400" />
                        Sync: {new Date(item.lastUpdated).toLocaleTimeString()}
                      </div>
                      <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Background Glow */}
                    <div className={cn(
                      "absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                      item.units < 5 ? "bg-red-500" : "bg-brand-500"
                    )} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div 
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="bg-gradient-to-br from-brand-600 to-brand-900 rounded-[3rem] p-12 text-white shadow-2xl shadow-brand-500/20 relative overflow-hidden group">
                  <div className="relative z-10 max-w-3xl">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20"
                    >
                      <Brain className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-5xl font-display font-bold mb-6 tracking-tighter leading-tight">Predictive Demand <br />Intelligence</h2>
                    <p className="text-brand-100 text-lg font-medium mb-10 leading-relaxed opacity-80">
                      Our neural engine analyzes historical usage patterns, seasonal fluctuations, and regional health data to forecast upcoming blood requirements with 94% accuracy.
                    </p>
                    <button 
                      onClick={handleForecast}
                      disabled={isForecasting}
                      className="px-10 py-5 bg-white text-brand-700 rounded-2xl font-bold hover:bg-brand-50 transition-all flex items-center gap-3 disabled:opacity-50 shadow-2xl shadow-white/10 active:scale-95 uppercase tracking-widest text-sm"
                    >
                      {isForecasting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                      {isForecasting ? 'Processing Neural Data...' : 'Initialize Forecast Engine'}
                    </button>
                  </div>
                  <Brain className="absolute right-[-40px] bottom-[-40px] w-96 h-96 text-white/5 group-hover:text-white/10 transition-colors duration-1000" />
                  
                  {/* Decorative circles */}
                  <div className="absolute top-10 right-20 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-brand-400/10 rounded-full blur-[100px]" />
                </div>

                {aiForecast && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl"
                    >
                      <h3 className="font-display font-bold text-2xl text-white mb-8 flex items-center gap-3 tracking-tight">
                        <AlertCircle className="w-6 h-6 text-brand-500" />
                        Shortage Risk Matrix
                      </h3>
                      <div className="space-y-8">
                        {aiForecast.forecast.map((item: any) => (
                          <div key={item.bloodType} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <BloodTypeBadge type={item.bloodType} />
                                <span className={cn(
                                  "text-[10px] font-bold uppercase tracking-[0.2em]",
                                  item.predictedShortageRisk > 70 ? "text-red-400" : "text-emerald-400"
                                )}>
                                  {item.predictedShortageRisk > 70 ? 'High' : 'Low'} Risk Level
                                </span>
                              </div>
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Confidence: {item.predictedShortageRisk}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.predictedShortageRisk}%` }}
                                className={cn(
                                  "h-full rounded-full",
                                  item.predictedShortageRisk > 70 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col"
                    >
                      <h3 className="font-display font-bold text-2xl text-white mb-8 flex items-center gap-3 tracking-tight">
                        <Brain className="w-6 h-6 text-brand-400" />
                        Strategic Recommendations
                      </h3>
                      <div className="flex-1 space-y-6">
                        {aiForecast.recommendations.map((rec: string, i: number) => (
                          <div key={i} className="flex gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center text-brand-400 border border-brand-500/20 flex-shrink-0 group-hover:scale-110 transition-transform">
                              <span className="font-display font-bold text-lg">{i + 1}</span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div 
                key="applications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">Donation Applications</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1">Review and manage donation intents from the community</p>
                  </div>
                  <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    Total: {donationApplications.length} Applications
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {donationApplications.length === 0 ? (
                    <div className="glass p-20 rounded-[3rem] border border-white/5 text-center">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <Heart className="w-10 h-10 text-slate-700" />
                      </div>
                      <h3 className="text-xl font-display font-bold text-white mb-2">No Applications Found</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto">There are currently no pending donation applications to review.</p>
                    </div>
                  ) : (
                    donationApplications.map((app) => (
                      <motion.div 
                        layout
                        key={app.id} 
                        className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group card-hover relative overflow-hidden"
                      >
                        <div className="flex items-start gap-6 relative z-10">
                          <div className="p-4 rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30 shadow-2xl transition-all duration-500 group-hover:rotate-12">
                            <Heart className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h4 className="font-display font-bold text-white text-xl tracking-tight group-hover:text-brand-400 transition-colors">{app.donorName}</h4>
                              <BloodTypeBadge type={app.bloodType} />
                              <span className={cn(
                                "px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest backdrop-blur-md",
                                app.status === 'Pending' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                                app.status === 'Approved' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                              )}>
                                {app.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                              <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-500" /> {app.location}</span>
                              <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-brand-500" /> Preferred: {app.preferredDate}</span>
                              <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-brand-500" /> Submitted: {new Date(app.date).toLocaleDateString()}</span>
                            </div>
                            {app.notes && (
                              <p className="mt-4 text-xs text-slate-400 italic bg-white/5 p-3 rounded-xl border border-white/5">
                                "{app.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 self-end md:self-center relative z-10">
                          {app.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => updateDonationAppStatus(app.id, 'Rejected')}
                                className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => updateDonationAppStatus(app.id, 'Approved')}
                                className="px-8 py-3 rounded-2xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/20 uppercase tracking-widest active:scale-95"
                              >
                                Approve
                              </button>
                            </>
                          )}
                          {app.status === 'Approved' && (
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4" />
                              Approved
                            </div>
                          )}
                          {app.status === 'Rejected' && (
                            <div className="flex items-center gap-2 text-red-400 font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                              <X className="w-4 h-4" />
                              Rejected
                            </div>
                          )}
                        </div>

                        {/* Background decoration */}
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'assistant' && (
              <motion.div 
                key="assistant"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-[calc(100vh-200px)] flex flex-col glass-dark rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-white/5 bg-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-2xl shadow-brand-500/20">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white tracking-tight">VitalFlow Neural Assistant</h3>
                    <p className="text-[10px] text-slate-500 flex items-center gap-2 font-bold uppercase tracking-widest mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                      Interface Synchronized
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-950/20 custom-scrollbar">
                  {chatMessages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                      <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-center group">
                        <Brain className="w-12 h-12 text-brand-400 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="max-w-xs">
                        <h4 className="font-display font-bold text-2xl text-white mb-3 tracking-tight">How can I assist?</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                          Ask me about eligibility requirements, donation intervals, or logistics optimization.
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3 pt-4">
                        {[
                          "Am I eligible to donate?",
                          "How often can I donate?",
                          "What should I eat before?",
                          "Schedule an appointment"
                        ].map(suggestion => (
                          <button 
                            key={suggestion}
                            onClick={() => {
                              setChatInput(suggestion);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:border-brand-500/50 hover:text-brand-400 hover:bg-brand-500/5 transition-all uppercase tracking-widest active:scale-95"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex items-start gap-4 max-w-[85%] mb-6",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-2xl",
                        msg.role === 'user' ? "bg-slate-800 text-slate-400 border-white/10" : "bg-brand-600 text-white border-brand-500/50 shadow-brand-500/20"
                      )}>
                        {msg.role === 'user' ? <Users className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                      </div>
                      <div className={cn(
                        "p-5 rounded-2xl text-sm leading-relaxed shadow-2xl relative overflow-hidden",
                        msg.role === 'user' 
                          ? "bg-slate-800 text-white rounded-tr-none border border-white/5" 
                          : "glass-dark border border-white/10 text-slate-200 rounded-tl-none"
                      )}>
                        {msg.text}
                        {msg.role === 'ai' && (
                          <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-brand-500/5 blur-xl rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center border border-brand-500/50 shadow-2xl shadow-brand-500/20">
                        <Brain className="w-5 h-5" />
                      </div>
                      <div className="p-5 rounded-2xl glass-dark border border-white/10 flex items-center gap-3 shadow-2xl">
                        <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Processing...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-slate-950/50 border-t border-white/5 backdrop-blur-xl">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="relative group"
                  >
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full pl-6 pr-20 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all shadow-2xl"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim() || isChatLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-brand-600 text-white rounded-xl hover:bg-brand-500 transition-all disabled:opacity-50 shadow-2xl shadow-brand-500/20 active:scale-95"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Request Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass-dark w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">New Blood Request</h2>
                    <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Urgent medical requirement</p>
                  </div>
                  <button onClick={() => setIsRequestModalOpen(false)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleAddRequest} className="space-y-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Patient Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Enter full name"
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                      onChange={e => setNewRequest({...newRequest, patientName: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Blood Type</label>
                      <select 
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all appearance-none cursor-pointer"
                        onChange={e => setNewRequest({...newRequest, bloodType: e.target.value as BloodType})}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                          <option key={t} value={t} className="bg-slate-900">{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Units Required</label>
                      <input 
                        required
                        type="number" 
                        min="1"
                        defaultValue="1"
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                        onChange={e => setNewRequest({...newRequest, units: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Hospital Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. City General Hospital"
                      value={auth.user?.role === 'hospital' ? auth.user.name : newRequest.hospital || ''}
                      disabled={auth.user?.role === 'hospital'}
                      className={cn(
                        "w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all",
                        auth.user?.role === 'hospital' && "opacity-50 cursor-not-allowed"
                      )}
                      onChange={e => setNewRequest({...newRequest, hospital: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Urgency</label>
                      <select 
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all appearance-none cursor-pointer"
                        onChange={e => setNewRequest({...newRequest, urgency: e.target.value as any})}
                      >
                        <option value="Normal" className="bg-slate-900">Normal</option>
                        <option value="Urgent" className="bg-slate-900">Urgent</option>
                        <option value="Critical" className="bg-slate-900">Critical</option>
                      </select>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Contact Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="+1 234..."
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                        onChange={e => setNewRequest({...newRequest, contactNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsRequestModalOpen(false)}
                      className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 rounded-2xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/20 uppercase tracking-widest active:scale-95"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Donor Modal */}
      <AnimatePresence>
        {isDonorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDonorModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass-dark w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">Donor Registration</h2>
                    <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">New life-saving entry</p>
                  </div>
                  <button onClick={() => setIsDonorModalOpen(false)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleAddDonor} className="space-y-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Donor's full name"
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                      onChange={e => setNewDonor({...newDonor, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Blood Type</label>
                      <select 
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all appearance-none cursor-pointer"
                        onChange={e => setNewDonor({...newDonor, bloodType: e.target.value as BloodType})}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                          <option key={t} value={t} className="bg-slate-900">{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Contact Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="+1 234..."
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                        onChange={e => setNewDonor({...newDonor, contactNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="donor@example.com"
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                      onChange={e => setNewDonor({...newDonor, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Location</label>
                    <input 
                      required
                      type="text" 
                      placeholder="City, Area"
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                      onChange={e => setNewDonor({...newDonor, location: e.target.value})}
                    />
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsDonorModalOpen(false)}
                      className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 rounded-2xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/20 uppercase tracking-widest active:scale-95"
                    >
                      Register Donor
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Edit Request Modal */}
      <AnimatePresence>
        {editingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingRequest(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass-dark w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">Edit Request</h2>
                    <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Update medical record</p>
                  </div>
                  <button onClick={() => setEditingRequest(null)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="space-y-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Patient Name</label>
                    <input 
                      required
                      type="text" 
                      value={editingRequest.patientName}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                      onChange={e => setEditingRequest({...editingRequest, patientName: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Units Required</label>
                      <input 
                        required
                        type="number" 
                        min="1"
                        value={editingRequest.units}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                        onChange={e => setEditingRequest({...editingRequest, units: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Urgency</label>
                      <select 
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all appearance-none cursor-pointer"
                        value={editingRequest.urgency}
                        onChange={e => setEditingRequest({...editingRequest, urgency: e.target.value as any})}
                      >
                        <option value="Normal" className="bg-slate-900">Normal</option>
                        <option value="Urgent" className="bg-slate-900">Urgent</option>
                        <option value="Critical" className="bg-slate-900">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Hospital</label>
                    <input 
                      required
                      type="text" 
                      value={editingRequest.hospital}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                      onChange={e => setEditingRequest({...editingRequest, hospital: e.target.value})}
                    />
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setEditingRequest(null)}
                      className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 rounded-2xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-all shadow-2xl shadow-brand-500/20 uppercase tracking-widest active:scale-95"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmingStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmingStatus(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative glass-dark w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center border border-white/10"
            >
              <div className={cn(
                "w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl transition-transform hover:rotate-12",
                confirmingStatus.status === 'Approved' ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                confirmingStatus.status === 'Fulfilled' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                "bg-red-500/20 text-red-400 border border-red-500/30"
              )}>
                {confirmingStatus.status === 'Approved' ? <Bell className="w-10 h-10" /> :
                 confirmingStatus.status === 'Fulfilled' ? <CheckCircle2 className="w-10 h-10" /> :
                 <X className="w-10 h-10" />}
              </div>
              
              <h3 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">
                Confirm {confirmingStatus.status}
              </h3>
              <p className="text-slate-400 mb-10 text-sm leading-relaxed font-medium">
                Are you sure you want to mark this request as <strong className="text-white">{confirmingStatus.status}</strong>? 
                {confirmingStatus.status === 'Fulfilled' && " This will deduct units from the current stock."}
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmingStatus(null)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => updateRequestStatus(confirmingStatus.id, confirmingStatus.status)}
                  className={cn(
                    "flex-1 py-4 rounded-2xl text-white text-xs font-bold shadow-2xl transition-all uppercase tracking-widest active:scale-95",
                    confirmingStatus.status === 'Approved' ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20" :
                    confirmingStatus.status === 'Fulfilled' ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" :
                    "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                  )}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
