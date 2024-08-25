"use client";

import { signIn } from 'next-auth/react';
import { Button } from '@mui/material';

const LoginButton: React.FC = () => (
  <Button variant="contained" color="primary" onClick={() => signIn('google')}>
    Sign in with Google
  </Button>
);

export default LoginButton;
