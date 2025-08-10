import { useState, useEffect } from 'react';
import { groupService, GroupsQuery } from '../services/groupService';
import { Group } from '../types';

export const useGroups = (query: GroupsQuery = {}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupService.getAllGroups(query);
      setGroups(response.data.groups);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch groups');
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [JSON.stringify(query)]);

  return {
    groups,
    loading,
    error,
    pagination,
    refetch: fetchGroups,
  };
};