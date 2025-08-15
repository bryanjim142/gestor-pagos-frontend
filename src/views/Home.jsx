
import React from 'react';
const Home = () => (<div className="container-fluid p-0">
    <div className="text-center bg-light" style={{ 
      backgroundImage: 'url(https://placehold.co/1920x600/a0d8ef/333333?text=Piscicola+El+Manantial)',
      height: '60vh', backgroundSize: 'cover', backgroundPosition: 'center' 
    }}>
      <div className="d-flex justify-content-center align-items-center h-100" style={{backgroundColor: 'rgba(0,0,0,0.4)'}}>
        <div className="text-white">
          <h1 className="display-4 fw-bold">Piscícola El Manantial</h1>
          <p className="lead">Calidad y frescura del agua a su mesa.</p>
        </div>
      </div>
    </div>
    <div className="container py-5">
      <h2 className="text-center mb-4">La mejor trucha, criada con pasión</h2>
      <p className="text-center text-muted">
        En nuestra piscícola combinamos técnicas tradicionales con tecnología para garantizar un producto de la más alta calidad,
        respetando el medio ambiente y asegurando el bienestar de nuestras truchas.
      </p>
    </div>
  </div>);
export default Home;