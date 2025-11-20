import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Settings, LogOut, RefreshCw, AlertTriangle, Plus, Trash2, UserPlus, UserCheck, Lock, Unlock, Newspaper, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/votingService';
import { motion } from 'framer-motion';
import { Candidate, RegisteredStudent, NewsItem, OrganizationMember } from '../types';

type AdminTab = 'dashboard' | 'candidates' | 'students' | 'news' | 'organization' | 'settings';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [liveStats, setLiveStats] = useState<Record<string, number>>({});
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [students, setStudents] = useState<RegisteredStudent[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [orgMembers, setOrgMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [votingOpen, setVotingOpen] = useState(true);
  
  // Form States
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({ mission: [''] });
  const [newStudent, setNewStudent] = useState({ name: '', nisn: '' });
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({ title: '', category: '', content: '', imageUrl: '' });
  const [newMember, setNewMember] = useState<Partial<OrganizationMember>>({ name: '', position: '', imageUrl: '', order: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    const [resStats, resCand, resStud, resNews, resOrg] = await Promise.all([
      apiService.voting.getLiveResults(),
      apiService.content.getCandidates(),
      apiService.admin.getStudents(),
      apiService.content.getNews(),
      apiService.content.getOrganization()
    ]);

    if (resStats.success && resStats.data) setLiveStats(resStats.data);
    if (resCand.success && resCand.data) setCandidates(resCand.data);
    if (resStud.success && resStud.data) setStudents(resStud.data);
    if (resNews.success && resNews.data) setNewsList(resNews.data);
    if (resOrg.success && resOrg.data) setOrgMembers(resOrg.data);
    
    setVotingOpen(apiService.voting.getVotingStatus());
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await apiService.auth.logout();
    navigate('/');
  };

  // --- CANDIDATE HANDLERS ---
  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.vision) return alert("Nama dan Visi wajib diisi");
    const id = (candidates.length + 1).toString();
    const toAdd: Candidate = {
        id,
        name: newCandidate.name!,
        vision: newCandidate.vision!,
        mission: newCandidate.mission?.filter(m => m !== '') || [],
        imageUrl: `https://picsum.photos/400/400?random=${id + 10}`, 
        voteCount: 0
    };
    await apiService.content.addCandidate(toAdd);
    setNewCandidate({ mission: [''] });
    fetchAllData();
  };

  const handleDeleteCandidate = async (id: string) => {
    if (window.confirm("Hapus kandidat ini?")) {
        await apiService.content.deleteCandidate(id);
        fetchAllData();
    }
  };

  // --- STUDENT HANDLERS ---
  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.nisn) return;
    const res = await apiService.admin.addStudent(newStudent);
    if (res.success) {
        setNewStudent({ name: '', nisn: '' });
        fetchAllData();
    } else {
        alert(res.message);
    }
  };

  const handleDeleteStudent = async (nisn: string) => {
     await apiService.admin.deleteStudent(nisn);
     fetchAllData();
  };

  // --- NEWS HANDLERS ---
  const handleAddNews = async () => {
    if (!newNews.title || !newNews.content) return alert("Judul dan Konten wajib diisi");
    const news: NewsItem = {
      id: Date.now().toString(),
      title: newNews.title!,
      category: newNews.category || 'Umum',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      excerpt: newNews.content!.substring(0, 100) + "...",
      content: newNews.content!,
      imageUrl: newNews.imageUrl || `https://picsum.photos/600/400?random=${Date.now()}`
    };
    await apiService.content.addNews(news);
    setNewNews({ title: '', category: '', content: '', imageUrl: '' });
    fetchAllData();
  };

  const handleDeleteNews = async (id: string) => {
    if(window.confirm("Hapus berita ini?")) {
      await apiService.content.deleteNews(id);
      fetchAllData();
    }
  };

  // --- ORG MEMBER HANDLERS ---
  const handleAddMember = async () => {
    if (!newMember.name || !newMember.position) return alert("Nama dan Jabatan wajib diisi");
    const member: OrganizationMember = {
      id: Date.now().toString(),
      name: newMember.name!,
      position: newMember.position!,
      imageUrl: newMember.imageUrl || `https://ui-avatars.com/api/?name=${newMember.name}&background=random`,
      order: newMember.order || orgMembers.length + 1
    };
    await apiService.content.addOrganizationMember(member);
    setNewMember({ name: '', position: '', imageUrl: '', order: 0 });
    fetchAllData();
  };

  const handleDeleteMember = async (id: string) => {
    await apiService.content.deleteOrganizationMember(id);
    fetchAllData();
  };

  // --- SETTINGS HANDLER ---
  const toggleVoting = async () => {
      const newState = !votingOpen;
      await apiService.voting.toggleVotingStatus(newState);
      setVotingOpen(newState);
  };

  const totalVotes = (Object.values(liveStats) as number[]).reduce((a, b) => a + b, 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg">
                        <h3 className="text-sm font-medium text-slate-400">Total Suara Masuk</h3>
                        <p className="text-4xl font-bold text-gold-400 mt-2">{totalVotes}</p>
                        <span className="text-xs text-green-400 flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Live Update
                        </span>
                    </div>
                    <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg">
                        <h3 className="text-sm font-medium text-slate-400">Daftar Pemilih Tetap</h3>
                        <p className="text-4xl font-bold text-white mt-2">{students.length}</p>
                        <span className="text-xs text-slate-500">Siswa Terdaftar</span>
                    </div>
                    <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 shadow-lg">
                        <h3 className="text-sm font-medium text-slate-400">Status Server</h3>
                        <p className="text-4xl font-bold text-green-400 mt-2">Online</p>
                        <span className="text-xs text-slate-500">Latency: 24ms</span>
                    </div>
                </div>

                <div className="bg-navy-800 p-6 rounded-xl border border-navy-700 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Hasil Sementara</h3>
                        <button onClick={fetchAllData} disabled={isLoading} className="p-2 bg-navy-700 rounded-lg hover:bg-navy-600">
                            <RefreshCw size={18} className={`${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {candidates.map((c) => {
                            const count = liveStats[c.id] || 0;
                            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                            return (
                                <div key={c.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white font-semibold">{c.name}</span>
                                        <span className="text-gold-400">{count} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-navy-900 rounded-full h-3">
                                        <div 
                                            className="bg-gradient-to-r from-gold-600 to-gold-400 h-3 rounded-full transition-all duration-1000" 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>
        );
      
      case 'candidates':
          return (
            <div className="space-y-6">
                 <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Plus size={20}/> Tambah Kandidat</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            className="bg-navy-900 border border-navy-600 p-3 rounded text-white" 
                            placeholder="Nama Pasangan Calon"
                            value={newCandidate.name || ''}
                            onChange={e => setNewCandidate({...newCandidate, name: e.target.value})}
                        />
                        <input 
                            className="bg-navy-900 border border-navy-600 p-3 rounded text-white" 
                            placeholder="Visi Singkat"
                            value={newCandidate.vision || ''}
                            onChange={e => setNewCandidate({...newCandidate, vision: e.target.value})}
                        />
                    </div>
                    <button onClick={handleAddCandidate} className="mt-4 bg-gold-500 text-navy-900 px-4 py-2 rounded font-bold hover:bg-gold-400">
                        Simpan Kandidat
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidates.map(c => (
                        <div key={c.id} className="bg-navy-800 border border-navy-700 p-4 rounded-xl flex justify-between items-start">
                            <div className="flex gap-4">
                                <img src={c.imageUrl} className="w-16 h-16 rounded object-cover bg-navy-900" alt="" />
                                <div>
                                    <h4 className="font-bold text-white">{c.name}</h4>
                                    <p className="text-xs text-slate-400 mt-1">{c.vision}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDeleteCandidate(c.id)} className="text-red-400 hover:text-red-300">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                 </div>
            </div>
          );

      case 'students':
        return (
            <div className="space-y-6">
                <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><UserPlus size={20}/> Daftarkan Siswa (DPT)</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input 
                            className="flex-1 bg-navy-900 border border-navy-600 p-3 rounded text-white" 
                            placeholder="Nama Lengkap Siswa"
                            value={newStudent.name}
                            onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                        />
                        <input 
                            className="w-full md:w-48 bg-navy-900 border border-navy-600 p-3 rounded text-white" 
                            placeholder="NISN"
                            value={newStudent.nisn}
                            onChange={e => setNewStudent({...newStudent, nisn: e.target.value})}
                        />
                        <button onClick={handleAddStudent} className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-500">
                            Tambah
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">* Hanya siswa yang terdaftar di sini yang bisa login untuk memilih.</p>
                </div>

                <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-navy-900 text-slate-400 text-sm uppercase">
                            <tr>
                                <th className="p-4">Nama Siswa</th>
                                <th className="p-4">NISN</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-700">
                            {students.map(s => (
                                <tr key={s.nisn} className="hover:bg-navy-700/50 transition-colors">
                                    <td className="p-4 text-white font-medium">{s.name}</td>
                                    <td className="p-4 text-gold-400 font-mono">{s.nisn}</td>
                                    <td className="p-4">
                                        <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">Terdaftar</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDeleteStudent(s.nisn)} className="text-red-400 hover:text-red-300 p-2">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
      
      case 'news':
        return (
          <div className="space-y-6">
             <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Newspaper size={20}/> Tulis Berita Baru</h3>
                <div className="grid grid-cols-1 gap-4">
                   <input 
                      className="bg-navy-900 border border-navy-600 p-3 rounded text-white w-full" 
                      placeholder="Judul Berita"
                      value={newNews.title}
                      onChange={e => setNewNews({...newNews, title: e.target.value})}
                   />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input 
                          className="bg-navy-900 border border-navy-600 p-3 rounded text-white" 
                          placeholder="Kategori (Misal: Prestasi, Event)"
                          value={newNews.category}
                          onChange={e => setNewNews({...newNews, category: e.target.value})}
                       />
                       <input 
                          className="bg-navy-900 border border-navy-600 p-3 rounded text-white" 
                          placeholder="URL Gambar (Opsional)"
                          value={newNews.imageUrl}
                          onChange={e => setNewNews({...newNews, imageUrl: e.target.value})}
                       />
                   </div>
                   <textarea 
                      className="bg-navy-900 border border-navy-600 p-3 rounded text-white h-32 w-full" 
                      placeholder="Isi Berita Lengkap..."
                      value={newNews.content}
                      onChange={e => setNewNews({...newNews, content: e.target.value})}
                   />
                </div>
                <button onClick={handleAddNews} className="mt-4 bg-gold-500 text-navy-900 px-6 py-2 rounded font-bold hover:bg-gold-400">
                    Publikasikan
                </button>
             </div>

             <div className="grid gap-4">
                {newsList.map(news => (
                   <div key={news.id} className="bg-navy-800 border border-navy-700 p-4 rounded-xl flex gap-4">
                      <img src={news.imageUrl} className="w-24 h-24 object-cover rounded bg-navy-900" alt="" />
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-lg">{news.title}</h4>
                            <button onClick={() => handleDeleteNews(news.id)} className="text-red-400 hover:text-red-300">
                               <Trash2 size={18} />
                            </button>
                         </div>
                         <p className="text-xs text-gold-400 mb-2">{news.date} | {news.category}</p>
                         <p className="text-sm text-slate-400 line-clamp-2">{news.excerpt}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );

      case 'organization':
        return (
          <div className="space-y-6">
             <div className="bg-navy-800 p-6 rounded-xl border border-navy-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Building size={20}/> Tambah Pengurus OSIS</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <input 
                      className="bg-navy-900 border border-navy-600 p-3 rounded text-white" 
                      placeholder="Nama Lengkap"
                      value={newMember.name}
                      onChange={e => setNewMember({...newMember, name: e.target.value})}
                   />
                   <input 
                      className="bg-navy-900 border border-navy-600 p-3 rounded text-white" 
                      placeholder="Jabatan (ex: Ketua OSIS)"
                      value={newMember.position}
                      onChange={e => setNewMember({...newMember, position: e.target.value})}
                   />
                   <input 
                      className="bg-navy-900 border border-navy-600 p-3 rounded text-white" 
                      placeholder="URL Foto (Opsional)"
                      value={newMember.imageUrl}
                      onChange={e => setNewMember({...newMember, imageUrl: e.target.value})}
                   />
                </div>
                <button onClick={handleAddMember} className="mt-4 bg-gold-500 text-navy-900 px-6 py-2 rounded font-bold hover:bg-gold-400">
                    Tambah Anggota
                </button>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {orgMembers.map(m => (
                   <div key={m.id} className="bg-navy-800 border border-navy-700 p-4 rounded-xl text-center relative group">
                      <button 
                        onClick={() => handleDeleteMember(m.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                      <img src={m.imageUrl} alt="" className="w-20 h-20 rounded-full mx-auto object-cover mb-3 border-2 border-gold-400" />
                      <h4 className="font-bold text-white">{m.name}</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{m.position}</p>
                   </div>
                ))}
             </div>
          </div>
        );

      case 'settings':
          return (
            <div className="space-y-6">
                <div className="bg-navy-800 p-8 rounded-xl border border-navy-700">
                    <h3 className="text-xl font-bold text-white mb-6">Kontrol Sesi Voting</h3>
                    
                    <div className="flex items-center justify-between p-6 bg-navy-900 rounded-lg border border-navy-600 mb-6">
                        <div>
                            <h4 className="text-lg font-bold text-white">Status Pemilihan</h4>
                            <p className="text-sm text-slate-400">Jika ditutup, siswa tidak akan bisa masuk ke bilik suara.</p>
                        </div>
                        <button 
                            onClick={toggleVoting}
                            className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
                                votingOpen 
                                ? 'bg-green-500 text-navy-900 hover:bg-green-400' 
                                : 'bg-red-500 text-white hover:bg-red-400'
                            }`}
                        >
                            {votingOpen ? <><Unlock size={18}/> SEDANG DIBUKA</> : <><Lock size={18}/> DITUTUP</>}
                        </button>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg">
                        <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2"><AlertTriangle size={20}/> Dangerous Zone</h4>
                        <p className="text-sm text-red-300 mb-4">Mereset akan menghapus seluruh perolehan suara.</p>
                        <button 
                            onClick={async () => {
                                if(window.confirm("Yakin ingin mereset semua hasil suara?")) {
                                    await apiService.voting.resetVotes();
                                    fetchAllData();
                                }
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-medium text-sm transition-colors"
                        >
                            Reset Hasil Suara
                        </button>
                    </div>
                </div>
            </div>
          );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex text-slate-light font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-800 border-r border-navy-700 hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-navy-700">
          <h2 className="text-xl font-bold text-white tracking-wider">OSIS ADMIN</h2>
          <p className="text-xs text-green-400 font-mono mt-1 flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> System Active</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'dashboard' ? 'bg-navy-700 text-white shadow-lg' : 'hover:bg-navy-700/50'}`}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'students' ? 'bg-navy-700 text-white shadow-lg' : 'hover:bg-navy-700/50'}`}>
            <UserCheck size={18} /> <span>Daftar Pemilih</span>
          </button>
          <button onClick={() => setActiveTab('candidates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'candidates' ? 'bg-navy-700 text-white shadow-lg' : 'hover:bg-navy-700/50'}`}>
            <Users size={18} /> <span>Kandidat</span>
          </button>
          <button onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'news' ? 'bg-navy-700 text-white shadow-lg' : 'hover:bg-navy-700/50'}`}>
            <Newspaper size={18} /> <span>Berita</span>
          </button>
          <button onClick={() => setActiveTab('organization')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'organization' ? 'bg-navy-700 text-white shadow-lg' : 'hover:bg-navy-700/50'}`}>
            <Building size={18} /> <span>Organisasi</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'settings' ? 'bg-navy-700 text-white shadow-lg' : 'hover:bg-navy-700/50'}`}>
            <Settings size={18} /> <span>Pengaturan</span>
          </button>
        </nav>

        <div className="p-4 border-t border-navy-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
            <LogOut size={18} /> <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto min-h-screen">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white capitalize">{activeTab}</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your digital ecosystem securely.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">Administrator</p>
                    <p className="text-xs text-gold-400">Super Admin</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50">
                    <Settings size={20} className="text-white" />
                </div>
            </div>
        </header>

        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;