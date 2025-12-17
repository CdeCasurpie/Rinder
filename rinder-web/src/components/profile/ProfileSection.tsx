"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCurrentUser } from '@/services/auth';
import { getProfile, updateProfile, uploadProfilePhoto } from '@/services/profiles';
import type { Profile } from '@/types';

export default function ProfileSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    lastname: '',
    description: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = await getCurrentUser();
    if (user) {
      const profileData = await getProfile(user.id_usuario);
      setProfile(profileData);
      setFormData({
        username: profileData.username,
        name: profileData.nombre,
        lastname: profileData.apellido,
        description: profileData.descripcion || '',
      });
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      await uploadProfilePhoto(fileInput.files[0]);
      setShowPhotoModal(false);
      loadProfile();
    }
  };

  const handleUpdateProfile = async () => {
    await updateProfile(formData);
    setShowEditModal(false);
    loadProfile();
  };

  if (!profile) {
    return <div>Cargando perfil...</div>;
  }

  const photoUrl = profile.ruta_photo
    ? `/assets/profilePhotos/${profile.id}/${profile.ruta_photo}`
    : '/assets/images/fondo1.JPG';

  return (
    <>
      {/* MODALES */}
      {showPhotoModal && (
        <>
          <div 
            id="fullscreen" 
            className="vista-superior" 
            onClick={() => setShowPhotoModal(false)}
            style={{ display: 'block' }}
          />
          <form id="form-photo" className="mensaje-emergente" style={{ display: 'block' }} onSubmit={handlePhotoUpload}>
            <label htmlFor="file-upload">Subir una foto de perfil</label>
            <input type="file" id="file-upload" name="file-upload" />
            <button type="submit" className="btn-send">Enviar</button>
          </form>
        </>
      )}

      {showEditModal && (
        <>
          <div 
            id="fullscreen" 
            className="vista-superior" 
            onClick={() => setShowEditModal(false)}
            style={{ display: 'block' }}
          />
          <div className="mensaje-emergente" style={{ display: 'block' }}>
            <div>
              <label htmlFor="username">Nuevo nombre de usuario:</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="name">Nuevo nombre:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="lastname">Nuevo apellido:</label>
              <input
                type="text"
                id="lastname"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="description" id="labelDescrip">Nueva Descripción:</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <button type="button" className="btn-send" onClick={handleUpdateProfile}>
              Guardar
            </button>
          </div>
        </>
      )}

      {/* PERFIL */}
      <div className="profile-container">
        <div className="profile-top">
          <div className="profile-info-fast">
            <div className="profile-info-immage">
              <Image
                id="profile-section-photo-img"
                src={photoUrl}
                alt="Foto de perfil"
                width={150}
                height={150}
              />
              <button
                id="btn-add-photo"
                className="btn-add-photo"
                onClick={() => setShowPhotoModal(true)}
              >
                <span className="icon">+</span>
              </button>
            </div>
            <div className="profile-info-fast-box">
              <div className="fast-info-box">
                <h3 id="profile-name">{profile.nombre} {profile.apellido}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-down">
          <div className="profile-info-main rounded-pink-border" style={{ width: '100%' }}>
            <h5 id="profile-username">@{profile.username}</h5>
            <br />
            <p id="profile-description">
              <strong>Descripción:</strong> {profile.descripcion || 'Sin descripción'}
            </p>
            <p id="profile-nacimiento">
              <strong>Fecha nacimiento:</strong>{' '}
              {new Date(profile.nacimiento).toLocaleDateString()}
            </p>
            <p id="profile-edad">
              <strong>Edad:</strong> {profile.edad}
            </p>
            <p id="profile-genero">
              <strong>Género:</strong> {profile.genero || 'No especificado'}
            </p>

            <button
              className="btn-edit-profile"
              id="btn-edit-profile"
              onClick={() => setShowEditModal(true)}
            >
              <p>Editar perfil</p>
            </button>
          </div>

          {/* Posts del perfil (ocultos por ahora) */}
          <div className="profile-posts" style={{ display: 'none' }}>
            {/* Aquí irían los posts del usuario */}
          </div>
        </div>
      </div>
    </>
  );
}
