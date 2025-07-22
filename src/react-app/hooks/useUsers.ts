import { useEffect, useState, useMemo } from 'react';

export interface UserData {
  id: string;
  name: string;
  profileImage: string;
}

export function useUsers(userIds: string[]) {
  const [users, setUsers] = useState<Record<string, UserData | undefined>>({});
  const [loading, setLoading] = useState(false);

  // Extract the serialized userIds to a stable reference to avoid unnecessary re-renders
  const serializedUserIds = useMemo(() => JSON.stringify(userIds), [userIds]);

  useEffect(() => {
    if (!userIds.length) {
      setUsers({});
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(
      userIds.map(id =>
        fetch(`/api/users/${id}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      if (cancelled) return;
      const userMap: Record<string, UserData | undefined> = {};
      userIds.forEach((id, i) => {
        userMap[id] = results[i] || undefined;
      });
      setUsers(userMap);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [serializedUserIds, userIds]);

  return { users, loading };
}