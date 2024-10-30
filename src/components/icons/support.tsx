import React from 'react';
import {Icon} from '@rneui/themed';
import colors from '../../styles/colors';

const HelpIcon = ({
  focused,
}: {
  focused: boolean;
  color: string;
  size: number;
}) => (
  <Icon
    type="material"
    name="support"
    size={20}
    color={focused ? colors.dark : colors.accent}
  />
);

export default HelpIcon;
