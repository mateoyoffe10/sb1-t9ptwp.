'use client'; // Añade esta línea para convertirlo en un Client Component

import React, { useEffect, useState } from "react";

const Awards: React.FC = () => {
  const [randomPercentage, setRandomPercentage] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    // Obtener la fecha de la última actualización guardada
    const storedLastUpdated = localStorage.getItem('lastUpdated');
    const currentTime = new Date().getTime();

    if (storedLastUpdated) {
      // Si existe la fecha de la última actualización, convertirla a número
      const lastUpdatedDate = parseInt(storedLastUpdated, 10);

      // Calcular los días transcurridos desde la última actualización
      const daysPassed = (currentTime - lastUpdatedDate) / (1000 * 60 * 60 * 24);

      // Si han pasado 7 días o más, generar un nuevo porcentaje
      if (daysPassed >= 7) {
        const newPercentage = Math.floor(Math.random() * 101);
        setRandomPercentage(newPercentage);

        // Guardar el nuevo porcentaje y la nueva fecha de actualización
        localStorage.setItem('randomPercentage', newPercentage.toString());
        localStorage.setItem('lastUpdated', currentTime.toString());
      } else {
        // Si no han pasado 7 días, cargar el porcentaje guardado
        const savedPercentage = localStorage.getItem('randomPercentage');
        if (savedPercentage) {
          setRandomPercentage(parseInt(savedPercentage, 10));
        }
      }
    } else {
      // Si no hay fecha guardada, generar un porcentaje nuevo
      const newPercentage = Math.floor(Math.random() * 101);
      setRandomPercentage(newPercentage);

      // Guardar el porcentaje y la fecha de la primera actualización
      localStorage.setItem('randomPercentage', newPercentage.toString());
      localStorage.setItem('lastUpdated', currentTime.toString());
    }
  }, []);

  const styles = {
    container: {
      textAlign: "center",
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
      position: "relative",
    } as React.CSSProperties,
    backArrow: {
      cursor: "pointer",
      position: "absolute",
      top: "20px",
      left: "20px",
      fontSize: "44px",
      color: "#f48325",
    } as React.CSSProperties,
    header: {
      marginBottom: "2rem",
    } as React.CSSProperties,
    trophy: {
      width: "80px",
      height: "auto",
      marginBottom: "1rem",
      margin: "0 auto",
      display: "block",
    } as React.CSSProperties,
    title: {
      fontSize: "2.5rem",
      color: "#f48325",
    } as React.CSSProperties,
    description: {
      fontSize: "1rem",
      color: "#333",
      maxWidth: "600px",
      margin: "0 auto",
    } as React.CSSProperties,
    cardsContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      flexWrap: "wrap",
    } as React.CSSProperties,
    card: {
      border: "2px solid #f48325",
      borderRadius: "28px",
      padding: "3rem",
      width: "280px",
      textAlign: "center",
      marginLeft: "30px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    } as React.CSSProperties,
    name: {
      fontSize: "1.5rem",
      color: "#f48325",
      marginBottom: "0.5rem",
    } as React.CSSProperties,
    percentage: {
      fontSize: "1rem",
      color: "#333",
    } as React.CSSProperties,
  };

  // Función para regresar a la página anterior
  const goBack = () => {
    window.history.back();
  };

  return (
    <div style={styles.container}>
      {/* Flecha de regreso */}
      <span style={styles.backArrow} onClick={goBack}>
        ←
      </span>

      <header style={styles.header}>
        {/* Copa encima del título */}
        <img src="/premios.png" alt="Trophy" style={styles.trophy} />
        <h1 style={styles.title}>Premios</h1>
        <p style={styles.description}>
          Cada semana mostraremos las estadísticas de los usuarios que más avanzaron
          en el proceso para demostrar que nuestro servicio te puede ayudar a que
          tu vida sin humo comience hoy.
        </p>
      </header>
      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <h2 style={styles.name}>Martin Weissmann</h2>
          <p style={styles.percentage}>
            Redujo su porcentaje en un <strong>{randomPercentage}%</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Awards;
