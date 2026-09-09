import React, { useEffect, useRef, useState } from 'react'
import "./App.css"
import { fetchWineData, getActiveBooth, groupBooths } from './utils.ts';
import { Booth, Bottle, Edit, EditTypes } from './types.ts';
import Tag from './Tag.tsx';
import InputSelect from './InputSelect.tsx';
import NewBottleForm from './NewBottleForm.tsx';
import WarningWidget from './WarningWidget.tsx';
import { Icon_Add } from './Icons.tsx';

function App() {
  const [formState, setFormState] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [dirtyItem, setDirtyItem] = useState<Record<string, boolean>>({})
  const [dirtyCount, setDirtyCount] = useState(0)
  const [changeLog, setChangeLog] = useState<Map<string, Edit>>(new Map())
  const [booths, setBooths] = useState<Booth[]>([])
  const [bottles, setBottles] = useState<Bottle[]>([])
  const [activeBoothName, setActiveBoothName] = useState<string>()
  const [activeBooth, setActiveBooth] = useState<Booth>()
  const formRef = useRef<HTMLFormElement>(null)
  const submitOverrideRef = useRef<Record<string, Edit> | null>(null)
  const [addingBottle, setAddingBottle] = useState<Boolean>(false)

  useEffect(() => {
    fetchData();
    console.log("v 1.1.1")
  }, [])

  const fetchData = async () => {
    try {
      const _bottles: Bottle[] = await fetchWineData();
      const _booths: Booth[] = groupBooths(_bottles);
      console.log(_bottles)
      setBooths(_booths);
      setBottles(_bottles);
      setLoading(false)
    } catch {
      console.log("Error fetching data in useEffect");
    }
  };

  const updateFormValidity = () => {
    const form = formRef.current
    if (!form) {
      setIsFormValid(false)
      return
    }

    setIsFormValid(form.checkValidity())
  }

  const handleChangeSimple = (e: any) => {
    console.log("change", e.target.name, e.target.value)
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    updateFormValidity()
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    const form = e?.currentTarget ?? formRef.current
    const overrideLog = submitOverrideRef.current

    if (form && !form.checkValidity()) {
      form.reportValidity()
      submitOverrideRef.current = null
      return
    }

    if (dirtyCount > 0 && !overrideLog) {
      alert("Please save your changes to each bottle you are editing before submitting")
      submitOverrideRef.current = null
      return
    }

    try {
      postForm(overrideLog ?? Object.fromEntries(changeLog))
    } catch (error) {
      console.log(error)
    }

    if (overrideLog) {
      const wineId = Object.keys(overrideLog)[0]
      setChangeLog((currentLog) => {
        const updated = new Map(currentLog)
        updated.delete(wineId)
        return updated
      })
    } else {
      setChangeLog(new Map())
    }

    submitOverrideRef.current = null
  }

  const submitSingleTagChange = (item: Bottle) => {
    const wineId = String(item["Wine_ID"])
    const singleChange: Edit = {
      bottle: item,
      type: EditTypes.CHANGE,
    }

    setDirtyItem((currentDirtyItems) => ({ ...currentDirtyItems, [wineId]: false }))
    submitOverrideRef.current = { [wineId]: singleChange }
    formRef.current?.requestSubmit()
  }

  const handleBoothSelect = (e: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if (!isFormValid) return

    e.preventDefault()
    const target = e.target as HTMLButtonElement
    const boothMatch: Booth | undefined = booths.find((booth) => booth.name === target.value)
    boothMatch !== undefined ? setActiveBoothName(boothMatch.name) : undefined
  }

  const addPlaceholderBooth = (e: React.MouseEvent<HTMLButtonElement>, name: string) => {
    if (!isFormValid) return

    e;
    const boothName = name.trim()
    if (!boothName) return

    const boothNumber = String(Date.now())

    setBooths((currentBooths) => {
      if (currentBooths.some((booth) => booth.name === boothName)) {
        return currentBooths
      }

      return [...currentBooths, {
        name: boothName,
        number: boothNumber,
        bottles: [],
      }]
    })
    setActiveBoothName(boothName)
  }

  const deleteBottle = (item: Bottle) => {
    console.log("removing item, ", item.Wine_Name, item.Booth_Name)
    if (!activeBoothName) return

    const prompt = confirm(`are you sure you want to delete ${item.Wine_Name}?`)
    if (!prompt) return

    const wineId = String(item["Wine_ID"])

    addToChangeLog(item, EditTypes.DELETE)
    setBottles((currentBottles) => currentBottles.filter((bottle) =>
      String(bottle["Wine_ID"]) !== wineId
    ))
    setBooths((currentBooths) =>
      currentBooths.map((booth) =>
        booth.name === activeBoothName
          ? { ...booth, bottles: booth.bottles.filter((bottle) => String(bottle["Wine_ID"]) !== wineId) }
          : booth
      )
    )
    setActiveBooth((currentBooth) => currentBooth && currentBooth.name === activeBoothName
      ? { ...currentBooth, bottles: currentBooth.bottles.filter((bottle) => String(bottle["Wine_ID"]) !== wineId) }
      : currentBooth
    )

    submitOverrideRef.current = {
      [wineId]: {
        bottle: item,
        type: EditTypes.DELETE,
      }
    }

    formRef.current?.requestSubmit()
  }

  const startAddBottle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!activeBooth) {
      alert("Please select a booth first")
      return
    }
    setAddingBottle(true)
  }

  const addBottle = (item: Bottle) => {
    setAddingBottle(false)
    console.log("adding item, ", item.Wine_Name, item.Booth_Name)
    if (!activeBoothName) return

    const wineId = String(item["Wine_ID"])

    addToChangeLog(item, EditTypes.ADD)
    setBottles((currentBottles) => [...currentBottles, item])
    setBooths((currentBooths) =>
      currentBooths.map((booth) =>
        booth.name === activeBoothName
          ? { ...booth, bottles: [...booth.bottles, item] }
          : booth
      )
    )

    submitOverrideRef.current = {
      [wineId]: {
        bottle: item,
        type: EditTypes.ADD,
      }
    }
    formRef.current?.requestSubmit()
  }

  const changeBottle = (item: Bottle) => {
    console.log("changing item, ", item.Wine_Name, item.Booth_Name)
    addToChangeLog(item, EditTypes.CHANGE)

    setBottles((currentBottles) => currentBottles.map((bottle) =>
      String(bottle["Wine_ID"]) === String(item["Wine_ID"]) ? item : bottle
    ))

    if (!activeBoothName) return

    setBooths((currentBooths) =>
      currentBooths.map((booth) =>
        booth.name === activeBoothName
          ? {
            ...booth,
            bottles: booth.bottles.map((bottle) => String(bottle["Wine_ID"]) === String(item["Wine_ID"]) ? item : bottle)
          }
          : booth
      )
    )
  }

  const addToChangeLog = (bottle: Bottle, type: EditTypes) => {
    const wineId = String(bottle["Wine_ID"])
    const newChange: Edit = { bottle, type }

    setChangeLog((currentLog) => {
      const updated = new Map(currentLog)
      updated.set(wineId, newChange)
      return updated
    })
  }

  const postForm = async (overrideLog?: Record<string, Edit>) => {
    const payloadLog = overrideLog ?? Object.fromEntries(changeLog)

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbx0uNsq4rhJUt-eH2cq5m6LvQm1qS8wXnk9AwvW4vHJgXTbqwrD1UoCLGsWwqpGc1Ieow/exec",
        {
          redirect: "follow",
          method: "POST",
          body: JSON.stringify({
            action: "formSubmit",
            formData: formState,
            submit_time: new Date().toISOString(),
            changeLog: payloadLog
          }),
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          }
        }
      )

      if (!response.ok) {
        console.log("Server Error. Please wait one moment and resubmit.")
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("server response:");
      console.log(data);
      console.log(JSON.parse(data.eventObject.postData.contents));

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
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
  }, [bottles, activeBoothName])

  useEffect(() => {
    setAddingBottle(false)
  }, [activeBoothName])

  useEffect(() => {
    console.log("dirty?", dirtyItem, dirtyCount)
    setDirtyCount(Object.values(dirtyItem).filter(Boolean).length)
  }, [dirtyItem])

  useEffect(() => {
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
    <form id="formroot" action="" onSubmit={handleSubmit} ref={formRef} onKeyDown={(e) => {
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault()
      }
    }}>

      <div>
        <label htmlFor="email">Email:&nbsp;&nbsp;</label>
        <input type="email" name="email" id="email" required onInput={handleChangeSimple} />
      </div>

      <div className='flex column card'>
        <b>Add or select your booth</b>
        <i>Begin typing your booth name to reveal existing booths. If your booth does not exist yet, type the <u>public facing name</u> of your booth and select <b>Add New Booth</b></i>
        <InputSelect id="booth-select" label="Booth" items={booths} _key="name" loading={loading} readOnly={dirtyCount > 0 || !isFormValid} handleChange={handleBoothSelect} handleAdd={addPlaceholderBooth} />
        {!isFormValid ? <i>Please complete the required form fields before selecting or adding a booth.</i> : undefined}
        {dirtyCount ? <i>Please save your changes before editing another booth.</i> : undefined}
      </div>

      <WarningWidget dirtyCount={dirtyCount} changeLog={changeLog}></WarningWidget>

      {activeBooth && <div className="flex column card" style={{ gap: '12px', width: '100%' }}>
        <div className="flex column" style={{ gap: 0 }}>
          <i>Currently Editing</i>
          <h3 style={{ padding: 0, margin: 0 }}>{activeBoothName}</h3>
        </div>
        <ul>
          <li>View your wine details below by clicking a wine.</li>
          <li> If you would like to edit the details, select <b>Edit Wine</b> below the details section.</li>
          <li>Click <b>Save Changes</b> when you are done editing! <i>Clicking this button saves your data to the database.</i></li>
          <li>You may add up to 5 wines per booth.</li>
        </ul>
        {activeBoothName && !addingBottle && <button className='flex row btn dark' onClick={startAddBottle} disabled={!activeBooth || activeBooth.bottles.length >= 5}>
          <Icon_Add /> Add a Wine
        </button>}
        {addingBottle && activeBooth ? <NewBottleForm bottles={bottles} activeBooth={activeBooth} loading={loading} addBottle={addBottle} /> : undefined}
        <div style={{ display: 'flex', flexDirection: "column", gap: "8px", flexWrap: 'wrap', width: "100%", overflow: "scroll" }}>
          {activeBooth ?
            activeBooth.bottles.length > 0
              ? activeBooth.bottles.map((bottle) => <Tag key={String(bottle["Wine_ID"])} item={bottle} bottles={bottles} loading={loading} deleteBottle={deleteBottle} editBottle={changeBottle} setDirtyItem={handleSetDirtyItem} submitForm={submitSingleTagChange} />)
              : <i>No wines here–Try adding one!</i>
            : undefined}
        </div>
      </div>}
    </form>
  </>
}

export default App