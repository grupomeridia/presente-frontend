import Link from "next/link";
import Image from "next/image";
import styles from "./navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faUserCheck,
  faChalkboardTeacher,
  faBell,
  faTachometerAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Cabecalho from "../Cabecalho/cabecalho";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState("");
  const { user } = useUser();
  const [userType, setUserType] = useState();
  const [userCurso,setUserCurso] = useState();
  const [userImage, setUserImage] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("User:", user);
      setUserType(user.Cargo);
      setUserCurso(user.Curso);
    }
  }, [user]);

 useEffect(() => {
  if (user && user.Curso) { // Verifica se `user` e `user.Curso` estão definidos
    console.log("User:", user);
    const updatedCourse = user.Curso.replace(/_/g, ' ');
    setUserCurso(updatedCourse);
    setUserType(user.Cargo)// Armazena o curso com espaços
  } else if (user) { // Se `user` está definido mas não tem `Curso`, talvez só precise do `Cargo`
    setUserType(user.Cargo);
    console.log(userType)
  }
}, [user]);

// useEffect(() => {
//   if (user) {
//     console.log("User:", user);
//     const updatedCourse = user.Curso.replace(/_/g, ' ');
//     setUserCurso(updatedCourse);
//     console.log(updatedCourse);
//   }
// }, [user]);

  useEffect(() => {
    console.log("Pathname:", router.pathname, "User Type:", userType);
    if (user && user.Cargo === "professor") {
      const restrictedRoutes = ["/admin", "/aluno"];

      if (restrictedRoutes.some((route) => router.pathname.startsWith(route))) {
        console.log("Redirecting to /home...");
        router.push("/home");
      }
    }
  }, [router.pathname, user]);

  useEffect(() => {
    const fetchedImage = "";
    setUserImage(fetchedImage);
  }, []);

  const getMenuItems = () => {
    if (userType === "Aluno") {
      return [
        { name: "Histórico", icon: faHistory, link: "/aluno/historico" },
        { name: "Presença", icon: faUserCheck, link: "/aluno/home" },
      ];
    }

    if (userType === "Professor") {
      return [
        { name: "Chamada", icon: faUserCheck, link: "/professor/home" },
        { name: "Frequência", icon: faHistory, link: "/professor/frequencia" },
        {
          name: "Presença",
          icon: faChalkboardTeacher,
          link: "/professor/presenca",
        },
      ];
    }

    if (userType === "Secretaria") {
      return [
        { name: "Dashboard", icon: faTachometerAlt, link: "/secretaria/home" },
        { name: "Chamada", icon: faUserCheck, link: "/secretaria/chamada" },
        { name: "Cadastrar", icon: faUserPlus, link: "/secretaria/cadastrar" },
        {
          name: "Presença",
          icon: faChalkboardTeacher,
          link: "/presenca-admin",
        },
        { name: "Alunos", icon: faUserPlus, link: "/alunos" },
        { name: "Lembretes", icon: faBell, link: "/lembretes-admin" },
      ];
    }
    return [];
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.userInfo}>
          {/* <Image
            className={styles.userImg}
            src={userImage}
            alt=""
            width={50}
            height={50}
          /> */}
          <div className={styles.userText}>
            <span className={styles.userName}>{user ? user.Nome : ""}</span>
            <span className={styles.userCourse}>
              {user
                ? user.Cargo == "Professor" || user.Cargo == "Secretaria"
                  ? user.Cargo
                  : userCurso
                : ""}
            </span>
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.adminMenu}>
            {getMenuItems().map((item) => (
              <li key={item.name} onClick={() => setActiveItem(item.name)}>
                <Link href={item.link}>
                  <span
                    className={`${styles.iconTextContainer} ${
                      router.pathname === item.link ? styles.active : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} size="1x" />
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
