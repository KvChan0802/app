import React, {useContext, useEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import analytics from '@react-native-firebase/analytics';
import {CheckIcon, TicketIcon} from 'react-native-heroicons/outline';

import Loading from './Loading';
import {colors} from '../components/Styles';
import ExploreWorkList from '../components/ExploreWorkList';
import LocationBasedNotification from '../components/LocationBasedNotification';

import useCheckin from '../hooks/useCheckin';
import useExhibition from '../hooks/useExhibition';
import useFetchExhibition from '../hooks/useFetchExhibition';
import useTicket from '../hooks/useTicket';
import useNavigation from '../hooks/useNavigation';
import useWork from '../hooks/useWork';

import {ExhibitionType, WorkType} from '../types';
import BeaconContext from '../context/BeaconContext';

// Tab: Explore
// Explore: 探索頁面
export default function Explore() {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();
  const {language} = i18n;
  const {useFetchTicketExhibitions} = useTicket();

  const {data: exhibitions, status} = useFetchExhibition();
  const {beacons} = useContext(BeaconContext);
  const liveExhibitions = useExhibition(beacons, exhibitions);
  const {data: ticketExhibitions} = useFetchTicketExhibitions();
  const works = useWork(beacons, exhibitions);
  // k-test
  console.log('------------'+works.length)
  // k-test
  const [liveTicketExhibitions, setLiveTicketExhibitions] = React.useState<
    ExhibitionType[]
  >([]);

  // events
  const {events} = useCheckin(beacons, language);

  function intersectStringArray(a: string[], b: string[]): string[] {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    return Array.from(intersection);
  }

  async function handleNavigateToWork(work: any) {
    await analytics().logEvent('visit_work', {
      id: work?.id,
      item: work?.name,
    });

    navigation.navigate('Work', {
      work,
      exhibition: work?.exhibition,
    });
  }

  function renderItem({item, index}: {item: WorkType; index: number}) {
    return (
      <ExploreWorkList
        key={index}
        work={item}
        index={index}
        onPress={() => handleNavigateToWork(item)}
      />
    );
  }

  useEffect(() => {
    const liveExhibitionIds = liveExhibitions.map(e => e.id);
    const ticketExhibitionIds = ticketExhibitions?.map(e => e.id);

    const liveTicketExhibitionIds = intersectStringArray(
      liveExhibitionIds ?? [],
      ticketExhibitionIds ?? [],
    );

    const results = liveTicketExhibitionIds
      .map(id => {
        return exhibitions.find((e: ExhibitionType) => e.id === id) || null;
      })
      .filter(e => e !== null && e !== undefined);

    setLiveTicketExhibitions(results as ExhibitionType[]);
  }, [ticketExhibitions, liveExhibitions, exhibitions]);

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Background />

      {/* {liveTicketExhibitions.length + events.length > 4 && ( */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.8)',
          'rgba(255, 255, 255, 0.5)',
          'rgba(255, 255, 255, 0.0)',
        ]}
        locations={[0.5, 0.8, 1]}
        style={styles.top}>
        <SafeAreaView>
          <View style={styles.locationBasedContainer}>
            {liveTicketExhibitions.length > 0 &&
              liveTicketExhibitions.map((exhibition: ExhibitionType) => (
                <LocationBasedNotification
                  key={exhibition.id}
                  icon={<TicketIcon color="#666" size={24} />}
                  title={exhibition.name || ''}
                  subtitle={t('explore.tickets.available')}
                  buttonLabel={t('explore.tickets.get')}
                  buttonAction={() =>
                    navigation.navigate('Tickets', {
                      exhibition,
                    })
                  }
                />
              ))}

            {events.length > 0 &&
              events.map(event => (
                <LocationBasedNotification
                  key={event.id}
                  icon={<CheckIcon color="#666" size={24} />}
                  title={event.name}
                  subtitle={t('explore.checkin.arrived')}
                  buttonLabel={t('explore.checkin.checkin')}
                  buttonAction={() =>
                    navigation.navigate('Checkin', {
                      event,
                    })
                  }
                />
              ))}
          </View>
        </SafeAreaView>
      </LinearGradient>
      {/* )} */}

      <FlatList
        style={styles.searchResultsList}
        data={works}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        inverted
      />
    </View>
  );
}

function Background() {
  return (
    <View style={styles.background}>
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <View key={index} style={[styles.lines, {width: index * 150 - 50}]} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  top: {
    zIndex: 10,
  },
  searchResultsList: {
    overflow: 'visible',
    marginBottom: 10,
  },
  background: {
    width: 0,
    height: 0,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lines: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'solid',
    borderRadius: 999,
    aspectRatio: 1,
  },
  workContainer: {
    backgroundColor: '#DDD',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  workTitle: {
    fontSize: 16,
  },
  workSubtitle: {
    color: '#888',
  },
  explanation: {
    backgroundColor: '#DDD',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 4,
    position: 'absolute',
    bottom: 40,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  locationBased: {
    zIndex: 100,
  },
  locationBasedContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 16,
  },
});
