import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import {colors} from '../components/Styles';
import useTicket from '../hooks/useTicket';
import {TicketType} from '../types';
import ReservationTicket from '../components/ReservationTicket';
import useFetchExhibition from '../hooks/useFetchExhibition';
import useNotification from '../hooks/useNotification';

// Tab: Explore
// Reservations: 我的預約籌
export default function Reservations() {
  const {getMyTickets, deleteTicket} = useTicket();
  const {getItem: getSession} = useAsyncStorage('@user.session');
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const {data: exhibitions} = useFetchExhibition();

  const {cancelNotification} = useNotification();

  function process(data: any) {
    return data
      .map((item: any) => {
        const section = item.section;
        const timestamp = new Date(section);
        const date = timestamp.toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        const time = timestamp.toLocaleTimeString('zh-TW', {
          hour: '2-digit',
          minute: '2-digit',
        });

        return {
          ...item,
          timestamp: timestamp.getTime(),
          date,
          time,
        };
      })
      .sort((a: TicketType, b: TicketType) => {
        return a.timestamp! - b.timestamp!;
      });
  }

  async function handleDelete(ticket: TicketType) {
    const sessionJSON = await getSession();

    if (!sessionJSON) {
      return;
    }

    const session = JSON.parse(sessionJSON);
    await deleteTicket(ticket, session);
    cancelNotification(`${Math.round(ticket.timestamp ?? 0 / 1000000)}`);
    setTickets(current =>
      current
        .filter(item => item.id !== ticket.id)
        .sort((a: TicketType, b: TicketType) => {
          return a.timestamp! - b.timestamp!;
        }),
    );
  }

  useEffect(() => {
    async function exec() {
      const sessionJSON = await getSession();

      if (!sessionJSON) {
        return;
      }

      const session = JSON.parse(sessionJSON);
      const fetchedTickets = await getMyTickets(session);
      setTickets(process(fetchedTickets));
    }

    exec();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView style={[styles.scrollView]}>
      <View style={[styles.container]}>
        {tickets.reverse().map((ticket: TicketType) => (
          <ReservationTicket
            key={ticket.id}
            ticket={ticket}
            exhibition={exhibitions?.find(exhibition => {
              return exhibition.id === ticket.exhibitionId;
            })}
            onDelete={handleDelete}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.background,
  },
  container: {
    padding: 8,
  },
});
