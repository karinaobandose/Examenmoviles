import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart } from '../store/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);

  
  const grandTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  
  const handleRemove = async (id) => {
    dispatch(removeFromCart(id));
    const updated = items.filter(i => i.id !== id);
    await AsyncStorage.setItem('cart', JSON.stringify(updated));
  };


  const handleCancel = async () => {
    Alert.alert('Cancelar compra', '¿Seguro que deseas vaciar el carrito?', [
      { text: 'No' },
      {
        text: 'Sí, cancelar',
        onPress: async () => {
          dispatch(clearCart());
          await AsyncStorage.removeItem('cart');
        },
      },
    ]);
  };


  const handleCheckout = async () => {
    Alert.alert('✅ Compra realizada', `Total pagado: $${grandTotal.toFixed(2)}`, [
      {
        text: 'Aceptar',
        onPress: async () => {
          dispatch(clearCart());
          await AsyncStorage.removeItem('cart');
          navigation.navigate('Products');
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>Precio: ${item.price.toFixed(2)}</Text>
        <Text style={styles.qty}>Cantidad: {item.quantity}</Text>
        <Text style={styles.subtotal}>Subtotal: ${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeBtn}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Carrito de Compras</Text>

      {items.length === 0
        ? <Text style={styles.empty}>El carrito está vacío</Text>
        : <>
            <FlatList
              data={items}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 200 }}
            />
            <View style={styles.footer}>
              <Text style={styles.total}>Total: ${grandTotal.toFixed(2)}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.payBtn} onPress={handleCheckout}>
                  <Text style={styles.payText}>Pagar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', padding: 20, paddingTop: 48, backgroundColor: '#e44d26', color: '#fff' },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 18, color: '#999' },
  card: { flexDirection: 'row', backgroundColor: '#fff', margin: 10, borderRadius: 10, padding: 10, elevation: 2 },
  image: { width: 70, height: 70 },
  info: { flex: 1, marginLeft: 10 },
  title: { fontSize: 13, color: '#333', marginBottom: 4 },
  price: { fontSize: 13, color: '#666' },
  qty: { fontSize: 13, color: '#666' },
  subtotal: { fontSize: 14, fontWeight: 'bold', color: '#e44d26' },
  removeBtn: { padding: 6 },
  removeText: { color: '#e44d26', fontSize: 18 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, elevation: 10 },
  total: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 12, textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { flex: 1, marginRight: 8, padding: 14, borderRadius: 10, borderWidth: 2, borderColor: '#e44d26', alignItems: 'center' },
  cancelText: { color: '#e44d26', fontSize: 16, fontWeight: 'bold' },
  payBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#e44d26', alignItems: 'center' },
  payText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});