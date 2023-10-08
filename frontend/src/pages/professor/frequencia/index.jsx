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

import api from "@/client/api";

Chart.register(ChartDataLabels);

export default function Frequencia() {
  const [numAlunosData, setNumAlunosData] = useState(null);
  const [idProfessor, setIdProfessor] = useState("1");
  const [idChamada, setIdChamada] = useState("1");
  const [presentes,setPresentes] = useState();
  const [ausentes,setAusentes] = useState();
  const [totalAlunos, setTotalAlunos] = useState();

  //Grafico circular

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

  const fetchDados = () => {
    api.professor.frequencia(idProfessor, idChamada)
      .then(response => {
        setNumAlunosData(response.data);
      })
      .catch(error => console.error("Erro ao buscar os dados:", error));
  }
  
    useEffect(() => {
      fetchDados();
    }, [idProfessor, idChamada]);


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
  
      const ausentesValue = numAlunosData["Faltam a chegar"];
      const presentesValue = numAlunosData["Aluno presentes"];
      const totalAlunosValue = numAlunosData["Total de Alunos"];
  
      // Verifica se todos os valores são válidos
      if (
        ausentesValue !== undefined &&
        !isNaN(ausentesValue) &&
        presentesValue !== undefined &&
        !isNaN(presentesValue) &&
        totalAlunosValue !== undefined &&
        !isNaN(totalAlunosValue)
      ) {
        setAusentes(ausentesValue);
        setPresentes(presentesValue);
        setTotalAlunos(totalAlunosValue);
  
        setChartData({
          labels: ["Presença", "Ausência"],
          datasets: [
            {
              label: "Presença / Ausência",
              data: [presentesValue, ausentesValue],
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(255, 99, 132, 0.2)",
              ],
            },
          ],
        });
      }
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
  };

  const valores = [50, 150, 80, 50, 90];
  const ajusteValores = valores.map((value) => Math.min(value, 100));

  const GraficoBarraData = {
    labels: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    datasets: [
      {
        label: "Frequencia",
        data: ajusteValores,
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
              {numAlunosData ? (
                isNaN(presentes) || isNaN(totalAlunos) ? (
                  "..."
                ) : (
                  `${presentes}/${totalAlunos}`
                )
              ) : (
                "Carregando..."
              )}
            </h3>
          </div>
          <div className={styles.graficoCircular}>
            {numAlunosData && !isNaN(presentes) && !isNaN(ausentes) ? (
              <GraficoCircular
                data={GraficoCircularData}
                options={GraficoCircularOptions}
                className={styles.Doughnut}
              />
            ) : (
              <h3></h3>
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
            <h2>Frequencia Semanal</h2>
          </div>
        </div>
      </Fundo>
    </>
  );
}
