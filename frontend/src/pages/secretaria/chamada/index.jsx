import React, { useReducer, useState } from "react";
import styles from "./style.module.css";
import NavBar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { Fundo } from "@/components/Fundo/fundo";
import Image from "next/image";

import withAuth from '@/utils/auth';

const initialState = {
    turmaSelecionada: "",
    periodoSelecionado: "",
    projetoSelecionado: "",
    data: "",
    horario: "",
    diaSemana: ""
};

function reducer(state, action) {
    return { ...state, [action.field]: action.value };
}

function ChamadaForm() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const handleChange = (field, value) => {
        dispatch({ field, value });
    };
    const handleHoraChange = (e) => {
        setHora(e.target.value);
    };
    const [hora, setHora] = useState("");

    function SelectInput({ value, onChange, options, placeholder }) {
        return (
            <div>
                <select value={value} onChange={(e) => onChange(e.target.value)}>
                    <option value="" disabled hidden>
                        {placeholder || "Selecione uma opção"}
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
    
    
    return (
        <>
        <Cabecalho/>
        <NavBar/>
            <Fundo className={styles.Fundo}>
                <section className={styles.contentChamada}>
                    <div>
                        <h1>ABRIR CHAMADA</h1>
                    </div>
                    <div className={styles.inputArea}>
                        <SelectInput
                            value={state.turmaSelecionada}
                            onChange={(value) => handleChange("turmaSelecionada", value)}
                            options={["Opção 1", "Opção 2", "Opção 3"]}
                            placeholder="Turma"
                        />
                        <SelectInput
                            value={state.periodoSelecionado}
                            onChange={(value) => handleChange("periodoSelecionado", value)}
                            options={["Opção A", "Opção B", "Opção C"]}
                            placeholder="Periodo"
                        />
                        <SelectInput
                            value={state.projetoSelecionado}
                            onChange={(value) => handleChange("projetoSelecionado", value)}
                            options={["Opção K", "Opção L", "Opção G"]}
                            placeholder="Projeto"
                        />
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
                                        <img className={styles.botaoFechar} src="/botao-fechar.png" width={30} height={30}  alt="" />
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

export default withAuth(ChamadaForm,['Secretaria']);



