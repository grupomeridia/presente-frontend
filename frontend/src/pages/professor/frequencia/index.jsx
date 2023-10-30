import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import NavBar from "@/components/Navbar/navbar";
import Chart from 'chart.js/auto';
import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GraficoBarra from "@/components/GraficoBarra/GraficoBarra";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";
import LoadingBar from "@/components/Loading";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import api from "@/client/api";

import { useUser } from "@/contexts/UserContext";


Chart.register(ChartDataLabels);

export default function Frequencia() {
  const [numAlunosData, setNumAlunosData] = useState(null);
  const { user } = useUser();
  const [idProfessor, setIdProfessor] = useState(user ? user.id_professor : null);
  const [idChamada, setIdChamada] = useState(null);
  const [presentes, setPresentes] = useState();
  const [ausentes, setAusentes] = useState();
  const [totalAlunos, setTotalAlunos] = useState();
  const [porcentagemPresenca, setPorcentagemPresenca] = useState(null);
  const [mediaSemanalData, setMediaSemanalData] = useState([]);
  const [loading, setLoading] = useState(true); // Mantenha o estado de loading sempre verdadeiro
  const [loadingProgress, setLoadingProgress] = useState(0);
  


  useEffect(() => {
    if (idProfessor) {
      api.professor.chamadasAbertas(idProfessor)
        .then(response => {
          if (response.data && response.data.length > 0) {
            setIdChamada(response.data[0].id); 
          }
        })
        .catch(error => {
          console.error("Erro ao buscar chamadas abertas:", error);
        });
    }
  }, [idProfessor]);
  

  const startLoadingProgress = () => {
    let progress = 0;
    const interval = 1000;
    const totalSteps = 10;
  
    const progressInterval = setInterval(() => {
      if (progress < 100) {
        progress += 100 / totalSteps;
        setLoadingProgress(progress);
      } else {
        clearInterval(progressInterval);
        setLoadingProgress(0);
        setTimeout(() => {
          // setLoadingProgress(0);
          startLoadingProgress();
        }, 10000);
      }
    }, interval);
  
    return progressInterval;
  };
  
  useEffect(() => {
    if (loadingProgress === 100) {
      fetchDados();
    }
  }, [loadingProgress]);

  useEffect(() => {
    startLoadingProgress();
  }, [idProfessor, idChamada]);

  const fetchDados = () => {
    return new Promise((resolve, reject) => {
      api.professor
        .frequencia(idProfessor, idChamada)
        .then((response) => {
          console.log("Dados recebidos para a frequência:", response.data);
          setNumAlunosData(response.data);
          resolve();
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados:", error);
          reject();
        });
    });
  };


  useEffect(() => {
    startLoadingProgress();
    fetchDados();
  
    return () => {

    };
  }, [idProfessor, idChamada]);


  useEffect(() => {
    if (numAlunosData) {
      console.log("Dados recebidos do backend:", numAlunosData);

      setAusentes(numAlunosData["Faltam a chegar"]);
      setPresentes(numAlunosData["Alunos presentes"]);
      setTotalAlunos(numAlunosData["Total de Alunos"]);
    }
  }, [numAlunosData]);

  const GraficoCircularData = {
    labels: ["Presença", "Ausência"],
    datasets: [
      {
        label: "Presença / Ausência",
        data: [presentes, ausentes],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
      },
    ],
  };

  const GraficoCircularOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          let sum = 0;
          let dataArr = context.chart.data.datasets[0].data;
          dataArr.forEach((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(2) + "%";
          return percentage;
        },
        color: "#fff",
        anchor: "center",
      },
      legend: {
        position: "left",
      },
      title: {
        display: true,
        text: "",
      },
    },
  };

  const fetchPorcentagemPresenca = () => {
    api.professor
      .historicoSemanal(idProfessor)
      .then((response) => {
        console.log("Resposta completa:", response);
        console.log("Dados da resposta:", response.data);
        if (response.data && response.data.porcentagem_presenca) {
          let valorNormal = parseFloat(
            response.data.porcentagem_presenca
          ).toFixed(2);
          setPorcentagemPresenca(valorNormal);
        } else {
          console.error(
            "Não foi possível encontrar 'porcentagem_presenca' nos dados:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar a porcentagem de presença:", error);
      });
  };

  useEffect(() => {
    fetchPorcentagemPresenca();
  }, [idProfessor, idChamada]);

  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const fetchMediaSemanal = () => {
    api.professor
      .mediaSemanal(idProfessor)
      .then((response) => {
        console.log("Dados da resposta:", response.data);
        setMediaSemanalData(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar a média semanal:", error);
      });
  };

  useEffect(() => {
    fetchMediaSemanal();
  }, [idProfessor]);

  const GraficoBarraOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          min: 0,
          max: 100,
          stepSize: 10,
          callback: function (value, index, values) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          if (value === 100) {
            return "";
          } else {
            return value + "%";
          }
        },
        color: "#fff",
        anchor: "end",
      },
      legend: {
        display: false,
      },
    },
  };

  let labels = [];
  let dataValues = [];

  mediaSemanalData.forEach((item) => {
    labels.push(diasDaSemana[item.dia_semana]);
    dataValues.push(parseFloat(item.porcentagem_presenca));
  });

  const GraficoBarraData = {
    labels: labels,
    datasets: [
      {
        label: "Frequencia",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      
      <NavBar />
      <Cabecalho />
      <Fundo >
      <LoadingBar progress={loadingProgress} />
        <div className={styles.container_center}>
          <div className={styles.tituloGrafico}>
            <div className={styles.info_center}>
              <h2>Presenças Marcadas</h2>
              <h3>
                {numAlunosData
                  ? `${presentes}/${totalAlunos}`
                  : "Carregando..."}
              </h3>
            </div>
            <div className={styles.graficoCircular}>
              {numAlunosData && (
                <GraficoCircular
                  data={GraficoCircularData}
                  options={GraficoCircularOptions}
                  className={styles.Doughnut}
                />
              )}
            </div>
          </div>
        </div>
      </Fundo>
      <Fundo className={styles.Fundo}>
        <div className={styles.container_center}>
          <div className={styles.tituloGrafico}>
            <div className={styles.graficoBar}>
              <GraficoBarra
                data={GraficoBarraData}
                options={GraficoBarraOptions}
                className={styles.Bar}
              />
            </div>
            <h2>
              Frequencia Semanal: <br />{" "}
              {porcentagemPresenca
                ? porcentagemPresenca + "%"
                : "Carregando..."}
            </h2>
          </div>
        </div>
      </Fundo>
    </>
  );
}
