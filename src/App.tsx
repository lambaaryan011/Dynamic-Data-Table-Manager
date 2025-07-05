import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store, persistor } from './store';
import { lightTheme, darkTheme } from './theme/muiTheme';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const ThemedApp = () => {
  const theme = useSelector((state: RootState) => state.dataTable.theme);
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <ThemedApp />
    </PersistGate>
  </Provider>
);

export default App;
