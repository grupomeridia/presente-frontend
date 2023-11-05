import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import NavBar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { Fundo } from "@/components/Fundo/fundo";
import { Doughnut, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import GraficoCircular from "@/components/GraficoCircular/GraficoCircular";
import GraficoBarra from "@/components/GraficoBarra/GraficoBarra";
import api from "@/client/api";

import withAuth from "@/utils/auth";

Chart.register(ChartDataLabels);

const Dashboard = () => {
  
  const [selectedOption, setSelectedOption] = useState("");
  const [data, setData] = useState(new Date());
  const [labelGraf, setLabelGraf] = useState(["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]);
  const [valores, setValores] = useState([50, 150, 80, 50, 90]);
  const [periodType, setPeriodType] = useState("dia");
  
  const [idTurma, setIdTurma] = useState(1);
  const [turmas, setTurmas] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  const [turmaData, setTurmaData] = useState("");
  const [alunosAusentes, setAlunosAusentes] = useState([]);
  const [alunosAtivos, setAlunosAtivos] = useState([]);
  const [mediaAlunosAtivos] = useState([]);
  const [mediaAlunosAusentes]= useState([]);

  const fetchAlunosAusentes = () => {
    api.admin.findByAusentes(idTurma)
      .then(response => {
        setAlunosAusentes(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar a média semanal:", error);
      });
  }

  useEffect(() => {
    fetchAlunosAusentes();
  }, [idTurma]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setData(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchTurmas = () =>{
    api.turma.listAll() 
    .then( response =>{
        setTurmas(response.data);
        console.log(response.data)
    })
    .catch(error => {
      console.error("Erro ao buscar dados da turma:", error);
    });
  }

  useEffect(() =>{
    fetchTurmas();
  },[])

  const fetchTurmaData = (selectedId) => {
    api.admin.findByAusentes(selectedId)
      .then(response => {
        setTurmaData(response.data);
        console.log(`dentro do select ${response.data}`)
      })
      .catch(error => {
        console.error("Erro ao buscar dados da turma:", error);
      });
  };

  const handleSelectChange = (event) => {
    const selectedId =  Number(event.target.value);
    const selectedTurma = turmas.find(turma => turma.Id === selectedId);
    console.log(selectedId)
    console.log(selectedTurma)
    if (selectedTurma) {
      setSelectedOption(selectedId);
      setSelectedName(selectedTurma.Nome);
      fetchTurmaData(selectedId);
    }

  };

  const GraficoCircularOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          let sum = context.dataset.data.reduce((acc, data) => acc + data, 0);
          let percentage = ((value * 100) / sum).toFixed(2) + "%";
          return percentage;
        },
        color: "#fff",
        anchor: "center",
      },
      legend: {
        labels: {
          color: "white",
        },
        position: "right",
      },
      title: {
        display: true,
        text: "",
      },
    },
  };

  const GraficoBarraOptions = {
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        color: "red",
      },
      y: {
        beginAtZero: true,
        ticks: {
          min: 0,
          max: 100,
          stepSize: 10,
          callback: function (value, index, values) {
            return value + "%";
          },
          color: "white",
        },
      },
    },
  };


const ajusteValores = valores.map((value) => Math.min(value, 100));

  const GraficoCircularDataAlunosAusentes = {
    labels: ["Presentes", "Ausentes"],
    datasets: [
      {
        label: "Alunos",
        data: alunosAusentes,
        backgroundColor: ["rgba(255, 255, 255, 0.8)", "rgba(255, 159, 64, 0.2)"],
      },
    ],
  };

  const GraficoCircularDataAlunosAtivos = {
    labels: ["Ativos", "Inativos"],
    datasets: [
      {
        label: "Alunos",
        data: [300, 100],
        backgroundColor: ["rgba(255, 255, 255, 0.8)", "rgba(255, 159, 64, 0.2)"],
      },
    ],
  };

  const GraficoBarraDataAtivos = {
    labels: labelGraf,
    datasets: [
      {
        label: "Frequencia",
        data: ajusteValores,
        backgroundColor: "white",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 100,
      },
    ],
  };

  const GraficoBarraDataAusentes = {
    labels: labelGraf,
    datasets: [
      {
        label: "Frequencia",
        data: ajusteValores,
        backgroundColor: "white",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 100,
      },
    ],
  };

  const handlePeriodButtonClick = (period) => {
    setPeriodType(period);
    if (period === "dia") {
      setLabelGraf(["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]);
      // Atualize os dados do gráfico para o período "dia"
    } else if (period === "semana") {
      setLabelGraf(["1", "2", "3", "4", "5"]);
      // Atualize os dados do gráfico para o período "semana"
    } else if (period === "mes") {
      setLabelGraf(["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]);
      // Atualize os dados do gráfico para o período "mês"
    }
  };

  return (
    <>
      <NavBar />
      <Cabecalho />
      <Fundo className={styles.Fundo}>
        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <div>
              {/* <div>{data.toLocaleString()}</div> */}
              <div>Curso selecionado:{selectedName}</div>
            </div>
            <div className={styles.selectCursos}>
            <select id="cursos" value={selectedOption} onChange={handleSelectChange}>
                  <option value="" disabled hidden>
                    Filtrar /cursos
                  </option>
                  {turmas.map((turma) => (
                    <option key={turma.Id} value={turma.Id}>
                      {turma.Nome}
                    </option>
                  ))}
                </select>
            </div>
          </div>
        </section>
        <section className={styles.graficosCircularContent}>

          <div className={styles.graficoDiv}>
            {alunosAusentes.length > 0 ? (
              <div className={styles.grafico}>
                <GraficoCircular
                  data={GraficoCircularDataAlunosAusentes}
                  options={GraficoCircularOptions}
                  className={styles.Doughnut}
                />
              </div>
            ) : (
              <h1>Carregando...</h1>
            )}
          </div>

          <div className={styles.graficoDiv}>
            {alunosAusentes.length > 0 ? (
              <div className={styles.grafico}>
                <GraficoCircular
                  data={GraficoCircularDataAlunosAtivos}
                  options={GraficoCircularOptions}
                  className={styles.Doughnut}
                />
              </div>
            ) : (
              <h1>Carregando...</h1>
            )}
          </div>
        </section>
        <section className={styles.content}>
          <div className={styles.contentHeaderBar}>
            <div className={styles.contentHeaderBarTitle}>
              <p>Media de alunos ativos</p>
              <div>
                <button type="button" onClick={() => handlePeriodButtonClick("dia")}>Dia</button>
                <button type="button" onClick={() => handlePeriodButtonClick("semana")}>Semana</button>
                <button type="button" onClick={() => handlePeriodButtonClick("mes")}>Mês</button>
              </div>
            </div>
            <div>
              <div className={styles.selectCursos}>
                <select id="cursos-alunos-ativos" value={selectedOption} onChange={handleSelectChange}>
                  <option value="" disabled hidden>
                    Filtrar /cursos
                  </option>
                  {turmas.map((turma) => (
                    <option key={turma.Id} value={turma.Id}>
                      {turma.Nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.graficoBarContent}>
          <div className={styles.graficoBar}>
            <GraficoBarra
              data={GraficoBarraDataAtivos}
              options={GraficoBarraOptions}
              className={styles.Bar}
            />
          </div>
        </section>
        <section className={styles.content}>
          <div className={styles.contentHeaderBar}>
            <div className={styles.contentHeaderBarTitle}>
              <p>Media de alunos ausentes</p>
              <div>
                <button type="button" onClick={() => handlePeriodButtonClick("dia")}>Dia</button>
                <button type="button" onClick={() => handlePeriodButtonClick("semana")}>Semana</button>
                <button type="button" onClick={() => handlePeriodButtonClick("mes")}>Mês</button>
              </div>
            </div>
            <div>
              <div className={styles.selectCursos}>
              <select id="cursos-alunos-ausentes" value={selectedOption} onChange={handleSelectChange}>
                  <option value="" disabled hidden>
                    Filtrar /cursos
                  </option>
                  {turmas.map((turma) => (
                    <option key={turma.Id} value={turma.Id}>
                      {turma.Nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.graficoBarContent}>
          <div className={styles.graficoBar}>
            <GraficoBarra
              data={GraficoBarraDataAusentes}
              options={GraficoBarraOptions}
              className={styles.Bar}
            />
          </div>
        </section>
      </Fundo>
    </>
  );

}

export default withAuth(Dashboard,['Admin']);
