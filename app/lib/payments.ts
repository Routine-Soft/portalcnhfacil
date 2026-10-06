// app/lib/payments.ts

// Formato do gateway_response salvo no History.
// AbacatePay: payerInformation.method / methods
// Mercado Pago: payment_method_id / payment_type_id
export type GatewayResponse = {
  payerInformation?: {
    method?: string
  }
  methods?: string[]
  payment_method_id?: string
  payment_type_id?: string
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Cartão',
  boleto: 'Boleto',
  ticket: 'Boleto',
  pix: 'PIX',
  bank_transfer: 'PIX',
  debit_card: 'Cartão de Débito',
  credit_card: 'Cartão de Crédito',
  prepaid_card: 'Cartão Pré-pago',
  account_money: 'Saldo Mercado Pago',
}

export function getPaymentMethod(gateway?: GatewayResponse | null): string | undefined {
  if (!gateway) return undefined
  if (gateway.payment_method_id === 'pix') return 'pix'
  return (
    gateway.payerInformation?.method ||
    gateway.methods?.[0] ||
    gateway.payment_type_id ||
    gateway.payment_method_id
  )
}

export function getPaymentMethodLabel(gateway?: GatewayResponse | null): string {
  const method = getPaymentMethod(gateway)
  if (!method) return '-'
  return PAYMENT_METHOD_LABELS[method.toLowerCase()] || method
}
