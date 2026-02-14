import type { 
  Ticket, 
  CreateTicketData, 
  TicketsResponse,
  TicketMessage,
  CreateMessageData
} from '../types/ticket.types';
import { mockTickets, incrementTicketId, incrementMessageId, saveMockTickets } from './mockData';

export const ticketServiceMock = {
  /**
   * Obtener lista de tickets del usuario autenticado (MOCK)
   */
  async getUserTickets(page: number = 1, perPage: number = 10): Promise<TicketsResponse> {
    // Simular delay de red
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
   * Crear un nuevo ticket (MOCK)
   */
  async createTicket(data: CreateTicketData): Promise<Ticket> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTicket: any = {
      id: incrementTicketId(),
      usuario_id: 0,
      asunto: data.asunto || '',
      descripcion: data.descripcion || '',
      estado: 'pendiente',
      usuario_nombre: '',
      usuario_email: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      mensajes: [],
    };
    
    mockTickets.unshift(newTicket);
    saveMockTickets();
    return newTicket;
  },

  /**
   * Obtener un ticket por ID (MOCK)
   */
  async getTicketById(id: number): Promise<Ticket> {
    // Simular delay de red
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
   * Buscar tickets por asunto/descripcion/fecha (MOCK)
   */
  async searchTickets(query: string): Promise<Ticket[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const q = query.toLowerCase();
    return mockTickets.filter((t: Ticket) =>
      (t.asunto && t.asunto.toLowerCase().includes(q)) ||
      (t.descripcion && t.descripcion.toLowerCase().includes(q))
    );
  },

  /**
   * Enviar mensaje al ticket (MOCK - usuario)
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
      usuario_id: 1, // Usuario
      mensaje: data.mensaje,
      is_admin: false,
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
