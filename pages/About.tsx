import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { OrganizationMember } from '../types';
import { apiService } from '../services/votingService';
import { Users, Award, BookOpen } from 'lucide-react';

const About: React.FC = () => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiService.content.getOrganization();
      if (res.success && res.data) {
        setMembers(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-navy-900 pt-24 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-serif font-bold text-slate-white mb-6"
        >
          Tentang OSIS
        </motion.h1>
        <p className="text-slate-light max-w-3xl mx-auto text-lg">
          Organisasi Siswa Intra Sekolah SMK LPPMRI 2 Kedungreja adalah wadah aspirasi dan kreasi siswa untuk membangun karakter kepemimpinan yang unggul dan berintegritas.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-navy-800 p-8 rounded-2xl border border-navy-700 shadow-xl"
          >
            <div className="w-12 h-12 bg-gold-500/20 text-gold-400 rounded-lg flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Visi</h2>
            <p className="text-slate-300 leading-relaxed">
              Mewujudkan OSIS sebagai organisasi yang mandiri, kreatif, inovatif, dan berakhlak mulia berlandaskan IMTAQ dan IPTEK.
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="bg-navy-800 p-8 rounded-2xl border border-navy-700 shadow-xl md:col-span-2"
          >
             <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
              <BookOpen size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Misi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
               <ul className="space-y-3 list-disc pl-5">
                 <li>Meningkatkan keimanan dan ketaqwaan terhadap Tuhan Yang Maha Esa.</li>
                 <li>Mengembangkan bakat dan minat siswa melalui kegiatan ekstrakurikuler.</li>
               </ul>
               <ul className="space-y-3 list-disc pl-5">
                 <li>Menjalin kerjasama yang harmonis antar warga sekolah.</li>
                 <li>Meningkatkan kedisiplinan dan rasa tanggung jawab siswa.</li>
               </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Structure Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-navy-800 rounded-full flex items-center justify-center border border-navy-700">
            <Users className="text-gold-400" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-white">Struktur Organisasi</h2>
            <div className="h-1 w-20 bg-gold-400 rounded-full mt-2"></div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-20">Memuat struktur organisasi...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 bg-navy-800/50 rounded-xl border border-navy-700 border-dashed">
             <p className="text-slate-400">Belum ada data pengurus yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-gold-500/20">
                   <div className="aspect-square overflow-hidden bg-navy-900 relative">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent opacity-60"></div>
                   </div>
                   <div className="p-4 text-center relative -mt-8">
                      <div className="bg-navy-700 inline-block px-4 py-1 rounded-full border border-navy-600 shadow-lg mb-3">
                         <span className="text-gold-400 text-xs font-bold tracking-wider uppercase">{member.position}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default About;