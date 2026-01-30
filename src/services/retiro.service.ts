import api from '@/lib/axios';

export const retiroService = {

  //obtenrer todos los retiros paginados
 getProfile: async (page = 1, limit = 10) => {
  const { data } = await api.get('/admin-retiros', {
    params: {
      page,
      limit,
    },
  });

  return data;
},

  // Actualizar retiro con estado, referencia y archivo
  updateWithdrawal: async (id: string, data: { status: string; payoutTxRef: string; file?: File }) => {
    const formData = new FormData();
    formData.append('status', data.status);
    formData.append('payoutTxRef', data.payoutTxRef);
    if (data.file) formData.append('file', data.file);

    const { data: response } = await api.patch(`/admin-retiros/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  },
};
