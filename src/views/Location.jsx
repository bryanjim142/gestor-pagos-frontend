// src/views/Location.jsx
import React from 'react';
const Location = () => (
  <div className="container py-5">
    <h2 className="text-center mb-4">Encuéntranos</h2>
    <div className="row">
      <div className="col-md-6">
        <h3>Contacto y Dirección</h3>
        <ul className="list-unstyled">
          <li className="mb-2"><i className="bi bi-geo-alt-fill me-2 text-primary"></i> Vereda El Encanto, Finca El Manantial, Guatavita, Cundinamarca</li>
          <li className="mb-2"><i className="bi bi-telephone-fill me-2 text-primary"></i> (+57) 300 123 4567</li>
          <li className="mb-2"><i className="bi bi-envelope-fill me-2 text-primary"></i> ventas@piscicolaelmanantial.com</li>
          <li className="mb-2"><i className="bi bi-clock-fill me-2 text-primary"></i> Lunes a Sábado: 8:00 AM - 5:00 PM</li>
        </ul>
      </div>
      <div className="col-md-6">
        <div className="ratio ratio-16x9">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15897.643960144983!2d-73.8407425128418!3d4.921312399999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e407c0a6b7d3e3b%3A0x8e5f8f8f2b3b6b3e!2sGuatavita%2C%20Cundinamarca!5e0!3m2!1ses-419!2sco!4v1678886400000!5m2!1ses-419!2sco"
            title="Ubicación de la Piscícola"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded shadow"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
);

export default Location;
