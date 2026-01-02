export type User = {
  id: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
};
