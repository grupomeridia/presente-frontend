import React, { useState } from "react";
import styles from "./style.module.css"

import NavBar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { Fundo } from "@/components/Fundo/fundo";

import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GraficoBarra from "@/components/GraficoBarra/GraficoBarra";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";
import { Doughnut, Bar } from "react-chartjs-2";
import { data } from "autoprefixer";

Chart.register(ChartDataLabels);

export default function Dashboard() {

  const [selectedOption, setSelectedOption] = useState('');
  const [data, setData] = useState(new Date());

  //Grafico circular
  const [GraficoCircularDataAlunosAusentes, setChartData1] = useState({
    labels: ["Presentes", "Ausentes"],
    datasets: [
      {
        label: "Alunos",
        data: [300, 90],
        backgroundColor: ["rgba(255, 255, 255, 0.8)", "rgba(255, 159, 64, 0.2)"],
      },
    ],
  });

  const [GraficoCircularDataAlunosAtivos, setChartData2] = useState({
    labels: ["Ativos", "Inativos"],
    datasets: [
      {
        label: "Alunos",
        data: [300, 100],
        backgroundColor: ["rgba(255, 255, 255, 0.8)", "rgba(255, 159, 64, 0.2)"],
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
        position: "right",
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
          color:'white'
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
        backgroundColor: "white",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 100
      },
    ],
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <NavBar />
      <Cabecalho />
      <Fundo className={styles.Fundo}>
        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <div>
              <div>{data.getDate}</div>
              <div>Curso selecionado:{selectedOption}</div>
            </div>
            <div className={styles.selectCursos}>
              <select id="cursos" value={selectedOption} onChange={handleSelectChange}>
                <option value="" disabled hidden>
                  Selecione uma opção
                </option>
                <option value="opcao1">Opção 1</option>
                <option value="opcao2">Opção 2</option>
                <option value="opcao3">Opção 3</option>
              </select>
            </div>
          </div>
        </section>
        <section className={styles.graficosCircularContent}>
          <div className={styles.grafico}>
            <GraficoCircular
              data={GraficoCircularDataAlunosAusentes}
              options={GraficoCircularOptions}
              className={styles.Doughnut}
            />
          </div>
          <div className={styles.grafico}>
            <GraficoCircular
              data={GraficoCircularDataAlunosAtivos}
              options={GraficoCircularOptions}
              className={styles.Doughnut}
            />
          </div>
        </section>
        <section className={styles.content}>
          <div className={styles.contentHeaderBar}>
            <div className={styles.contentHeaderBarTitle}>
              <p>Media de alunos ativos</p>
              <div>
                <button type="button" value="dia">Dia</button>
                <button type="button" value="semana">Semana</button>
                <button type="button" value="mes">Mes</button>
              </div>
            </div>
            <div>
              <div className={styles.selectCursos}>
                <select id="cursos-alunos-ativos" value={selectedOption} onChange={handleSelectChange}>
                  <option value="" disabled hidden>
                    Selecione uma opção
                  </option>
                  <option value="opcaoA">Opção a</option>
                  <option value="opcaoB">Opção b</option>
                  <option value="opcaoC">Opção c</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.graficoBarContent}>
            <div className={styles.graficoBar}>
              <GraficoBarra
                data={GraficoBarraData}
                options={GraficoBarraOptions}
                className={styles.Bar}
              />
            </div>
        </section>
        <section className={styles.content}>
          <div className={styles.contentHeaderBar}>
            <div className={styles.contentHeaderBarTitle}>
              <p>Media de alunos ativos</p>
              <div>
                <button type="button" value="dia">Dia</button>
                <button type="button" value="semana">Semana</button>
                <button type="button" value="mes">Mes</button>
              </div>
            </div>
            <div>
              <div className={styles.selectCursos}>
                <select id="cursos-alunos-ativos" value={selectedOption} onChange={handleSelectChange}>
                  <option value="" disabled hidden>
                    Selecione uma opção
                  </option>
                  <option value="opcaoA">Opção a</option>
                  <option value="opcaoB">Opção b</option>
                  <option value="opcaoC">Opção c</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.graficoBarContent}>
            <div className={styles.graficoBar}>
              <GraficoBarra
                data={GraficoBarraData}
                options={GraficoBarraOptions}
                className={styles.Bar}
              />
            </div>
        </section>
      </Fundo>
    </>
  );


}