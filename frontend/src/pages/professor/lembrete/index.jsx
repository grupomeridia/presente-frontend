import Navbar from "@/components/Navbar/navbar";
import styles from "./style.module.css";
import { Fundo } from "@/components/Fundo/fundo";
import Cabecalho from "@/components/Cabecalho/cabecalho";

export default function Lembrete() {
  return (
    <>
      <Navbar />
      <Cabecalho />
      <Fundo>
        <div className={styles.form_center}>
          <div className={styles.form}>
            <h2 className={styles.titulo}> Enviar lembrete para os alunos </h2>
            <input className={styles.input} type="text" placeholder="Informe o RA"></input>
            <textarea  pattern="[a-z]{4,8}" className={styles.input} type="radio" placeholder="Informe o Lembrete: "/>
          </div>
          <button className={styles.botao}>Enviar</button>
        </div>
        
      </Fundo>
    </>
  );
}
