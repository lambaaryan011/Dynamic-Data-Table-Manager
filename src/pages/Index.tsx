import React from 'react';
import { Container } from '@mui/material';
import DataTableManager from '../components/DataTableManager';

const Index = () => {
  return (
    <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <DataTableManager />
    </Container>
  );
};

export default Index;
