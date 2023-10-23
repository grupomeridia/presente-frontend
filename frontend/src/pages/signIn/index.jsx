// pages/SignIn.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import logo from '../../img/logo-removebg.png'
import Image from "next/image";
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';

import api from '@/client/api';

const SignIn = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    Login();
}

  const Login = () => {
    const payload = {
      login: login,
      senha: password
    }

    console.log("Payload:" , payload);

    api.usuario.login(payload)
    .then((response) => {
      console.log("Resposta completa:", response);
      if (response.status === 200 && response.statusText == "OK" && response.data.id_aluno !== null ) { 
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        router.push(response.data.Cargo.toLowerCase() + '/home');
      } else {
        alert(response.data ? response.data.message : "Resposta inesperada do servidor.");
      }
    })
    .catch((error) => {
      alert("Erro durante a tentativa de login.");
      console.error(error);
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
      <div className={styles.avatar_center}>
            <Image src={logo} className={styles.avatar}/>
        <h1 className={styles.title}>Bem Vindo</h1>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Login:</label>
            <input 
              type="email" 
              className={styles.input} 
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Senha:</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className={styles.input}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className={styles.showButton} onClick={handleShowClick}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.1 }}
        className={styles.loginButton}
        onClick={Login}
      >
        Acessar
      </motion.button>
          <p className={styles.helperText}>Forgot password?</p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
