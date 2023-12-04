import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faFile, faChartPie,faEye  } from "@fortawesome/free-solid-svg-icons";
import { Fundo } from "@/components/Fundo/fundo";
import api from "@/client/api";
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";

function Modal({ isOpen, onClose, title, content }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.ajuste}>          
            <h2 className={styles.modalTitle}>Titulo:</h2><h1>{title}</h1>
            </div>
          <button onClick={onClose} className={styles.modalCloseButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalText}>Mensagem: {content}</p>
        </div>
      </div>
    </div>
  );
}

const Lembrete = () => {
  const [lembretes, setLembretes] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLembrete, setSelectedLembrete] = useState(null);
  const { user } = useUser();
  const IdSecretaria = user && user.id_secretaria;
  const [id, setId] = useState();
  const jwt = user ? user.JWT : null;

  useEffect(() => {
    if (user) {
      console.log("User:", user);
      setId(user.id_secretaria);
      const jwt = user.JWT;
    }
  }, [user]);

  const handleFileIconClick = (lembreteId) => {
    api.lembrete
      .FindById(lembreteId, jwt)
      .then((response) => {
        setSelectedLembrete(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar lembrete:", error);
      });
  };
  const listarTodosLembretes = () => {
    api.lembrete
      .listAll(jwt)
      .then((response) => {
        setLembretes(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar lembretes:", error);
      });
  };

  useEffect(() => {
    listarTodosLembretes(jwt);
  }, [jwt]);

  return (
    <>
      <Navbar />
      <Cabecalho />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
          <div className={styles.search_input}></div>
          <div className={styles.div_table}>
            <table className={styles.tabela}>
              <thead className={styles.tableHeader}>
                <tr className={styles.row}>
                  <th className={styles.headerCell}>Nome</th>
                  <th className={styles.headerCell}>Titulo</th>
                  <th className={styles.headerCell}>Data do Envio</th>
                  <th className={styles.headerCell}>Vizualizado</th>
                  <th className={styles.headerCell}>Enviado por</th>
                  <th className={styles.headerCell}></th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {lembretes.map((lembrete) => (
                  <tr key={lembrete.id}>
                    <td>{lembrete.nome_aluno}</td>
                    <td>{lembrete.titulo}</td>
                    <td>{lembrete.criacao}</td>
                    <td>{lembrete.visualizacao || 'Não visualizado'}</td>
                    <td>{lembrete.nome_secretaria}</td>
                    <td className={styles.iconCell}>
                      <FontAwesomeIcon
                        icon={faEye}
                        className={styles.faIcon}
                        onClick={() =>
                          handleFileIconClick(lembrete.id_lembrete)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <Fundo>
        {selectedLembrete && (
          <div className={styles.lembreteContainer}>
            <h1 className={styles.lembreteTitle}>LEMBRETE</h1>
            <div className={styles.lembreteContent}>
              <h2>Titulo: {selectedLembrete.titulo}</h2>
              <p>Mensagem: {selectedLembrete.mensagem}</p>
            </div>
            <div className={styles.lembreteFooter}>
              <span>Enviado em: {selectedLembrete.criacao}</span>
              <span>Visualizado em: {selectedLembrete.visualizacao || 'Não visualizado'}</span>
            </div>
          </div>
        )}
      </Fundo>
    </>
  );
};

export default withAuth(Lembrete, ["Secretaria"]);
