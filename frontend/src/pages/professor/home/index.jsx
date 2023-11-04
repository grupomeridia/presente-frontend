import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import React, { useState, useEffect } from "react";

import api from "@/client/api";
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";

import { invokeCallback } from "@/utils/sending";

const Chamada = () => {
  const { user } = useUser();
  const IdProfessor = user && user.id_professor;
  const [id, setId] = useState();
  const [turmas, setTurmas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [dataEncerramento, setDataEncerramento] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [chamadasAbertas, setChamadasAbertas] = useState([]);
  const [dataAbertura, setDataAbertura] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  

  useEffect(() => {
    if (user) {
        console.log("User:", user);
        setId(user.id_professor);
    }
}, [user]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const turmaResponse = await api.professor.turmas(IdProfessor);
      setTurmas(turmaResponse.data);

      const projetosData = turmaResponse.data.map((turma) => ({
        id_projeto: turma.id_materia,
        nome_projeto: turma.nome_materia,
      }));
      setProjetos(projetosData);

      const chamadasResponse = await api.professor.chamadasAbertas(IdProfessor);
      setChamadasAbertas(chamadasResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  if (IdProfessor) {
    fetchData();
  }
}, [IdProfessor]);


  useEffect(() => {
    api.professor
      .turmas(IdProfessor)
      .then((response) => {
        console.log(response.data);
        setTurmas(response.data);

        const projetosData = response.data.map((turma) => ({
          id_projeto: turma.id_materia,
          nome_projeto: turma.nome_materia,
        }));

        setProjetos(projetosData);
      })
      .catch((error) => {
        console.error("Erro ao buscar as turmas:", error);
      });
  }, []);


  useEffect(() => {
    api.professor
      .chamadasAbertas(IdProfessor)
      .then((response) => {
        console.log(response.data);
        setChamadasAbertas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar as chamadas abertas:", error);
      });
  }, []);

  

  //Abrir chamada

  const formatData = (dataString) => {
    if (!dataString) return "";
    const [date, time] = dataString.split("T");
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy} ${time}`;
  };

  const abrirChamada = () => {
    const payload = {
      id_turma: selectedTurma,
      id_professor: IdProfessor,
      // id_materia: selectedProjeto,
      encerramento: formatData(dataEncerramento) || null,
      abertura: formatData(dataAbertura) || null,
    };

    console.log("Enviando payload:", payload);

    api.chamada
      .create(payload)
      .then((response) => {
        console.log("Resposta da chamada:", response.data);
        setServerResponse(response.data);
        setButtonClicked(true);
        return api.professor.chamadasAbertas(IdProfessor);
      })
      .then((response) => {
        setChamadasAbertas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao abrir a chamada:", error);
        setServerResponse(error.response.data);
        setButtonClicked(true);
        if (error.response) {
          console.error("Detalhes do erro:", error.response.data);
        }
      });
  };

  // Fechar chamada

  const fecharChamada = (idChamada) => {
    api.chamada
      .fecharChamada(idChamada)
      .then((response) => {
        console.log("Chamada encerrada com sucesso:", response.data);
        setServerResponse(response.data);
        return api.professor.chamadasAbertas(IdProfessor);
      })
      .then((response) => {
        setChamadasAbertas(response.data);
      })
      .catch((error) => {
        console.error("Erro:", error);
        if (error.response) {
          setServerResponse(error.response.data)
          console.error("Detalhes do erro:", error.response.data);
        }
      });
  };

  const renderResponse = () => {
    if (!buttonClicked) {
      return null;
    } else {
      const successIcon = "✅";
      const errorIcon = "❌";
      let responseMessage = "";
  
      if (typeof serverResponse === 'object' && serverResponse.mensagem) {
        responseMessage = serverResponse.mensagem;
      } else if (typeof serverResponse === 'string') {
        responseMessage = serverResponse;
      }
  
      if (responseMessage === "Chamada registrada"  || responseMessage === "Chamada fechada com sucesso") {
        return (
          <div>
            {successIcon} {responseMessage}
          </div>
        );
      } else {
        return (
          <div>
            {errorIcon} {responseMessage}
          </div>
        );
      }
    }
  };


  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.fundoContainer}>
        <div className={styles.serverResponse}>{renderResponse()}</div>
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Abrir Chamada</h2>

              <select
                className={styles.input}
                id="turma"
                value={selectedTurma}
                onChange={(e) => setSelectedTurma(e.target.value)}
              >
                <option value="">Selecione uma Turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id_turma} value={turma.id_turma}>
                    {turma.nome}
                  </option>
                ))}
              </select>

              {/* <select
                className={styles.input}
                id="turma"
                value={selectedProjeto}
                onChange={(e) => setSelectedProjeto(e.target.value)}
              >
                <option value="">Selecione um Projeto</option>
                {projetos.map((projeto) => (
                  <option key={projeto.id_projeto} value={projeto.id_projeto}>
                    {projeto.nome_projeto}
                  </option>
                ))}
              </select> */}

              <label>Insira a data de abertura:</label>
              <input
                className={styles.input}
                type="datetime-local"
                value={dataAbertura}
                onChange={(e) => setDataAbertura(e.target.value)}
              />

              <label>Insira a data de encerramento:</label>
              <input
                className={styles.input}
                type="datetime-local"
                value={dataEncerramento}
                onChange={(e) => setDataEncerramento(e.target.value)}
              />
            </div>

            <br />

            <button className={styles.botao} onClick={abrirChamada}>
              ABRIR
            </button>
          </div>
        </div>
      </Fundo>

      <Fundo>
        <div className={styles.container_chamadas}>
          <h2>Chamadas Abertas</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Turma</th>
                <th>Projeto</th>
                <th>Professor</th>
                <th>Data Abertura</th>
                <th>Data Encerramento</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {chamadasAbertas.map((chamada) => (
                <tr key={chamada.id}>
                  <td>{chamada.id_turma}</td>
                  <td>{chamada.nome_materia}</td>
                  <td>{chamada.id_professor}</td>
                  <td>{chamada.abertura}</td>
                  <td>
                    {chamada.encerramento
                      ? chamada.encerramento
                      : "não definido"}
                  </td>
                  <td>
                    <button onClick={() => fecharChamada(chamada.id_chamada)}>
                      Encerrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fundo>
    </>
  );
}

export default  withAuth(Chamada,['Professor']);