export type Bottle = {
    "Timestamp": string,
    "Booth #": number,
    "Distributor Name": string,
    "Winery Name": string,
    "Booth Name": string,
    "Wine Name / Type": string,
    "What country or region is this wine from?": string,
    "Wine Price": number,
    "Wine ID": string,
    "Is this a connoisseur/VIP wine?": string,
    "New Distributor Name": string,
    "New Winery Name": string,
    "If your booth name is not on the list above, enter a new one below. This name will be what is displayed on your booth at the festival.": string,
    "My distributor is not on the list above. I'd like to enter a new distributor": string,
    "My winery is not on the list above. I'd like to enter a new winery": string,
    "Distributor Phone #": string,
    "Distributor Email": string,
    "Winery Phone #": string | number,
    "Winery Email": string,
    "Email Address": string,
    "Continue?": string,
}

export type Booth = {
    name: string
    number: string | number
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