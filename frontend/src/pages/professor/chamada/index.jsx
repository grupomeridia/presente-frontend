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

  //   useEffect(() => {
  //     api.professor
  //       .chamadasAbertas(IdProfessor)
  //       .then((response) => {
  //         console.log(response.data);
  //         setChamadasAbertas(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Erro ao buscar as chamadas abertas:", error);
  //       });
  // }, []);

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
      })
      .catch((error) => {
        console.error("Erro ao abrir a chamada:", error);
        setServerResponse("Erro ao abrir a chamada.");
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
                <th>Periodo</th>
                <th>Projeto</th>
                <th>Data</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {/* {chamadasAbertas.map((chamada) => (
                <tr key={chamada.id}>
                  <td>{chamada.turma}</td>
                  <td>{chamada.periodo}</td>
                  <td>{chamada.projeto}</td>
                  <td>{chamada.data}</td>
                  <td>
                    <span>Ação</span>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </Fundo>
    </>
  );
}
