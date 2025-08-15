import React from 'react';

const Footer = () => (
    <footer className="bg-dark text-white text-center p-3 mt-auto">
        <div className="container">
            <p>© {new Date().getFullYear()} Piscícola El Manantial. Todos los derechos reservados.</p>
        </div>
    </footer>
);

export default Footer;