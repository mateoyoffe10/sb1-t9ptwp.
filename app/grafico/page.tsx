// pages/grafico.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Registra los elementos necesarios para Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Grafico: React.FC = () => {
  const router = useRouter();
  const [cigarrillosSemana, setCigarrillosSemana] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    // Recuperamos los datos desde la URL
    if (router.query.data) {
      setCigarrillosSemana(JSON.parse(router.query.data as string));
    }
  }, [router.query.data]);

  const data = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Cigarrillos fumados',
        data: cigarrillosSemana,
        backgroundColor: '#f49034',
        borderColor: '#f49034',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Cantidad de cigarrillos fumados por semana',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Días de la semana',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cigarrillos',
        },
        min: 0,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h1>Gráfico de Cigarrillos Semanal</h1>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Grafico;
