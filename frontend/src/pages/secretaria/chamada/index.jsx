import React, { useReducer, useState, useEffect } from "react";
import styles from "./style.module.css";
import NavBar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { Fundo } from "@/components/Fundo/fundo";
import Image from "next/image";
import api from "@/client/api";

import withAuth from '@/utils/auth';

const ChamadaForm = () => {
    const [selectedOption, setSelectedOption] = useState("");
    const [turmas, setTurmas] = useState([]);
    const [professor, setProfessor] = useState([]);
    const [professorSelecionado, setProfessorSelecionado] = useState(null);


    const handleChange = (field, value) => {
        dispatch({ field, value });
    };
    const handleHoraChange = (e) => {
        setHora(e.target.value);
    };
    const [hora, setHora] = useState("");

    // function SelectInput({ value, onChange, options, placeholder }) {
    //     return (
    //         <div>
    //             <select value={value} onChange={(e) => onChange(e.target.value)}>
    //                 <option value="" disabled hidden>
    //                     {placeholder || "Selecione uma opção"}
    //                 </option>
    //                 {options.map((option, index) => (
    //                     <option key={index} value={option}>
    //                         {option}
    //                     </option>
    //                 ))}
    //             </select>
    //         </div>
    //     );
    // }

    const fetchProfessores = () => {
        api.professor.listAll()
          .then(response => {
            setProfessor(response.data);
            console.log('professor');
            console.log(response.data)
          })
          .catch(error => {
            console.error("Erro ao buscar dados da turma:", error);
          });
      }

      useEffect(() => {
        fetchProfessores();
      }, []);

    // const handleTurmaSelectChange = (event) => {
    //     const selectedId = Number(event.target.value);
    //     const selectedTurma = turmas.find(turma => turma.Id === selectedId);
    //     console.log(selectedId);
    //     console.log(selectedTurma);
    //     if (selectedTurma) {
    //         console.log("estamos dentro do handlerSelect de turma");
    //     }
    // };

    const fetchTurmasByProfessor = (id) =>{
        
    }

    const handleProfessorSelectChange = async (event) => {
        const selectedId = Number(event.target.value);
        const selectProfessor = professor.find(professor => professor.id === selectedId);
        console.log(selectedId);
        console.log(selectProfessor);
        if(selectProfessor){
            console.log("Professor selecionado:", selectProfessor);
            setProfessorSelecionado(selectProfessor); 

            try{
                const response = await api.professor.turmas(selectedId);
                const dados = await response.json();
            }catch(error){

            }
        }
    }

    return (
        <>
            <Cabecalho />
            <NavBar />
            <Fundo className={styles.Fundo}>
                <section className={styles.contentChamada}>
                    <div>
                        <h1>ABRIR CHAMADA</h1>
                    </div>
                    <div className={styles.inputArea}>
                    <div className={styles.selectCursos}>
                            <select id="cursos" value={selectedOption} onChange={handleProfessorSelectChange}>
                                <option value="" disabled hidden>
                                    Professor
                                </option>
                                {turmas.map((turma) => (
                                    <option key={turma.Id} value={turma.Id}>
                                        {turma.Nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.selectCursos}>
                            <select id="cursos" value={selectedOption} onChange={handleTurmaSelectChange}>
                                <option value="" disabled hidden>
                                    Turma
                                </option>
                                {turmas.map((turma) => (
                                    <option key={turma.Id} value={turma.Id}>
                                        {turma.Nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.a}>
                            {/* <label htmlFor="horaInput">Fecha às:</label> */}
                            <input
                                placeholder="Fecha as:"
                                type="time"
                                id="horaInput"
                                value={hora}
                                onChange={handleHoraChange}
                                required
                            />
                        </div>
                        <div className={styles.divButton}>
                            <button>Finalizar</button>
                        </div>
                    </div>

                </section>
            </Fundo>
            <Fundo className={styles.Fundo}>
                <section className={styles.contentChamadaAberta}>
                    <h1>CHAMADAS ABERTAS</h1>
                    <div>
                        <table>
                            {/* <thead>
                            <th><p>CURSO</p></th>
                            <th><p>PROJETO</p></th>
                            <th><p>HORARIO</p></th>
                            <th><p>FECHA</p></th>
                        </thead>  */}
                            <tbody>
                                <tr>
                                    <td>eng.soft</td>
                                    <td>pizzaria</td>
                                    <td>NOTURNO</td>
                                    <td>22:00</td>
                                    <td>
                                        {/* <Image
                                            src={userImage}
                                            alt="User"
                                            width={50}
                                            height={50}
                                        /> */}
                                        <img className={styles.botaoFechar} src="/botao-fechar.png" width={30} height={30} alt="" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </section>
            </Fundo>
        </>

    );
}

export default ChamadaForm;

// export default withAuth(ChamadaForm,['Secretaria']);



