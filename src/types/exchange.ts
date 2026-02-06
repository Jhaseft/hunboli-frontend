export interface ExchangeProvider {
  proveedor: string;
  precio: number;
  aceptacion_porcentaje: number;
  operaciones_mes: number;
  rango_pen: {
    minimo: number;
    maximo: number;
    texto: string;
  };
  liquidez: {
    surplusAmount: number;
    tradableQuantity: number;
  };
  bancos: Array<{
    nombre: string;
  }>;
}

export interface ExchangeResponse {
  success: boolean;
  total: number;
  data: ExchangeProvider[];
}