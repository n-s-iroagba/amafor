'use client'

import { API_ROUTES } from '@/config/routes'
import PaystackPop from '@paystack/inline-js'
import { useRouter } from 'next/navigation'
import React from 'react'
import { InitializePaymentResponse, PaymentPayload } from '../types'
import { usePost } from '@/shared/hooks/useApiQuery'
import { CreditCard } from 'lucide-react'

export type PaymentButtonProps = {
    paymentDetails: PaymentPayload
    type: 'subscription' | 'donation'
}

export default function PaymentButton(props: PaymentButtonProps) {
    const router = useRouter()

    const { post, isPending } = usePost<PaymentPayload, { data: InitializePaymentResponse }>(API_ROUTES.PAYMENT.INITIALIZE_GATEWAY)

    const initiateTransaction = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const response = await post(props.paymentDetails)
            console.log(response)

            if (response.data?.access_code) {
                const popup = new PaystackPop()
                popup.resumeTransaction(response.data.access_code)
                if (props.type === 'subscription') {
                    router.push(`/thanks`)
                    return
                }
                router.push('/dashboard/advertiser/')
            }
        } catch (error) {
            alert('Paystack error occured')
            console.error('Transaction initiation failed:', error)
        }
    }

    return (
        <button
            onClick={initiateTransaction}
            disabled={isPending || !props.paymentDetails}
            className="w-full"
        >
            <div className={`w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${isPending ? 'opacity-70 cursor-wait' : ''}`}>
                {isPending ? (
                    'Processing...'
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        {props.type === 'subscription' ? 'Subscribe Now' : 'Donate Now'}
                    </>
                )}
            </div>
        </button>
    )
}