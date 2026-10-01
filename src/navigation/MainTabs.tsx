import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopStack } from './ShopStack';
import { CartScreen } from '@screens/CartScreen';
import { MeScreen } from '@screens/MeScreen';
import { VARIANT } from '@constants/student';
import { theme } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

export type MainTabsParamList = {
  Shop: undefined;
  Cart: undefined;
  Me: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs = () => {
  const totalQty = useCartStore((state) => state.totalQuantity());

  const shopScreen = (
    <Tab.Screen
      key="ShopTab"
      name="Shop"
      component={ShopStack}
      options={{
        tabBarLabel: 'Cửa hàng',
        tabBarIcon: ({ color, focused }) => (
          <Text style={[styles.tabIcon, { color }]}>{focused ? '🛍️' : '🏬'}</Text>
        ),
      }}
    />
  );

  const cartScreen = (
    <Tab.Screen
      key="CartTab"
      name="Cart"
      component={CartScreen}
      options={{
        tabBarLabel: 'Giỏ hàng',
        tabBarBadge: totalQty > 0 ? totalQty : undefined,
        tabBarBadgeStyle: {
          backgroundColor: theme.colors.secondary,
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '700',
        },
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🛒</Text>,
      }}
    />
  );

  const meScreen = (
    <Tab.Screen
      key="MeTab"
      name="Me"
      component={MeScreen}
      options={{
        tabBarLabel: 'Tôi',
        tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>👤</Text>,
      }}
    />
  );

  // Thứ tự tab theo VARIANT (shopFirst: Shop → Giỏ → Tôi | cartFirst: Giỏ → Shop → Tôi)
  const isShopFirst = VARIANT.tabOrder === 'shopFirst';

  return (
    <Tab.Navigator
      initialRouteName={isShopFirst ? 'Shop' : 'Cart'}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {isShopFirst ? (
        <>
          {shopScreen}
          {cartScreen}
          {meScreen}
        </>
      ) : (
        <>
          {cartScreen}
          {shopScreen}
          {meScreen}
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});
