import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, ScrollView
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const cart = useSelector(state => state.cart.items);

  
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  
  const fetchCategories = async () => {
    const res = await axios.get('https://fakestoreapi.com/products/categories');
    setCategories(['all', ...res.data]);
  };

  
  const fetchProducts = async (category = 'all') => {
    setLoading(true);
    const url = category === 'all'
      ? 'https://fakestoreapi.com/products'
      : `https://fakestoreapi.com/products/category/${category}`;
    const res = await axios.get(url);
    setProducts(res.data);
    setLoading(false);
  };

  
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    fetchProducts(cat);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Fake Store</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒 {cart.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Filtro de categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catBtn, selectedCategory === cat && styles.catBtnActive]}
            onPress={() => handleCategoryChange(cat)}
          >
            <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading
        ? <ActivityIndicator size="large" color="#e44d26" style={{ marginTop: 40 }} />
        : <FlatList
            data={products}
            keyExtractor={item => item.id.toString()}
            renderItem={renderProduct}
            numColumns={2}
            contentContainerStyle={styles.list}
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#e44d26', padding: 16, paddingTop: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  cartIcon: { color: '#fff', fontSize: 18 },
  categoryBar: { paddingHorizontal: 12, paddingVertical: 10, maxHeight: 56 },
  catBtn: { marginRight: 8, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#ddd' },
  catBtnActive: { backgroundColor: '#e44d26' },
  catText: { color: '#555', fontSize: 13 },
  catTextActive: { color: '#fff', fontWeight: 'bold' },
  list: { padding: 8 },
  card: { flex: 1, backgroundColor: '#fff', margin: 6, borderRadius: 10, padding: 10, elevation: 2 },
  image: { width: '100%', height: 120 },
  info: { marginTop: 8 },
  productTitle: { fontSize: 12, color: '#333' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#e44d26', marginTop: 4 },
});