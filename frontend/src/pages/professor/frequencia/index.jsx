import { Doughnut, Bar } from "react-chartjs-2";
import NavBar from "@/components/Navbar/navbar";
import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Chart from "chart.js/auto";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GraficoBarra from "@/components/GraficoBarra/GraficoBarra";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";
import React, { useEffect, useState } from "react";
import axios from 'axios';

import api from "@/client/api";

Chart.register(ChartDataLabels);

export default function Frequencia() {
  const [numAlunosData, setNumAlunosData] = useState(null);
  const [idProfessor, setIdProfessor] = useState("1");
  const [idChamada, setIdChamada] = useState("1");
  const [presentes,setPresentes] = useState();
  const [ausentes,setAusentes] = useState();
  const [totalAlunos, setTotalAlunos] = useState();
  const [porcentagemPresenca, setPorcentagemPresenca] = useState(null);
  const [mediaSemanalData, setMediaSemanalData] = useState([]);



  //Grafico circular

  // dados grafico circular

const fetchDados = () => {
  api.professor.frequencia(idProfessor, idChamada)
    .then(response => {
      console.log("Dados recebidos para a frequência:", response.data);
      setNumAlunosData(response.data);
    })
    .catch(error => console.error("Erro ao buscar os dados:", error));
}


  useEffect(() => {
    fetchDados();
  }, [idProfessor, idChamada]);

  const [GraficoCircularData, setChartData] = useState({
    labels: ["Presença", "Ausência"],
    datasets: [
      {
        label: "Presença / Ausência",
        data: [0, 0],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
      },
    ],
  });

  useEffect(() => {
    const handleUserInteraction = () => {
      fetchDados();
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keypress', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keypress', handleUserInteraction);
    }
  }, [idProfessor, idChamada]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDados();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [idProfessor, idChamada]);

  useEffect(() => {
    if (numAlunosData) {
      console.log("Dados recebidos do backend:", numAlunosData);
      
      setAusentes(numAlunosData["Faltam a chegar"]);
      setPresentes(numAlunosData["Alunos presentes"]);
      setTotalAlunos(numAlunosData["Total de Alunos"]);
      
      setChartData({
        labels: ["Presença", "Ausência"],
        datasets: [
          {
            label: "Presença / Ausência",
            data: [presentes,ausentes ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
          },
        ],
      });
    }
  }, [numAlunosData]);

  const GraficoCircularOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          let sum = 0;
          let dataArr = context.chart.data.datasets[0].data;
          dataArr.map((data) => {
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

  // Grafico Barra
  // dados do porcentagem presença

const fetchPorcentagemPresenca = () => {
  api.professor.historicoSemanal(idProfessor)
      .then(response => {
          console.log("Resposta completa:", response);
          console.log("Dados da resposta:", response.data);
          if(response.data && response.data.porcentagem_presenca) {
            // Convertendo a notação científica para número decimal/normal
            let valorNormal = parseFloat(response.data.porcentagem_presenca).toFixed(2);
            setPorcentagemPresenca(valorNormal);
          } else {
            console.error("Não foi possível encontrar 'porcentagem_presenca' nos dados:", response.data);
          }
      })
      .catch(error => {
          console.error("Erro ao buscar a porcentagem de presença:", error);
      });
}


useEffect(() => {
  fetchDados();
  fetchPorcentagemPresenca();
}, [idProfessor, idChamada]);

//  dados grafico barra

const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const fetchMediaSemanal = () => {
    api.professor.mediaSemanal(idProfessor)
        .then(response => {
            console.log("Dados da resposta:", response.data);
            setMediaSemanalData(response.data);
        })
        .catch(error => {
            console.error("Erro ao buscar a média semanal:", error);
        });
}

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
            return '';
          } else {
            return value + '%';
          }
        },
        color: "#000",
        anchor: "end",
      }
    }
  };

let labels = [];
let dataValues = [];

mediaSemanalData.forEach(item => {
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
      <Fundo className={styles.Fundo}>
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
            <h2>Frequencia Semanal: <br/> {porcentagemPresenca ? porcentagemPresenca + "%" : "Carregando..."}</h2>
          </div>
        </div>
      </Fundo>
    </>
  );
}