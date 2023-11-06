import useApi, {UseApiReturnTypes} from './useApi';
import type {ExhibitionType} from '../types/exhibition';
import type {TicketType} from '../types/ticket';
import type {TimeslotType} from '../types/timeslot';

type Session = {
  session: string;
  sessionSig: string;
};

interface ReturnTypes {
  useFetchTicketExhibitions: () => UseApiReturnTypes<ExhibitionType[]>;
  useTicketsTimeslots: (
    exhibitionId: string,
  ) => UseApiReturnTypes<TimeslotType[]>;
  getTicket: (
    session: Session,
    exhibition: ExhibitionType,
    section: number,
    count: number,
  ) => Promise<TicketType>;
  getMyTickets: (session: Session) => Promise<TicketType[]>;
  deleteTicket: (ticket: TicketType, session: Session) => Promise<void>;
}

export default function useTicket(): ReturnTypes {
  function getOpeningClosing(): [number, number] {
    const tz = new Date().getTimezoneOffset() * 60000;
    const now = new Date().getTime();
    const start = now - (now % 86400000) + tz;
    const opening = start + 3600000 * 10;
    const closing = start + 3600000 * 18 - 1;
    return [opening, closing];
  }

  function useFetchTicketExhibitions(): UseApiReturnTypes<ExhibitionType[]> {
    const [opening, closing] = getOpeningClosing();
    const url = `/api/get-ticket-exhibitions/${opening}/${closing}`;

    return useApi<ExhibitionType[]>(url);
  }

  function useTicketsTimeslots(
    exhibitionId: string,
  ): UseApiReturnTypes<TimeslotType[]> {
    const [opening, closing] = getOpeningClosing();
    const url = `/api/get-ticket-counts/${exhibitionId}/${opening}/${closing}`;

    return useApi<TimeslotType[]>(url);
  }

  async function getTicket(
    session: Session,
    exhibition: ExhibitionType,
    section: number,
    count: number,
  ): Promise<TicketType> {
    const url = 'https://msc-guide-server-next-rho.vercel.app/api/take-ticket';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        session: session.session,
        'session-sig': session.sessionSig,
      },
      body: JSON.stringify({
        exhibitionId: exhibition.id,
        section,
        count,
      }),
    });
    if (res.status !== 200) {
      throw new Error(`Failed to get ticket: ${JSON.stringify(res)}`);
    }

    const json = await res.json();

    return json;
  }

  async function getMyTickets(session: Session): Promise<TicketType[]> {
    const url = 'https://msc-guide-server-next-rho.vercel.app/api/my-tickets';
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        session: session.session,
        'session-sig': session.sessionSig,
      },
    });
    if (res.status !== 200) {
      throw new Error(`Failed to get ticket: ${JSON.stringify(res)}`);
    }

    const json = await res.json();
    return json;
  }

  async function deleteTicket(
    ticket: TicketType,
    session: Session,
  ): Promise<void> {
    const url =
      'https://msc-guide-server-next-rho.vercel.app/api/cancel-ticket';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        session: session.session,
        'session-sig': session.sessionSig,
      },
      body: JSON.stringify({
        ticketId: ticket.id,
      }),
    });
    if (res.status !== 200) {
      throw new Error(`Failed to get ticket: ${JSON.stringify(res)}`);
    }

    const json = await res.json();
    return json;
  }

  return {
    useFetchTicketExhibitions,
    useTicketsTimeslots,
    getTicket,
    getMyTickets,
    deleteTicket,
  };
}
