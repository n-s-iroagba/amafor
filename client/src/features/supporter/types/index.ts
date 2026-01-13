export interface Supporter{
    id:string
    tierId:string
    name:string
    imageUrl:string
    createdAt:Date
}

export interface SupporterTier{
    name:'Advocate'|'Grand Patron'|'Patron'|'Legend'|'Supporter'
    billing:string
    price:string
    benefits:string[]
}
export interface SupporterWithTier extends Supporter{
    tier:SupporterTier
}