import { Booth, Bottle, Distributor, Region } from "./types";

export const fetchWineData = async (): Promise<Bottle[]> => {
    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbx0uNsq4rhJUt-eH2cq5m6LvQm1qS8wXnk9AwvW4vHJgXTbqwrD1UoCLGsWwqpGc1Ieow/exec");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data as Bottle[]
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

export const getActiveBooth = (booths: Booth[], activeBoothName: string | undefined) => {
    const match = booths.find((booth) => booth.name === activeBoothName)
    if (!match) {
        return undefined
    }
    return match
}

export const getValueByKey = (data: Bottle[], key: keyof Bottle) => {
    let values = new Set(data.map((booth) => booth[key]).sort())
    return [...values]
}

export const groupBooths = (response: Bottle[]): Booth[] => {
    const booths: Booth[] = []

    response.forEach((bottle: Bottle) => {
        const boothNum = String(bottle["Booth #"])
        const existingBooth: Booth | undefined = booths.find((booth) => String(booth.number) === boothNum)

        if (existingBooth) {
            existingBooth.bottles.push(bottle)
        } else {
            const booth: Booth = {
                name: bottle.Booth_Name,
                number: boothNum,
                bottles: [bottle]
            }
            booths.push(booth)
        }
    })

    return booths
}

export const groupRegions = (booths: Booth[]): Region[] =>
    groupGeneric(
        booths,
        "Region",
        (name, groupedBooths) => ({ name, booths: groupedBooths } as Region)
    )

export const groupDistributors = (booths: Booth[]): Distributor[] =>
    groupGeneric(
        booths,
        "Distributor Name",
        (name, groupedBooths) => ({
            name,
            phone: String(groupedBooths[0].bottles[0]["Distributor Phone #"]),
            email: String(groupedBooths[0].bottles[0]["Distributor Email"]),
            booths: groupedBooths,
        } as Distributor)
    )

export const groupGeneric = (
    booths: Booth[],
    key: keyof Bottle,
    createGroup: (name: string, booths: Booth[]) => any
) => {
    const grouped: { [key: string]: Booth[] } = {}

    booths.forEach((booth) => {
        const name = String(booth.bottles[0][key])
        if (!grouped[name]) {
            grouped[name] = []
        }
        grouped[name].push(booth)
    })

    return Object.entries(grouped).map(([name, groupedBooths]) => createGroup(name, groupedBooths))
}