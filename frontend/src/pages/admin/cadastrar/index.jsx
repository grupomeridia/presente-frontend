import React, { useState, useEffect } from "react";
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

import api from "@/client/api";

export default function Cadastrar() {
  const [activeForm, setActiveForm] = useState(null);
  const [cargo, setCargo] = useState("");
  const [SelectedCargo, setSelectedCargo] = useState(null);
  const [nome, setNome] = useState(null);
  const [login, setLogin] = useState(null);
  const [senha, setSenha] = useState(null);
  const [ra, setRa] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [nomeMateria, setNomeMateria] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState("");
  const [IdProfessor, setIdProfessor] = useState();
  const [IdAluno, setIdAluno] = useState();

  const CriarMateria = () => {
    const payload = {
      nome: nomeMateria,
    };

    console.log("Payload:", payload);

    api.materia
      .create(payload)
      .then((response) => {
        alert("Materia criado com sucesso!");
      })
      .catch((error) => {
        alert(error.response.data);
      });
  };

  const CriarUsuario = () => {
    const payload = {
      nome: nome,
      login: login,
      senha: senha,
      cargo: cargo,
      ra: cargo === "Aluno" ? ra : null,
    };

    if ((cargo === "Professor" || cargo === "Aluno") && (!selectedTurma || selectedTurma === "")) {
      alert("Por favor, selecione uma turma antes de continuar.");
      return; 
  }

    console.log("Payload CriarUsuario:", payload);

    api.usuario
      .create(payload)
      .then((response) => {
        console.log("AQUIIIIIIIIIII",response.data);
        alert("Usuário criado com sucesso!");

        let userId;

        if (cargo == 'Professor'){
         userId = response.data.id_professor;
        }
        if(cargo == 'Aluno'){
          userId = response.data.id_aluno;
        }
        
        else if (cargo === "Professor") {
          setIdProfessor(userId);
          CadastrarProfessorouAlunoNaTurma(userId);
        } else if (cargo === "Aluno") {
          setIdAluno(userId);
          CadastrarProfessorouAlunoNaTurma(userId);
        }
        // return "Erro";
        
      })
      .catch((error) => {
        alert(error.response.data);
        if (error.response && error.response.data) {
          console.error(error.response.data);
        } else {
          console.error(error);
        }
      });
  };

  useEffect(() => {
    api.turma
      .listAll()
      .then((response) => {
        console.log(response.data);
        if(response.data.cargo == "Aluno"){

        }
        setTurmas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar as chamadas abertas:", error);
      });
  }, []);

  const CadastrarProfessorouAlunoNaTurma = (userId) => {
    if (cargo === "Professor") {
      const payload = {
        id_turma: parseInt(selectedTurma, 10),
        id_professor: userId,
      };

      console.log(
        "Enviando payload CadastrarProfessorouAlunoNaTurma:",
        payload
      );

      api.turma
        .professorNaTurma(payload)
        .then((response) => {
          console.log(response.data);
          
        })
        .catch((error) => {
          console.error(error.response.data);
        });
    }

    if (cargo === "Aluno") {
      const payload = {
        id_turma: parseInt(selectedTurma, 10),
        id_aluno: userId,
      };

      console.log("Enviando payload:", payload);

      api.turma
        .alunoNaTurma(payload)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Erro ao Cadastra aluno na turma:", error);
        });
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case "usuario":
        return (
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Aluno</h2>

              <select
                className={styles.input}
                type="text"
                placeholder="Insira o cargo"
                value={cargo}
                onChange={(e) => {
                  setCargo(e.target.value);
                  setSelectedCargo(e.target.value);
                }}
              >
                <option value="" disabled selected>
                  Selecione um cargo
                </option>
                <option value="Professor">Professor</option>
                <option value="Aluno">Aluno</option>
                <option value="Secretaria">Secretaria</option>
              </select>

              {cargo !== "Professor" && cargo !== "Secretaria" && (
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Insira o RA"
                  value={ra}
                  onChange={(e) => setRa(e.target.value)}
                />
              )}

              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={styles.input}
                type="text"
                placeholder="Insira o nome do usuario"
              />

              {cargo === "Professor" || cargo === "Aluno" ? (
                <select
                  className={styles.input}
                  id="turma"
                  value={selectedTurma}
                  onChange={(e) => setSelectedTurma(e.target.value)}
                >
                  <option value="">Turma</option>
                  {turmas.map((turma) => (
                    <option key={turma.id_turma} value={turma.Id}>
                      {turma.Nome}
                    </option>
                  ))}
                </select>
              ) : null}

              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className={styles.input}
                type="text"
                placeholder="Informe o login"
              />
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={styles.input}
                type="text"
                placeholder="Informe a senha"
              />
              <button onClick={CriarUsuario} className={styles.botao}  disabled={!selectedTurma || selectedTurma === ""}>
                Salvar
              </button>
            </div>
          </div>
        );
      case "materia":
        return (
          <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Matéria</h2>
              <input
                className={styles.input}
                value={nomeMateria}
                onChange={(e) => setNomeMateria(e.target.value)}
                type="text"
                placeholder="Insira o nome da matéria"
              />
              <button onClick={CriarMateria} className={styles.botao}>
                Salvar
              </button>
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
                  activeForm === "usuario" ? styles.selectedItem : ""
                }`}
                onClick={() => setActiveForm("usuario")}
              >
                <FontAwesomeIcon icon={faUser} size="2x" color="white" />
                <p style={{ color: "white" }}>Usuario</p>
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
          </div>
        </div>
      </Fundo>

      <Fundo>{renderForm()}</Fundo>
    </>
  );
}
