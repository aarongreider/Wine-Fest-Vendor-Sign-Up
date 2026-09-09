export type Bottle = {
    Created_Time: string
    Modified_Time: string
    "Booth #": string
    Booth_Name: string
    Wine_Name: string
    Price: number | string
    Region: string
    Is_VIP: string
    Wine_ID: number | string
    "Submitter Email Address": string
    "Distributor Name": string
    "Distributor Phone #": string | number
    "Distributor Email": string
    "Winery Name": string
    "Winery Phone #": string | number
    "Winery Email": string
}

export type Booth = {
    name: string
    number: string
    bottles: Bottle[]
}

export type Region = {
    name: string
    booths: Booth[]
}

export type Distributor = {
    name: string
    phone: string
    email: string
    booths: Booth[]
}

export enum EditTypes { CHANGE="CHANGE", ADD="ADD", DELETE="DELETE" }

export type Edit = {
    bottle: Bottle
    type: EditTypes
}