export class EventLog {
    constructor(
      public date: string,        // Fecha del evento
      public description: string, // Descripción del evento
      public type: string         // Tipo de evento (por ejemplo, API o FORM)
    ) {}
  
    // Aquí podrías agregar validaciones o lógica adicional relacionada con la entidad
  }
  