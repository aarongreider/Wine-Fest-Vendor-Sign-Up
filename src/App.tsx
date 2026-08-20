import React, { RefObject, useEffect, useRef, useState } from 'react'
import "./App.css"
import { fetchWineData, getActiveBooth, getValueByKey, groupBooths, groupDistributors, groupRegions } from './utils.ts';
import { Booth, Bottle, Region } from './types.ts';
import Tag from './Tag.tsx';
import InputSelect from './InputSelect.tsx';


function App() {
  const [formState, setFormState] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [booths, setBooths] = useState<Booth[]>([])
  const [activeBoothName, setActiveBoothName] = useState<string>()
  const [regions, setRegions] = useState<Region[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const addButtonRef = useRef<HTMLInputElement>(null)

  useEffect(() => {  // fetch the initial data and set the state 
    const fetchData = async () => {
      try {
        //console.log("Fetching data");
        const _bottles: Bottle[] = await fetchWineData();
        const _booths: Booth[] = groupBooths(_bottles);
        //const _regions: Region[] = groupRegions(_booths);
        setBooths(_booths);
      } catch {
        console.log("Error fetching data in useEffect");
      }
    };

    fetchData();
  }, [])

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
  }

  const handleSetActiveBooth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)

  }
  const handleBoothSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const target = e.target as HTMLButtonElement
    let boothMatch: Booth | undefined = booths.find((booth) => booth.name == target.value)
    console.log(boothMatch)
    boothMatch != undefined ? setActiveBoothName(boothMatch.name) : undefined
  }

  const deleteBottle = (item: Bottle) => {
    // filter bottle is not equal to incoming bottle
    console.log("trying to remove item, ", item['Wine Name / Type'], item['Booth Name'])

  }



  const postForm = async () => {
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycby0NfF1QI2eICYik9viJqiICdFdPwMrL-IxpjHD8FWYaK1LwHuUpTSAz93oVOGn3qSRcQ/exec",
        {
          redirect: "follow",
          method: "POST",
          body: JSON.stringify({
            action: "formSubmit",
            formData: formState
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
        <input type="email" name="email" id="email" required onChange={handleChangeSimple} />
      </div>


      <InputSelect label="Select a Booth" items={booths} _key="name" handleChange={handleBoothSelect} />

      {/* <div className="flex column">
        <div className="flex">
          <label htmlFor="distributor_name">Distributor Name:&nbsp;&nbsp;</label>
          <input type="distributor_name" name="distributor_name" id="distributor_name" required onChange={handleChangeSimple} />
        </div>
        <div className="flex">
          <label htmlFor="distributor_phone">Distributor Phone:&nbsp;&nbsp;</label>
          <input type="distributor_phone" name="distributor_phone" id="distributor_phone" required onChange={handleChangeSimple} />
        </div>
        <div className="flex">
          <label htmlFor="distributor_email">Distributor Email:&nbsp;&nbsp;</label>
          <input type="distributor_email" name="distributor_email" id="distributor_email" required onChange={handleChangeSimple} />
        </div>
      </div>

      <div className="flex column">
        <div className="flex">
          <label htmlFor="winery_name">Winery Name:&nbsp;&nbsp;</label>
          <input type="winery_name" name="winery_name" id="winery_name" required onChange={handleChangeSimple} />
        </div>
        <div className="flex">
          <label htmlFor="winery_phone">Winery Phone:&nbsp;&nbsp;</label>
          <input type="winery_phone" name="winery_phone" id="winery_phone" required onChange={handleChangeSimple} />
        </div>
        <div className="flex">
          <label htmlFor="winery_email">Winery Email:&nbsp;&nbsp;</label>
          <input type="winery_email" name="winery_email" id="winery_email" required onChange={handleChangeSimple} />
        </div>
      </div> */}

      {/* <div className="flex">
        <label htmlFor="booth_name">Booth Name:&nbsp;&nbsp;</label>
        <input type="booth_name" name="booth_name" id="booth_name" required onChange={handleChangeSimple} />
      </div> */}


      <div style={{ display: 'flex', gap: "8px", flexWrap: 'wrap', marginBottom: '20px', maxWidth: "100%", overflow: "scroll" }}>
        {activeBoothName && booths ?
          getActiveBooth(booths, activeBoothName).bottles.length > 0
            ? getActiveBooth(booths, activeBoothName).bottles.map((bottle, index) => <Tag key={`${bottle}-${index}`} item={bottle} deleteBottle={deleteBottle} />)
            : <i>No wines here–Try adding one!</i>
          : undefined}
      </div>

      {/* <label htmlFor="ProductInput">Add a new wine:&nbsp;&nbsp;</label>
      <input name="ProductInput" type='text' placeholder="Sauce Name" onKeyDown={(e) => e.key == "Enter" ? handleAddProduct(e) : undefined} ref={addButtonRef}></input><button type="button" style={{ textWrap: 'nowrap' }} onClick={handleAddProduct}>Add +</button>
 */}
      <button type='submit' value="Submit">Submit</button>
      {isSubmitted ? <p>Your response has been recorded. Thank you for making our 2026 International Wine Festival possible!</p> : undefined}
    </form>
  </>
}

export default App