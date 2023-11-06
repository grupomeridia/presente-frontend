import React, { useState, useEffect } from "react";
import api from "@/client/api";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { BsFillCheckCircleFill } from 'react-icons/bs';
import withAuth from "@/utils/auth";
import { useUser } from "@/contexts/UserContext";

function presencaAluno() {
  const { user } = useUser();
  const IdAluno = user && user.id_aluno;
  const [aluno, setAluno] = useState();
  const [chamadasAbertas, setChamadasAbertas] = useState([]);
  const [ra, setRa] = useState();
  const [historico, setHistorico] = useState([]);

  historico.reverse();

  useEffect(() => {
    const fetchData = async () => {
      try{
        const AlunosResponse = await api.aluno.chamadasAbertas(IdAluno);
        setChamadasAbertas(AlunosResponse.data);
  
    }catch(error) {
      console.error("Erro ao buscar as chamadas", error);
    };
  
    if (IdAluno) {
      fetchData();
    }
    }
  },[IdAluno]);

  useEffect(() => {
    if (user) {
      console.log("User:", user);
      setAluno(user.id_aluno);
      setRa(user.RA)
    }
  }, [user]);

  useEffect(() => {
    api.aluno
      .chamadasAbertas(IdAluno)
      .then((response) => {
        console.log(response.data);
        setChamadasAbertas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar as chamadas abertas:", error);
      });
  }, []);

  const fazerChamada = () => {
    const body = {
      ra: parseInt(ra, 10),
    };

    api.aluno
      .presenca(body)
      .then((response) => {
        console.log("Chamada marcada com sucesso:", response.data);
        setServerResponse(response.data);
      })
      .catch((error) => {
        console.error("Erro:", error);
        if (error.response) {
          console.error("Detalhes do erro:", error.response.data);
          setServerResponse(error.response.data);
        }
      });
  };

  const fetchPresencasAluno = () => {
    api.aluno.findChamadaByAluno(aluno)
      .then(response => {
        setHistorico(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.log("Error ao buscar a lista de presencas", error);
      });
  };

  useEffect(() => {
    fetchPresencasAluno();
  }, [aluno]);




  return (
    <div>
      <Cabecalho />
      <Navbar />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
          <div className={styles.chamada}>
            <div>
              <h1>Chamadas abertas</h1>
            </div>
            <table className={styles.tabela}>
              <thead className={styles.tableHeader}>
                <tr className={styles.row}>
                  <th className={styles.headerCell}>Professor</th>
                  <th className={styles.headerCell}>materia</th>
                  <th className={styles.headerCell}>Abertura</th>
                  <th className={styles.headerCell}>Encerramento</th>
                  <th className={styles.headerCell}>Acoes</th>
                </tr>
              </thead>
              {chamadasAbertas && chamadasAbertas.length > 0 ? (
                <tbody className={styles.tableBody}>
                  {chamadasAbertas.map((chamada) => (
                    <tr key={chamada.id} className={styles.row}>
                      <td className={styles.cell}>{chamada.professor_nome}</td>
                      <td className={styles.cell}>{chamada.materia_nome}</td>
                      <td className={styles.cell}>{chamada.abertura}</td>
                      <td className={styles.cell}>{chamada.encerramento ? chamada.encerramento : "não definido"}</td>
                      <td className={styles.cell}>
                        <button className={styles.botaoRealizaChamada} onClick={() => fazerChamada(chamada.id_chamada)}>
                          Marcar Presenca
                          {/* <BsFillCheckCircleFill/> */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody className={styles.tableBody}>
                  <tr className={styles.row}>
                    <td colSpan="5" className={styles.cell}>Nao ha chamadas</td>
                  </tr>
                </tbody>
              )}
            </table>

          </div>
          <div className={styles.historico}>
            <div>
              <h1>Ultimas Chamadas</h1>
            </div>
            <table className={styles.tabela}>
              {historico && historico.length > 0 ? (
                <tbody className={styles.tableBody}>
                  {historico.slice(0, 4).map((item) => (
                    <tr key={item.id_presenca} className={styles.row}>
                      <td className={styles.cell}>{item.nome}</td>
                      <td className={styles.cell}>{item.horario}</td>
                      <td className={styles.cell}>{item.status ? "ativo" : "inativo"}</td>
                      <td className={styles.cell}>{item.tipo_presenca}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody className={styles.tableBody}>
                  <tr className={styles.row}>
                    <td colSpan="4" className={styles.cell}>Semhistorico</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );

}

export default withAuth(presencaAluno, ['Aluno']);