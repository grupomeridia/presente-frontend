import { Fundo } from "@/components/Fundo/fundo";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import React, { useState } from 'react';

export default function Chamada() {


  const [rows, setRows] = useState([
    { id: 1, turma: 'eng.Software', periodo: 'Pizzaria', projeto: 'Noturno', data: 'Fecha:22:00' }
  ]);

  const removeRow = (id) => {
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
  };
  
  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.form_center}>
          <div className={styles.form}>
            <h2 className={styles.titulo}>Abrir Chamada</h2>
            
            <select className={styles.input} id="turma">
              <option value="" disabled selected hidden>Turma</option>
              <option value="Turma A">Turma A</option>
              <option value="Turma B">Turma B</option>
              <option value="Turma C">Turma C</option>
            </select>

            <select className={styles.input} id="periodo">
              <option value="" disabled selected hidden>Periodo</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>

            <select className={styles.input} id="projeto">
              <option value="" disabled selected hidden>Projeto</option>
              <option value="Projeto 1">Projeto 1</option>
              <option value="Projeto 2">Projeto 2</option>
              <option value="Projeto 3">Projeto 3</option>
            </select>
          </div>
          <button className={styles.botao}>ABRIR</button>
        </div>
      </Fundo>

      <Fundo>
        <div className={styles.container_chamadas}>
          <h2>Chamadas Abertas</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Turma</th>
                <th>Periodo</th>
                <th>Projeto</th>
                <th>Data</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.turma}</td>
                  <td>{row.periodo}</td>
                  <td>{row.projeto}</td>
                  <td>{row.data}</td>
                  <td><span onClick={() => removeRow(row.id)}>Fechar</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fundo>
    </>
  );
}
