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
  faPeopleGroup
} from "@fortawesome/free-solid-svg-icons";

import withAuth from '@/utils/auth';
import api from "@/client/api";

const Cadastrar = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [cargo, setCargo] = useState("");
  const [SelectedCargo, setSelectedCargo] = useState(null);
  const [nome, setNome] = useState(null);
  const [login, setLogin] = useState(null);
  const [senha, setSenha] = useState(null);
  const [ra, setRa] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [selectedMateria, setselectedMateria] = useState(null);
  const [nomeMateria, setNomeMateria] = useState(null);
  const [nomeTurma, setNomeTurma] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [ano,setAno] = useState(null);
  const [curso,setCurso] = useState(null);
  const [modalidade,setModalidade] = useState(null);
  const [selectCurso,setSelectedCurso] = useState(null);
  const [turno,setTurno] = useState(null);
  const [selectTurno,setSelectedTurno] = useState(null);
  const [semestre,setSemestre] = useState(null);
  const [turmaId, setTurmaId] = useState("");
  const [IdProfessor, setIdProfessor] = useState();
  const [IdAluno, setIdAluno] = useState();
  const [previousCargo, setPreviousCargo] = useState(null);


  const resetFormStates = () => {
    setCargo("");
    setSelectedCargo(null);
    setNome(null);
    setLogin(null);
    setSenha(null);
    setRa(null);
    setSelectedTurma(null);
    setselectedMateria(null);
    setNomeMateria(null);
    setNomeTurma(null);
    setAno(null);
    setCurso(null);
    setModalidade(null);
    setSelectedCurso(null);
    setTurno(null);
    setSelectedTurno(null);
    setSemestre(null);
    setTurmaId("");
    setIdProfessor(null);
    setIdAluno(null);
  };

  useEffect(() => {
    resetFormStates();
  }, [activeForm]);


  useEffect(() => {
    if (previousCargo === 'Aluno' && (cargo === 'Professor' || cargo === 'Secretaria')) {
      setSenha("");
      setLogin("");
      setNome("");
      setRa("");
      setSelectedTurma("");
    }
    if (previousCargo === 'Professor' && (cargo === 'Aluno' || cargo === 'Secretaria')) {
      setSenha("");
      setLogin("");
      setNome("");
      setSelectedTurma("");
    }
    if (previousCargo === 'Secretaria' && (cargo === 'Aluno' || cargo === 'Professor')) {
      setSenha("");
      setLogin("");
      setNome("");
    }

    setPreviousCargo(cargo);
  }, [cargo]);
  
/// listAlls

const fetchTurmas = () => {
  api.turma
    .listAll()
    .then((response) => {
      console.log(response.data);
      setTurmas(response.data);
    })
    .catch((error) => {
      console.error("Erro ao buscar as chamadas abertas:", error);
    });
};

useEffect(() => {
  fetchTurmas();
}, []);

const fetchMaterias = () => {
  api.materia
    .listAll()
    .then((response) => {
      console.log(response.data);
      setMaterias(response.data);
    })
    .catch((error) => {
      console.error("Erro ao buscar as matérias:", error);
    });
};

