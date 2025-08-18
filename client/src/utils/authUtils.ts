export const loadUserFromToken = () => {
  const token = localStorage.getItem('token');
  return token ? { token } : null;
};