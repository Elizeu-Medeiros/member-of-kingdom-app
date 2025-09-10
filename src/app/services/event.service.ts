import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

// Interfaces
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  type: EventType;
  status: EventStatus;
  maxAttendees?: number;
  currentAttendees: number;
  organizer: {
    id: number;
    name: string;
    email: string;
  };
  requirements?: string[];
  materials?: string[];
  image?: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  attendees: EventAttendee[];
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendee {
  id: number;
  memberId: number;
  memberName: string;
  memberEmail?: string;
  status: AttendeeStatus;
  checkedIn: boolean;
  checkInTime?: string;
  notes?: string;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalAttendees: number;
  averageAttendance: number;
  eventsByType: { [key: string]: number };
  monthlyEvents: { month: string; count: number }[];
  popularEvents: { title: string; attendees: number }[];
}

export type EventType = 'culto' | 'estudo' | 'reuniao' | 'evento-especial' | 'jovens' | 'criancas' | 'casamento' | 'funeral' | 'conferencia' | 'outro';

export type EventStatus = 'planned' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'postponed';

export type AttendeeStatus = 'confirmed' | 'pending' | 'declined' | 'maybe';

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export interface EventFilters {
  type?: EventType;
  status?: EventStatus;
  dateRange?: { start: string; end: string };
  location?: string;
  organizer?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // Dados mockados
  private mockEvents: Event[] = [
    {
      id: '1',
      title: 'Culto Dominical',
      description: 'Culto de adoração e pregação da palavra de Deus',
      date: this.getDateString(2), // Daqui a 2 dias
      startTime: '09:00',
      endTime: '11:00',
      location: 'Santuário Principal',
      type: 'culto',
      status: 'confirmed',
      maxAttendees: 200,
      currentAttendees: 180,
      organizer: {
        id: 1,
        name: 'Pastor João Silva',
        email: 'joao@igreja.com'
      },
      requirements: ['Chegada 30min antes', 'Participação no louvor'],
      materials: ['Bíblia', 'Hinário'],
      image: 'assets/images/events/culto-dominical.jpg',
      isRecurring: true,
      recurringPattern: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [0] // Domingo
      },
      attendees: [
        {
          id: 5,
          memberId: 6,
          memberName: 'Sofia Almeida',
          memberEmail: 'sofia@email.com',
          status: 'confirmed',
          checkedIn: false
        }
      ],
      createdAt: '2024-01-01T07:00:00Z',
      updatedAt: '2024-11-15T07:30:00Z'
    },
    {
      id: '5',
      title: 'Conferência Anual - "Avivamento"',
      description: 'Conferência anual da igreja com preletores especiais',
      date: this.getDateString(15), // Daqui a 15 dias
      startTime: '18:00',
      endTime: '22:00',
      location: 'Santuário Principal + Transmissão Online',
      type: 'conferencia',
      status: 'planned',
      maxAttendees: 300,
      currentAttendees: 85,
      organizer: {
        id: 1,
        name: 'Pastor João Silva',
        email: 'joao@igreja.com'
      },
      requirements: ['Inscrição obrigatória', 'Chegada 1h antes'],
      materials: ['Material será fornecido', 'Caderno de anotações'],
      image: 'assets/images/events/conferencia.jpg',
      isRecurring: true,
      recurringPattern: {
        frequency: 'yearly',
        interval: 1
      },
      attendees: [],
      createdAt: '2024-10-01T12:00:00Z',
      updatedAt: '2024-11-14T15:45:00Z'
    },
    {
      id: '6',
      title: 'Reunião de Líderes',
      description: 'Reunião mensal de liderança para planejamento e oração',
      date: this.getDateString(7), // Daqui a 7 dias
      startTime: '14:00',
      endTime: '16:00',
      location: 'Sala de Reuniões',
      type: 'reuniao',
      status: 'confirmed',
      maxAttendees: 15,
      currentAttendees: 12,
      organizer: {
        id: 1,
        name: 'Pastor João Silva',
        email: 'joao@igreja.com'
      },
      requirements: ['Apenas líderes', 'Pontualidade essencial'],
      materials: ['Agenda será enviada por email'],
      image: 'assets/images/events/reuniao-lideres.jpg',
      isRecurring: true,
      recurringPattern: {
        frequency: 'monthly',
        interval: 1,
        dayOfMonth: 15
      },
      attendees: [
        {
          id: 6,
          memberId: 2,
          memberName: 'Pedro Oliveira',
          memberEmail: 'pedro@email.com',
          status: 'confirmed',
          checkedIn: false
        },
        {
          id: 7,
          memberId: 8,
          memberName: 'Carla Rodrigues',
          memberEmail: 'carla@email.com',
          status: 'confirmed',
          checkedIn: false
        }
      ],
      createdAt: '2024-01-01T13:00:00Z',
      updatedAt: '2024-11-13T09:15:00Z'
    }
  ];

  private mockStats: EventStats = {
    totalEvents: 156,
    upcomingEvents: 8,
    completedEvents: 142,
    cancelledEvents: 6,
    totalAttendees: 2840,
    averageAttendance: 18.2,
    eventsByType: {
      'culto': 52,
      'estudo': 28,
      'reuniao': 24,
      'jovens': 18,
      'evento-especial': 12,
      'criancas': 16,
      'conferencia': 4,
      'outro': 2
    },
    monthlyEvents: [
      { month: 'Jan', count: 22 },
      { month: 'Fev', count: 18 },
      { month: 'Mar', count: 26 },
      { month: 'Abr', count: 20 },
      { month: 'Mai', count: 24 },
      { month: 'Jun', count: 28 }
    ],
    popularEvents: [
      { title: 'Culto Dominical', attendees: 180 },
      { title: 'Estudo Bíblico', attendees: 45 },
      { title: 'Conferência Anual', attendees: 320 },
      { title: 'Reunião de Jovens', attendees: 32 }
    ]
  };

  // BehaviorSubjects para estado reativo
  private eventsSubject = new BehaviorSubject<Event[]>(this.mockEvents);
  private statsSubject = new BehaviorSubject<EventStats>(this.mockStats);

  // Observables públicos
  public events$ = this.eventsSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();

  constructor() {
    console.log('✅ EventService inicializado com dados mock');
  }

  /**
   * Função auxiliar para gerar datas futuras
   */
  private getDateString(daysFromNow: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  /**
   * CRUD OPERATIONS - MOCKADOS
   */

  /**
   * Listar todos os eventos
   */
  getEvents(filters?: EventFilters): Observable<Event[]> {
    console.log('📅 Buscando eventos...', filters);

    let filteredEvents = [...this.mockEvents];

    if (filters) {
      if (filters.type) {
        filteredEvents = filteredEvents.filter(e => e.type === filters.type);
      }
      if (filters.status) {
        filteredEvents = filteredEvents.filter(e => e.status === filters.status);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(e =>
          e.title.toLowerCase().includes(searchTerm) ||
          e.description?.toLowerCase().includes(searchTerm) ||
          e.location?.toLowerCase().includes(searchTerm)
        );
      }
      if (filters.dateRange) {
        filteredEvents = filteredEvents.filter(e =>
          e.date >= filters.dateRange!.start && e.date <= filters.dateRange!.end
        );
      }
    }

    return of(filteredEvents).pipe(
      delay(400),
      map(events => {
        this.eventsSubject.next(events);
        return events;
      })
    );
  }

  /**
   * Obter evento por ID
   */
  getEvent(id: string): Observable<Event> {
    console.log('🎯 Buscando evento ID:', id);

    const event = this.mockEvents.find(e => e.id === id);

    if (!event) {
      return throwError(() => new Error('Evento não encontrado'));
    }

    return of(event).pipe(delay(300));
  }

  /**
   * Criar novo evento
   */
  createEvent(eventData: Partial<Event>): Observable<Event> {
    console.log('➕ Criando novo evento:', eventData);

    const newEvent: Event = {
      id: (Math.max(...this.mockEvents.map(e => parseInt(e.id))) + 1).toString(),
      title: eventData.title || '',
      description: eventData.description,
      date: eventData.date || new Date().toISOString().split('T')[0],
      startTime: eventData.startTime || '09:00',
      endTime: eventData.endTime,
      location: eventData.location,
      type: eventData.type || 'outro',
      status: eventData.status || 'planned',
      maxAttendees: eventData.maxAttendees,
      currentAttendees: 0,
      organizer: eventData.organizer || {
        id: 1,
        name: 'Sistema',
        email: 'sistema@igreja.com'
      },
      requirements: eventData.requirements || [],
      materials: eventData.materials || [],
      image: eventData.image,
      isRecurring: eventData.isRecurring || false,
      recurringPattern: eventData.recurringPattern,
      attendees: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockEvents.push(newEvent);
    this.updateStats();

    return of(newEvent).pipe(delay(600));
  }

  /**
   * Atualizar evento
   */
  updateEvent(id: string, eventData: Partial<Event>): Observable<Event> {
    console.log('✏️ Atualizando evento ID:', id, eventData);

    const index = this.mockEvents.findIndex(e => e.id === id);

    if (index === -1) {
      return throwError(() => new Error('Evento não encontrado'));
    }

    const updatedEvent = {
      ...this.mockEvents[index],
      ...eventData,
      updatedAt: new Date().toISOString()
    };

    this.mockEvents[index] = updatedEvent;
    this.updateStats();

    return of(updatedEvent).pipe(delay(500));
  }

  /**
   * Deletar evento
   */
  deleteEvent(id: string): Observable<void> {
    console.log('🗑️ Deletando evento ID:', id);

    const index = this.mockEvents.findIndex(e => e.id === id);

    if (index === -1) {
      return throwError(() => new Error('Evento não encontrado'));
    }

    this.mockEvents.splice(index, 1);
    this.updateStats();

    return of(void 0).pipe(delay(400));
  }

  /**
   * EVENTOS ESPECÍFICOS - MOCKADOS
   */

  /**
   * Próximos eventos
   */
  getUpcomingEvents(limit: number = 10): Observable<Event[]> {
    console.log('📆 Buscando próximos eventos...');

    const today = new Date().toISOString().split('T')[0];

    const upcomingEvents = this.mockEvents
      .filter(e => e.date >= today && e.status !== 'cancelled')
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit);

    return of(upcomingEvents).pipe(delay(300));
  }

  /**
   * Eventos de hoje
   */
  getTodayEvents(): Observable<Event[]> {
    console.log('📅 Buscando eventos de hoje...');

    const today = new Date().toISOString().split('T')[0];

    const todayEvents = this.mockEvents.filter(e => e.date === today);

    return of(todayEvents).pipe(delay(250));
  }

  /**
   * Eventos por período
   */
  getEventsByDateRange(startDate: string, endDate: string): Observable<Event[]> {
    console.log('📊 Buscando eventos por período:', startDate, 'até', endDate);

    const events = this.mockEvents.filter(e =>
      e.date >= startDate && e.date <= endDate
    );

    return of(events).pipe(delay(400));
  }

  /**
   * PARTICIPANTES E CHECK-IN - MOCKADOS
   */

  /**
   * Adicionar participante ao evento
   */
  addAttendee(eventId: string, memberId: number, status: AttendeeStatus = 'confirmed'): Observable<EventAttendee> {
    console.log('👤 Adicionando participante:', eventId, memberId);

    const event = this.mockEvents.find(e => e.id === eventId);
    if (!event) {
      return throwError(() => new Error('Evento não encontrado'));
    }

    const newAttendee: EventAttendee = {
      id: Math.max(0, ...event.attendees.map(a => a.id)) + 1,
      memberId,
      memberName: `Membro ${memberId}`,
      memberEmail: `membro${memberId}@email.com`,
      status,
      checkedIn: false
    };

    event.attendees.push(newAttendee);
    event.currentAttendees = event.attendees.length;

    return of(newAttendee).pipe(delay(400));
  }

  /**
   * Fazer check-in de participante
   */
  checkInAttendee(eventId: string, attendeeId: number): Observable<EventAttendee> {
    console.log('✅ Check-in participante:', eventId, attendeeId);

    const event = this.mockEvents.find(e => e.id === eventId);
    if (!event) {
      return throwError(() => new Error('Evento não encontrado'));
    }

    const attendee = event.attendees.find(a => a.id === attendeeId);
    if (!attendee) {
      return throwError(() => new Error('Participante não encontrado'));
    }

    attendee.checkedIn = true;
    attendee.checkInTime = new Date().toISOString();

    return of(attendee).pipe(delay(300));
  }

  /**
   * ESTATÍSTICAS - MOCKADAS
   */

  /**
   * Obter estatísticas dos eventos
   */
  getEventStats(): Observable<EventStats> {
    console.log('📊 Carregando estatísticas dos eventos...');

    return of(this.mockStats).pipe(
      delay(400),
      map(stats => {
        this.statsSubject.next(stats);
        return stats;
      })
    );
  }

  /**
   * Relatório de presença
   */
  getAttendanceReport(eventId: string): Observable<any> {
    console.log('📋 Gerando relatório de presença:', eventId);

    const event = this.mockEvents.find(e => e.id === eventId);
    if (!event) {
      return throwError(() => new Error('Evento não encontrado'));
    }

    const report = {
      eventId,
      eventTitle: event.title,
      totalAttendees: event.attendees.length,
      checkedInCount: event.attendees.filter(a => a.checkedIn).length,
      attendanceRate: event.attendees.length > 0
        ? (event.attendees.filter(a => a.checkedIn).length / event.attendees.length) * 100
        : 0,
      attendees: event.attendees
    };

    return of(report).pipe(delay(500));
  }

  /**
   * FUNÇÕES AUXILIARES - MOCKADAS
   */

  /**
   * Buscar eventos
   */
  searchEvents(term: string): Observable<Event[]> {
    console.log('🔍 Buscando eventos por termo:', term);

    if (!term.trim()) {
      return this.getEvents();
    }

    const searchTerm = term.toLowerCase();
    const results = this.mockEvents.filter(e =>
      e.title.toLowerCase().includes(searchTerm) ||
      e.description?.toLowerCase().includes(searchTerm) ||
      e.location?.toLowerCase().includes(searchTerm)
    );

    return of(results).pipe(delay(300));
  }

  /**
   * Duplicar evento
   */
  duplicateEvent(eventId: string, newDate: string): Observable<Event> {
    console.log('📋 Duplicando evento:', eventId, 'para', newDate);

    const originalEvent = this.mockEvents.find(e => e.id === eventId);
    if (!originalEvent) {
      return throwError(() => new Error('Evento não encontrado'));
    }

    const duplicatedEvent: Event = {
      ...originalEvent,
      id: (Math.max(...this.mockEvents.map(e => parseInt(e.id))) + 1).toString(),
      date: newDate,
      attendees: [], // Novo evento sem participantes
      currentAttendees: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockEvents.push(duplicatedEvent);

    return of(duplicatedEvent).pipe(delay(600));
  }

  /**
   * Atualizar status do evento
   */
  updateEventStatus(id: string, status: EventStatus): Observable<Event> {
    console.log('🔄 Atualizando status do evento:', id, status);

    return this.updateEvent(id, { status });
  }

  /**
   * MÉTODOS AUXILIARES
   */

  /**
   * Atualizar estatísticas baseado nos dados atuais
   */
  private updateStats(): void {
    const today = new Date().toISOString().split('T')[0];

    const upcomingEvents = this.mockEvents.filter(e =>
      e.date >= today && e.status !== 'cancelled'
    ).length;

    const completedEvents = this.mockEvents.filter(e =>
      e.status === 'completed'
    ).length;

    const cancelledEvents = this.mockEvents.filter(e =>
      e.status === 'cancelled'
    ).length;

    this.mockStats = {
      ...this.mockStats,
      totalEvents: this.mockEvents.length,
      upcomingEvents,
      completedEvents,
      cancelledEvents
    };

    this.statsSubject.next(this.mockStats);
  }

  /**
   * Obter eventos atuais do cache
   */
  getCurrentEvents(): Event[] {
    return this.eventsSubject.value;
  }

  /**
   * Obter stats atuais do cache
   */
  getCurrentStats(): EventStats {
    return this.statsSubject.value;
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.eventsSubject.next([]);
    this.statsSubject.next({
      totalEvents: 0,
      upcomingEvents: 0,
      completedEvents: 0,
      cancelledEvents: 0,
      totalAttendees: 0,
      averageAttendance: 0,
      eventsByType: {},
      monthlyEvents: [],
      popularEvents: []
    });
  }

  /**
   * Validar dados do evento
   */
  validateEventData(eventData: Partial<Event>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!eventData.title?.trim()) {
      errors.push('Título é obrigatório');
    }

    if (!eventData.date) {
      errors.push('Data é obrigatória');
    } else {
      const eventDate = new Date(eventData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        errors.push('Data não pode ser no passado');
      }
    }

    if (!eventData.startTime) {
      errors.push('Horário de início é obrigatório');
    }

    if (!eventData.type) {
      errors.push('Tipo de evento é obrigatório');
    }

    if (eventData.maxAttendees && eventData.maxAttendees < 1) {
      errors.push('Número máximo de participantes deve ser maior que 0');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

}
