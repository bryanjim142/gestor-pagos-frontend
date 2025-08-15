
export const initialData = {
  usuarios: [
    { IdUsuario: 'admin01', NombreUsuario: 'admin', Contraseña: '123', TipoUsuario: 'admin' },
    { IdUsuario: 'emp01', NombreUsuario: 'juanp', Contraseña: '123', TipoUsuario: 'empleado' },
    { IdUsuario: 'emp02', NombreUsuario: 'anag', Contraseña: '123', TipoUsuario: 'empleado' },
  ],
  empleados: [
    { IdEmpleado: 'E001', IdUsuario: 'emp01', Nombre: 'Juan', Apellido: 'Pérez', CorreoElectronico: 'juan.perez@email.com', Telefono: '3101234567', Cargo: 'Operario de Piscina', FechaContratacion: '2023-01-15', SalarioBase: 2800000, Estado: 'activo' },
    { IdEmpleado: 'E002', IdUsuario: 'emp02', Nombre: 'Ana', Apellido: 'García', CorreoElectronico: 'ana.garcia@email.com', Telefono: '3207654321', Cargo: 'Empacadora', FechaContratacion: '2022-06-20', SalarioBase: 2650000, Estado: 'activo' },
  ],
  nomina: [
    { IdNomina: 'N001', IdEmpleado: 'E001', PeriodoPago: 'Mensual', SalarioBruto: 2800000, Deducciones: 320000, MetodoPago: 'transferencia', Detalles: 'Pago de Enero' },
    { IdNomina: 'N002', IdEmpleado: 'E002', PeriodoPago: 'Mensual', SalarioBruto: 2650000, Deducciones: 300000, MetodoPago: 'transferencia', Detalles: 'Pago de Enero' },
    { IdNomina: 'N003', IdEmpleado: 'E001', PeriodoPago: 'Mensual', SalarioBruto: 2800000, Deducciones: 320000, MetodoPago: 'transferencia', Detalles: 'Pago de Febrero' },
  ],
  recibosPago: [
    { IdRecibo: 'R001', IdNomina: 'N001', FechaEmision: '2024-01-30', DetallePago: 'Pago correspondiente al mes de Enero.', EstadoRecibo: 'pagado' },
    { IdRecibo: 'R002', IdNomina: 'N002', FechaEmision: '2024-01-30', DetallePago: 'Pago correspondiente al mes de Enero.', EstadoRecibo: 'pagado' },
    { IdRecibo: 'R003', IdNomina: 'N003', FechaEmision: '2024-02-28', DetallePago: 'Pago correspondiente al mes de Febrero.', EstadoRecibo: 'emitido' },
  ],
  productos: [
    { id: 1, nombre: 'Trucha Arcoíris Fresca', descripcion: 'Entera y eviscerada, lista para preparar. Ideal para asar o freír.', precio: '18,000 COP/kg', imagen: 'https://placehold.co/600x400/2299dd/ffffff?text=Trucha+Fresca' },
    { id: 2, nombre: 'Filete de Trucha', descripcion: 'Filetes sin piel ni espinas, perfectos para preparaciones gourmet.', precio: '25,000 COP/kg', imagen: 'https://placehold.co/600x400/55aadd/ffffff?text=Filete+de+Trucha' },
    { id: 3, nombre: 'Trucha Ahumada', descripcion: 'Exquisita trucha ahumada en frío, lista para consumir en ensaladas o aperitivos.', precio: '35,000 COP/kg', imagen: 'https://placehold.co/600x400/88ccff/ffffff?text=Trucha+Ahumada' },
  ]
};