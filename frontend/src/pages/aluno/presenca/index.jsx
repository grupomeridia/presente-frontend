import React, { useState, useEffect } from "react";
import api from "@/client/api";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { BsFillCheckCircleFill } from 'react-icons/bs';


function presencaAluno() {
  // const [professor, setProfessor] = useState("");
  // const [curso, setCusco] = useState("");
  // const [projeto, setProjeto] = useState("");
  // const [presencas, setPresencas] = useState("");
  // const [alunos, setAlunos] = useState("");
  // const [ativo, setAtivo] = useState(false);
  // const [alunoRa, setAlunoRa] = useState("");
  // const [turma, setTurma] = useState("");
  // const [chamada, setChamada] = useState("");
  // const [tipoPresenca, setTipoPresenca] = useState("");
  // const [horario, setHorario] = useState("");
  // const [isSuccess, setIsSuccess] = useState(true); 

  const [aluno, setALuno] = useState(1);
  const [chamadasAbertas, setChamadasAbertas] = useState([]);
  const [ra, setRa] = useState(234325);

  useEffect(() => {
    api.aluno
      .chamadasAbertas(aluno)
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

  const [historico, setHistorico] = useState([]);

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
              <thead>
                <tr>
                  <th>Professor</th>
                  <th>Projeto</th>
                  <th>Abertura</th>
                  <th>Encerramento</th>
                </tr>
              </thead>
              <tbody>
                {chamadasAbertas.map((chamada) => (
                  <tr key={chamada.id}>
                    <td className={styles.td}>{chamada.professor_nome}</td>
                    <td>{chamada.materia_nome}</td>
                    <td>{chamada.abertura}</td>
                    <td>{chamada.encerramento ? chamada.encerramento : "não definido"}</td>
                    <td>
                      <button className={styles.botaoRealizaChamada} onClick={() => fazerChamada(chamada.id_chamada)}>
                        Marcar Presenca
                        {/* <BsFillCheckCircleFill/> */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div className={styles.historico}>
            <div>
              <h1>Ultimas Chamadas</h1>
            </div>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Dia/Hora</th>
                  <th>Status</th>
                  <th>Tipo de Presenca</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item) => (
                  <tr key={item.id_presenca}>
                    <td>{item.nome}</td>
                    <td>{item.horario}</td>
                    <td>{item.status ? "ativo" : "inativo"}</td>
                    <td>{item.tipo_presenca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );

}

export default presencaAluno;