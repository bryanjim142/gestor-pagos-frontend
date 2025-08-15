
// RECIBOS

import React, { useState, useEffect } from 'react';
import { api } from '../api/apiService'; // Importamos la api

// Recibe receiptId, el objeto del empleado, y la función para volver
const PaymentReceipt = ({ receiptId, employee, onBack }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Si no hay receiptId, no hacemos nada
        if (!receiptId) return;

        const fetchDetails = async () => {
            try {
                setLoading(true);
                // Usamos la nueva función de la API
                const data = await api.getReceiptDetails(receiptId);
                setDetails(data);
            } catch (err) {
                setError('No se pudieron cargar los detalles del recibo.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [receiptId]); // Se ejecuta cada vez que el receiptId cambie

    if (loading) return <p className="text-center mt-5">Cargando detalles del recibo...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!details) return null; // No renderiza nada si no hay detalles

    // 'details' ahora contiene el recibo y su historial (ej. details.recibo y details.historial)
    const { recibo, historialCambios } = details;

    return (
        <div className="container py-5" style={{ maxWidth: '800px' }}>
            <button className="btn btn-outline-secondary mb-3" onClick={onBack}><i className="bi bi-arrow-left me-2"></i>Volver al Historial</button>
            
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white text-center">
                    <h3>Recibo de Pago</h3>
                </div>
                <div className="card-body p-4">
                    {/* ... (Sección de información de la empresa y del recibo) ... */}
                    <div className="row mb-4">
                        <div className="col-6">
                            <h5>Piscícola El Manantial</h5>
                        </div>
                        <div className="col-6 text-end">
                            <p className="mb-0"><strong>Recibo N°:</strong> {recibo.IdRecibo}</p>
                            <p className="mb-0"><strong>Fecha Emisión:</strong> {new Date(recibo.FechaEmision).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* ... (Sección de información del empleado, usa el prop 'employee') ... */}
                    <h5 className="border-bottom pb-2 mb-3">Información del Empleado</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Nombre:</strong> {employee.Nombre} {employee.Apellido}</p>
                            <p><strong>Cargo:</strong> {employee.Cargo}</p>
                        </div>
                    </div>

                    {/* ... (Sección de detalle de pago, usa los datos de 'recibo') ... */}
                    <h5 className="border-bottom pb-2 mt-4 mb-3">Detalle de Pago</h5>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Salario Bruto</td>
                                <td className="text-end">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(recibo.SalarioBruto)}</td>
                            </tr>
                            <tr>
                                <td>Deducciones</td>
                                <td className="text-end text-danger">-{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(recibo.Deducciones)}</td>
                            </tr>
                            <tr className="table-primary fw-bold">
                                <td>Salario Neto a Pagar</td>
                                <td className="text-end">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(recibo.SalarioNeto)}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* --- NUEVA SECCIÓN: HISTORIAL DE CAMBIOS --- */}
                    {historialCambios && historialCambios.length > 0 && (
                        <>
                            <h5 className="border-bottom pb-2 mt-4 mb-3">Historial de Cambios del Recibo</h5>
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Responsable</th>
                                            <th>Cambio Realizado</th>
                                            <th>Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historialCambios.map(h => (
                                            <tr key={h.IdHistorial}>
                                                <td>{new Date(h.FechaCambio).toLocaleString()}</td>
                                                <td>{h.NombreUsuarioResponsable}</td>
                                                <td>De '{h.EstadoAnterior}' a '{h.EstadoNuevo}'</td>
                                                <td>{h.Observaciones}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentReceipt;