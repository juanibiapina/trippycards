import { useState, useEffect } from 'react';

interface Session {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

interface UseSessionReturn {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

const useSession = (): UseSessionReturn => {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const sessionData = await response.json();
          if (sessionData.user) {
            setSession(sessionData);
            setStatus('authenticated');
          } else {
            setSession(null);
            setStatus('unauthenticated');
          }
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setSession(null);
        setStatus('unauthenticated');
      }
    };

    fetchSession();
  }, []);

  return { session, status };
};

const AuthButton = () => {
  const { session, status } = useSession();

  const signIn = () => {
    window.location.href = '/api/auth/signin';
  };

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated' && session?.user) {
    return (
      <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', margin: '1rem 0' }}>
        <p>Welcome, {session.user.name || session.user.email}!</p>
        <button
          onClick={signOut}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', margin: '1rem 0' }}>
      <p>You are not signed in.</p>
      <button
        onClick={signIn}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Sign In with Google
      </button>
    </div>
  );
};

export default AuthButton;