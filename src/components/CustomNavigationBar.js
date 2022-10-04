import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Appbar, Menu, useTheme } from 'react-native-paper'
import useDebugging from '../hooks/useDebugging';

export default function CustomNavigationBar({back, options}) {
  const navigation = useNavigation();
  const theme = useTheme();
  const {debugging} = useDebugging();

  const [visible, setVisible] = useState(false)
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header>
      { back && <Appbar.BackAction onPress={navigation.goBack} /> }
      <Appbar.Content title={options.title ? options.title : 'myPills'}/>
      { !back && (
        <Menu visible={visible} onDismiss={closeMenu} anchor={
          <Appbar.Action icon="menu" color="white" onPress={openMenu} />
        }>
          <Menu.Item title="Meus Medicamentos" onPress={() => {navigation.navigate("Schedules"); closeMenu()}} />
          <Menu.Item title="Novo Medicamento" onPress={() => {navigation.navigate("NewMed"); closeMenu()}} />
          { debugging && (
            <Menu.Item title="Debugar" onPress={() => {navigation.navigate("Debugging"); closeMenu()}} />
          )}
        </Menu>
      ) }
    </Appbar.Header>
  )
}