'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Type, User } from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';
import { INITIAL_AVATAR_GRADIENTS, SILHOUETTE_AVATARS } from '@/types/profile';
import { cropAndCompressImage, uploadAvatarToStorage, blobToBase64, setLocalAvatar } from '@/lib/avatarStorage';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n';

type Tab = 'upload' | 'initials' | 'silhouettes';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  isSupporter: boolean;
}

export function AvatarUploadModal({ isOpen, onClose, level, isSupporter }: AvatarUploadModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFileRef = useRef<File | null>(null);

  const { user } = useAuth();
  const { t } = useTranslation();
  const setAvatarUrl = useStore(s => s.setAvatarUrl);
  const userName = useStore(s => s.name);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    selectedFileRef.current = file;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleUploadConfirm = useCallback(async () => {
    const file = selectedFileRef.current;
    if (!file) return;
    setIsUploading(true);

    try {
      const blob = await cropAndCompressImage(file);

      if (user?.id) {
        // Authenticated: upload to Supabase Storage
        const url = await uploadAvatarToStorage(blob, user.id);
        setAvatarUrl(url);
      } else {
        // Anonymous: store as base64 in separate localStorage key
        const base64 = await blobToBase64(blob);
        setLocalAvatar(base64);
        setAvatarUrl(null); // No URL in store for anonymous
      }

      onClose();
    } catch (err) {
      console.error('Avatar upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  }, [user, setAvatarUrl, onClose]);

  const handleInitialSelect = useCallback((gradientIndex: number) => {
    setSelectedGradient(gradientIndex);
    // Clear any uploaded avatar — use initial-letter fallback
    setAvatarUrl(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('avatar-local');
    }
    onClose();
  }, [setAvatarUrl, onClose]);

  const handleSilhouetteSelect = useCallback((path: string) => {
    setAvatarUrl(path);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('avatar-local');
    }
    onClose();
  }, [setAvatarUrl, onClose]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'upload', label: t('profilePage.avatarUpload'), icon: <Upload className="w-4 h-4" /> },
    { id: 'initials', label: t('profilePage.avatarInitials'), icon: <Type className="w-4 h-4" /> },
    { id: 'silhouettes', label: t('profilePage.avatarSilhouettes'), icon: <User className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md mx-4 mb-4 bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-lg font-display text-amber-100">{t('profilePage.chooseAvatar')}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 px-5 pb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-amber-900/40 text-amber-200 border border-amber-700/30'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-5 pb-6 min-h-[280px]">
              {activeTab === 'upload' && (
                <div className="flex flex-col items-center gap-4">
                  {/* Preview */}
                  <div className="flex items-center justify-center">
                    {previewUrl ? (
                      <AvatarDisplay
                        size="hero"
                        avatarUrl={previewUrl}
                        name={userName}
                        level={level}
                        isSupporter={isSupporter}
                      />
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-36 h-36 rounded-full border-2 border-dashed border-stone-700 hover:border-amber-600/50 flex flex-col items-center justify-center gap-2 text-stone-500 hover:text-amber-400 transition-colors"
                      >
                        <Upload className="w-8 h-8" />
                        <span className="text-xs">{t('profilePage.tapToUpload')}</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {previewUrl && (
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => {
                          setPreviewUrl(null);
                          selectedFileRef.current = null;
                          fileInputRef.current?.click();
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-sm font-medium hover:bg-stone-700 transition-colors"
                      >
                        {t('profilePage.chooseDifferent')}
                      </button>
                      <button
                        onClick={handleUploadConfirm}
                        disabled={isUploading}
                        className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors disabled:opacity-50"
                      >
                        {isUploading ? t('profilePage.saving') : t('profilePage.saveAvatar')}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'initials' && (
                <div className="flex flex-col items-center gap-5">
                  <p className="text-sm text-stone-400 text-center">
                    {t('profilePage.chooseGradient')}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {INITIAL_AVATAR_GRADIENTS.map((gradient, i) => (
                      <button
                        key={i}
                        onClick={() => handleInitialSelect(i)}
                        className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center transition-transform hover:scale-105 ${
                          selectedGradient === i ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-900' : ''
                        }`}
                      >
                        <span className="text-2xl font-display font-bold text-white/90">
                          {userName?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'silhouettes' && (
                <div className="flex flex-col items-center gap-5">
                  <p className="text-sm text-stone-400 text-center">
                    {t('profilePage.choosePhilosophicalAvatar')}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {SILHOUETTE_AVATARS.map((avatar) => (
                      <button
                        key={avatar.key}
                        onClick={() => handleSilhouetteSelect(avatar.path)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-stone-800 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center overflow-hidden">
                          <img
                            src={avatar.path}
                            alt={avatar.label}
                            className="w-12 h-12 opacity-70"
                            draggable={false}
                          />
                        </div>
                        <span className="text-xs text-stone-400">{avatar.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
