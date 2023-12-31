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
  const jwt = user ? user.JWT : null;
  const [id, setId] = useState();
  const [turmas, setTurmas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [dataEncerramento, setDataEncerramento] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  // const [chamadasAbertas, setChamadasAbertas] = useState([]);
  const [dataAbertura, setDataAbertura] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [chamadaStatus, setChamadaStatus] = useState();
  const [professores, setProfessores] = useState([]);
  const [chamadas, setChamadas] = useState([]);
  const [professorSelecionado, setProfessorSelecionado] = useState(null);

  useEffect(() => {
    if (user) {
      console.log("User:", user);
      const jwt = user.JWT;
      setId(user.id_secretaria);
    }
  }, [user]);

  const handleTurmaSelect = (event) => {
    setSelectedTurma(event.target.value);
  };

  const validarDatas = () => {
    // if (!dataAbertura || !dataEncerramento) {
    //   alert("Por favor, defina as datas de abertura e encerramento.");
    //   return false;
    // }

    const inicio = new Date(dataAbertura);
    const fim = new Date(dataEncerramento);

    if (inicio >= fim) {
      alert("A data de abertura deve ser anterior à data de encerramento.");
      return false;
    }

    return true;
  };

  useEffect(() => {
    api.professor
      .listAll(jwt)
      .then((response) => {
        setProfessores(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar professores:", error);
      });
  }, []);

  useEffect(() => {
    if (professorSelecionado && professorSelecionado.id != null) {
      api.professor
        .turmas(professorSelecionado.id, jwt)
        .then((response) => {
          setTurmas(response.data);
          console.log(response.data);
          const projetosData = response.data.map((turma) => ({
            id_projeto: turma.id_materia,
            nome_projeto: turma.nome_materia,
            id_turma: turma.id_turma,
          }));
          setProjetos(projetosData);
        })
        .catch((error) => {
          console.error("Erro ao buscar as turmas:", error);
        });
    }else{
      buscarTurmas();
    }
  }, [professorSelecionado, jwt]);

  // useEffect(() => {
  //   listarProfessores();
  // }, [professorSelecionado,jwt]);

  const agendarChamada = () => {
    if (!validarDatas()) return;

    const agora = new Date();
    const inicio = new Date(dataAbertura);
    const fim = new Date(dataEncerramento);

    const tempoParaAbrir = inicio.getTime() - agora.getTime();
    const tempoParaFechar = fim.getTime() - agora.getTime();

    if (tempoParaAbrir > 0) {
      setTimeout(() => abrirChamada(), tempoParaAbrir);
    } else {
      abrirChamada();
    }

    if (tempoParaFechar > 0) {
      setTimeout(() => fecharChamada(), tempoParaFechar);
    }
  };

  // const CriarChamada = () => {
  //   if (!professorSelecionado) {
  //     console.error("Professor não selecionado.");
  //     return;
  //   }

  //   const payload = {
  //     id_turma: parseInt(selectedTurma),
  //     id_professor: professorSelecionado?.id,
  //     encerramento: dataEncerramento || null,
  //     abertura: dataAbertura || null,
  //     status: true
  //   };

  //   api.chamada
  //     .create(payload,jwt)
  //     .then((response) => {
  //       console.log("Resposta da chamada:", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Erro ao abrir a chamada:", error);
  //     });
  // };

  const buscarTurmas = () => {
    if (professorSelecionado && professorSelecionado.id) {
    api.professor
      .turmas(professorSelecionado.id, jwt)
      .then((response) => {
        setTurmas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar turmas:", error);
      });
    }
  };

  useEffect(() => {
    buscarTurmas();
  }, [professorSelecionado, jwt]);

  const handleProfessorSelect = (event) => {
    const professorId = event.target.value;
    if (professorId) {
      const selecionado = professores.find(
        (p) => p.id === parseInt(professorId)
      );
      setProfessorSelecionado(selecionado);
    } else {
      setProfessorSelecionado(null);
      buscarTurmas();
    }
  };

  // const handleProfessorSelectChange = async (event) => {
  //   const selectedId = Number(event.target.value);
  //   const selectProfessor = professor.find((p) => p.id === selectedId);
  //   if (selectProfessor) {
  //     setProfessorSelecionado(selectProfessor);
  //     try {
  //       const response = await api.professor.turmas(selectedId);
  //       setTurmas(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Erro ao buscar as turmas:", error);
  //     }
  //   }
  // };

  const listarTodasChamadas = (IdProfessor, jwt) => {
    api.chamada
      .listAll(jwt)
      .then((response) => {
        setChamadas(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar chamadas:", error);
      });
  };

  useEffect(() => {
    listarTodasChamadas(IdProfessor, jwt);
  }, []);

  const ListarTurmas = () => {
    const fetchData = async () => {
      try {
        const turmaResponse = await api.professor.turmas(IdProfessor, jwt);
        setTurmas(turmaResponse.data);

        const projetosData = turmaResponse.data.map((turma) => ({
          id_projeto: turma.id_materia,
          nome_projeto: turma.nome_materia,
        }));
        setProjetos(projetosData);

        const chamadasResponse = await api.chamada.listAll(jwt);
        setChamadas(chamadasResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (IdProfessor) {
      fetchData();
    }
  };

  useEffect(() => {
    ListarTurmas();
  }, [IdProfessor]);

  const listarTurmasProfessor = (IdProfessor, jwt) => {
    if (professorSelecionado) {
      api.professor
        .turmas(IdProfessor, jwt)
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
    }
  };

  useEffect(() => {
    listarTurmasProfessor(IdProfessor, jwt);
  }, []);

  // useEffect(() => {
  //   api.professor
  //     .chamadasAbertas(IdProfessor,jwt)
  //     .then((response) => {
  //       console.log(response.data);
  //       setChamadasAbertas(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Erro ao buscar as chamadas abertas:", error);
  //     });
  // }, []);

  //Abrir chamada

  const formatData = (dataString) => {
    if (!dataString) return "";
    const [date, time] = dataString.split("T");
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy} ${time}`;
  };

  const abrirChamada = () => {
    if (!professorSelecionado) {
      setServerResponse("Por favor, selecione um professor.");
      setButtonClicked(true);
      return;
    }
    const payload = {
      id_turma: selectedTurma,
      id_professor: professorSelecionado?.id,
      // id_materia: selectedProjeto,
      encerramento: formatData(dataEncerramento) || null,
      abertura: formatData(dataAbertura) || null,
      status: true,
    };

    console.log("Enviando payload:", payload);

    api.chamada
      .create(payload, jwt)
      .then((response) => {
        console.log("Resposta da chamada:", response.data);
        setServerResponse(response.data);
        setButtonClicked(true);
        return api.chamada.listAll(jwt);
      })
      .then((response) => {
        setChamadas(response.data);
        console.log(response.data);
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
      .fecharChamada(idChamada, jwt, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        console.log("Chamada encerrada com sucesso:", response.data);
        setServerResponse(response.data);
        return api.chamada.listAll(jwt);
      })
      .then((response) => {
        setChamadas(response.data);
      })
      .catch((error) => {
        console.error("Erro:", error);
        if (error.response) {
          setServerResponse(error.response.data);
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

      if (typeof serverResponse === "object" && serverResponse.mensagem) {
        responseMessage = serverResponse.mensagem;
      } else if (typeof serverResponse === "string") {
        responseMessage = serverResponse;
      }

      if (
        responseMessage === "Chamada registrada" ||
        responseMessage === "Chamada fechada com sucesso"
      ) {
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
      <Cabecalho />
      <Navbar />
      <Fundo>
      <div className={styles.fundoContainer}>
      <div className={styles.serverResponse}>{renderResponse()}</div>
        <section className={styles.contentChamada}>
          <div>
            <h1>ABRIR CHAMADA</h1>
          </div>
          <div className={styles.inputArea}>
            <div className={styles.selectCursos}>
              <select onChange={handleProfessorSelect}>
                <option value="">Selecione um professor</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.Nome}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.selectCursos}>
              <select onChange={handleTurmaSelect}>
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id_turma}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="juntar">
              <label className={styles.label}>Insira a data de abertura:</label>
              <input
                className={styles.input}
                type="datetime-local"
                value={dataAbertura}
                onChange={(e) => setDataAbertura(e.target.value)}
              />
            </div>
            <div className="juntar">
              <label className={styles.label}>
                Insira a data de fechamento:
              </label>
              <input
                className={styles.input}
                type="datetime-local"
                value={dataEncerramento}
                onChange={(e) => setDataEncerramento(e.target.value)}
              />
            </div>
            <div className={styles.divButton}>
              <button onClick={abrirChamada}>Finalizar</button>
            </div>
          </div>
        </section>
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
              {chamadas.map((chamada) => (
                <tr key={chamada.id}>
                  <td>{chamada.nome_turma}</td>
                  <td>{chamada.nome_materia}</td>
                  <td>{chamada.nome_professor}</td>
                  <td>{chamada.abertura}</td>
                  <td>
                    {chamada.encerramento !== null
                      ? formatData(chamada.encerramento, true)
                      : "não definido"}
                  </td>
                  <td>
                    <button onClick={() => fecharChamada(chamada.id_chamada, jwt)}>
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
};

export default withAuth(Chamada, ["Secretaria"]);
