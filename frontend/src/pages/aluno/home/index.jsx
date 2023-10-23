import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import { Fundo } from "@/components/Fundo/fundo";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import React, { useState, useEffect } from "react";

import api from "@/client/api";

export default function Presenca() {
  const [ra, setRa] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);

  const MarcarPresenca = () => {
    const body = {
      ra: parseInt(ra, 10),
    };

    api.professor
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

  const renderResponseMessage = () => {
    if (!ra) {
      return "Por favor, insira um RA.";
    }
    if (serverResponse && serverResponse.mensagem) {
      return serverResponse.mensagem === "presença registrada"
        ? `✅ ${serverResponse.mensagem}`
        : `❌ ${serverResponse.mensagem}`;
    }
    return "";
  };

  

  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.fundoContainer}>
          <div className={styles.serverResponse}>{renderResponseMessage()}</div>
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Realizar Presença</h2>
              <input
                className={styles.input}
                type="text"
                placeholder="Informe o RA"
                value={ra || ""}
                onChange={(e) => setRa(e.target.value)}
              ></input>
            </div>
            <button className={styles.botao} onClick={MarcarPresenca}>
              Confirmar Presença
            </button>
          </div>
        </div>
      </Fundo>
    </>
  );
}
