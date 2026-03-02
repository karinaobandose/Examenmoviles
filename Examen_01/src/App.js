import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSuccess } from './src/store/authSlice';
import { loadCart } from './src/store/cartSlice';


function AppInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        const cart = await AsyncStorage.getItem('cart');

       
        if (token && user) {
          dispatch(loginSuccess({ user: JSON.parse(user), token }));
        }
       
        if (cart) {
          dispatch(loadCart(JSON.parse(cart)));
        }
      } catch (e) {
        console.error('Error cargando sesión', e);
      }
    };
    loadSession();
  }, []);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInit />
    </Provider>
  );
}