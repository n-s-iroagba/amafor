export interface InitializePaymentResponse {
    access_code: string
    reference: string
    authorizationUrl: string
}

export enum PaymentType {
    SUBSCRIPTION = 'subscription',
    ADVERTISMENT = 'advertisment'
}