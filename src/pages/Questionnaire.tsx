import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import Button from '../components/Button';
import Stepper from '../components/Stepper';
import {RootStackParamList} from '../navigations/msc';
import {QuestionnaireType} from '../types/questionnaire';

type QuestionnaireScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Questionnaire'
>;

interface QuestionnaireParams {
  navigation: QuestionnaireScreenNavigationProp;
}

// Tab: MSC
// Questionnaire: 問卷
export default function Questionnaire({navigation}: QuestionnaireParams) {
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireType>([
    {label: '嬰兒', value: 0},
    {label: '二至六歲', value: 0},
    {label: '七至十八歲', value: 0},
    {label: '成年', value: 1},
  ]);

  const {setItem} = useAsyncStorage('@questionnaire');

  async function handleSubmit() {
    const now = new Date().getTime();
    const today = now - (now % 86400000);
    await setItem(`${today}`);
    navigation.goBack();
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>歡迎光臨澳門科學館</Text>
        <Text style={styles.paragraph}>
          請協助填寫隨行人數，以作統計用，謝謝。
        </Text>

        {questionnaire.map((question, index) => (
          <Stepper
            key={index}
            label={question.label}
            value={question.value}
            onChange={value => {
              const newQuestionnaire = [...questionnaire];
              newQuestionnaire[index].value = value;
              setQuestionnaire(newQuestionnaire);
            }}
          />
        ))}

        <View style={styles.buttonContainer}>
          <Button title="確認" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 30,
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'normal',
    marginVertical: 10,
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
