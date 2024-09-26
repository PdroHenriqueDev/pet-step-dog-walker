import React from 'react';
import {Icon} from '@rneui/themed';
import colors from '../../styles/colors';

const HistorytIcon = ({
  focused,
}: {
  focused: boolean;
  color: string;
  size: number;
}) => (
  <Icon
    type="material"
    name="access-time"
    size={20}
    color={focused ? colors.dark : colors.accent}
  />
);

export default HistorytIcon;
