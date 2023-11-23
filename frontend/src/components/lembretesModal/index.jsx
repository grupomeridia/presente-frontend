import React from "react";
import style from "./style.module.css";

const LembretesModal = ({ lembretes, onClose }) => {
  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <button onClick={onClose}>FECHAR</button>
        <h2>Lembretes</h2>
        <ul>
          {Array.isArray(lembretes) && lembretes.map((lembrete, index) => (
            <li key={index}>
              <h3>Titulo: {lembrete.Titulo}</h3>
              <p>{lembrete.mensagem}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LembretesModal;
