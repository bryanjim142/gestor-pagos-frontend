
//GESTOR NOMINA 
// src/components/PayrollModal.jsx (MODIFICADO)

import React, { useState, useEffect } from 'react';

// Se eliminó la prop 'employees' porque ya no es necesaria
const PayrollModal = ({ show, onHide, onSave, payrollItem }) => {
    const [formData, setFormData] = useState({});

    // Este useEffect se encarga de inicializar el formulario
    useEffect(() => {
        if (payrollItem) { // Modo Edición
            setFormData({ ...payrollItem });
        } else { // Modo Creación
            setFormData({
                // Ya no necesitamos IdEmpleado aquí, se añadirá en handleSave
                periodoPago: '',
                salarioBruto: 0,
                deducciones: 0,
                metodoPago: 'transferencia'
            });
        }
    }, [payrollItem]); // Se activa cuando payrollItem cambia

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Para los campos numéricos, convierte el valor a número
        const finalValue = e.target.type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!show) return null;

    return (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">{payrollItem ? 'Editar' : 'Agregar'} Registro de Nómina</h5>
                            <button type="button" className="btn-close" onClick={onHide}></button>
                        </div>
                        <div className="modal-body">
                            {/* SE ELIMINÓ EL SELECTOR DE EMPLEADOS */}
                            <div className="mb-3">
                                <label htmlFor="periodoPago" className="form-label">Periodo de Pago (ej. "Enero 2024")</label>
                                <input type="text" name="periodoPago" id="periodoPago" className="form-control" value={formData.periodoPago || ''} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="salarioBruto" className="form-label">Salario Bruto</label>
                                <input type="number" name="salarioBruto" id="salarioBruto" className="form-control" value={formData.salarioBruto || 0} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="deducciones" className="form-label">Deducciones</label>
                                <input type="number" name="deducciones" id="deducciones" className="form-control" value={formData.deducciones || 0} onChange={handleChange} required />
                            </div>
                             <div className="mb-3">
                                <label htmlFor="metodoPago" className="form-label">Método de Pago</label>
                                <select name="metodoPago" id="metodoPago" className="form-select" value={formData.metodoPago || 'transferencia'} onChange={handleChange} required>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="cheque">Cheque</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>Cancelar</button>
                            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PayrollModal;