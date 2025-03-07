import { useMutation, useQuery } from '@tanstack/react-query'
import { auth, gameProviders, games, monitoring, notifications, updateCommands, updates, subscriptions } from './client'
import useSWR from 'swr'

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: auth.login,
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: auth.logout,
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: auth.getCurrentUser,
  })
}

// Game providers hooks
export const useGameProviders = (params?: Parameters<typeof gameProviders.getAll>[0]) => {
  return useQuery({
    queryKey: ['gameProviders', params],
    queryFn: () => gameProviders.getAll(params),
  })
}

export const useGameProvider = (id: string) => {
  return useQuery({
    queryKey: ['gameProvider', id],
    queryFn: () => gameProviders.getById(id),
  })
}

export const useCreateGameProvider = () => {
  return useMutation({
    mutationFn: gameProviders.create,
  })
}

export const useUpdateGameProvider = () => {
  return useMutation({
    mutationFn: ({ id, ...data }: Parameters<typeof gameProviders.update>[1] & { id: string }) =>
      gameProviders.update(id, data),
  })
}

export const useDeleteGameProvider = () => {
  return useMutation({
    mutationFn: gameProviders.delete,
  })
}

// Games hooks
export const useGames = (params?: Parameters<typeof games.getAll>[0]) => {
  return useQuery({
    queryKey: ['games', params],
    queryFn: () => games.getAll(params),
  })
}

export const useGame = (id: string) => {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => games.getById(id),
  })
}

export const useCreateGame = () => {
  return useMutation({
    mutationFn: games.create,
  })
}

export const useUpdateGame = () => {
  return useMutation({
    mutationFn: ({ id, ...data }: Parameters<typeof games.update>[1] & { id: string }) =>
      games.update(id, data),
  })
}

export const useDeleteGame = () => {
  return useMutation({
    mutationFn: games.delete,
  })
}

// Updates hooks
export const useNotifications = (params: { userId: string; type: string }) => {
  const { data, error, isLoading } = useSWR(
    ['/notifications', params],
    () => notifications.getAll(params)
  );
  return { data: data?.data, error, isLoading };
};

export const useNotification = (id: string) => {
  return useQuery({
    queryKey: ['notification', id],
    queryFn: () => notifications.getById(id),
  })
}

// Settings hooks
export const useUpdateCommands = (params: { gameId: string }) => {
  const { data, error, isLoading } = useSWR(
    ['/update-commands', params],
    () => updateCommands.getAll(params)
  );
  return { data: data?.data, error, isLoading };
};

export const useUpdateCommand = () => {
  return useMutation({
    mutationFn: updateCommands.create,
  })
}

// Updates hooks
export const useUpdates = (params?: Parameters<typeof updates.getAll>[0]) => {
  return useQuery({
    queryKey: ['updates', params],
    queryFn: () => updates.getAll(params),
  })
}

export const useUpdate = (id: string) => {
  return useQuery({
    queryKey: ['update', id],
    queryFn: () => updates.getById(id),
  })
}

export const useCreateUpdate = () => {
  return useMutation({
    mutationFn: updates.create,
  })
}

export const useUpdateUpdate = () => {
  return useMutation({
    mutationFn: ({ id, ...data }: Parameters<typeof updates.update>[1] & { id: string }) =>
      updates.update(id, data),
  })
}

export const useDeleteUpdate = () => {
  return useMutation({
    mutationFn: updates.delete,
  })
} 

export const useMetrics = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: monitoring.getMetrics,
  })
}

// User subscription hooks
export const useUserSubscriptions = (params?: Parameters<typeof subscriptions.getUserSubscriptions>[0]) => {
  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: () => subscriptions.getUserSubscriptions(params),
  });
};

export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: subscriptions.createSubscription,
  });
};

export const useDeleteSubscription = () => {
  return useMutation({
    mutationFn: subscriptions.deleteSubscription,
  });
};

// Admin subscription hooks
export const useAdminUserSubscriptions = (
  userId: string,
  params?: Parameters<typeof subscriptions.adminGetUserSubscriptions>[1],
) => {
  return useQuery({
    queryKey: ['admin', 'subscriptions', userId, params],
    queryFn: () => subscriptions.adminGetUserSubscriptions(userId, params),
  });
};

export const useAdminDeleteSubscription = () => {
  return useMutation({
    mutationFn: subscriptions.adminDeleteSubscription,
  });
};

// Group subscription hooks
export const useGroupSubscriptions = (
  groupId: string,
  params?: Parameters<typeof subscriptions.getGroupSubscriptions>[1],
) => {
  return useQuery({
    queryKey: ['group-subscriptions', groupId, params],
    queryFn: () => subscriptions.getGroupSubscriptions(groupId, params),
  });
};

export const useCreateGroupSubscription = () => {
  return useMutation({
    mutationFn: ({ groupId, ...data }: Parameters<typeof subscriptions.createGroupSubscription>[1] & { groupId: string }) =>
      subscriptions.createGroupSubscription(groupId, data),
  });
};

export const useDeleteGroupSubscription = () => {
  return useMutation({
    mutationFn: ({ groupId, id }: { groupId: string; id: string }) =>
      subscriptions.deleteGroupSubscription(groupId, id),
  });
};