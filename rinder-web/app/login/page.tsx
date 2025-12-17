"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login, register } from '@/services/auth';
import { getAssetPath } from '@/lib/utils';
import type { LoginCredentials, RegisterData } from '@/types';
import '@/styles/login_register.css';

export default function LoginPage() {
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [errors, setErrors] = useState({
    login: '',
    password: '',
    email: '',
    age: '',
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const credentials: LoginCredentials = {
      email_login: formData.get('email_login') as string,
      password_login: formData.get('password_login') as string,
    };

    const result = await login(credentials);
    
    if (result.success) {
      router.push('/');
    } else {
      setErrors({ ...errors, login: 'Ingrese un usuario válido' });
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Validaciones
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('password_confirmed') as string;
    const email = formData.get('email') as string;
    const fechaNacimiento = formData.get('fecha_nacimiento') as string;
    
    // Validar edad
    const edad = calcularEdad(fechaNacimiento);
    if (edad < 18) {
      setErrors({ ...errors, age: 'Lo sentimos, debe ser mayor de edad' });
      return;
    }
    
    // Validar contraseñas
    if (password !== passwordConfirm) {
      setErrors({ ...errors, password: 'Las contraseñas no coinciden' });
      return;
    }
    
    // Validar email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErrors({ ...errors, email: 'Ingrese un email válido' });
      return;
    }

    const data: RegisterData = {
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      email: email,
      fecha_nacimiento: fechaNacimiento,
      username: formData.get('username') as string,
      password: password,
    };

    const result = await register(data);
    
    if (result.success) {
      router.push('/');
    }
  };

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#F7F3F7',
      width: '100%',
    }}>
      <div className="logo">
        <Image 
          src={getAssetPath("/assets/logos/logoFuccia.png")} 
          alt="Rinder" 
          width={86} 
          height={86}
          id="logoinicio"
        />
      </div>

      <div className="main_container">
        {/* LOGIN SECTION */}
        <section id="login-section" style={{ display: showRegister ? 'none' : 'block' }}>
          <form id="login-form" onSubmit={handleLogin}>
            <div className="container_register">
              <label htmlFor="email_login">Correo electrónico:</label>
              <input 
                type="email" 
                name="email_login" 
                id="email_login" 
                required 
                autoComplete="on"
              />
              
              <label htmlFor="password_login">Contraseña:</label>
              <input 
                type="password" 
                name="password_login" 
                id="password_login" 
                required 
                autoComplete="on"
              />
              
              {errors.login && (
                <div id="login_fallido" style={{ display: 'block', color: 'red' }}>
                  {errors.login}
                </div>
              )}

              <button type="submit" id="login-btn">Iniciar sesión</button>
            </div>
          </form>
          <p>
            ¿No tienes una cuenta?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>
              Regístrate aquí
            </a>
          </p>
        </section>

        {/* REGISTER SECTION */}
        <section id="register-section" style={{ display: showRegister ? 'block' : 'none' }}>
          <form id="register-form" onSubmit={handleRegister}>
            <div className="container_register">
              <h3 id="datos">Regístrate aquí</h3>
              
              <div id="encap">
                <input 
                  type="text" 
                  name="nombre" 
                  id="nombre" 
                  required 
                  placeholder="Ingrese su nombre" 
                  autoComplete="off"
                />
                <input 
                  type="text" 
                  name="apellido" 
                  id="apellido" 
                  required 
                  placeholder="Ingrese su apellido" 
                  autoComplete="off"
                />
              </div>

              <input 
                type="email" 
                name="email" 
                id="email" 
                required 
                placeholder="Ingrese su correo electrónico" 
                autoComplete="on"
              />
              {errors.email && (
                <div id="mensaje-mail" style={{ display: 'block', color: 'red' }}>
                  {errors.email}
                </div>
              )}

              <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
              <input 
                type="date" 
                name="fecha_nacimiento" 
                id="fecha_nacimiento" 
                required 
                autoComplete="off"
              />
              {errors.age && (
                <div id="mensaje-menor-edad" style={{ display: 'block', color: 'red' }}>
                  {errors.age}
                </div>
              )}

              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                name="username" 
                id="u-username" 
                required 
                placeholder="Ingrese su usuario" 
                autoComplete="off"
              />

              <label htmlFor="password">Contraseña</label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                required 
                placeholder="Ingrese su contraseña" 
                autoComplete="on"
              />

              <input 
                type="password" 
                name="password_confirmed" 
                id="password_confirmed" 
                required 
                placeholder="Confirme su contraseña" 
                autoComplete="off"
              />
              {errors.password && (
                <div id="contraseñas_distintas" style={{ display: 'block', color: 'red' }}>
                  {errors.password}
                </div>
              )}

              <button type="submit" id="register-btn">Registrarse</button>

              <p>
                ¿Ya tienes una cuenta?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(false); }}>
                  Inicia sesión!
                </a>
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
