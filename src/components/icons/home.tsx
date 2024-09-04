import React from 'react';
import {Icon} from '@rneui/themed';
import colors from '../../styles/colors';

const HomeIcon = ({
  focused,
}: {
  focused: boolean;
  color: string;
  size: number;
}) => (
  <Icon
    type="material"
    name="home"
    size={20}
    color={focused ? colors.dark : colors.accent}
  />
);

export default HomeIcon;
