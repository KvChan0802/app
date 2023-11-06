import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  CalendarDaysIcon,
  ClockIcon,
  TrashIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import {t} from 'i18next';

import Styles, {colors} from './Styles';
import {ExhibitionType, TicketType} from '../types';

type StatusEnum = 'waiting' | 'valid' | 'invalid';

interface Props {
  ticket: TicketType;
  exhibition: ExhibitionType | undefined;
  onDelete: (ticket: TicketType) => void;
}

export default function ReservationTicket({
  ticket,
  exhibition,
  onDelete,
}: Props) {
  const now = new Date().getTime();
  const status: StatusEnum =
    now < ticket.timestamp! - 60_000
      ? 'waiting'
      : now < ticket.timestamp! + 1_200_000
      ? 'valid'
      : 'invalid';
  const color: string =
    now < ticket.timestamp! - 60_000
      ? colors.contrast
      : now < ticket.timestamp! + 1_200_000
      ? colors.primary
      : colors.disabled;

  return (
    <View key={ticket.id} style={styles.innerContainer}>
      <View style={styles.ticket}>
        <View style={styles.ticketVertical}>
          <Text style={[Styles.title, styles.ticketTitle]}>
            {exhibition?.code} - {exhibition?.name}
          </Text>

          <View style={styles.ticketHorizontal}>
            <View style={styles.attributeSet}>
              <View style={styles.ticketAttribute}>
                <CalendarDaysIcon color="#000" size={18} />
              </View>
              <Text style={styles.ticketValue}>{ticket.date}</Text>
            </View>
            <View style={styles.attributeSet}>
              <View style={styles.ticketAttribute}>
                <ClockIcon color="#000" size={18} />
              </View>
              <Text style={styles.ticketValue}>{ticket.time}</Text>
            </View>
            <View style={styles.attributeSet}>
              <View style={styles.ticketAttribute}>
                <UserIcon color="#000" size={18} />
              </View>
              <Text style={styles.ticketValue}>{ticket.count}</Text>
            </View>
          </View>

          <Tag status={status} color={color} />

          {status === 'waiting' && (
            <View style={styles.tools}>
              <TouchableOpacity onPress={() => onDelete(ticket)}>
                <View style={styles.toolsButtons}>
                  <TrashIcon color={colors.primary} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function Tag({status, color}: {status: string; color: string}) {
  return (
    <View style={[styles.status, {backgroundColor: `${color}40`}]}>
      <View style={[styles.dot, {backgroundColor: `${color}`}]} />
      <Text style={{color}}>{t(`explore.tickets.status.${status}`)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 8,
    alignContent: 'flex-end',
  },
  ticket: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ticketVertical: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 12,
  },
  ticketHorizontal: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  tools: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  toolsButtons: {
    padding: 4,
    borderRadius: 100,
  },
  attributeSet: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexGrow: 1,
  },
  ticketTitle: {
    width: '100%',
    marginBottom: 8,
  },
  ticketAttribute: {
    backgroundColor: colors.background,
    width: 32,
    height: 32,
    borderRadius: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketValue: {
    marginLeft: 8,
    fontSize: 16,
  },
  status: {
    backgroundColor: `${colors.emphersis}40`,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: colors.emphersis,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
});
