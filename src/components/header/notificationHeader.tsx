import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import {Icon} from '@rneui/base';
import {StackHeaderProps} from '@react-navigation/stack';

function NotificationHeader({navigation, route, options}: StackHeaderProps) {
  const [notification] = useState(true);
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {notification && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          )}

          <Icon type="material" name="notifications-none" size={22} />
        </View>
      </View>
    </View>
  );
}

export default NotificationHeader;
