import React, { useState } from "react";
import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChalkboardTeacher,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

export default function Cadastrar() {
  const [activeForm, setActiveForm] = useState(null);

  const renderForm = () => {
    switch (activeForm) {
      case "aluno":
        return (
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Aluno</h2>
              <input className={styles.input} type="text" placeholder="Insira o RA" />
              <input className={styles.input} type="text" placeholder="Insira o nome do aluno" />
              <button className={styles.botao}>Salvar</button>
            </div>
          </div>
        );
      case "materia":
        return (
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Matéria</h2>
              <input className={styles.input} type="text" placeholder="Insira o nome da matéria" />
              <button className={styles.botao}>Salvar</button>
            </div>
          </div>
        );
      case "professor":
        return (
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Professor</h2>
              <input className={styles.input} type="text" placeholder="Insira o nome do professor" />
              <button className={styles.botao}>Salvar</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  

  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.cadastroContainer}>
          <h2>Deseja Cadastrar?</h2>
          <div className={styles.iconContainer}>

            <div className={styles.back}>
              <div
                className={`${styles.iconItem} ${
                  activeForm === "aluno" ? styles.selectedItem : ""
                }`}
                onClick={() => setActiveForm("aluno")}
              >
                <FontAwesomeIcon icon={faUser} size="2x" color="white" />
                <p style={{ color: "white" }}>Aluno</p>
              </div>
            </div>

            <div className={styles.back}>
              <div
                className={`${styles.iconItem} ${
                  activeForm === "materia" ? styles.selectedItem : ""
                }`}
                onClick={() => setActiveForm("materia")}
              >
                <FontAwesomeIcon icon={faBook} size="2x" color="white" />
                <p style={{ color: "white" }}>Matéria</p>
              </div>
            </div>

            <div className={styles.back}>
              <div
                className={`${styles.iconItem} ${
                  activeForm === "professor" ? styles.selectedItem : ""
                }`}
                onClick={() => setActiveForm("professor")}
              >
                <FontAwesomeIcon
                  icon={faChalkboardTeacher}
                  size="2x"
                  color="white"
                />
                <p style={{ color: "white" }}>Professor</p>
              </div>
            </div>
          </div>
        </div>
      </Fundo>

      <Fundo>{renderForm()}</Fundo>
    </>
  );
}
