"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import Sidebar from '@/components/layout/Sidebar';
import MatchesSection from '@/components/matches/MatchesSection';
import MessagesSection from '@/components/messages/MessagesSection';
import ProfileSection from '@/components/profile/ProfileSection';
import PlanesSection from '@/components/profile/PlanesSection';
import SoporteSection from '@/components/profile/SoporteSection';

// Importar estilos globales
import '@/styles/styles.css';
import '@/styles/animations.css';
import '@/styles/matches.css';
import '@/styles/messages.css';
import '@/styles/profile.css';
import '@/styles/posts.css';

export default function HomePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('Matches');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw' }}>
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="main">
        {/* MATCHES SECTION */}
        <div 
          id="Matches-Content" 
          className={`Matches-container slide-in-top ${activeSection === 'Matches' ? '' : 'slide-out-bottom'}`}
          style={{ display: activeSection === 'Matches' ? 'flex' : 'none' }}
        >
          <MatchesSection />
        </div>

        {/* MESSAGES SECTION */}
        <div 
          id="Mensajes-Content" 
          className={`slide-in-top Messages-container ${activeSection === 'Mensajes' ? '' : 'slide-out-bottom'}`}
          style={{ display: activeSection === 'Mensajes' ? 'flex' : 'none' }}
        >
          <MessagesSection />
        </div>

        {/* PROFILE SECTION */}
        <div 
          id="Perfil-Content" 
          className={`Perfil-container slide-in-top ${activeSection === 'Perfil' ? '' : 'slide-out-bottom'}`}
          style={{ display: activeSection === 'Perfil' ? 'block' : 'none' }}
        >
          <ProfileSection />
        </div>

        {/* PLANES SECTION */}
        <div 
          id="Planes-Content" 
          className={`slide-in-top ${activeSection === 'Planes' ? '' : 'slide-out-bottom'}`}
          style={{ display: activeSection === 'Planes' ? 'block' : 'none' }}
        >
          <PlanesSection />
        </div>

        {/* SOPORTE SECTION */}
        <div 
          id="Soporte-Content" 
          className={`slide-in-top ${activeSection === 'Soporte' ? '' : 'slide-out-bottom'}`}
          style={{ display: activeSection === 'Soporte' ? 'block' : 'none' }}
        >
          <SoporteSection />
        </div>
      </div>

      {/* ADDS CONTAINER (publicidad) */}
      <div className="adds-container rounded-pink-border">
        <div className="row">
          <div className="col-12">
            <h3>Publicidad</h3>
            <br />
            <p>Nos estas viendo? Ellos te verán</p>
            <a>Anunciate aqui!</a>
          </div>
        </div>
      </div>
    </div>
  );
}
