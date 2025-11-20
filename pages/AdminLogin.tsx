import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/votingService';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.auth.loginAdmin(password);
      if (response.success) {
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Akses ditolak.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(2, 12, 27, 0.9), rgba(2, 12, 27, 0.95)), url("https://www.transparenttextures.com/patterns/cubes.png")',
             backgroundSize: '50px 50px'
           }}>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md w-full bg-navy-800/80 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.1)]"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 animate-pulse">
            <Shield size={40} className="text-red-500" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-white tracking-wider">RESTRICTED AREA</h2>
          <p className="text-red-400 text-xs uppercase tracking-[0.2em] mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
            <input 
              type="password"
              placeholder="Admin Key Pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-900/50 border border-navy-600 text-slate-white pl-12 pr-4 py-3 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all placeholder:text-slate-600 font-mono"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-red-400 text-xs bg-red-950/30 p-3 rounded border border-red-900/50"
            >
              <AlertTriangle size={14} /> {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
          >
            {isLoading ? (
              <span className="animate-pulse">VERIFYING...</span>
            ) : (
              <>
                ACCESS CONTROL <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
           <a href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">← Return to Public Portal</a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;