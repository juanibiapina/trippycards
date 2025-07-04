import { useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type Session = {
  user: User;
} | null;

// Simple custom hook for auth state
export function useSession() {
  const [session, setSession] = useState<Session>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // Fetch session from our API
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setSession(data.data);
        }
        setIsPending(false);
      })
      .catch(() => {
        setIsPending(false);
      });
  }, []);

  return { data: session, isPending };
}

export const signIn = {
  social: ({ provider }: { provider: string }) => {
    // For demo purposes, simulate signing in by reloading the page
    // In a real implementation, this would redirect to OAuth
    alert(`Would redirect to ${provider} OAuth. For demo purposes, we'll simulate a successful sign-in.`);
    window.location.reload();
  }
};

export const signOut = () => {
  // For demo purposes, just show an alert
  // In a real implementation, this would call the signout endpoint
  alert("Signed out! In a real implementation, this would clear the session.");
  window.location.reload();
};

export const authClient = {
  useSession,
  signIn,
  signOut
};