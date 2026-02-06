import api from '@/lib/axios';

export const P2PService = {

    p2pservice: async () => {
        const { data } = await api.get('/p2-p');
        return data;
    }

}