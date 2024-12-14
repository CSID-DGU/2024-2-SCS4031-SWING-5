import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import Calendar from '@/components/Calendar';
import dayjs from 'dayjs';
import FamilyMedication from '@/components/FamilyMedication';
import { useFamilyContext } from '@/context/FamilyContext';

export default function FamilyMedicationPage(){
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { selectedFamily } = useFamilyContext();

    return(
      <View style={styles.container}>
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        {selectedFamily && selectedFamily.userId ? (
        <FamilyMedication userId={selectedFamily.userId} selectedDate={selectedDate} />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>가족 구성원을 선택해주세요.</Text>
        </View>
      )}
    </View>
      );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0F4FF',
      padding: 0,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 16,
      color: 'red',
    },
  });