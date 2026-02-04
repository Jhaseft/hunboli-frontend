import api from '@/lib/axios';

export const HistorialService = {

    getHistorial: async (page = 1, limit = 10) => {
        const { data } = await api.get('/historial-retiro', {
            params: {
                page,
                limit,
            },
        });

        return data;
    }















}