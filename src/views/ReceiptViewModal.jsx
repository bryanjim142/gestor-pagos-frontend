
//GESTOR DE RECIBOS 

import React from 'react';

const ReceiptViewModal = ({ show, onHide, receipt }) => {
    if (!show || !receipt) return null;

    const printReceipt = () => {
        const printContent = document.getElementById('receipt-content').innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); 
    };

    const formatCurrency = (value) => {
        // Asegura que el valor sea un número válido antes de formatearlo
        const numericValue = typeof value === 'number' ? value : 0;
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(numericValue);
    };

    return (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Recibo de Pago - {receipt.employee?.nombre} {receipt.employee?.apellido}</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body" id="receipt-content">
                        <div className="p-4 border rounded">
                            <div className="text-center mb-4">
                                <h2 className="mb-1">Piscicola El Manantial</h2>
                                <p className="text-muted">Recibo de Salario</p>
                                <hr />
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-6">
                                    <strong>Empleado:</strong> {receipt.employee?.nombre} {receipt.employee?.apellido}
                                </div>
                                <div className="col-sm-6 text-sm-end">
                                    <strong>ID Recibo:</strong> {receipt.idRecibo}
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-sm-6">
                                    <strong>ID Nómina:</strong> {receipt.idNomina}
                                </div>
                                <div className="col-sm-6 text-sm-end">
                                    <strong>Periodo de Pago:</strong> {receipt.periodoPago}
                                </div>
                            </div>
                            <h5 className="mb-3">Detalles de Pago</h5>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td>Salario Bruto</td>
                                            <td className="text-end">{formatCurrency(receipt.salarioBruto)}</td>
                                        </tr>
                                        <tr>
                                            <td>Deducciones</td>
                                            <td className="text-end">-{formatCurrency(receipt.deducciones)}</td>
                                        </tr>
                                        <tr className="fw-bold">
                                            <td>Salario Neto</td>
                                            <td className="text-end">{formatCurrency(receipt.salarioNeto)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onHide}>Cerrar</button>
                        <button type="button" className="btn btn-primary" onClick={printReceipt}>Imprimir</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptViewModal;