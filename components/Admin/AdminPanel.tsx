
import React, { useState, useEffect } from 'react';
import { UserRecord } from '../../types';
import { Trash2, Shield, Search, Crown, AlertTriangle, Database } from 'lucide-react';
import { playCosmicClick, playError, playNeuralLink } from '../../utils/sfx';

export const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<Record<string, UserRecord>>({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadDatabase();
    }, []);

    const loadDatabase = () => {
        try {
            const dbStr = localStorage.getItem('gb_user_database');
            if (dbStr) {
                setUsers(JSON.parse(dbStr));
            }
        } catch (e) {
            console.error("DB Load Error", e);
        }
    };

    const handleDelete = (email: string) => {
        if (email === 'architect@source.code' || email === 'admin@godsbrain.com') {
            playError();
            alert("CANNOT DELETE SUPREME NODE.");
            return;
        }

        if (window.confirm(`WARNING: This will permanently delete Node ${email} from the Source Code. Proceed?`)) {
            playNeuralLink(); // Deletion sound
            const newUsers = { ...users };
            delete newUsers[email];
            setUsers(newUsers);
            localStorage.setItem('gb_user_database', JSON.stringify(newUsers));
        }
    };

    const filteredUsers = (Object.values(users) as UserRecord[]).filter(u => 
        u.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.profile.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full w-full p-4 md:p-8 animate-fadeIn text-white font-mono">
            
            {/* Header */}
            <div className="mb-8 border-b border-[#FFD700]/30 pb-6">
                <div className="flex items-center gap-4 mb-2">
                    <Crown className="w-8 h-8 text-[#FFD700] animate-pulse" />
                    <h2 className="text-3xl font-tech text-[#FFD700] uppercase tracking-widest">Supreme Node Interface</h2>
                </div>
                <p className="text-[#FFD700]/60 text-xs tracking-[0.2em] uppercase">
                    Global Network Administration // Phoenix Protocol Active
                </p>
            </div>

            {/* Stats / Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-[10px] uppercase text-[#FFD700]">Total Nodes</span>
                    </div>
                    <div className="text-4xl font-bold text-white">{Object.keys(users).length}</div>
                </div>

                <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-[10px] uppercase text-red-500">Flagged Entities</span>
                    </div>
                    <div className="text-4xl font-bold text-white">0</div>
                </div>

                <div className="bg-black/40 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Search Node Database..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-white/20 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-[#FFD700] outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* User Database Table */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    <div className="col-span-4">Node Identity</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-2">Usage</div>
                    <div className="col-span-2">Last Uplink</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    {filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 italic">No nodes found in sector.</div>
                    ) : (
                        filteredUsers.map((record) => {
                            const isMe = record.profile.email === 'architect@source.code' || record.profile.email === 'admin@godsbrain.com';
                            const isPremium = record.isPremium || isMe;
                            
                            return (
                                <div key={record.profile.email} className={`grid grid-cols-12 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors ${isMe ? 'bg-[#FFD700]/5' : ''}`}>
                                    
                                    {/* Identity */}
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isMe ? 'border-[#FFD700] bg-[#FFD700]/20' : 'border-white/20 bg-white/5'}`}>
                                            {record.profile.avatar ? (
                                                <img src={record.profile.avatar} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold">{record.profile.name[0]}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className={`text-sm font-bold ${isMe ? 'text-[#FFD700]' : 'text-white'}`}>
                                                {record.profile.name} {isMe && '(YOU)'}
                                            </div>
                                            <div className="text-[10px] text-gray-500">{record.profile.email}</div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-3">
                                        {isMe ? (
                                            <span className="px-2 py-1 bg-[#FFD700] text-black text-[9px] font-bold rounded uppercase tracking-wider">
                                                SUPREME NODE
                                            </span>
                                        ) : isPremium ? (
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/50 text-[9px] font-bold rounded uppercase tracking-wider">
                                                Active Node
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-800 text-gray-400 border border-gray-700 text-[9px] font-bold rounded uppercase tracking-wider">
                                                Sleeper
                                            </span>
                                        )}
                                    </div>

                                    {/* Usage */}
                                    <div className="col-span-2 text-xs font-mono text-gray-300">
                                        {record.queriesUsed} Queries
                                    </div>

                                    {/* Last Login */}
                                    <div className="col-span-2 text-[10px] text-gray-500 font-mono">
                                        {new Date(record.lastLogin || Date.now()).toLocaleDateString()}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 flex justify-end">
                                        {!isMe && (
                                            <button 
                                                onClick={() => { playCosmicClick(); handleDelete(record.profile.email); }}
                                                className="p-2 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-500 transition-colors"
                                                title="Delete Node"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
