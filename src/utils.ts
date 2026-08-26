import { Booth, Bottle, Distributor, Region } from "./types";
//@ts-ignore
import html2pdf from 'html2pdf.js';

export const fetchWineData = async (): Promise<Bottle[]> => {
    try {
        const response = await fetch("https://script.google.com/a/macros/junglejims.com/s/AKfycbxQqq-6tKwuCZxbyXnGZAxGsx3o0WBc14tk-l1TZMjz0RfRu2V_GhqMYp85izuLUqiJdQ/exec");
        //const response = await fetch("/src/assets/data.json");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const bottleData = data.data
        console.log(bottleData);

        return bottleData as Bottle[]
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // Ensure the error is propagated if necessary 
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
    // get array of all booth names / whatever key is passed in, remove duplicates and sort alphabetically
    let values = new Set(data.map(booth => booth[key]).sort())
    return [...values]
}

export const groupBooths = (response: Bottle[]): Booth[] => {
    // take in the json response and return an object containing each section as an array of items in that section
    // Assuming your data is in an array of objects
    // Initialize an empty object to store the grouped data
    const booths: Booth[] = []

    // Loop through the data and group by the key
    response.forEach((bottle: Bottle) => {
        const boothNum: number = bottle["Booth #"]
        const existingBooth: Booth | undefined = booths.find((booth) => booth.number == boothNum);

        if (existingBooth) {
            existingBooth.bottles.push(bottle)
        } else {
            // If the section doesn't exist in the groupedData object, create it
            const booth: Booth = {
                name: bottle["Booth Name"],
                number: bottle["Booth #"],
                bottles: [bottle]
            }
            booths.push(booth)
        }
    });

    return booths
}

export const groupRegions = (booths: Booth[]): Region[] =>
    groupGeneric(
        booths,
        "What country or region is this wine from?",
        (name, groupedBooths) => ({ name, booths: groupedBooths } as Region)
    )

export const groupDistributors = (booths: Booth[]): Distributor[] =>
    groupGeneric(
        booths,
        "Distributor Name",
        (name, groupedBooths) => ({
            name,
            phone: groupedBooths[0].bottles[0]["Distributor Phone #"],
            email: groupedBooths[0].bottles[0]["Distributor Email"],
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
        const name = booth.bottles[0][key] as string
        if (!grouped[name]) {
            grouped[name] = []
        }
        grouped[name].push(booth)
    })

    return Object.entries(grouped).map(([name, groupedBooths]) => createGroup(name, groupedBooths))
}
