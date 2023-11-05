import React from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog,faSignOutAlt  } from "@fortawesome/free-solid-svg-icons";
import style from "./cabecalho.module.css";

const Cabecalho = () => {

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('timestamp');
    
    router.push('/login');
  };

  return (
    <div className={style.cabecalho_center}>
      <div className={style.cabecalho}>
        <span className={style.headerTitle}>App Chamada</span>
        {/* <FontAwesomeIcon icon={faCog} className={style.headerIcon} /> */}
        <button onClick={handleLogout} className={style.logoutButton}>
          <FontAwesomeIcon icon={faSignOutAlt} className={style.headerIcon} />
        </button>
      </div>
    </div>
  );
};

export default Cabecalho;
