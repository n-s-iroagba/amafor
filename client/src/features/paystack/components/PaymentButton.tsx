'use client'


import { API_ROUTES } from '@/config/routes'

import PaystackPop from '@paystack/inline-js'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { InitializePaymentResponse } from '../types'
import { usePost } from '@/shared/hooks/useApiQuery'
import { CreditCard } from 'lucide-react'


export type PaymentButtonProps<T> = {
    paymentDetails: T
    type: 'subscription' | 'donation'
}





export default function PaymentButton<T>(props

    : PaymentButtonProps<T>) {
    const router = useRouter()

    const { post, isPending } = usePost<T, { data: InitializePaymentResponse }>(API_ROUTES.PAYMENT.INITIALIZE_GATEWAY)



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
        } finally {

        }
    }

    return (
        <button
            className='bg-blue-600 py-3 px-3 text-white'
            onClick={initiateTransaction}

            disabled={isPending}>
            <CreditCard className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2" />
            {isPending ? 'Processing...' : props.type === 'subscription' ? 'Subscribe' : 'Donate'}
        </button>
    )
}