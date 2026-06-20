import api from '@/lib/axios';

export type ContractEventType =
  | 'MINTED'
  | 'BURNED'
  | 'REDEMPTION_REQUESTED'
  | 'REDEMPTION_FINALIZED'
  | 'REDEMPTION_REJECTED'
  | 'CONFISCATED'
  | 'SYSTEM_PAUSED'
  | 'SYSTEM_UNPAUSED'
  | 'ADDED_TO_BLACKLIST'
  | 'REMOVED_FROM_BLACKLIST'
  | 'TOKENS_RECOVERED'
  | 'TRANSFER';

export interface EventLogItem {
  id: string;
  eventType: ContractEventType;
  txHash: string;
  blockNumber: string;
  userAddress: string | null;
  fromAddress: string | null;
  toAddress: string | null;
  amount: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface EventLogListResponse {
  items: EventLogItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventLogListParams {
  page?: number;
  limit?: number;
  eventType?: ContractEventType;
  userAddress?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const eventLogsService = {
  list: async (params?: EventLogListParams): Promise<EventLogListResponse> => {
    const { data } = await api.get<EventLogListResponse>('listener/event-logs', {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        eventType: params?.eventType,
        userAddress: params?.userAddress,
        dateFrom: params?.dateFrom,
        dateTo: params?.dateTo,
      },
    });
    return data;
  },
};
