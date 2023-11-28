import { useEffect, useState,useCallback } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent, roles = []) => {
  return (props) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true); 
    const sessionTimeout = 60 * 60 * 2000; // 2 hora de validade, por exemplo.
    
    const logout = useCallback(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('timestamp');
    
      if (router.pathname !== '/login') {
        router.push('/login');
      }
    }, [router]);

    useEffect(() => {
      // ... código do useEffect ...
    }, [router, sessionTimeout, roles, logout]);

    useEffect(() => {
      // Função assíncrona para verificar o usuário e o cargo
      async function verifyUser() {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const timestamp = localStorage.getItem('timestamp');
        const currentTime = new Date().getTime();
    
        // Se não houver usuário ou a sessão expirou, faça logout
        if (!storedUser || (timestamp && currentTime - parseInt(timestamp) > sessionTimeout)) {
          logout();
        } else {
          // Atualiza o timestamp do usuário logado
          if (storedUser) {
            localStorage.setItem('timestamp', currentTime.toString());
          }
    
          // Tratamento do cargo antes de setar o usuário
          const cleanCargo = storedUser?.Cargo.replace(/_/g, ' ');
          const updatedUser = {
            ...storedUser,
            Cargo: cleanCargo,
          };
    
          // Verificação do cargo
          if (roles.length && !roles.includes(updatedUser.Cargo)) {
            router.push('/error');
          } else {
            setUser(updatedUser);
          }
        }
      }
    
      // Executa a função de verificação
      verifyUser().finally(() => {
        // Encerra o estado de carregamento após a verificação
        setLoading(false);
      });
    
      // A dependência 'logout' deve ser estabilizada com useCallback se definida fora do useEffect
    }, [router, sessionTimeout, roles, logout]);

  
      // Se o estado de carregamento estiver ativo, retornar um componente de loading
      if (loading) {
        return <div>Carregando...</div>; // Idealmente, substituir por um componente de loading real
      }
  
      // Se não houver usuário logado, retorna null para não renderizar nada
      if (!user) {
        return null;
      }
  
      // Usuário autenticado e com o cargo permitido, renderiza o componente
      return <WrappedComponent {...props} user={user} logout={logout} />;
    };
  };
  
  export default withAuth;
