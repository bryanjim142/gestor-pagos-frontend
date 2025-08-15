
import React from 'react';
import { initialData } from '../data/initialData';
const Products = () => (
    <div className="container py-5">
        <h2 className="text-center mb-5">Catálogo de Productos</h2>
        <div className="row g-4">
            {initialData.productos.map(producto => (
                <div className="col-md-4" key={producto.id}>
                    <div className="card h-100 shadow-sm">
                        <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{producto.nombre}</h5>
                            <p className="card-text flex-grow-1">{producto.descripcion}</p>
                            <p className="card-text text-end fw-bold fs-5 text-primary">{producto.precio}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default Products;