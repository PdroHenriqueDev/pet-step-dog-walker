import './styles/global.css';
import React from 'react';

import Routes from './routes';
import {DialogProvider} from './contexts/dialogContext';
import {AuthProvider} from './contexts/authContext';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <DialogProvider>
        <Routes />
      </DialogProvider>
    </AuthProvider>
  );
}

export default App;
