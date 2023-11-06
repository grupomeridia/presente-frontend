import React, { useState, useEffect } from "react";
import api from "@/client/api";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { text } from "@fortawesome/fontawesome-svg-core";
import { useUser } from "@/contexts/UserContext";

import withAuth from '@/utils/auth';

const historicoAluno = () => {

    const { user } = useUser();
    const id_aluno = user ? user.id_aluno : null;
    const [historico, setHistorico] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [historicoFiltrada, setHistoricoFiltrada] = useState([]);
    const [faltasPresencas, setFaltasPresencas] = useState();
    const [ServerResponse, setServerResponse] = useState("");

    historico.reverse();
    
    useEffect(() => {
        if (user) {
          const id_aluno = user.id_aluno;
        }
      }, [user]);

    const fetchPresencasAluno = () => {
        api.aluno.findChamadaByAluno(id_aluno)
            .then(response => {
                setHistorico(response.data);
                setHistoricoFiltrada(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log("Error ao buscar a lista de presencas", error);
            });
    };

    const fetchFaltasPresencas = () => {
        api.aluno.presencasFaltas(id_aluno)
            .then(response => {
                setFaltasPresencas(response.data);
                console.log(`presencas faltas ` + response.data);
            })
            .catch(error => {
                console.log("Error ao buscar a lista de presencas", error);
            });
    };

    useEffect(() => {
        fetchFaltasPresencas();
    }, [id_aluno]);

    useEffect(() => {
        fetchPresencasAluno();
    }, [id_aluno]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filteredList = historico.filter(item =>
            item.nome.toLowerCase().includes(value.toLowerCase())
        );

        setHistoricoFiltrada(filteredList);
    };

    return (
        <div>
            <Cabecalho />
            <Navbar />
            <section className={styles.page_content}>
                <section className={styles.inner_content}>
                    <div className={styles.div_content}>
                        <div>
                            {faltasPresencas && faltasPresencas.nome ? (
                                <div className={styles.dados}>
                                    <div>
                                        <h1>{faltasPresencas.presencas}</h1>
                                        <p>Presencas</p>
                                    </div>
                                    <div>
                                        <h1>{faltasPresencas.faltas}</h1>
                                        <p>Faltas</p>
                                    </div>
                                </div>
                            ) : (
                                <p>Carregando...</p>
                            )}
                        </div>
                        <div className={styles.search_input}>
                            <div>
                                <input type="text" placeholder="Pesquisar..."
                                    value={searchTerm}
                                    onChange={handleSearch}></input>
                            </div>
                        </div>
                    </div>
                    <div className={styles.div_table}>
                        <table className={styles.tabela}>
                            <thead className={styles.tableHeader}>
                                <tr className={styles.row}>
                                    <th className={styles.headerCell}>Nome</th>
                                    <th className={styles.headerCell}>Data</th>
                                    <th className={styles.headerCell}>Status</th>
                                    <th className={styles.headerCell}>Tipo de Presenca</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {historicoFiltrada.map((item) => (
                                    <tr key={item.id_presenca} className={styles.row}>
                                        <td className={styles.cell}>{item.nome}</td>
                                        <td className={styles.cell}>{item.horario}</td>
                                        <td className={styles.cell}>{item.status ? "ativo" : "inativo"}</td>
                                        <td className={styles.cell}>{item.tipo_presenca}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </section>
        </div>
    );

}

export default  withAuth(historicoAluno,['Aluno']);