useEffect(() => {
  fetchMaterias();
}, []);


  /////

  //Creates

  const CriarTurma = () => {
    const payload = {
      ano: parseInt(ano,10),
      semestre: semestre,
      curso: curso,
      modalidade: modalidade,
      nome: nomeTurma,
      turno:turno,
      id_materia: selectedMateria,
    };
  
    console.log("Payload:", payload);
  
    api.turma
      .create(payload)
      .then((response) => {
        alert("Turma criada com sucesso!");
        fetchTurmas();
        setNomeTurma("");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(error.response.data);
          console.error(error.response.data);
        } else {
          alert("Ocorreu um erro ao criar turma.");
          console.error(error);
        }
      });
  };


  const CriarMateria = () => {
    const payload = {
      nome: nomeMateria,
    };
  
    console.log("Payload:", payload);
  
    api.materia
      .create(payload)
      .then((response) => {
        alert("Matéria criada com sucesso!");
        // setMaterias([...materias, response.data]);
        fetchMaterias();
        setNomeMateria("");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(error.response.data);
          console.error(error.response.data);
        } else {
          alert("Ocorreu um erro ao criar a matéria.");
          console.error(error);
        }
      });
  };

  const CriarUsuario = () => {
    const payload = {
      nome: nome,
      login: login,
      senha: senha,
      cargo: cargo,
      ra: cargo === "Aluno" ? parseInt(ra, 10) : null,
    };

    if ((cargo === "Professor" || cargo === "Aluno" || cargo === "Secretaria") && (!selectedTurma || selectedTurma === "")) {
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
         setIdProfessor(userId);
         CadastrarProfessorouAlunoNaTurma(userId);
        }
        else if(cargo == 'Aluno'){
          userId = response.data.id_aluno;
          setIdAluno(userId);
          CadastrarProfessorouAlunoNaTurma(userId);
        }
        else{
          console.log("Erro aqui na api.usuario");
        }
        
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

  const CadastrarProfessorouAlunoNaTurma = (userId) => {
    if (cargo === "Professor") {
      const payload = {
        id_turma: parseInt(selectedTurma, 10),
        id_professor: userId,
      };

      console.log(
        "Enviando payload Cadastramento de Professor na turma:",
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

      console.log("Enviando payload Cadastramento de Aluno na turma:", payload);

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
  ///////////////////////
  // Mudança do Forms pra cadastro
  
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
                  <option value="">Selecione uma turma para o {cargo} </option>
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
              <button onClick={CriarUsuario} className={styles.botao} disabled={cargo !== "Secretaria" && (!selectedTurma || selectedTurma === "")}>
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
        case "turma":
          return (
            <div className={styles.form_center}>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Turma</h2>
              <label>Insira o nome da turma:</label>
              <input
                className={styles.input}
                value={nomeTurma}
                onChange={(e) => setNomeTurma(e.target.value)}
                type="text"
              />
              <label>Insira o semestre:</label>
              <input
                className={styles.input}
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
                type="text"
              />
              <label>Insira o ano:</label>
              <input
                className={styles.input}
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                type="text"
              />

                <select
                  className={styles.input}
                  id="materia"
                  value={selectedMateria}
                  onChange={(e) => setselectedMateria(e.target.value)}
                >
                  <option value="">Selecione uma materia</option>
                  {materias.map((materia) => (
                    <option key={materia.id_materia} value={materia.Id}>
                      {materia.Nome}
                    </option>
                  ))}
                </select>

                <select
                className={styles.input}
                type="text"
                value={curso}
                onChange={(e) => {
                  setCurso(e.target.value);
                  setSelectedCurso(e.target.value);
                }}
              >
                <option value="" disabled selected>
                  Selecione um curso
                </option>
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Análise e Desenvolvimento de Sistemas">Análise e desenvolvimento de sistemas</option>
              </select>

              <select
                className={styles.input}
                type="text"
                value={turno}
                onChange={(e) => {
                  setTurno(e.target.value);
                }}
              >
                <option value="" disabled selected>
                  Selecione o Turno
                </option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </select>

              <select
                className={styles.input}
                type="text"
                value={modalidade}
                onChange={(e) => {
                  setModalidade(e.target.value);
                }}
              >
                <option value="" disabled selected>
                  Selecione a Modalidade
                </option>
                <option value="Online">Online</option>
                <option value="Presencial">Presencial</option>
              </select>

              <button onClick={CriarTurma} className={styles.botao}>
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

            <div className={styles.back}>
              <div
                className={`${styles.iconItem} ${
                  activeForm === "turma" ? styles.selectedItem : ""
                }`}
                onClick={() => setActiveForm("turma")}
              >
                <FontAwesomeIcon icon={faPeopleGroup} size="2x" color="white" />
                <p style={{ color: "white" }}>Turma</p>
              </div>
            </div>
          </div>
        </div>
      </Fundo>

      <Fundo>{renderForm()}</Fundo>
    </>
  );
}

export default Cadastrar;