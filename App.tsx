import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Test, Question, Attempt, Option } from './types';
import { storageService } from './services/storage';
import { generateQuestions, analyzePerformance } from './services/geminiService';
import ArchitectureDoc from './components/ArchitectureDoc';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { 
  BookOpen, Clock, LogOut, Plus, 
  Settings, Trash2, User as UserIcon, FileText, BrainCircuit, Play,
  Home, PieChart as PieChartIcon, Search, ChevronRight, Check, X,
  GraduationCap, Layout, Sparkles, ArrowLeft, MoreHorizontal, Calendar,
  Globe, Smartphone, Coffee, Code, Server, Database, Cpu, Briefcase, ShieldAlert, FileJson
} from 'lucide-react';

// --- CONSTANTS & THEMES ---

const COLORS = {
  primaryGradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500",
  secondaryGradient: "bg-gradient-to-r from-blue-400 to-cyan-500",
  correct: "#22c55e",
  wrong: "#ef4444",
  unanswered: "#e2e8f0",
  chartColors: ['#22c55e', '#ef4444', '#94a3b8']
};

const SUBJECT_ICONS: Record<string, any> = {
  'Computer Network': { icon: Globe, color: 'text-blue-600', bg: 'bg-blue-100' },
  'JAVA': { icon: Coffee, color: 'text-orange-600', bg: 'bg-orange-100' },
  'C Program': { icon: Code, color: 'text-slate-600', bg: 'bg-slate-100' },
  'Android': { icon: Smartphone, color: 'text-green-600', bg: 'bg-green-100' },
  'Data Structures': { icon: Database, color: 'text-purple-600', bg: 'bg-purple-100' },
  'DBMS': { icon: Server, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  'OS': { icon: Cpu, color: 'text-red-600', bg: 'bg-red-100' },
  'Web Dev': { icon: Layout, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  'Software Eng': { icon: Briefcase, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'Cyber Security': { icon: ShieldAlert, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  'Python': { icon: Code, color: 'text-blue-500', bg: 'bg-blue-50' },
  'Default': { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' }
};

// --- HELPER COMPONENTS ---

const MobileWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className="min-h-screen bg-slate-100 flex justify-center">
    <div className={`w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative overflow-hidden flex flex-col ${className}`}>
      {children}
    </div>
  </div>
);

const BottomNav = ({ role, activeTab, onTabChange }: { role: UserRole, activeTab: string, onTabChange: (t: string) => void }) => {
  const tabs = role === UserRole.STUDENT 
    ? [
        { id: 'HOME', icon: Home, label: 'Home' },
        { id: 'TESTS', icon: BookOpen, label: 'Tests' },
        { id: 'RESULTS', icon: PieChartIcon, label: 'Results' },
        { id: 'PROFILE', icon: UserIcon, label: 'Profile' },
      ]
    : [
        { id: 'DASH', icon: Layout, label: 'Dash' },
        { id: 'CREATE', icon: Plus, label: 'Create' },
        { id: 'REPORTS', icon: PieChartIcon, label: 'Reports' },
        { id: 'PROFILE', icon: UserIcon, label: 'Profile' },
    ];

  return (
    <div className="bg-white border-t border-slate-100 h-20 px-6 pb-4 flex justify-between items-center fixed bottom-0 w-full max-w-md z-40 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id} 
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-indigo-600 -translate-y-1' : 'text-slate-400'}`}
          >
            <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            {isActive && <div className="w-1 h-1 bg-indigo-600 rounded-full mt-0.5" />}
          </button>
        )
      })}
    </div>
  );
};

const SubjectTile: React.FC<{ subject: string; count: number; onClick: () => void }> = ({ subject, count, onClick }) => {
  const style = SUBJECT_ICONS[subject] || SUBJECT_ICONS['Default'];
  const Icon = style.icon;
  return (
    <button onClick={onClick} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-start gap-3 hover:shadow-md transition-all active:scale-95">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${style.bg} ${style.color}`}>
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm">{subject}</h4>
        <p className="text-xs text-slate-400 font-medium">{count} Tests</p>
      </div>
    </button>
  );
};

