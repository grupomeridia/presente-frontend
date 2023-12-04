import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faFile, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { Fundo } from "@/components/Fundo/fundo";
import api from "@/client/api";
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";

function Modal({
  isOpen,
  onClose,
  alunoId,
  title,
  setTitle,
  content,
  setContent,
  cargo,
  onSend,
}) {
  const handleSend = () => {
    onSend(alunoId, title, content, cargo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <input
            type="text"
            className={styles.modalTitleInput}
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={onClose} className={styles.modalCloseButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <textarea
            className={styles.modalTextArea}
            placeholder="Lembrete"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalSubmitButton} onClick={handleSend}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

const Aluno = () => {
  const [alunos, setAlunos] = useState([]);
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


  return (
    <>
      <Navbar />
      <Cabecalho />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
        
          <div className={styles.search_input}>
          </div>
          <div className={styles.div_table}>
            <table className={styles.tabela}>
              <thead className={styles.tableHeader}>
                <tr className={styles.row}>
                  <th className={styles.headerCell}>Nome</th>
                  <th className={styles.headerCell}>Titulo</th>
                  <th className={styles.headerCell}>Enviado</th>
                  <th className={styles.headerCell}>Vizualizado</th>
                  <th className={styles.headerCell}>Enviado por</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    {" "} 
                    <td>{aluno.nome}</td>
                    <td>{aluno.ra}</td>
                    <td>{aluno.nome_materia}</td>
                    <td>{aluno.semestre}</td>
                    <td className={styles.iconCell}>
                      <FontAwesomeIcon
                        icon={faFile}
                        className={styles.faIcon}
                        onClick={() => openModal(aluno.id_aluno, aluno.cargo)}
                      />
                      <FontAwesomeIcon
                        icon={faChartPie}
                        className={styles.faIcon}
                        onClick={() => handleShowStats(aluno.id_aluno)}
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
       
      </Fundo>
    </>
  );
};

export default Aluno;
