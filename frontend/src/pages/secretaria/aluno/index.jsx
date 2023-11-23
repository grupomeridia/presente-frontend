import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faFile, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { Fundo } from "@/components/Fundo/fundo";
import api from "@/client/api";
import { useUser } from "@/contexts/UserContext";
import withAuth from "@/utils/auth";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";

function Modal({
  isOpen,
  onClose,
  alunoId,
  title,
  setTitle,
  content,
  setContent,
  cargo,
  onSend,
}) {
  const handleSend = () => {
    onSend(alunoId, title, content, cargo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <input
            type="text"
            className={styles.modalTitleInput}
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={onClose} className={styles.modalCloseButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <textarea
            className={styles.modalTextArea}
            placeholder="Lembrete"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalSubmitButton} onClick={handleSend}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

const Aluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);
  const [selectedCargo, setSelectedCargo] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useUser();
  const IdSecretaria = user && user.id_secretaria;
  const [id, setId] = useState();
  const [chartData, setChartData] = useState(null);
  const [studentStats, setStudentStats] = useState(null);

  useEffect(() => {
    if (user) {
      console.log("User:", user);
      setId(user.id_secretaria);
    }
  }, [user]);

  const prepareChartData = (response) => {
    // Inicialize as variáveis que você espera dos dados
    let presenca = 0;
    let ausencia = 0;

    // Verifique se a resposta é um objeto e possui as propriedades esperadas
    if (response && typeof response === "object" && "frequencia" in response) {
      presenca = response.frequencia;
      ausencia = 100 - presenca; // Assumindo que a frequência é a porcentagem de presença
    } else {
      // Se não for o formato esperado, você pode definir um valor padrão ou lançar um erro
      console.error("Formato de resposta inesperado:", response);
    }

    // Agora, configure os dados do gráfico com os valores que você tem
    return {
      labels: ["Presença", "Ausência"],
      datasets: [
        {
          label: "Presença / Ausência",
          data: [presenca, ausencia],
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          hoverBackgroundColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
          ],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true, 
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
      datalabels: {
        display: true,
        color: "white",
      },
    },
    layout: {
      padding: {
        // right: 20,
      },
    },
  };

  const handleShowStats = async (idAluno) => {
    try {
      const response = await api.aluno.statusAluno(idAluno);
      if (response.status === 200) {
        setStudentStats({
          ...response.data,
          presencas: 100 - response.data.faltas,
        });
      }
      // Log o estado após a atualização para depuração
      console.log("Dados de estatísticas recebidos:", response.data);
      console.log("Dados de estatísticas recebidos:", data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (alunoId, cargo) => {
    setSelectedAlunoId(alunoId);
    setSelectedCargo(cargo);
    setIsModalOpen(true);
  };

  const handleSend = async (
    destinatario_id,
    titulo,
    mensagem,
    destinatario_cargo
  ) => {
    const lembreteData = {
      destinatario_id,
      titulo,
      mensagem,
      destinatario_cargo,
      id_secretaria: IdSecretaria,
    };

    try {
      await api.admin.lembrete(lembreteData);
      console.log("Dados enviados com sucesso");
    } catch (error) {
      console.error("Erro ao enviar os dados do lembrete:", error);
    }

    closeModal();
    setTitle("");
    setContent("");
  };

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await api.aluno.listAll();
        if (Array.isArray(response)) {
          // Check if the response is an array
          setAlunos(response);
        } else if (Array.isArray(response.data)) {
          // Or if response.data is an array
          setAlunos(response.data);
        } else {
          // Handle any other cases or throw an error
          console.error("Response is not in expected format:", response);
        }
      } catch (error) {
        console.error("Fetching alunos failed: ", error);
      }
    };

    fetchAlunos();
  }, []);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Navbar />
      <Cabecalho />
      <section className={styles.page_content}>
        <section className={styles.inner_content}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "ausentes" ? styles.active : ""
              }`}
              onClick={() => handleFilterClick("ausentes")}
            >
              Ausentes
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "presentes" ? styles.active : ""
              }`}
              onClick={() => handleFilterClick("presentes")}
            >
              Presentes
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "achegar" ? styles.active : ""
              }`}
              onClick={() => handleFilterClick("achegar")}
            >
              A chegar
            </button>
          </div>
          <div className={styles.search_input}>
            <div>
              <input
                type="text"
                placeholder="Pesquisar..."
                // value={searchTerm}
                // onChange={handleSearch}
              ></input>
            </div>
          </div>
          <div className={styles.div_table}>
            <table className={styles.tabela}>
              <thead className={styles.tableHeader}>
                <tr className={styles.row}>
                  <th className={styles.headerCell}>Nome</th>
                  <th className={styles.headerCell}>RA</th>
                  <th className={styles.headerCell}>PROJETO</th>
                  <th className={styles.headerCell}>SEMESTRE</th>
                  <th className={styles.headerCell}>
                    <FontAwesomeIcon icon={faBell} />
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    {" "}
                    <td>{aluno.nome}</td>
                    <td>{aluno.ra}</td>
                    <td>{aluno.nome_materia}</td>
                    <td>{aluno.semestre}</td>
                    <td className={styles.iconCell}>
                      <FontAwesomeIcon
                        icon={faFile}
                        className={styles.faIcon}
                        onClick={() => openModal(aluno.id_aluno, aluno.cargo)}
                      />
                      <FontAwesomeIcon
                        icon={faChartPie}
                        className={styles.faIcon}
                        onClick={() => handleShowStats(aluno.id_aluno)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            alunoId={selectedAlunoId}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            cargo={selectedCargo}
            onSend={handleSend}
          />
        </section>
      </section>

      <Fundo>
        {studentStats && (
          <div className={styles.fundoContainer}>
            <div className={styles.cardContainer}>
              <div className={styles.chartSection}>
                <GraficoCircular
                  className={styles.chartContainer}
                  key={`chart-${studentStats.id_aluno}`}
                  data={{
                    labels: ["Presenças", "Faltas"],
                    datasets: [
                      {
                        data: [studentStats.presencas, studentStats.faltas],
                        backgroundColor: [
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 99, 132, 0.2)",
                        ],
                      },
                    ],
                  }}
                  options={chartOptions}
                />
                <p>{studentStats.faltas} Faltas</p>
              </div>
              <div className={styles.infoSection}>
                <h2>{studentStats.nome}</h2>
                <p>Curso: {studentStats.curso}</p>
                <p>RA: {studentStats.ra}</p>
                <p>Status: {studentStats.status ? "Ativo" : "Inativo"}</p>
                <p>Frequência Média: {studentStats.frequencia}%</p>
              </div>
            </div>
          </div>
        )}
      </Fundo>
    </>
  );
};

export default Aluno;
