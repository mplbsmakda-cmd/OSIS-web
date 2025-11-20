import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Candidate, User } from '../types';
import { apiService } from '../services/votingService';
import { Lock, CheckCircle, BarChart2, AlertCircle, Check } from 'lucide-react';

const Voting: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nisnInput, setNisnInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [votingComplete, setVotingComplete] = useState(false);
  const [liveStats, setLiveStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
        // Load Session
        const session = apiService.auth.getSession();
        if (session && session.role === 'STUDENT') {
            setUser(session);
            if (session.hasVoted) {
                setVotingComplete(true);
            }
        }
        // Load Candidates dynamically
        const res = await apiService.content.getCandidates();
        if(res.success && res.data) {
            setCandidates(res.data);
        }
    };
    fetchData();
  }, []);

  // Update live stats when voting is done or user has voted
  useEffect(() => {
    if (votingComplete || user?.hasVoted) {
      const fetchResults = async () => {
        const res = await apiService.voting.getLiveResults();
        if (res.success && res.data) {
            setLiveStats(res.data);
        }
      };
      fetchResults();
    }
  }, [votingComplete, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await apiService.auth.loginStudent(nisnInput);
      if (res.success && res.data) {
        setUser(res.data);
        if (res.data.hasVoted) {
            setVotingComplete(true);
        }
      } else {
        setError(res.message || 'Gagal login.');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate || !user) return;
    
    setIsLoading(true);
    const res = await apiService.voting.submitVote(selectedCandidate.id, user.nisn);
    
    if (res.success) {
      setVotingComplete(true);
      setUser({ ...user, hasVoted: true });
    } else {
      setError(res.message || 'Gagal merekam suara.');
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
      await apiService.auth.logout();
      setUser(null);
      setVotingComplete(false);
      setNisnInput('');
      setSelectedCandidate(null);
  };

  // Component: Login Form
  if (!user) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl animate-pulse"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-navy-800/50 backdrop-blur-xl p-8 rounded-2xl border border-navy-600 shadow-2xl max-w-md w-full z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-400/30">
                <Lock className="text-gold-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-white">Akses E-Voting</h2>
            <p className="text-slate-light mt-2 text-sm">Masukkan NIS/NISN Anda untuk menggunakan hak suara.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Masukkan NISN (Sesuai DPT)"
                value={nisnInput}
                onChange={(e) => setNisnInput(e.target.value)}
                className="w-full bg-navy-900 border border-navy-600 text-slate-white px-4 py-3 rounded-lg focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold-500/20"
            >
              {isLoading ? 'Memeriksa Data...' : 'Masuk ke Bilik Suara'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Component: Voting Results (After Voting)
  if (votingComplete) {
    const totalVotes = (Object.values(liveStats) as number[]).reduce((a, b) => a + b, 0);

    return (
      <div className="min-h-screen bg-navy-900 pt-24 px-6 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50"
          >
            <CheckCircle size={40} />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-white mb-2">Terima Kasih, {user.name}!</h2>
          <p className="text-slate-light mb-12">Suara Anda telah berhasil direkam secara aman.</p>

          <div className="grid gap-6">
            <h3 className="text-xl font-serif text-gold-400 flex items-center justify-center gap-2">
                <BarChart2 /> Hasil Sementara
            </h3>
            {candidates.map((candidate) => {
                const votes = liveStats[candidate.id] || 0;
                const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                
                return (
                    <div key={candidate.id} className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                        <div className="flex justify-between items-end mb-2">
                            <span className="font-bold text-slate-white">{candidate.name}</span>
                            <span className="text-gold-400 font-mono text-lg">{percentage}%</span>
                        </div>
                        <div className="w-full h-4 bg-navy-900 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                            />
                        </div>
                        <div className="text-left mt-2 text-xs text-slate-500">Total Suara: {votes}</div>
                    </div>
                );
            })}
          </div>
          
          <button 
            onClick={handleLogout}
            className="mt-12 text-slate-500 hover:text-slate-300 underline"
          >
            Keluar (Logout)
          </button>
        </div>
      </div>
    );
  }

  // Component: Ballot Paper (Candidate Selection)
  return (
    <div className="min-h-screen bg-navy-900 pt-24 px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-white mb-4">
            Pilih Ketua & Wakil Ketua OSIS
          </h2>
          <p className="text-slate-light">Masa Bakti 2024/2025</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {candidates.length === 0 ? (
             <div className="col-span-3 text-center py-12 bg-navy-800 rounded-xl border border-navy-700 border-dashed">
               <p className="text-slate-400">Belum ada kandidat yang ditambahkan oleh Admin.</p>
             </div>
          ) : candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              whileHover={{ y: -10 }}
              className={`relative bg-navy-800 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedCandidate?.id === candidate.id 
                  ? 'border-gold-400 shadow-[0_0_30px_rgba(255,215,0,0.3)] scale-105 z-10' 
                  : 'border-navy-700 hover:border-navy-600 opacity-80 hover:opacity-100 grayscale hover:grayscale-0'
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              {/* Image Area */}
              <div className="h-64 bg-navy-900 relative overflow-hidden group">
                 <img 
                   src={candidate.imageUrl} 
                   alt={candidate.name} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>
                 
                 {/* Selection Indicator */}
                 {selectedCandidate?.id === candidate.id && (
                    <div className="absolute top-4 right-4 bg-gold-400 text-navy-900 p-2 rounded-full shadow-lg animate-bounce">
                        <Check size={20} strokeWidth={3} />
                    </div>
                 )}

                 <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md">{candidate.name}</h3>
                 </div>
              </div>
              
              {/* Content Area */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gold-400 text-sm font-serif italic border-l-2 border-gold-400 pl-3 py-1">
                    "{candidate.vision}"
                  </p>
                </div>
                <ul className="space-y-2">
                    {candidate.mission.slice(0, 3).map((m, i) => (
                        <li key={i} className="text-xs text-slate-light flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-1.5 shrink-0"></span>
                            {m}
                        </li>
                    ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Action Bar for Voting */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 w-full bg-navy-900/90 backdrop-blur-md border-t border-navy-700 z-50 px-6 py-4 shadow-2xl"
        >
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <p className="text-slate-500 text-xs uppercase tracking-wider">Pemilih Terdaftar</p>
                    <p className="font-bold text-slate-white">{user.name} <span className="text-gold-400">({user.nisn})</span></p>
                </div>
                
                <div className="flex items-center gap-4">
                    {selectedCandidate ? (
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-slate-500">Pilihan Anda:</p>
                                <p className="text-gold-400 font-bold">{selectedCandidate.name}</p>
                            </div>
                            <button 
                                onClick={handleVote}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-900 font-bold px-8 py-3 rounded-full transition-all shadow-lg shadow-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? 'Memproses...' : 'KIRIM SUARA'}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-navy-800 px-6 py-3 rounded-full text-slate-500 text-sm border border-navy-700">
                          Silakan pilih pasangan calon di atas
                        </div>
                    )}
                </div>
             </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Voting;