import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import style from "./cabecalho.module.css";
import { useUser } from "@/contexts/UserContext";
import api from "@/client/api";
import LembretesModal from "../lembretesModal";

const Cabecalho = () => {
  const router = useRouter();
  const { user } = useUser();
  const [lembretes, setLembretes] = useState([]);
  const [showLembretesModal, setShowLembretesModal] = useState(false);
  const [expandedLembrete, setExpandedLembrete] = useState(null);
  const jwt = user ? user.JWT : null;

  useEffect(() => {
    if (user) {
      const jwt = user.JWT;
    }
  }, [user]);

  const handleExpandLembrete = (lembrete) => {
    setExpandedLembrete(lembrete);
  };

  const handleCloseExpanded = () => {
    setExpandedLembrete(null);
  };


  useEffect(() => {
    if (user && user.Cargo && user.id_aluno) {
      api.aluno
        .fetchLembretes(user.Cargo, user.id_aluno,jwt)
        .then((response) => {
          // Se a resposta for um objeto, mas você espera um array, converta-o em um array
          const data = response.data;
          if (!Array.isArray(data) && data.Titulo && data.mensagem) {
            // Supõe que o objeto tenha as propriedades Titulo e mensagem
            setLembretes([data]); // Converte em um array com um único objeto
          } else {
            setLembretes(data); // Usa diretamente se já for um array
          }
        })
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("timestamp");
    router.push("/login");
  };

  const toggleLembretesModal = () => {
    setShowLembretesModal(!showLembretesModal);
  };

  return (
    <>
            <div className={style.cabecalho_center}>
        <div className={style.cabecalho}>
          <span className={style.headerTitle}>App Chamada</span>
          {user?.Cargo === "Aluno" ? (
            <div className={style.lembreteIcon} onClick={toggleLembretesModal}>
              <FontAwesomeIcon icon={faBell} />
              {lembretes.length > 0 && (
                <span className={style.lembreteCount}>{lembretes.length}</span>
              )}
              
            </div>
          ) : null}
          <div>
          <button onClick={handleLogout} className={style.logoutButton}>
            <FontAwesomeIcon icon={faSignOutAlt} className={style.headerIcon} />
          </button>
          </div>
        </div>
      </div>

      {showLembretesModal && (
        <LembretesModal
          lembretes={lembretes}
          onClose={toggleLembretesModal}
          onExpandLembrete={handleExpandLembrete}
          expandedLembrete={expandedLembrete}
          onCloseExpanded={handleCloseExpanded}
        />
      )}
    </>
  );
};

export default Cabecalho;
