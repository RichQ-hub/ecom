import { useContext, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AuthContext } from '../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

/**
 * LogOutBtn Component
 *
 * This component provides a user interface for logging out of the application. It includes a button to trigger the logout process
 * and a confirmation dialog to prevent accidental logouts. When the user confirms, the component clears authentication tokens,
 * updates the authentication context, and navigates the user to the home page.
 *
 */
const LogOutBtn = () => {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /**
   * Handles the logout process:
   * - Clears authentication tokens from local storage
   * - Resets authentication context
   * - Closes the dialog
   * - Navigates to the home page
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    auth.setToken('');
    auth.setName('');
    handleClose();
    navigate('/');
  };

  return (
    <>
      {/* Log Out Button */}
      <Button
        variant="outlined"
        sx={{
          color: '#66c0f4',
          backgroundColor: '#111921',
        }}
        onClick={handleOpen}
      >
        Log Out
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Confirm Logout'}</DialogTitle>

        <DialogContent>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>

        <DialogActions>
          {/* Cancel Button */}
          <Button
            sx={{
              color: 'black',
              '&:hover': {
                backgroundColor: '#d9d9d9',
              },
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>

          {/* Confirm Logout Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#ec4141',
              '&:hover': {
                backgroundColor: '#cd1515',
              },
              color: 'white',
            }}
            onClick={handleLogout}
          >
            Yes, Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogOutBtn;
