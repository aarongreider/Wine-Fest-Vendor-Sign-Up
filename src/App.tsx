import React, { useEffect, useRef, useState } from 'react'
import "./App.css"
import { fetchWineData, getActiveBooth, groupBooths } from './utils.ts';
import { Booth, Bottle, Edit, EditTypes } from './types.ts';
import Tag from './Tag.tsx';
import InputSelect from './InputSelect.tsx';
import NewBottleForm from './NewBottleForm.tsx';
import WarningWidget from './WarningWidget.tsx';

/* https://cdn.jsdelivr.net/gh/aarongreider/Wine-Fest-Vendor-Sign-Up@main/dist/jj-aaron-winefest-vendor-dashboard-1.0.0.js
   https://cdn.jsdelivr.net/gh/aarongreider/Wine-Fest-Vendor-Sign-Up@main/dist/jj-aaron-winefest-vendor-dashboard.css
 */

function App() {
  const [formState, setFormState] = useState({})
  const [loading, setLoading] = useState<boolean>(true)
  const [dirtyItem, setDirtyItem] = useState<Record<string, boolean>>({})
  const [dirtyCount, setDirtyCount] = useState(0)
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
    console.log("v 1.0.1")
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
    if (dirtyCount > 0/*  || changeLog.size > 0 */) {
      alert("Please save your changes before submitting")
      return
    }
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
    setDirtyCount(Object.values(dirtyItem).filter(Boolean).length)
    setIsSubmitted(false)

  }, [dirtyItem])

  useEffect(() => { // ensure the unsaved changes are tracked 
    if (!dirtyCount && !changeLog) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    if (dirtyCount > 0 || changeLog.size > 0) {
      window.addEventListener("beforeunload", handleBeforeUnload)
    }

    return () => window.removeEventListener("beforeunload", handleBeforeUnload)

  }, [dirtyCount, changeLog])



  return <>
    <form id="formroot" action="" onSubmit={handleSubmit} ref={formRef}>

      <div>
        <label htmlFor="email">Email:&nbsp;&nbsp;</label>
        <input type="email" name="email" id="email" required onInput={handleChangeSimple} />
      </div>

      <div className='flex column card'>
        <b>Add or select your booth</b>
        <i>Begin typing your booth name to reveal existing booths. If your booth does not exist yet, type the <u>public facing name</u> of your booth and select "Add New Booth"</i>
        <InputSelect id="booth-select" label="Booth" items={booths} _key="name" loading={loading} readOnly={dirtyCount > 0} handleChange={handleBoothSelect} handleAdd={addPlaceholderBooth} />
        {dirtyCount ? <i>Please save your changes before editing another booth.</i> : undefined}
      </div>
      
      <WarningWidget dirtyCount={dirtyCount} changeLog={changeLog}></WarningWidget>

      {activeBooth && <div className="flex column card" style={{ gap: '12px', width: '100%' }}>
        <div className="flex column" style={{ gap: 0 }}>
          {/* <hr style={{ width: '100%', marginTop: "30px" }} /> */}
          <i>Currently Editing</i>
          <h3 style={{ padding: 0, margin: 0 }}>{activeBoothName}</h3>
        </div>
        {activeBoothName && !addingBottle && <button style={{ textWrap: 'nowrap' }} onClick={startAddBottle} disabled={!activeBooth || activeBooth.bottles.length >= 5}>+ Add a Wine</button>}
        {addingBottle && activeBooth ? <NewBottleForm bottles={bottles} activeBooth={activeBooth} loading={loading} addBottle={addBottle} /> : undefined}
        <div style={{ display: 'flex', flexDirection: "column", gap: "8px", flexWrap: 'wrap', width: "100%", overflow: "scroll" }}>
          {activeBooth ?
            activeBooth.bottles.length > 0
              ? activeBooth.bottles.map((bottle) => <Tag key={String(bottle["Wine ID"])} item={bottle} bottles={bottles} loading={loading} deleteBottle={deleteBottle} editBottle={changeBottle} setDirtyItem={handleSetDirtyItem} />)
              : <i>No wines here–Try adding one!</i>
            : undefined}
        </div>
      </div>}


      <button type='submit' value="Submit"
        style={{ background: "rgb(63, 63, 63)", padding: "10px 20px", fontWeight: "bold", fontSize: "18px", color: "white", textWrap: 'nowrap' }}>
        Save Changes
      </button>
      <WarningWidget dirtyCount={dirtyCount} changeLog={changeLog}></WarningWidget>

      {isSubmitted ? <p>Your response has been recorded. Thank you for making our 2026 International Wine Festival possible!</p> : undefined}
    </form>
  </>
}

export default App