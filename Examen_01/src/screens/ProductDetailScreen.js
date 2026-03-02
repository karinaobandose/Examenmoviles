import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { product } = route.params;

  
  const handleAddToCart = async () => {
    dispatch(addToCart(product));

    // Persistir carrito en almacenamiento local
    try {
      const existing = await AsyncStorage.getItem('cart');
      const cart = existing ? JSON.parse(existing) : [];
      const idx = cart.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        cart[idx].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error guardando carrito', e);
    }

    Alert.alert('✅ Agregado', `${product.title} fue añadido al carrito`, [
      { text: 'Ver Carrito', onPress: () => navigation.navigate('Cart') },
      { text: 'Seguir comprando' },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.content}>
        <Text style={styles.category}>📁 {product.category}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        {/* Rating */}
        <View style={styles.ratingBox}>
          <Text style={styles.ratingText}>⭐ {product.rating?.rate} ({product.rating?.count} reseñas)</Text>
        </View>

        <Text style={styles.descLabel}>Descripción</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>🛒 Agregar al Carrito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 280, backgroundColor: '#f9f9f9' },
  content: { padding: 20 },
  category: { color: '#e44d26', fontSize: 13, textTransform: 'uppercase', marginBottom: 6 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  price: { fontSize: 28, fontWeight: 'bold', color: '#e44d26', marginBottom: 10 },
  ratingBox: { backgroundColor: '#fff8e1', padding: 10, borderRadius: 8, marginBottom: 16 },
  ratingText: { fontSize: 14, color: '#888' },
  descLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#333' },
  description: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 24 },
  button: { backgroundColor: '#e44d26', padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});