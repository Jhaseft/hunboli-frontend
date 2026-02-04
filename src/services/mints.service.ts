import api from '@/lib/axios';

export const mintsService = {
  getPendingCount: async () => {
    const { data } = await api.get('/admin/mints/count-pending');
    return data;
  },
};
