import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import LoginScreen from '../screens/LoginScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {

  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn
          ? <Stack.Screen name="Login" component={LoginScreen} />
          : <>
              <Stack.Screen name="Products" component={ProductsScreen} />
              <Stack.Screen name="ProductDetail" component={ProductDetailScreen}
                options={{ headerShown: true, title: 'Detalle del Producto', headerTintColor: '#e44d26' }}
              />
              <Stack.Screen name="Cart" component={CartScreen} />
            </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}