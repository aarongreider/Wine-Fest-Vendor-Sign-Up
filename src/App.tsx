import React, { useEffect, useRef, useState } from 'react'
import "./App.css"
import { fetchWineData, getActiveBooth, groupBooths } from './utils.ts';
import { Booth, Bottle, Edit, EditTypes } from './types.ts';
import Tag from './Tag.tsx';
import InputSelect from './InputSelect.tsx';
import NewBottleForm from './NewBottleForm.tsx';


function App() {
  const [formState, setFormState] = useState({})
  const [loading, setLoading] = useState<boolean>(true)
  const [dirtyItem, setDirtyItem] = useState<Record<string, boolean>>({})
  const [changeLog, setChangeLog] = useState<Map<string, Edit>>(new Map())
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [booths, setBooths] = useState<Booth[]>([])
  const [bottles, setBottles] = useState<Bottle[]>([])
  const [activeBoothName, setActiveBoothName] = useState<string>()
  const [activeBooth, setActiveBooth] = useState<Booth>()
  const formRef = useRef<HTMLFormElement>(null)
  const [addingBottle, setAddingBottle] = useState<Boolean>(false)

  useEffect(() => {  // fetch the initial data and set the state 
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      //console.log("Fetching data");
      const _bottles: Bottle[] = await fetchWineData();
      const _booths: Booth[] = groupBooths(_bottles);
      //const _regions: Region[] = groupRegions(_booths);
      setBooths(_booths);
      setBottles(_bottles);
      setLoading(false)
    } catch {
      console.log("Error fetching data in useEffect");
    }
  };

  const handleChangeSimple = (e: any) => {
    console.log("change", e.target.name, e.target.value)
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitted(true)
    console.log(formState)
    try {
      postForm()
    } catch (error) {
      console.log(error)
    }
    formRef.current?.reset()
    setFormState({})
    setChangeLog(new Map())
    setBottles([])
    fetchData()
  }

  const handleBoothSelect = (e: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault()
    const target = e.target as HTMLButtonElement
    let boothMatch: Booth | undefined = booths.find((booth) => booth.name == target.value)
    console.log(boothMatch)
    boothMatch != undefined ? setActiveBoothName(boothMatch.name) : undefined
  }

  const addPlaceholderBooth = (e: React.MouseEvent<HTMLButtonElement>, name: string) => {
    e;
    const boothName = name.trim()
    if (!boothName) return

    setBooths((currentBooths) => {
      if (currentBooths.some((booth) => booth.name === boothName)) {
        return currentBooths
      }

      return [...currentBooths, {
        name: boothName,
        number: `placeholder-${Date.now()}`,
        bottles: [],
      }]
    })
    setActiveBoothName(boothName)
  }

  const deleteBottle = (item: Bottle) => {
    console.log("removing item, ", item['Wine Name / Type'], item['Booth Name'])
    if (!activeBoothName) return

    const prompt = confirm(`are you sure you want to delete ${item['Wine Name / Type']}?`)
    if (!prompt) return
    addToChangeLog(item, EditTypes.DELETE)
    setBottles((currentBottles) => currentBottles.filter((bottle) =>
      String(bottle['Wine ID']) !== String(item['Wine ID'])
    ))
  }

  const startAddBottle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    //const target = e.target as HTMLButtonElement
    if (!activeBooth) {
      alert("Please select a booth first")
      return
    }
    setAddingBottle(true)
  }

  const addBottle = (item: Bottle) => {
    setAddingBottle(false)
    console.log("adding item, ", item['Wine Name / Type'], item['Booth Name'])
    if (!activeBoothName) return

    addToChangeLog(item, EditTypes.ADD)
    setBottles(bottles => [...bottles, item])
  }

  const changeBottle = (item: Bottle) => {
    console.log("changing item, ", item['Wine Name / Type'], item['Booth Name'])
    addToChangeLog(item, EditTypes.CHANGE)

    setBottles((currentBottles) => currentBottles.map((bottle) =>
      String(bottle['Wine ID']) === String(item['Wine ID']) ? item : bottle
    ))

    if (!activeBoothName) return

    setBooths((currentBooths) =>
      currentBooths.map((booth) =>
        booth.name === activeBoothName
          ? {
            ...booth,
            bottles: booth.bottles.map((bottle) => bottle['Wine ID'] === item['Wine ID'] ? item : bottle)
          }
          : booth
      )
    )
  }

  const addToChangeLog = (bottle: Bottle, type: EditTypes) => {
    const wineId = bottle['Wine ID']
    const newChange: Edit = { bottle, type }

    setChangeLog((currentLog) => {
      const updated = new Map(currentLog)
      updated.set(wineId, newChange)
      return updated
    })
  }

  const postForm = async () => {
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbx0uNsq4rhJUt-eH2cq5m6LvQm1qS8wXnk9AwvW4vHJgXTbqwrD1UoCLGsWwqpGc1Ieow/exec",
        {
          redirect: "follow",
          method: "POST",
          body: JSON.stringify({
            action: "formSubmit",
            formData: formState,
            changeLog: Object.fromEntries(changeLog)
          }),
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          }
        }
      )

      if (!response.ok) {
        console.log("Server Error. Please wait one moment and resubmit.")
        //setSubState(subStates.errorServer)
        throw new Error('Network response was not ok');
      }

      var data = await response.json();
      console.log("server response:");
      console.log(data);
      console.log(JSON.parse(data.eventObject.postData.contents));

      /* if (isSubmitted) {
        console.log("Submitted")
        //setSubState(subStates.success)
      } */
    } catch (error) {
      //setSubState(subStates.errorServer)
      console.error('There was a problem with the fetch operation:', error);
      throw error; // Ensure the error is propagated if necessary 

    }
  }

  const handleSetDirtyItem = (wine: Record<string, boolean>) => {
    setDirtyItem((currentDirtyItems) => ({ ...currentDirtyItems, ...wine }))
  }

  const dirtyCount = Object.values(dirtyItem).filter(Boolean).length

  useEffect(() => {
    console.log(JSON.stringify(Object.fromEntries(changeLog)))
  }, [changeLog])

  useEffect(() => {
    setBooths(groupBooths(bottles))
  }, [bottles])

  useEffect(() => {
    if (!activeBoothName) return
    const booth = getActiveBooth(booths, activeBoothName)
    setActiveBooth(booth)
  })

  useEffect(() => {
    setAddingBottle(false)
  }, [activeBoothName])

  useEffect(() => {
    console.log("dirty?", dirtyItem, dirtyCount)
    setIsSubmitted(false)

  }, [dirtyItem])



  return <>
    <form action="" onSubmit={handleSubmit} ref={formRef}>
      <div className="flex column">
        <p>
          Use this form to add a new winery, new distributor, or a new wine to your booth catalogue.
          Please submit this form once for each wine in your catalogue.
        </p>
        <p>
          If you realize you need to remove a wine from your wine catalogue, use the form link below to make an official log of them or reach out to TJ Askren at taskren@junglejims.com.
          If you are simply adding more wines to your catalogue, use this current form.
        </p>
        <a href="https://forms.gle/bveAaPM2D44VhCQi9">https://forms.gle/bveAaPM2D44VhCQi9</a>
        <br />
      </div>

      <div>
        <label htmlFor="email">Email:&nbsp;&nbsp;</label>
        <input type="email" name="email" id="email" required onInput={handleChangeSimple} />
      </div>

      <div>
        <InputSelect label="Select a Booth" items={booths} _key="name" loading={loading} readOnly={dirtyCount > 0} handleChange={handleBoothSelect} handleAdd={addPlaceholderBooth} />
        {dirtyCount ? <i>Please save your changes before editing another booth.</i> : undefined}
      </div>

      {activeBoothName && <div className="flex column" style={{ gap: 0 }}>
        <hr style={{ width: '100%', marginTop: "30px" }} />
        <i>Currently Editing</i>
        <h3 style={{ padding: 0, margin: 0 }}>{activeBoothName}</h3>
      </div>}
      <button style={{ textWrap: 'nowrap' }} onClick={startAddBottle}>+ Add a Wine</button>
      {addingBottle && activeBooth ? <NewBottleForm bottles={bottles} activeBooth={activeBooth} loading={loading} addBottle={addBottle} /> : undefined}

      <div style={{ display: 'flex', flexDirection: "column", gap: "8px", flexWrap: 'wrap', marginBottom: '20px', maxWidth: "100%", overflow: "scroll" }}>
        {activeBooth ?
          activeBooth.bottles.length > 0
            ? activeBooth.bottles.map((bottle) => <Tag key={String(bottle["Wine ID"])} item={bottle} bottles={bottles} loading={loading} deleteBottle={deleteBottle} editBottle={changeBottle} setDirtyItem={handleSetDirtyItem} />)
            : <i>No wines here–Try adding one!</i>
          : undefined}
      </div>

      <button type='submit' value="Submit">Submit</button>
      {isSubmitted ? <p>Your response has been recorded. Thank you for making our 2026 International Wine Festival possible!</p> : undefined}
    </form>
  </>
}

export default App