// --- SCREENS ---

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <MobileWrapper className={COLORS.primaryGradient}>
      <div className="flex-1 flex flex-col items-center justify-center text-white p-8 animate-fade-in">
        <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-xl">
           <Cpu size={56} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">JMC-CS MCQ PLATFORM</h1>
        <p className="text-white/80 font-medium text-lg">Computer Science Mastery</p>
      </div>
      <div className="pb-12 text-center text-white/60 text-sm">v2.0.0</div>
    </MobileWrapper>
  );
};

const RoleSelectionScreen = ({ onSelect }: { onSelect: (role: UserRole) => void }) => {
  return (
    <MobileWrapper className="bg-white p-6">
      <div className="flex-1 flex flex-col justify-center gap-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Welcome</h2>
          <p className="text-slate-500">JMC-CS Department Portal</p>
        </div>
        
        <div className="space-y-4">
          <button onClick={() => onSelect(UserRole.STUDENT)} className="w-full bg-slate-50 hover:bg-indigo-50 border-2 border-slate-100 hover:border-indigo-200 rounded-3xl p-6 flex items-center gap-6 transition-all group">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <GraduationCap size={32} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-slate-800">Student</h3>
              <p className="text-slate-500 text-sm">Access Tests & Results</p>
            </div>
          </button>

          <button onClick={() => onSelect(UserRole.TEACHER)} className="w-full bg-slate-50 hover:bg-purple-50 border-2 border-slate-100 hover:border-purple-200 rounded-3xl p-6 flex items-center gap-6 transition-all group">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Server size={32} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-slate-800">Teacher</h3>
              <p className="text-slate-500 text-sm">Manage CS Assessments</p>
            </div>
          </button>
        </div>
      </div>
    </MobileWrapper>
  );
};

const AuthScreen = ({ role, onLogin }: { role: UserRole, onLogin: (u: User) => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!name || !email || !password) return;
      const newUser: User = { id: Date.now().toString(), name, email, password, role };
      storageService.saveUser(newUser);
      onLogin(newUser);
    } else {
      const user = storageService.login(email, password);
      if (user) onLogin(user);
      else alert("Invalid credentials (try student@jmc.com / 123)");
    }
  };

  return (
    <MobileWrapper className="bg-white">
      <div className="h-64 rounded-b-[40px] bg-slate-900 overflow-hidden relative">
         <div className={`absolute inset-0 opacity-80 ${COLORS.primaryGradient}`} />
         <div className="absolute inset-0 flex flex-col justify-end p-8 pb-12">
            <h1 className="text-4xl font-bold text-white mb-2">CS Portal</h1>
            <p className="text-white/80">Sign in to continue as {role.toLowerCase()}</p>
         </div>
      </div>

      <div className="px-8 py-10 flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
               <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
             </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500" placeholder="user@jmc.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border-none p-4 rounded-2xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
          </div>

          <button type="submit" className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 ${COLORS.primaryGradient}`}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsRegister(!isRegister)} className="ml-1 text-indigo-600 font-bold hover:underline">
              {isRegister ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </MobileWrapper>
  );
};

// --- STUDENT DASHBOARD ---

const StudentHome = ({ user, tests, onSelectTest }: { user: User, tests: Test[], onSelectTest: (t: Test) => void }) => {
  const subjects = Array.from(new Set(tests.map(t => t.subject || 'General')));

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className={`pt-12 pb-16 px-6 rounded-b-[40px] ${COLORS.primaryGradient} text-white relative shadow-lg`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-12 h-12 rounded-full border-2 border-white/50 bg-white/20" />
             <div>
               <h2 className="font-bold text-lg">Hi, {user.name.split(' ')[0]}</h2>
               <p className="text-white/70 text-sm">{user.classGrade || 'CS Student'}</p>
             </div>
          </div>
          <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <Search size={20} className="text-white" />
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-2">CS Dashboard</h1>
        <div className="absolute -bottom-6 left-6 right-6">
           <div className="bg-white p-4 rounded-2xl shadow-lg flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Assigned</p>
                <p className="text-slate-800 font-bold text-lg">{tests.length} Tests</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500 flex items-center justify-center text-indigo-600 font-bold text-xs">
                Active
              </div>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-10">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-bold text-slate-800 text-xl">Topics</h3>
          <button className="text-indigo-600 text-sm font-bold">See All</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
           {subjects.length > 0 ? subjects.map(sub => (
             <SubjectTile key={sub} subject={sub} count={tests.filter(t => t.subject === sub).length} onClick={() => {}} />
           )) : (
             <p className="col-span-2 text-slate-400 text-sm">No topics available yet.</p>
           )}
        </div>

        <h3 className="font-bold text-slate-800 text-xl mb-4">Recommended</h3>
        <div className="space-y-4">
          {tests.map(test => (
             <div key={test.id} onClick={() => onSelectTest(test)} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between group active:scale-95 transition-transform">
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${SUBJECT_ICONS[test.subject]?.bg || 'bg-slate-100'} ${SUBJECT_ICONS[test.subject]?.color || 'text-slate-500'}`}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{test.title}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-2">
                       <Clock size={12} /> {test.durationMinutes} mins • {test.questions.length} Qs
                    </p>
                  </div>
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  <Play size={14} fill="currentColor" />
               </div>
             </div>
          ))}
          {tests.length === 0 && <p className="text-slate-400 text-center py-4">No tests found.</p>}
        </div>
      </div>
    </div>
  );
};

