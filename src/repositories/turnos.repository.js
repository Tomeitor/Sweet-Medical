let turnosDB = []; 

export const save = (nuevoTurno) => {
  turnosDB.push(nuevoTurno); 
  return nuevoTurno;
};


export const findByMedicoYFecha = (medicoId, fecha) => {
  return turnosDB.find(t => 
    t.medico.id === medicoId && 
    t.fechaHora.getTime() === fecha.getTime() &&
    t.estado !== 'CANCELADO'
  );
};

//busca un turno por su ID
export const findById = (id) => {
  return turnosDB.find(t => t.id === id);
};

//reemplaza el turno viejo por el nuevo con los datos actualizados
export const update = (turnoActualizado) => {
  const indice = turnosDB.findIndex(t => t.id === turnoActualizado.id);
    
  if (indice !== -1) {
    turnosDB[indice] = turnoActualizado;
    return turnosDB[indice];
  }
    
  return null;
};