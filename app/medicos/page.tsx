'use client'; // Añade esta línea para convertirlo en un Client Component


import React from 'react';

const DoctorProfile: React.FC = () => {
  const doctors = [
    {
      name: 'Dr. Martín Masdeu',
      phone: '011 15-5094-2107',
      image: '/martin.png', // Coloca la URL de la imagen
      doctoraliaUrl:
        'https://www.doctoraliar.com/martin-masdeu/neumonologo/capital-federal#profile-pricing',
    },
    {
      name: 'Dr. Hernan Vasilo Vigil',
      phone: '011 2390-6220',
      image: '/hernan.png', // Coloca la URL de la imagen
      doctoraliaUrl:
        'https://www.doctoraliar.com/hernan-basilo-vigil/neumonologo/capital-federal#address-id=136005&is-online-only=false&filters%5Bspecializations%5D%5B%5D=44',
    },
   
  ];

  // Función para regresar a la página anterior
  const goBack = () => {
    window.history.back();
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      {/* Flecha de regreso */}
      <span
        style={{
          cursor: 'pointer',
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '44px',
          color: '#f49034',
          background: 'none', // Sin fondo
          border: 'none', // Sin borde
          padding: 0, // Sin padding
        }}
        onClick={goBack}
      >
        ←
      </span>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Conoce a nuestros médicos profesionales
      </h1>
      <p style={{ fontSize: '16px', marginBottom: '20px' }}>
        En QS sabemos que el proceso de dejar de fumar es complicado y que puede
        llegar a requerir de ayuda médica profesional, por lo que dejamos el
        contacto de los mejores neumonólogos que hay.
      </p>
      {doctors.map((doctor, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '400px',
            margin: '20px auto',
          }}
        >
          <img
            src={doctor.image}
            alt={doctor.name}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '15px',
            }}
          />
          <div>
            <h2 style={{ fontSize: '18px', margin: '0' }}>{doctor.name}</h2>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              Contacto:{' '}
              <a href={`tel:${doctor.phone}`} style={{ color: '#007bff' }}>
                {doctor.phone}
              </a>
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              Página con información:{' '}
              <a
                href={doctor.doctoraliaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007bff' }}
              >
                Doctoralia
              </a>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorProfile;
