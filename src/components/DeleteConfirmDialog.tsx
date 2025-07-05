import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Delete, Cancel, Warning } from '@mui/icons-material';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="warning" />
          <Typography variant="h6">Confirm Deletion</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete this row?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </Alert>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          startIcon={<Cancel />}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          startIcon={<Delete />}
          variant="contained"
          color="error"
        >
          Delete Row
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;