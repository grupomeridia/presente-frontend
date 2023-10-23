import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import NavBar from "@/components/Navbar/navbar";
import Cabecalho from "@/components/Cabecalho/cabecalho";
import { Fundo } from "@/components/Fundo/fundo";
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { BsMotherboard } from 'react-icons/bs';

export default function cadastrar(){
    return (
        <>
            <NavBar/>
            <Cabecalho />
            <Fundo className={styles.Fundo}>
                <div className={styles.navbar}>
                    <div>
                        <h1>DESEJA CADASTRAR</h1>
                    </div>
                    <div className={styles.navbarOpcoes}>
                        <div className={styles.opcoes}>
                            <FaUserGraduate/>
                            <p>Aluno</p>
                        </div>
                        <div className={styles.opcoes}>
                            <BsMotherboard/>
                            <p>Projeto</p>
                        </div>
                        <div className={styles.opcoes}>
                            <FaChalkboardTeacher/>
                            <p>Professor</p>
                        </div>
                    </div>
                </div>
            </Fundo>
        </>
    );
}