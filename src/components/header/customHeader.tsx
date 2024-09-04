import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Icon} from '@rneui/base';
import {StackHeaderProps} from '@react-navigation/stack';
import colors from '../../styles/colors';

function CustomHeader({navigation, route, options, back}: StackHeaderProps) {
  const handleBackPress = () => {
    const isWalkScreen =
      route.name === 'WalkStart' || route.name === 'WalkInProgress';

    isWalkScreen ? navigation.navigate('HomeScreen') : navigation.goBack();
  };

  return (
    <View>
      {back ? (
        <View style={styles.headerInvisible}>
          <TouchableOpacity onPress={handleBackPress}>
            <View style={styles.backIconContainer}>
              <Icon
                type="material"
                name="arrow-back-ios-new"
                size={14}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default CustomHeader;
