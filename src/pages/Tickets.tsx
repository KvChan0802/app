import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

import Button from '../components/Button';
import Stepper from '../components/Stepper';
import Styles, {colors} from '../components/Styles';

import useNavigation from '../hooks/useNavigation';
import useNotification from '../hooks/useNotification';
import useTicket from '../hooks/useTicket';

import {RootStackParamList} from '../navigations/explore';
import {TimeslotType} from '../types/timeslot';
import Loading from './Loading';

type TicketScreenRouteProp = RouteProp<RootStackParamList, 'Tickets'>;

interface TicketsParams {
  route: TicketScreenRouteProp;
}

const MAX_PEOPLE = 3;

// Tab: Explore
// Tickets: 取籌頁面
export default function Tickets({route}: TicketsParams) {
  const {getTicket, useTicketsTimeslots} = useTicket();

  const {exhibition} = route.params;
  const {data: timeslots, loading} = useTicketsTimeslots(exhibition.id);

  const [selectedTimeslot, setSelectedTimeslot] = useState<number | null>(null);
  const [people, setPeople] = useState(1);
  const [maxBySelected, setMaxBySelected] = useState<number>(MAX_PEOPLE);

  const {getItem: getSession} = useAsyncStorage('@user.session');

  const {t} = useTranslation();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  const {scheduleNotification} = useNotification();

  function getStartTime(timeslot: TimeslotType): string {
    const obj = new Date(timeslot.sectionStart);
    const hour = obj.getHours().toString().padStart(2, '0');
    const minute = obj.getMinutes().toString().padStart(2, '0');

    return `${hour}:${minute}`;
  }

  function isSelected(timeslot: TimeslotType): boolean {
    return new Date(timeslot.sectionStart).getTime() === selectedTimeslot;
  }

  function isReservable() {
    return selectedTimeslot !== null && people > 0;
  }

  function handleSelectTimeslot(timeslot: TimeslotType) {
    if (timeslot.count >= timeslot.limit || isPassed(timeslot)) {
      return;
    }

    setSelectedTimeslot(new Date(timeslot.sectionStart).getTime());
    setMaxBySelected(timeslot.limit - timeslot.count);
  }

  async function handleReserve() {
    if (selectedTimeslot === null) {
      return;
    }
    
    try {
      const sessionJSON = await getSession();
      if (!sessionJSON) {
        Alert.alert(
          `${t('login-first.not-login')}`,
          `${t('login-first.login-first')}`, [
          {
            text: `${t('login-first.cancel')}`,
            isPreferred: false,
          },
          {
            text: `${t('login-first.login')}`,
            onPress: () => navigation.navigate('User'),
            isPreferred: true,
          },
        ]);
        return;
      }
      
      const session = JSON.parse(sessionJSON);
      const ticket = await getTicket(
        session,
        exhibition,
        selectedTimeslot,
        people,
      );

      if (ticket && ticket.id !== undefined) {
        scheduleNotification({
          id: Math.round(selectedTimeslot / 1000000),
          title: `${exhibition.code} - ${exhibition.name}`,
          subtitle: `${t('msc.title')}`,
          message: t('explore.tickets.notification-message', {
            exhibition: `${exhibition.code} - ${exhibition.name}`,
          }),
          date: new Date(selectedTimeslot - 5 * 60 * 1000),
          repeatTime: 1,
        });
        navigation.navigate('Reservations');
      } else {
        Alert.alert(
          `${t('explore.tickets.error.failed')}`,
          `${t('explore.tickets.error.duplicated')}`,
          [
            {
              text: `${t('cancel')}`,
              isPreferred: false,
            },
            {
              text: `${t('explore.tickets.check-mine')}`,
              onPress: () => navigation.navigate('Reservations'),
              isPreferred: true,
            },
          ],
        );
      }
    } catch (error) {
      console.warn(error);
    }
  }

  function isPassed(timeslot: TimeslotType) {
    const now = new Date().getTime();

    return new Date(timeslot.sectionStart).getTime() < now;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Text style={[Styles.title, styles.title]}>{exhibition.name}</Text>

      <ScrollView style={styles.scrollView}>
        <View style={styles.timeslots}>
          {timeslots?.map((timeslot, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectTimeslot(timeslot)}>
              <View
                style={[
                  styles.timeslot,
                  {width: width / 3 - 16},
                  isSelected(timeslot) && styles.selected,
                  timeslot.count >= timeslot.limit && styles.unavailable,
                  isPassed(timeslot) && styles.unavailable,
                ]}>
                <Text style={styles.time}>{getStartTime(timeslot)}</Text>
                <Text style={styles.available}>
                  {isPassed(timeslot)
                    ? t('explore.tickets.expired')
                    : t('explore.tickets.quota', {
                        quota: timeslot.limit - timeslot.count,
                      })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <View style={styles.stepperContainer}>
          <Stepper
            label={t('explore.tickets.no-of-people')}
            value={people}
            max={Math.min(maxBySelected, MAX_PEOPLE)}
            min={1}
            onChange={setPeople}
          />
        </View>

        <Button
          title={t('explore.tickets.get')}
          onPress={handleReserve}
          disabled={!isReservable()}
          primary
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 28,
    marginBottom: 28,
  },
  scrollView: {
    width: '100%',
  },
  timeslots: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeslot: {
    backgroundColor: '#EEE',
    borderRadius: 8,
    width: 150,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  selected: {
    backgroundColor: colors.emphersis,
    color: colors.primary,
  },
  unavailable: {
    backgroundColor: 'white',
    opacity: 0.3,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  available: {
    fontSize: 14,
    color: '#666',
  },
  footerContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
  },
  stepperContainer: {
    marginTop: -12,
    height: 'auto',
  },
});
