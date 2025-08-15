
import React from 'react';

const ReceiptHistory = ({ receipts, onSelectReceipt }) => {
  return (
    <div className="card">
      <div className="card-header bg-white border-0 d-flex align-items-center">
        <i className="bi bi-journal-text text-success me-2 fs-5"></i>
        <h4 className="mb-0 fw-bold">Mis Recibos de Pago</h4>
      </div>
      <div className="card-body">
        {receipts.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Recibo N°</th>
                  <th>Fecha de Emisión</th>
                  <th>Periodo de Pago</th>
                  <th>Salario Neto</th>
                  <th className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map(receipt => (
                  <tr key={receipt.idRecibo}>
                    <td>{receipt.idRecibo}</td>
                    <td>{new Date(receipt.fechaEmision).toLocaleDateString()}</td>
                    <td>{receipt.periodoPago}</td>
                    <td className="fw-semibold">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(receipt.salarioNeto)}
                    </td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onSelectReceipt(receipt.idRecibo)}
                      >
                        <i className="bi bi-eye-fill me-1"></i> Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted">Aún no tienes recibos de pago registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptHistory;