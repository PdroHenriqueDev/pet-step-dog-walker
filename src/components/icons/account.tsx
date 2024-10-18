import React from 'react';
import {Icon} from '@rneui/themed';
import colors from '../../styles/colors';

const AccountIcon = ({
  focused,
}: {
  focused: boolean;
  color: string;
  size: number;
}) => (
  <Icon
    type="material-community"
    name="account-outline"
    size={20}
    color={focused ? colors.dark : colors.accent}
  />
);

export default AccountIcon;
