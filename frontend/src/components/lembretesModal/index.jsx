import React, { useState,useEffect } from "react";
import style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "@/client/api";
import { useUser } from "@/contexts/UserContext";

const LembretesModal = ({ lembretes, onClose }) => {

  const { user } = useUser();
  const jwt = user ? user.JWT : null;

  const [visualizado, setVisualizado] = useState({});
  const [lembretesVisualizados, setLembretesVisualizados] = useState([]);
  const [exibirVisualizados, setExibirVisualizados] = useState(false);

  useEffect(() => {
    if (user) {
      const jwt = user.JWT;
    }
  }, [user]);

  const handleVisualizar = (idLembrete) => {
    // Aqui você chama o endpoint para marcar o lembrete como visualizado
    
    api.lembrete.vizualizar(idLembrete,jwt)
      .then((response) => {
        setVisualizado((prevVisualizado) => {
          const novoEstado = { ...prevVisualizado };
          novoEstado[idLembrete] = !novoEstado[idLembrete];
          return novoEstado;
        });
      })
      .catch((error) => {
        console.error("Erro ao visualizar o lembrete", error);
      });
  };

  const handleVisualizadosClick = () => {
    if (!exibirVisualizados) {
      api.lembrete.verVizualizados(jwt)
        .then(response => {
          setLembretesVisualizados(response.data);
          console.log(response.data)
        })
        .catch(error => {
          console.error("Erro ao buscar lembretes visualizados:", error);
        });
    }
    setExibirVisualizados(!exibirVisualizados);
  };

  


  return (
    <div className={style.modalOverlay}>
    <div className={style.modalContent}>
      <button onClick={onClose}>FECHAR</button>
      <h2 className={style.tirar}>Lembretes</h2>
      <button
        onClick={handleVisualizadosClick}
        className={style.tirarr}
      >
        {exibirVisualizados ? "Não Visualizados" : "Visualizados"}
      </button>
      <ul>
        {(exibirVisualizados ? lembretesVisualizados : lembretes).map((lembrete) => (
          <li key={lembrete.id}>
            <h3>Título: {lembrete.Titulo}</h3>
            <p>{lembrete.mensagem}</p>
            {!exibirVisualizados && (
              <FontAwesomeIcon
                icon={visualizado[lembrete.id] ? faEyeSlash : faEye}
                className={style.visualizadoIcon}
                onClick={() => handleVisualizar(lembrete.id)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default LembretesModal;
