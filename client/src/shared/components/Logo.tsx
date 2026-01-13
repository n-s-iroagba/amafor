'use client'
import Image from 'next/image'
import logo from '@/images/logo.jpeg'

const Logo =()=>{
    return <>
          <Image
                src={logo}
                alt="Amafor Gladiators FC Logo"
                width={56}
                height={56}
                className="object-contain rounded-full border-2 border-sky-500"
                priority
                quality={85}
                sizes="(max-width: 640px) 40px, 56px"
           
                loading="eager"
              />
    </>
}
export default Logo