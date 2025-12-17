"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getRandomMatch, checkMatch } from '@/services/profiles';
import { getAssetPath } from '@/lib/utils';
import type { Match } from '@/types';

export default function MatchesSection() {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [animationClass, setAnimationClass] = useState('slide-in-top');

  useEffect(() => {
    loadNewMatch();
  }, []);

  const loadNewMatch = async () => {
    const match = await getRandomMatch();
    setCurrentMatch(match);
  };

  const handleReject = () => {
    setAnimationClass('slide-out-bottom');
    setTimeout(() => {
      loadNewMatch();
      setAnimationClass('slide-in-top');
    }, 500);
  };

  const handleLike = async () => {
    setAnimationClass('slide-out-top');
    
    if (currentMatch) {
      const result = await checkMatch(currentMatch.user_id);
      
      setTimeout(() => {
        loadNewMatch();
        setAnimationClass('slide-in-bottom');
      }, 500);

      if (result.match) {
        setTimeout(() => {
          alert("¡Es un match!");
        }, 800);
      }
    }
  };

  if (!currentMatch) {
    return <div>Cargando...</div>;
  }

  const photoSrc = currentMatch?.ruta_photo
    ? getAssetPath(`/assets/profilePhotos/${currentMatch.user_id}/${currentMatch.ruta_photo}`)
    : getAssetPath('/assets/images/fondo1.JPG'); // placeholder

  return (
    <>
      <div className="left-matches">
        <button id="like" onClick={handleLike}>
          <Image src={getAssetPath("/assets/icons/c_rosado.PNG")} alt="Acepta" width={80} height={80} />
        </button>
      </div>

      <div className={`center-matches ${animationClass}`} id="center-matches">
        <div className="profile-photo-matches" id="container_image">
          <Image 
            id="foto_perfil"
            src={photoSrc}
            alt="Foto de perfil"
            width={425}
            height={425}
            data-id={currentMatch.user_id}
          />
          <div id="profile-photo-footer" className="profile-photo-footer">
            <h4>{currentMatch.nombre}</h4>
            <h4>{currentMatch.edad}</h4>
          </div>
        </div>
        
        <div id="profile-info-matches" className="profile-info-matches">
          <p><strong>Descripción:</strong></p>
          <p>{currentMatch.descripcion || 'Sin descripción disponible'}</p>
        </div>
      </div>

      <div className="right-matches">
        <button id="equis" onClick={handleReject}>
          <Image 
            id="equis_image" 
            src={getAssetPath("/assets/icons/equis.PNG")} 
            alt="Rechaza" 
            width={80} 
            height={80}
          />
        </button>
      </div>
    </>
  );
}