// --- MCQ TEST PLAYER ---

const TestPlayer = ({ test, user, onComplete, onExit }: { test: Test, user: User, onComplete: (a: Attempt) => void, onExit: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    let score = 0;
    test.questions.forEach(q => {
      if (responses[q.id] === q.correctOptionId) score++;
    });
    const attempt: Attempt = {
      id: Date.now().toString(),
      testId: test.id,
      studentId: user.id,
      studentName: user.name,
      responses, score, totalQuestions: test.questions.length,
      completedAt: new Date().toISOString()
    };
    onComplete(attempt);
  };

  const currentQ = test.questions[currentIndex];
  const progress = ((currentIndex + 1) / test.questions.length) * 100;

  return (
    <MobileWrapper className="bg-white">
      {/* Header */}
      <div className="pt-12 px-6 pb-4 bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onExit} className="p-2 -ml-2 text-slate-400 hover:text-slate-800"><ArrowLeft size={24} /></button>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Time Remaining</span>
            <span className={`text-lg font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-slate-800'}`}>
               {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <button className="p-2 -mr-2 text-slate-400 hover:text-slate-800"><MoreHorizontal size={24} /></button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
           <span>Question {currentIndex + 1}</span>
           <span>{test.questions.length} total</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
         <h2 className="text-2xl font-bold text-slate-800 leading-snug mb-8">{currentQ.text}</h2>
         
         <div className="space-y-4 pb-24">
            {currentQ.options.map((opt, idx) => {
               const isSelected = responses[currentQ.id] === opt.id;
               const letters = ['A', 'B', 'C', 'D'];
               return (
                 <button 
                    key={opt.id}
                    onClick={() => setResponses({...responses, [currentQ.id]: opt.id})}
                    className={`w-full p-5 rounded-2xl flex items-center gap-4 border-2 transition-all ${
                       isSelected 
                       ? 'border-indigo-500 bg-indigo-50' 
                       : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}
                 >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                       isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-slate-200 text-slate-400'
                    }`}>
                       {letters[idx]}
                    </div>
                    <span className={`text-left font-medium text-lg ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>
                       {opt.text}
                    </span>
                 </button>
               )
            })}
         </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 p-6 z-20 flex justify-between gap-4">
         <button 
           disabled={currentIndex === 0}
           onClick={() => setCurrentIndex(p => p - 1)}
           className="px-6 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors"
         >
            Prev
         </button>
         
         {currentIndex === test.questions.length - 1 ? (
           <button 
             onClick={handleSubmit}
             className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg shadow-indigo-200 ${COLORS.primaryGradient}`}
           >
             Submit Test
           </button>
         ) : (
           <button 
             onClick={() => setCurrentIndex(p => p + 1)}
             className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
           >
             Next Question
           </button>
         )}
      </div>
    </MobileWrapper>
  );
};

// --- INSTANT RESULT SCREEN ---

const ResultScreen = ({ attempt, test, onHome }: { attempt: Attempt, test: Test, onHome: () => void }) => {
  const [activeTab, setActiveTab] = useState<'PERF' | 'ANALYSIS'>('PERF');
  const percent = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const correct = attempt.score;
  const wrong = attempt.totalQuestions - correct;
  const pieData = [
     { name: 'Correct', value: correct },
     { name: 'Wrong', value: wrong }
  ];

  const [aiAnalysis, setAiAnalysis] = useState('Analyzing results...');

  useEffect(() => {
    analyzePerformance(attempt.studentName, attempt.score, attempt.totalQuestions, test.subject)
      .then(setAiAnalysis);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MobileWrapper className="bg-slate-50">
      <div className={`pt-12 pb-24 px-6 rounded-b-[40px] bg-slate-900 text-white relative shadow-xl overflow-hidden`}>
         <div className={`absolute inset-0 opacity-20 ${COLORS.primaryGradient}`}></div>
         <div className="relative z-10 flex flex-col items-center">
             <h2 className="text-white/60 font-medium tracking-widest text-sm mb-4 uppercase">Test Result</h2>
             <div className="w-40 h-40 relative flex items-center justify-center mb-4">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
                         <Cell fill={COLORS.correct} />
                         <Cell fill={COLORS.wrong} />
                      </Pie>
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-4xl font-bold text-white">{attempt.score}/{attempt.totalQuestions}</span>
                </div>
             </div>
             <div className="bg-white/10 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-md">
                {percent >= 70 ? '🎉 Excellent Job!' : '👍 Good Effort!'}
             </div>
         </div>
      </div>

      <div className="px-6 -mt-12 relative z-20 pb-24">
         <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 flex mb-6">
            {['Performance', 'Analysis'].map((tab, idx) => (
               <button 
                 key={tab} 
                 onClick={() => setActiveTab(idx === 0 ? 'PERF' : 'ANALYSIS')}
                 className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                    (idx === 0 && activeTab === 'PERF') || (idx === 1 && activeTab === 'ANALYSIS') 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-50'
                 }`}
               >
                 {tab}
               </button>
            ))}
         </div>

         {activeTab === 'PERF' && (
           <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BrainCircuit size={18} className="text-purple-600"/> AI Insight</h3>
                 <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{aiAnalysis}"
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
                    <p className="text-xs text-slate-400 font-bold uppercase">Accuracy</p>
                    <p className="text-2xl font-bold text-green-500 mt-1">{percent}%</p>
                 </div>
                 <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
                    <p className="text-xs text-slate-400 font-bold uppercase">Time Taken</p>
                    <p className="text-2xl font-bold text-orange-500 mt-1">12m 30s</p>
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'ANALYSIS' && (
           <div className="bg-white rounded-3xl shadow-sm border border-slate-50 overflow-hidden animate-fade-in">
             {test.questions.map((q, idx) => {
               const isCorrect = attempt.responses[q.id] === q.correctOptionId;
               return (
                 <div key={q.id} className="p-4 border-b border-slate-50 flex items-start gap-3 last:border-0">
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCorrect ? <Check size={14} /> : <X size={14} />}
                    </div>
                    <div>
                       <p className="text-sm font-medium text-slate-800 line-clamp-2">Q{idx+1}. {q.text}</p>
                    </div>
                 </div>
               )
             })}
           </div>
         )}
      </div>

      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 p-6 z-30">
         <button onClick={onHome} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            Back to Reports
         </button>
      </div>
    </MobileWrapper>
  );
};

// --- TEACHER COMPONENTS ---

const TeacherReports = ({ attempts, tests, onViewAttempt }: { attempts: Attempt[], tests: Test[], onViewAttempt: (a: Attempt) => void }) => {
  return (
    <div className="pb-24 animate-fade-in pt-12 px-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Student Reports</h2>
      <div className="space-y-4">
        {attempts.length === 0 ? (
           <div className="text-center text-slate-400 py-10 bg-white rounded-2xl border border-slate-100 p-8">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                 <FileText size={32} />
              </div>
              <p>No test attempts found.</p>
           </div>
        ) : (
           attempts.map(attempt => {
              const test = tests.find(t => t.id === attempt.testId);
              const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
              const isPass = percentage >= 50; 
              return (
                 <div 
                    key={attempt.id} 
                    onClick={() => onViewAttempt(attempt)}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
                 >
                    <div className="flex justify-between items-start">
                       <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                             {attempt.studentName.charAt(0)}
                          </div>
                          <div>
                             <h4 className="font-bold text-slate-800 text-lg">{attempt.studentName}</h4>
                             <p className="text-xs text-slate-500 font-medium">{test?.title || 'Unknown Test'}</p>
                          </div>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-xs font-bold ${isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {percentage}%
                       </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-50 pt-3">
                       <span className="flex items-center gap-1"><Check size={14} className="text-slate-400"/> Score: <span className="font-bold text-slate-900">{attempt.score}/{attempt.totalQuestions}</span></span>
                       <span className="flex items-center gap-1 text-slate-400 text-xs">
                         {new Date(attempt.completedAt).toLocaleDateString()}
                         <ChevronRight size={14} />
                       </span>
                    </div>
                 </div>
              );
           })
        )}
      </div>
    </div>
  );
};

const TeacherDash = ({ user, tests, onCreate, onReports, onShowArch }: { user: User, tests: Test[], onCreate: () => void, onReports: () => void, onShowArch: () => void }) => (
  <div className="pb-24 animate-fade-in">
    <div className={`pt-12 pb-10 px-6 rounded-b-[40px] ${COLORS.primaryGradient} text-white shadow-lg`}>
       <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg border border-white/30">
               {user.name.charAt(0)}
             </div>
             <div>
                <p className="text-xs text-white/70 font-medium">Welcome Teacher</p>
                <h2 className="font-bold text-lg">{user.name}</h2>
             </div>
          </div>
          <Settings className="text-white/80" />
       </div>
       <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
             <h3 className="text-2xl font-bold">{tests.length}</h3>
             <p className="text-[10px] text-white/70 uppercase font-bold">Active Tests</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
             <h3 className="text-2xl font-bold">142</h3>
             <p className="text-[10px] text-white/70 uppercase font-bold">Students</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
             <h3 className="text-2xl font-bold">89%</h3>
             <p className="text-[10px] text-white/70 uppercase font-bold">Avg Pass</p>
          </div>
       </div>
    </div>

    <div className="px-6 mt-8">
       <h3 className="font-bold text-slate-800 text-lg mb-4">Quick Actions</h3>
       <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button onClick={onCreate} className="min-w-[100px] h-[100px] bg-white rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95">
             <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600"><Plus size={20} /></div>
             <span className="text-xs font-bold text-slate-700">Create Test</span>
          </button>
          <button className="min-w-[100px] h-[100px] bg-white rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95">
             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><BookOpen size={20} /></div>
             <span className="text-xs font-bold text-slate-700">Q-Bank</span>
          </button>
          <button onClick={onReports} className="min-w-[100px] h-[100px] bg-white rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95">
             <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><PieChartIcon size={20} /></div>
             <span className="text-xs font-bold text-slate-700">Reports</span>
          </button>
          <button onClick={onShowArch} className="min-w-[100px] h-[100px] bg-white rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><FileJson size={20} /></div>
             <span className="text-xs font-bold text-slate-700">Product Design</span>
          </button>
       </div>

       <h3 className="font-bold text-slate-800 text-lg mb-4">Recent Tests</h3>
       <div className="space-y-3">
          {tests.map(test => (
             <div key={test.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                <div>
                   <h4 className="font-bold text-slate-800 text-sm">{test.title}</h4>
                   <p className="text-xs text-slate-400 mt-1">{test.subject} • {new Date(test.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                   Active
                </div>
             </div>
          ))}
       </div>
    </div>
  </div>
);

const CreateTestFlow = ({ user, onCancel, onSave }: { user: User, onCancel: () => void, onSave: (t: Test) => void }) => {
  const [step, setStep] = useState(1);
  const [testDetails, setTestDetails] = useState({ title: '', subject: 'Computer Network', duration: 15, desc: '' });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState({ text: '', opt1: '', opt2: '', opt3: '', opt4: '', correct: 0 });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddQuestion = () => {
     if (!currentQ.text || !currentQ.opt1) return;
     const newQ: Question = {
        id: Date.now().toString(),
        text: currentQ.text,
        options: [
           { id: '1', text: currentQ.opt1 }, { id: '2', text: currentQ.opt2 },
           { id: '3', text: currentQ.opt3 }, { id: '4', text: currentQ.opt4 },
        ],
        correctOptionId: (currentQ.correct + 1).toString()
     };
     setQuestions([...questions, newQ]);
     setCurrentQ({ text: '', opt1: '', opt2: '', opt3: '', opt4: '', correct: 0 });
  };

  const handleAi = async () => {
    setIsGenerating(true);
    try {
      const qs = await generateQuestions(aiPrompt || testDetails.title, 3);
      setQuestions([...questions, ...qs]);
    } catch(e) { alert("AI Error"); }
    setIsGenerating(false);
  };

  const finalize = () => {
     const t: Test = {
        id: Date.now().toString(),
        title: testDetails.title,
        subject: testDetails.subject,
        description: testDetails.desc,
        durationMinutes: testDetails.duration,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        isPublished: true,
        questions: questions
     };
     onSave(t);
  };

  return (
    <MobileWrapper className="bg-slate-50">
       <div className="pt-12 px-6 pb-4 bg-white sticky top-0 z-10 border-b border-slate-100 flex justify-between items-center">
          <button onClick={onCancel} className="text-slate-400 font-medium">Cancel</button>
          <h2 className="font-bold text-slate-800">New Test</h2>
          <button onClick={() => { if(step===1) setStep(2); else finalize(); }} className="text-indigo-600 font-bold">
             {step === 1 ? 'Next' : 'Publish'}
          </button>
       </div>

       <div className="p-6">
          {step === 1 ? (
             <div className="space-y-6">
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase ml-1">Test Title</label>
                   <input value={testDetails.title} onChange={e => setTestDetails({...testDetails, title: e.target.value})} className="w-full bg-white p-4 rounded-2xl border border-slate-200 mt-2 font-bold text-slate-800 focus:border-indigo-500 outline-none" placeholder="e.g. Advanced Java" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">Subject</label>
                     <select value={testDetails.subject} onChange={e => setTestDetails({...testDetails, subject: e.target.value})} className="w-full bg-white p-4 rounded-2xl border border-slate-200 mt-2 font-medium text-slate-800 outline-none">
                        {Object.keys(SUBJECT_ICONS).filter(k => k !== 'Default').map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">Duration (min)</label>
                     <input type="number" value={testDetails.duration} onChange={e => setTestDetails({...testDetails, duration: Number(e.target.value)})} className="w-full bg-white p-4 rounded-2xl border border-slate-200 mt-2 font-medium text-slate-800 outline-none" />
                   </div>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase ml-1">Description</label>
                   <textarea value={testDetails.desc} onChange={e => setTestDetails({...testDetails, desc: e.target.value})} className="w-full bg-white p-4 rounded-2xl border border-slate-200 mt-2 font-medium text-slate-800 outline-none h-32 resize-none" placeholder="Topics covered..." />
                </div>
             </div>
          ) : (
             <div className="space-y-6 pb-24">
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex gap-2 items-center">
                   <Sparkles className="text-purple-600" size={20} />
                   <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Generate with AI (e.g. 'Network Protocols')" className="bg-transparent flex-1 outline-none text-purple-900 placeholder:text-purple-300 text-sm" />
                   <button onClick={handleAi} disabled={isGenerating} className="text-xs font-bold bg-purple-200 text-purple-800 px-3 py-1.5 rounded-lg">{isGenerating ? '...' : 'Go'}</button>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                   <h3 className="font-bold text-slate-800">Add Question {questions.length + 1}</h3>
                   <textarea value={currentQ.text} onChange={e => setCurrentQ({...currentQ, text: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border-none outline-none text-sm font-medium" placeholder="Question text..." rows={2} />
                   <div className="space-y-2">
                      {[currentQ.opt1, currentQ.opt2, currentQ.opt3, currentQ.opt4].map((opt, idx) => (
                         <div key={idx} className="flex items-center gap-2">
                            <button onClick={() => setCurrentQ({...currentQ, correct: idx})} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${currentQ.correct === idx ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300'}`}>
                               {currentQ.correct === idx && <Check size={14} />}
                            </button>
                            <input 
                              value={idx === 0 ? currentQ.opt1 : idx === 1 ? currentQ.opt2 : idx === 2 ? currentQ.opt3 : currentQ.opt4}
                              onChange={e => {
                                 const val = e.target.value;
                                 if (idx === 0) setCurrentQ({...currentQ, opt1: val});
                                 if (idx === 1) setCurrentQ({...currentQ, opt2: val});
                                 if (idx === 2) setCurrentQ({...currentQ, opt3: val});
                                 if (idx === 3) setCurrentQ({...currentQ, opt4: val});
                              }}
                              className="flex-1 bg-slate-50 p-3 rounded-xl text-sm outline-none" 
                              placeholder={`Option ${String.fromCharCode(65+idx)}`} 
                           />
                         </div>
                      ))}
                   </div>
                   <button onClick={handleAddQuestion} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">Add Question</button>
                </div>

                <div className="space-y-2">
                   {questions.map((q, i) => (
                      <div key={q.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex justify-between items-center">
                         <span className="text-sm font-medium">Q{i+1}: {q.text}</span>
                         <button onClick={() => setQuestions(questions.filter(x => x.id !== q.id))} className="text-red-400"><Trash2 size={16}/></button>
                      </div>
                   ))}
                </div>
             </div>
          )}
       </div>
    </MobileWrapper>
  );
};

// --- APP ROOT ---

export default function App() {
  const [screen, setScreen] = useState<'SPLASH' | 'ROLE' | 'AUTH' | 'APP'>('SPLASH');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [user, setUser] = useState<User | null>(null);
  
  // App State
  const [activeTab, setActiveTab] = useState('HOME'); // or DASH
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [lastAttempt, setLastAttempt] = useState<Attempt | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // New State for Features
  const [showArch, setShowArch] = useState(false);
  const [viewingReport, setViewingReport] = useState<Attempt | null>(null);

  // Data
  const [tests, setTests] = useState<Test[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
     setTests(storageService.getTests());
     setAttempts(storageService.getAttempts());
     const u = storageService.getCurrentUser();
     if (u) {
        setUser(u);
        setRole(u.role);
        setScreen('APP');
        setActiveTab(u.role === UserRole.STUDENT ? 'HOME' : 'DASH');
     }
  }, []);

  const handleLogin = (u: User) => {
     setUser(u);
     setRole(u.role);
     setScreen('APP');
     setActiveTab(u.role === UserRole.STUDENT ? 'HOME' : 'DASH');
  };

  const handleLogout = () => {
     storageService.logout();
     setUser(null);
     setScreen('ROLE');
  };

  const renderContent = () => {
     if (showArch) {
        return <ArchitectureDoc onClose={() => setShowArch(false)} />;
     }

     if (viewingReport) {
        const t = tests.find(x => x.id === viewingReport.testId);
        if (t) {
            return <ResultScreen attempt={viewingReport} test={t} onHome={() => setViewingReport(null)} />;
        }
     }

     if (activeTest) {
        if (lastAttempt && lastAttempt.testId === activeTest.id) {
           return <ResultScreen attempt={lastAttempt} test={activeTest} onHome={() => { setActiveTest(null); setLastAttempt(null); }} />
        }
        return <TestPlayer test={activeTest} user={user!} onComplete={(a) => {
           setLastAttempt(a);
           setAttempts([...attempts, a]);
           storageService.saveAttempt(a);
        }} onExit={() => setActiveTest(null)} />
     }

     if (isCreating) {
        return <CreateTestFlow user={user!} onCancel={() => setIsCreating(false)} onSave={(t) => {
           storageService.saveTest(t);
           setTests([...tests, t]);
           setIsCreating(false);
        }} />
     }

     return (
        <MobileWrapper className="bg-slate-50">
           {role === UserRole.STUDENT ? (
              <>
                 {activeTab === 'HOME' && <StudentHome user={user!} tests={tests} onSelectTest={setActiveTest} />}
                 {activeTab === 'TESTS' && (
                    <div className="pt-12 px-6">
                       <h2 className="text-2xl font-bold mb-4">All Tests</h2>
                       <div className="space-y-3">
                          {tests.map(t => (
                             <div key={t.id} onClick={() => setActiveTest(t)} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                                <div><h4 className="font-bold">{t.title}</h4><p className="text-xs text-slate-400">{t.subject}</p></div>
                                <ChevronRight className="text-slate-300" />
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
                 {activeTab === 'RESULTS' && (
                    <div className="pt-12 px-6">
                       <h2 className="text-2xl font-bold mb-4">My Results</h2>
                       <div className="space-y-3">
                          {attempts.filter(a => a.studentId === user!.id).map(a => (
                             <div key={a.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                                <div><h4 className="font-bold">{tests.find(t=>t.id===a.testId)?.title}</h4><p className="text-xs text-slate-400">{new Date(a.completedAt).toLocaleDateString()}</p></div>
                                <div className="text-lg font-bold text-pink-600">{a.score}/{a.totalQuestions}</div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
                 {activeTab === 'PROFILE' && (
                    <div className="pt-12 px-6 flex flex-col items-center">
                       <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 overflow-hidden">
                          <img src={user!.avatarUrl} className="w-full h-full object-cover" />
                       </div>
                       <h2 className="text-2xl font-bold">{user!.name}</h2>
                       <p className="text-slate-500 mb-8">{user!.email}</p>
                       <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-6 py-3 rounded-2xl">
                          <LogOut size={20} /> Sign Out
                       </button>
                    </div>
                 )}
              </>
           ) : (
              <>
                 {activeTab === 'DASH' && <TeacherDash user={user!} tests={tests} onCreate={() => setIsCreating(true)} onReports={() => setActiveTab('REPORTS')} onShowArch={() => setShowArch(true)} />}
                 {activeTab === 'REPORTS' && <TeacherReports attempts={attempts} tests={tests} onViewAttempt={setViewingReport} />}
                 {activeTab === 'CREATE' && <div className="p-8 text-center text-slate-400">Tap Create on Dashboard</div>}
                 {activeTab === 'PROFILE' && (
                    <div className="pt-12 px-6 flex flex-col items-center">
                       <h2 className="text-2xl font-bold">{user!.name}</h2>
                       <button onClick={handleLogout} className="mt-8 flex items-center gap-2 text-red-500 font-bold bg-red-50 px-6 py-3 rounded-2xl">
                          <LogOut size={20} /> Sign Out
                       </button>
                    </div>
                 )}
              </>
           )}
           <BottomNav role={role} activeTab={activeTab} onTabChange={setActiveTab} />
        </MobileWrapper>
     );
  };

  // Screen Routing
  if (screen === 'SPLASH') return <SplashScreen onFinish={() => setScreen(storageService.getCurrentUser() ? 'APP' : 'ROLE')} />;
  if (screen === 'ROLE') return <RoleSelectionScreen onSelect={(r) => { setRole(r); setScreen('AUTH'); }} />;
  if (screen === 'AUTH') return <AuthScreen role={role} onLogin={handleLogin} />;
  
  return renderContent();
}