import React, { useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import NavBar from "@/components/Navbar/navbar";
import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Chart from "chart.js/auto";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GraficoBarra from "@/components/GraficoBarra/GraficoBarra";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";

Chart.register(ChartDataLabels);

export default function Frequencia() {
  //Grafico circular

  const [GraficoCircularData, setChartData] = useState({
    labels: ["Red", "Green"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)"],
      },
    ],
  });

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
              <h3>10/50</h3>
            </div>
            <div className={styles.graficoCircular}>
              <GraficoCircular
                data={GraficoCircularData}
                options={GraficoCircularOptions}
                className={styles.Doughnut}
              />
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
