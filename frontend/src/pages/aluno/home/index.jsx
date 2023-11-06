import React, { useState, useEffect } from "react";
import api from "@/client/api";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { BsFillCheckCircleFill } from "react-icons/bs";
import withAuth from "@/utils/auth";
import { useUser } from "@/contexts/UserContext";

function presencaAluno() {
  const { user } = useUser();
  // const [aluno, setALuno] = useState(1);
  const [chamadasAbertas, setChamadasAbertas] = useState([]);
  const [historico, setHistorico] = useState([]);
  const id_aluno = user ? user.id_aluno : null;
  const ra = user ? user.RA : null;
  const [ServerResponse, setServerResponse] = useState("");

  historico.reverse();

  useEffect(() => {
    if (user) {
      const id_aluno = user.id_aluno;
      const ra = user.RA;
    }
  }, [user]);

  const fetchChamadasAbertas = () => {
    api.aluno
      .chamadasAbertas(id_aluno)

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
        setServerResponse(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar as chamadas abertas:", error);
        setServerResponse(error.response.data);
      });
    };

    useEffect(() => {
      fetchChamadasAbertas();
      fetchPresencasAluno();
    }, [id_aluno]);

  const fazerChamada = (id_chamada) => {
    // if (!ra) {
    //   console.error("RA não disponível.");
    //   return;
    // }

    const body = {
      ra: parseInt(ra, 10),
    };

    console.log(ra);

    api.aluno
      .presenca(body)
      .then((response) => {
        console.log("Chamada marcada com sucesso:", response.data);
        setServerResponse(response.data);
        fetchChamadasAbertas();
        fetchPresencasAluno();
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
    api.aluno
      .findChamadaByAluno(id_aluno)
      .then((response) => {
        setHistorico(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error ao buscar a lista de presencas", error);
      });
  };

  useEffect(() => {
    fetchPresencasAluno();
  }, [id_aluno]);

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
              </thead>
              {chamadasAbertas && chamadasAbertas.length > 0 ? (
                <tbody className={styles.tableBody}>
                  {chamadasAbertas.map((chamada) => (
                    <tr key={chamada.id} className={styles.row}>
                      <td className={styles.cell}>{chamada.professor_nome}</td>
                      <td className={styles.cell}>{chamada.materia_nome}</td>
                      <td className={styles.cell}>{chamada.abertura}</td>
                      <td className={styles.cell}>
                        {chamada.encerramento
                          ? chamada.encerramento
                          : "não definido"}
                      </td>
                      <td className={styles.cell}>
                        <button
                          className={styles.botaoRealizaChamada}
                          onClick={() => fazerChamada(chamada.id_chamada)}
                        >
                          Marcar Presenca
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody className={styles.tableBody}>
                  <tr className={styles.row}>
                    <td colSpan="5" className={styles.cell}>
                      Não há chamadas
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          <div className={styles.historico}>
            <div>
              <h1>Últimas Chamadas</h1>
            </div>
            <table className={styles.tabela}>
              {historico && historico.length > 0 ? (
                <tbody className={styles.tableBody}>
                  {historico.slice(0, 4).map((item) => (
                    <tr key={item.id_presenca} className={styles.row}>
                      <td className={styles.cell}>{item.nome}</td>
                      <td className={styles.cell}>{item.horario}</td>
                      <td className={styles.cell}>
                        {item.status ? "ativo" : "inativo"}
                      </td>
                      <td className={styles.cell}>{item.tipo_presenca}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody className={styles.tableBody}>
                  <tr className={styles.row}>
                    <td colSpan="4" className={styles.cell}>
                      Sem Historico
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}

export default withAuth(presencaAluno, ["Aluno"]);

