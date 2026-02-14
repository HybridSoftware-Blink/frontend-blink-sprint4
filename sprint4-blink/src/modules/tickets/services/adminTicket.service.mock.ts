import type { 
  AdminTicket, 
  UpdateTicketData, 
  AdminTicketsResponse,
  TicketMessage,
  CreateMessageData
} from '../types/adminTicket.types';
import { mockTickets, incrementMessageId, saveMockTickets } from './mockData';

export const adminTicketServiceMock = {
  /**
   * Obtener lista de tickets (admin MOCK)
   */
  async getTickets(page: number = 1, perPage: number = 10): Promise<AdminTicketsResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: [...mockTickets],
      meta: {
        current_page: page,
        from: 1,
        last_page: 1,
        per_page: perPage,
        to: mockTickets.length,
        total: mockTickets.length,
      },
    };
  },

  /**
   * Obtener ticket por ID (MOCK)
   */
  async getTicketById(id: number): Promise<AdminTicket> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ticket = mockTickets.find(t => t.id === id);
    if (!ticket) {
      throw {
        message: 'tickets.errors.notFound',
        status: 404,
      };
    }
    return ticket;
  },

  /**
   * Actualizar ticket (MOCK)
   */
  async updateTicket(id: number, data: UpdateTicketData): Promise<AdminTicket> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const ticket = mockTickets.find(t => t.id === id);
    if (!ticket) {
      throw {
        message: 'tickets.errors.notFound',
        status: 404,
      };
    }

    // Actualizar ticket
    ticket.asunto = data.asunto ?? ticket.asunto;
    ticket.descripcion = data.descripcion ?? ticket.descripcion;
    ticket.estado = data.estado ?? ticket.estado;
    ticket.updated_at = new Date().toISOString();

    saveMockTickets();
    return ticket;
  },

  /**
   * Eliminar ticket (MOCK)
   */
  async deleteTicket(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockTickets.findIndex(t => t.id === id);
    if (index === -1) {
      throw {
        message: 'tickets.errors.notFound',
        status: 404,
      };
    }
    mockTickets.splice(index, 1);
    saveMockTickets();
  },

  /**
   * Buscar tickets (MOCK)
   */
  async searchTickets(query: string): Promise<AdminTicket[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const q = query.toLowerCase();
    return mockTickets.filter((t: AdminTicket) =>
      (t.asunto && t.asunto.toLowerCase().includes(q)) ||
      (t.descripcion && t.descripcion.toLowerCase().includes(q)) ||
      (t.usuario_nombre && t.usuario_nombre.toLowerCase().includes(q)) ||
      (t.usuario_email && t.usuario_email.toLowerCase().includes(q))
    );
  },

  /**
   * Enviar mensaje al ticket (MOCK)
   */
  async sendMessage(ticketId: number, data: CreateMessageData): Promise<TicketMessage> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw {
        message: 'tickets.errors.notFound',
        status: 404,
      };
    }

    const newMessage: TicketMessage = {
      id: incrementMessageId(),
      ticket_id: ticketId,
      usuario_id: 0, // Admin
      mensaje: data.mensaje,
      is_admin: true,
      created_at: new Date().toISOString(),
    };

    if (!ticket.mensajes) {
      ticket.mensajes = [];
    }
    ticket.mensajes.push(newMessage);
    ticket.updated_at = new Date().toISOString();

    saveMockTickets();
    return newMessage;
  },
};
