"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth';
import { getAssetPath } from '@/lib/utils';

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function Sidebar({ activeSection = 'Matches', onSectionChange }: SidebarProps) {
  const router = useRouter();
  const [active, setActive] = useState(activeSection);

  const handleSectionClick = (section: string) => {
    setActive(section);
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="sidebar">
      <div>
        <div className="title">
          <Image 
            src={getAssetPath("/assets/logos/logoTitle.png")} 
            alt="Rinder" 
            width={200} 
            height={62}
            style={{ marginLeft: '-13px' }}
          />
        </div>
        <a 
          id="Matches" 
          className={active === 'Matches' ? 'active' : ''}
          onClick={() => handleSectionClick('Matches')}
          style={{ cursor: 'pointer' }}
        >
          Rind your love!
        </a>
        <a 
          id="Posts" 
          className={active === 'Posts' ? 'active' : ''}
          onClick={() => handleSectionClick('Posts')}
          style={{ display: 'none', cursor: 'pointer' }}
        >
          Posts
        </a>
        <a 
          id="Mensajes" 
          className={active === 'Mensajes' ? 'active' : ''}
          onClick={() => handleSectionClick('Mensajes')}
          style={{ cursor: 'pointer' }}
        >
          Mensajes
        </a>
        <a 
          id="Perfil" 
          className={active === 'Perfil' ? 'active' : ''}
          onClick={() => handleSectionClick('Perfil')}
          style={{ cursor: 'pointer' }}
        >
          Mi Perfil
        </a>
        <a 
          id="Planes" 
          className={active === 'Planes' ? 'active' : ''}
          onClick={() => handleSectionClick('Planes')}
          style={{ cursor: 'pointer' }}
        >
          Planes
        </a>
        <a 
          id="Soporte" 
          className={active === 'Soporte' ? 'active' : ''}
          onClick={() => handleSectionClick('Soporte')}
          style={{ cursor: 'pointer' }}
        >
          Soporte
        </a>
      </div>
      <div>
        <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
          Cerrar sesión
        </a>
      </div>
    </div>
  );
}
