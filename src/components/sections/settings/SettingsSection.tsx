import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../../../types/UserProfile';

const SettingsSection = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    bio: '',
    ramoProfissional: '',
    photoURL: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const ref = doc(db, 'userProfiles', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setProfile({ ...profile, photoURL: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Aqui você pode adicionar upload da foto para o Firebase Storage se desejar
      // Por enquanto, salva apenas a URL local
      if (user) {
        await setDoc(doc(db, 'userProfiles', user.uid), profile);
        setSuccess('Perfil salvo com sucesso!');
      }
    } catch (err: any) {
      setError('Erro ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return (
    <div className="flex flex-col gap-8 items-start">
      <div className="bg-white rounded-2xl p-8 shadow flex flex-col w-full" style={{ minHeight: 120 }}>
        <span className="text-gray-400" style={{ fontSize: 14, fontWeight: 500, marginBottom: 18, textAlign: 'left' }}>Configurações de Perfil</span>
        <form className="flex flex-col gap-0" onSubmit={handleSave}>
          <div className="flex items-start gap-4 py-8 border-b border-gray-200">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 w-48 pt-1">Nome de Usuário</label>
            <input
              id="username"
              name="username"
              type="text"
              value={profile.username}
              onChange={handleChange}
              placeholder="Usuário"
              className="border p-2 px-4 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 flex-1 placeholder:text-sm text-sm"
              required
            />
          </div>
          <div className="flex items-start gap-4 py-8 border-b border-gray-200">
            <label htmlFor="bio" className="text-sm font-medium text-gray-700 w-48 pt-1">Biografia</label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Digite a sua descrição ou de sua loja..."
              className="border p-2 px-4 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 flex-1 placeholder:text-sm text-sm"
              rows={5}
              required
            />
          </div>
          <div className="flex items-start gap-4 py-8 border-b border-gray-200">
            <label htmlFor="ramoProfissional" className="text-sm font-medium text-gray-700 w-48 pt-1">Área Profissional</label>
            <input
              id="ramoProfissional"
              name="ramoProfissional"
              type="text"
              value={profile.ramoProfissional}
              onChange={handleChange}
              placeholder="Ramo alimentício, bebidas, etc..."
              className="border p-2 px-4 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 flex-1 placeholder:text-sm text-sm"
              required
            />
          </div>
          <div className="flex items-start gap-4 py-8">
            <label htmlFor="photo" className="text-sm font-medium text-gray-700 w-48 pt-1">Foto de Perfil</label>
            <div className="flex items-center gap-4 flex-1 profile-photo-input-wrapper">
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="border p-12 px-10 rounded bg-gray-100 focus:border-gray-400 focus:outline-none focus:ring-0 text-sm file:text-sm file:py-2 file:px-3 file:rounded file:bg-gray-400 file:font-medium file:text-white file:border-none responsive-photo-input"
                style={{ fontSize: '0.75rem' }}
              />
              {profile.photoURL && (
                <img src={profile.photoURL} alt="Foto de perfil" className="w-24 h-24 rounded-full object-cover border" />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-gray-600 hover:opacity-80 text-white font-semibold py-2 px-6 rounded-lg transition self-end text-sm"
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar' }
          </button>
          {success && <span className="text-green-600 text-sm mt-2">{success}</span>}
          {error && <span className="text-red-600 text-sm mt-2">{error}</span>}
        </form>
      </div>
    </div>
  );
};

export default SettingsSection; 