import React from "react";
import { Box, Button, TextField, Typography, Alert, Link, Stack } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";

interface AuthFormProps {
  title: string;
  onSubmit: (formData: { email: string; password: string }) => void;
  error: string | null;
  toggleForm: () => void;
  isLogin?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  onSubmit,
  error,
  toggleForm,
  isLogin = false,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        backgroundColor: "#f4f2ff",
        padding: 4,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold" color="#361c82">
        {title} ⚽
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          <Button variant="contained" type="submit" fullWidth color="primary">
            {title}
          </Button>

          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            sx={{ borderColor: "#361c82", color: "#361c82" }}
            onClick={() => console.log("Sign in with Google")}
          >
            {isLogin ? "Sign in with Google" : "Sign up with Google"}
          </Button>

          <Typography variant="body2" textAlign="center">
            {isLogin ? (
              <>
                Don't have an account? <Link onClick={toggleForm}>Sign Up</Link>
              </>
            ) : (
              <>
                Already have an account? <Link onClick={toggleForm}>Sign In</Link>
              </>
            )}
          </Typography>
        </Stack>
      </form>
    </Box>
  );
};
