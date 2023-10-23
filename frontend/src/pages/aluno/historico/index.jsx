import React, { useState, useEffect } from "react";
import api from "@/client/api";
import styles from "./style.module.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { text } from "@fortawesome/fontawesome-svg-core";


export default function historicoAluno() {

    const [aluno, setAluno] = useState(1);
    const [historico, setHistorico] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [historicoFiltrada, setHistoricoFiltrada] = useState([]);

    const fetchPresencasAluno = () => {
        api.aluno.findChamadaByAluno(aluno)
            .then(response => {
                setHistorico(response.data);
                setHistoricoFiltrada(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log("Error ao buscar a lista de presencas", error);
            });
    };

    useEffect(() => {
        fetchPresencasAluno();
    }, [aluno]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filteredList = historico.filter(item =>
            item.nome.toLowerCase().includes(value.toLowerCase())
          );
      
          setHistoricoFiltrada(filteredList);
    };

    // useEffect(() =>{
    //     const fetchPresencasAluno = async () => {
    //         try{
    //             const resposnse = await api.aluno.findChamadaByAluno(aluno);
    //             setHistorico(resposnse.data);
    //         }catch(error){
    //             console.error("Erro ao buscar as presenças", error);
    //         }
    //     };
    //     fetchPresencasAluno();
    // }, )


    return (
        <div>
            <Cabecalho />
            <Navbar />
            <section className={styles.page_content}>
                <section className={styles.inner_content}>
                    <div className={styles.div_content}>
                        <div className={styles.dados}>
                            <div>
                                <h1>9</h1>
                                <p>Presencas</p>
                            </div>
                            <div>
                                <h1>1</h1>
                                <p>Faltas</p>
                            </div>
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
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Dia/Hora</th>
                                    <th>Status</th>
                                    <th>Tipo de Presenca</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicoFiltrada.map((item) => (
                                    <tr key={item.id_presenca}>
                                        <td>{item.nome}</td>
                                        <td>{item.horario}</td>
                                        <td>{item.status ? "ativo" : "inativo"}</td>
                                        <td>{item.tipo_presenca}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </section>
            <Footer />
        </div>
    );


}