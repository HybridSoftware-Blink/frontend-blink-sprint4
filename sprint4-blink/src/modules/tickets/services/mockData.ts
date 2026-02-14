import type { AdminTicket } from '../types/adminTicket.types';

const STORAGE_KEY = 'blink_mock_tickets';
const TICKET_ID_KEY = 'blink_next_ticket_id';
const MESSAGE_ID_KEY = 'blink_next_message_id';

// Cargar datos desde localStorage
function loadFromStorage(): AdminTicket[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tickets from localStorage:', error);
    return [];
  }
}

// Guardar datos en localStorage
function saveToStorage(tickets: AdminTicket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (error) {
    console.error('Error saving tickets to localStorage:', error);
  }
}

// Cargar contadores desde localStorage
function loadCounter(key: string, defaultValue: number): number {
  try {
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

// Guardar contador en localStorage
function saveCounter(key: string, value: number): void {
  try {
    localStorage.setItem(key, value.toString());
  } catch (error) {
    console.error('Error saving counter to localStorage:', error);
  }
}

// Datos mock compartidos entre servicios de usuario y admin
// Se cargan desde localStorage para persistir entre recargas
export const mockTickets: AdminTicket[] = loadFromStorage();

export let nextTicketId = loadCounter(TICKET_ID_KEY, 1);
export let nextMessageId = loadCounter(MESSAGE_ID_KEY, 1);

export function incrementTicketId(): number {
  const id = nextTicketId++;
  saveCounter(TICKET_ID_KEY, nextTicketId);
  return id;
}

export function incrementMessageId(): number {
  const id = nextMessageId++;
  saveCounter(MESSAGE_ID_KEY, nextMessageId);
  return id;
}

// Función para guardar los tickets después de modificarlos
export function saveMockTickets(): void {
  saveToStorage(mockTickets);
}
