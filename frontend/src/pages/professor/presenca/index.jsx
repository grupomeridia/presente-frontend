import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import { Fundo } from "@/components/Fundo/fundo";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import React, { useState } from "react";

import api from "@/client/api";
import withAuth from "@/utils/auth";

const Presenca = () => {
  const [ra, setRa] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  const MarcarPresenca = () => {
    const body = {
      ra: parseInt(ra, 10),
    };

    api.professor
      .presenca(body)
      .then((response) => {
        console.log("Chamada marcada com sucesso:", response.data);
        setServerResponse(response.data);
        setButtonClicked(true);
      })
      .catch((error) => {
        console.error("Erro:", error);
        if (error.response) {
          console.error("Detalhes do erro:", error.response.data);
          setServerResponse(error.response.data);
          setButtonClicked(true);
        }
      });
  };

  const renderResponse = () => {
    if (!buttonClicked) {
      return null;
    } else {
      const successIcon = "✅";
      const errorIcon = "❌";
      const responseMessage = serverResponse || "";

      if (serverResponse === "presença registrada") {
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

export default withAuth(Presenca,['Professor']);