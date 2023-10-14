import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import React, { useState, useEffect } from "react";

import api from "@/client/api";

export default function Chamada() {
  const [IdProfessor, setIdProfessor] = useState("1");
  const [turmas, setTurmas] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [chamadasAbertas, setChamadasAbertas] = useState([]);

  useEffect(() => {
    api.professor
      .turmas(IdProfessor)
      .then((response) => {
        console.log(response.data);
        setTurmas(response.data);
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

  const abrirChamada = () => {
    const payload = {
      id_turma: selectedTurma,
      id_professor: IdProfessor,
    };
  
    console.log("Enviando payload:", payload);
  
    api.chamada
      .create(payload)
      .then((response) => {
        console.log("Resposta da chamada:", response.data);
        setServerResponse("Chamada aberta com sucesso!");
        // Após abrir a chamada com sucesso, refetch chamadas abertas
        return api.professor.chamadasAbertas(IdProfessor);
      })
      .then((response) => {
        setChamadasAbertas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao abrir a chamada:", error);
        setServerResponse("Erro ao abrir a chamada.");
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
        // Após encerrar a chamada com sucesso, refetch chamadas abertas
        return api.professor.chamadasAbertas(IdProfessor);
      })
      .then((response) => {
        setChamadasAbertas(response.data);
      })
      .catch((error) => {
        console.error("Erro:", error);
        if (error.response) {
          console.error("Detalhes do erro:", error.response.data);
        }
      });
  };

  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.fundoContainer}>
          {serverResponse && (
            <div className={styles.serverResponse}>
              {serverResponse === "Chamada aberta com sucesso!" ? "✅" : "❌"}{" "}
              {serverResponse}
            </div>
          )}

          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Abrir Chamada</h2>

              <select
                className={styles.input}
                id="turma"
                value={selectedTurma}
                onChange={(e) => setSelectedTurma(e.target.value)}
              >
                <option value="">Turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id_turma} value={turma.id_turma}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </div>
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
                  <td>{chamada.encerramento}</td>
                  <td>{chamada.id_professor}</td>
                  <td>{chamada.abertura}</td>
                  <td>{chamada.encerramento ? chamada.encerramento : "não definido"}</td>
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
