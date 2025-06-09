import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import EditEventForm from './EditEventForm';

export default function EditEventScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { evento } = route.params || {};

  return (
    <EditEventForm
      evento={evento}
      onSuccess={() => navigation.goBack()}
    />
  );
}