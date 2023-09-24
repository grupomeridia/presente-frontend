import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import { Fundo } from "@/components/Fundo/fundo";
import Cabecalho from "@/components/Cabecalho/cabecalho";

export default function Presenca() {
  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.form_center}>
          <div className={styles.form}>
            <h2 className={styles.titulo}>Realizar Presença</h2>
            <input className={styles.input} type="text" placeholder="Informe o RA"></input>
          </div>
          <button className={styles.botao}>Confirmar Presença</button>
        </div>
      </Fundo>
    </>
  );
}
