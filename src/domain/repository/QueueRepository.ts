export interface QueueRepository {
    sendMessage(message: any): Promise<void>;  // Método para enviar mensajes a la cola
  }