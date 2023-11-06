import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent, roles = []) => {
  return (props) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true); 
    const sessionTimeout = 60 * 60 * 2000; // 2 hora de validade, por exemplo.
    
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('timestamp');

        router.push('/login');
      }

    useEffect(() => {
        // Função para verificar o usuário e o cargo
        const verifyUser = () => {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          const timestamp = localStorage.getItem('timestamp');
          const currentTime = new Date().getTime();
  
          // Se não houver usuário ou a sessão expirou, faça logout
          if (!storedUser || (timestamp && currentTime - parseInt(timestamp) > sessionTimeout)) {
            logout();
          } else {
            if (storedUser) {
              localStorage.setItem('timestamp', currentTime.toString());
            }
  
            // Tratamento do cargo antes de setar o usuário
            const cleanCargo = storedUser?.Cargo.replace(/_/g, ' ');

            // Atualize o storedUser com o cargo tratado
          const updatedUser = {
            ...storedUser,
            Cargo: cleanCargo,
          };

            // Verificação do cargo
           if (updatedUser && roles.length && !roles.includes(updatedUser.Cargo)) {
            router.push('/error');
          } else {
            setUser(updatedUser);
          }
        }
        setLoading(false);
      };
  
        verifyUser();
        // Adicionado um identificador da sessão para forçar a verificação quando voltar para o aplicativo
      }, [router]); // Removido router.route para verificar em todas as mudanças de rota
  
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
