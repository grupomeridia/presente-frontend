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
  const [serverResponse, setServerResponse] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [ultimaChamada, setUltimaChamada] = useState(null);
  const [IdProfessorAntigaChamada,setIdProfessorAntigaChamada] = useState();

  const resetFormStates = () => {
    setCargo("");
    setSelectedCargo("");
    setNome("");
    setLogin("");
    setSenha("");
    setRa("");
    setSelectedTurma("");
    setselectedMateria("");
    setNomeMateria("");
    setNomeTurma("");
    setAno("");
    setCurso("");
    setModalidade("");
    setSelectedCurso("");
    setTurno("");
    setSelectedTurno("");
    setSemestre("");
    setTurmaId("");
    setIdProfessor("");
    setIdAluno("");
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
      setServerResponse(response.data);
      setButtonClicked(true);
      console.log(response.data);
      setTurmas(response.data);
    })
    .catch((error) => {
      setServerResponse(error.response.data);
      setButtonClicked(true);
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
      setServerResponse(response.data);
      setButtonClicked(true);
      console.log(response.data);
      setMaterias(response.data);
    })
    .catch((error) => {
      setServerResponse(error.response.data);
      setButtonClicked(true);
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
        // alert("Turma criada com sucesso!");
        console.log(response.data);
        setServerResponse("Turma cadastrada com sucesso");
        setButtonClicked(true);

        setTimeout(function() {
        fetchTurmas();
        }, 2000);

        setNomeTurma("");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setServerResponse(error.response.data);
          setButtonClicked(true);
          // alert(error.response.data);
          console.error(error.response.data);
        } else {
          // alert("Ocorreu um erro ao criar turma.");
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
        // alert("Matéria criada com sucesso!");
        
        // setMaterias([...materias, response.data]);
        
        setTimeout(function() {
          fetchMaterias();
        }, 2000); 

        setNomeMateria("");
        setServerResponse("Materia Cadastrada");
        setButtonClicked(true);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setServerResponse(error.response.data);
          setButtonClicked(true);
          // alert(error.response.data);
          console.error(error.response.data);
        } else {
          // alert("Ocorreu um erro ao criar a matéria.");
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

    if ((cargo === "Professor" || cargo === "Aluno") && (!selectedTurma || selectedTurma === "")) {
        setServerResponse("Por favor, selecione uma turma antes de continuar.");
        setButtonClicked(true);
      // alert("Por favor, selecione uma turma antes de continuar.");
      return; 
  }

    console.log("Payload CriarUsuario:", payload);

    api.usuario
      .create(payload)
      .then((response) => {
        console.log("AQUIIIIIIIIIII",response.data);
        // alert("Usuário criado com sucesso!");
        setServerResponse(response.data);
        setButtonClicked(true);
        resetFormStates();

        let userId;

        if (cargo == 'Professor'){


         setIdProfessorAntigaChamada(response.data.id_professor);


         userId = response.data.id_professor;
         setIdProfessor(userId);
         CadastrarProfessorouAlunoNaTurma(userId);
         setServerResponse(response.data);
          setButtonClicked(true);
         resetFormStates();
         console.log(response.data);
        }
        else if(cargo == 'Aluno'){
          userId = response.data.id_aluno;
          setIdAluno(userId);
          CadastrarProfessorouAlunoNaTurma(userId);
          setServerResponse(response.data);
          setButtonClicked(true);
          resetFormStates();
        }
        else if(cargo == 'Secretaria'){
          setServerResponse("Secretaria cadastrada");
          setButtonClicked(true);
          resetFormStates();
          console.log("Erro aqui na api.usuario");
          console.log(response.data);
        }
        
      })
      .catch((error) => {
        // alert(error.response.data);
        if (error.response && error.response.data) {
          setServerResponse(error.response.data);
          setButtonClicked(true);
          resetFormStates();
          console.error(error.response.data);
        } else {
          resetFormStates();
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
          setServerResponse(response.data);
          setButtonClicked(true);
          resetFormStates();
        })
        .catch((error) => {
          console.error(error.response.data);
          setServerResponse(error.response.data);
          setButtonClicked(true);
          resetFormStates();
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
          setServerResponse(response.data);
          setButtonClicked(true);
          resetFormStates();
        })
        .catch((error) => {
          console.error("Erro ao Cadastra aluno na turma:", error);
          setServerResponse(error.response.data);
          setButtonClicked(true);
          resetFormStates();
        });
    }
  };
  ///////////////////////
  // Mudança do Forms pra cadastro

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
  
      if (responseMessage === "Aluno cadastrado na turma"  || responseMessage === "Professor cadastrado na turma" || responseMessage === "Secretaria cadastrada" || responseMessage === "Materia Cadastrada" || responseMessage === "Turma cadastrada com sucesso") {
        return (
          <div>
            {successIcon} {responseMessage}
          </div>
        );
      } else if(responseMessage != "") {
        return (
          <div>
            {errorIcon} {responseMessage}
          </div>
        );
      }
    }
  };

  
  const renderForm = () => {
    
    switch (activeForm) {
      case "usuario":
        return (
          <div className={styles.form_center}>
            <div className={styles.serverResponse}>{renderResponse()}</div>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Usuário</h2>
  
              <label htmlFor="cargo" className={styles.label}>Cargo:</label>
              <select
                className={styles.input}
                id="cargo"
                value={cargo}
                onChange={(e) => {
                  setCargo(e.target.value);
                  setSelectedCargo(e.target.value);
                }}
              >
                <option value="" disabled selected>Selecione um cargo</option>
                <option value="Professor">Professor</option>
                <option value="Aluno">Aluno</option>
                <option value="Secretaria">Secretaria</option>
              </select>
  
              {cargo !== "Professor" && cargo !== "Secretaria" && (
                <>
                  <label htmlFor="ra" className={styles.label}>RA:</label>
                  <input
                    id="ra"
                    className={styles.input}
                    type="text"
                    placeholder="Insira o RA"
                    value={ra}
                    onChange={(e) => setRa(e.target.value)}
                  />
                </>
              )}
  
              <label htmlFor="nome" className={styles.label}>Nome:</label>
              <input
                id="nome"
                className={styles.input}
                type="text"
                placeholder="Insira o nome do usuário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
  
              {cargo === "Professor" || cargo === "Aluno" ? (
                <>
                  <label htmlFor="turma" className={styles.label}>Turma:</label>
                  <select
                    className={styles.input}
                    id="turma"
                    value={selectedTurma}
                    onChange={(e) => setSelectedTurma(e.target.value)}
                  >
                    <option value="">Selecione uma turma</option>
                    {turmas.map((turma) => (
                      <option key={turma.id_turma} value={turma.Id}>
                        {turma.Nome}
                      </option>
                    ))}
                  </select>
                </>
              ) : null}
  
              <label htmlFor="login" className={styles.label}>Login:</label>
              <input
                id="login"
                className={styles.input}
                type="text"
                placeholder="Informe o login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
  
              <label htmlFor="senha" className={styles.label}>Senha:</label>
              <input
                id="senha"
                className={styles.input}
                type="password" // Mudar para 'password' para esconder a senha
                placeholder="Informe a senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
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
            <div className={styles.serverResponse}>{renderResponse()}</div>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Matéria</h2>
  
              <label htmlFor="nomeMateria" className={styles.label}>Nome da Matéria:</label>
              <input
                id="nomeMateria"
                className={styles.input}
                type="text"
                placeholder="Insira o nome da matéria"
                value={nomeMateria}
                onChange={(e) => setNomeMateria(e.target.value)}
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
            <div className={styles.serverResponse}>{renderResponse()}</div>
            <div className={styles.form}>
              <h2 className={styles.titulo}>Cadastro de Turma</h2>
  
              <label htmlFor="nomeTurma" className={styles.label}>Nome da Turma:</label>
              <input
                id="nomeTurma"
                className={styles.input}
                type="text"
                value={nomeTurma}
                onChange={(e) => setNomeTurma(e.target.value)}
              />
  
              <label htmlFor="semestre" className={styles.label}>Semestre:</label>
              <input
                id="semestre"
                className={styles.input}
                type="text"
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
              />
  
              <label htmlFor="ano" className={styles.label}>Ano:</label>
              <input
                id="ano"
                className={styles.input}
                type="text"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
  
              <label htmlFor="materia" className={styles.label}>Matéria:</label>
              <select
                id="materia"
                className={styles.input}
                value={selectedMateria}
                onChange={(e) => setselectedMateria(e.target.value)}
              >
                <option value="">Selecione uma matéria</option>
                {materias.map((materia) => (
                  <option key={materia.id_materia} value={materia.Id}>
                    {materia.Nome}
                  </option>
                ))}
              </select>
  
              <label htmlFor="curso" className={styles.label}>Curso:</label>
              <select
                id="curso"
                className={styles.input}
                value={curso}
                onChange={(e) => {
                  setCurso(e.target.value);
                  setSelectedCurso(e.target.value);
                }}
              >
                <option value="" disabled selected>Selecione um curso</option>
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Análise e Desenvolvimento de Sistemas">Análise e Desenvolvimento de Sistemas</option>
              </select>
  
              <label htmlFor="turno" className={styles.label}>Turno:</label>
              <select
                id="turno"
                className={styles.input}
                value={turno}
                onChange={(e) => {
                  setTurno(e.target.value);
                }}
              >
                <option value="" disabled selected>Selecione o Turno</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </select>
  
              <label htmlFor="modalidade" className={styles.label}>Modalidade:</label>
              <select
                id="modalidade"
                className={styles.input}
                value={modalidade}
                onChange={(e) => {
                  setModalidade(e.target.value);
                }}
              >
                <option value="" disabled selected>Selecione a Modalidade</option>
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