import React,{ useState } from "react"
import axios from "axios"
import "./App.css"

export default function App() {
  const [name,setName] = useState("")
  const [age,setAge] = useState("")
  const [gender,setGender] = useState("")
  const [goal,setGoal] = useState("")
  const [experience,setExperience] = useState("")
  const [equipment,setEquipment] = useState("")
  const [daysPerWeek,setdaysPerWeek] = useState("")
  
  const [planData,setPlanData] = useState(null)

  const generatePlan = async(e)=>{
    e.preventDefault();

    if(!name || !age || !gender || !goal || !experience || !equipment || !daysPerWeek){
      alert("Please fill all fields before generating the plan.")
      return
    } else {
      const data = {
      name,
      age: parseInt(age),
      gender,
      goal,
      experience,
      equipment: equipment.split(",").map((e)=>e.trim()),
      days_per_week: parseInt(daysPerWeek)
    }

    try{
      const res = await axios.post("https://workout-generator-gnhv.onrender.com/api/workout/generate",data)
      setPlanData(res.data)
    } catch(error){
      console.error(error)
    }
    console.log(planData)
    }
  }

  return (
    <div>
      <h1>Workout Plan Generator</h1>
      <form onSubmit={generatePlan}>
        <h4>Name - <input placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}/></h4>
        <h4>Age - <input type="number" min="0" placeholder="Enter your age" onChange={(e)=>setAge(e.target.value)}/></h4>
        <h4>Gender - <select onChange={(e)=>setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select></h4>
        <h4>Goals - <select value={goal} onChange={(e)=>setGoal(e.target.value)}>
          <option value="">Select Goal</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="fat_loss">Fat Loss</option>
          <option value="endurance">Endurance</option>
          <option value="general_fitness">General Fitness</option>
        </select></h4>
        <h4>Experience Level - <select value={experience} onChange={(e)=>setExperience(e.target.value)}>
          <option value="">Select Experience Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advance">Advance</option>
        </select></h4>
        <h4>Equipment - <input placeholder="Enter the equipment (comma-separated)" onChange={(e)=>setEquipment(e.target.value)}/></h4>
        <h4>Days Per Week - <input placeholder="Enter the days per week" onChange={(e)=>setdaysPerWeek(e.target.value)}/></h4>
        <br />
        <button type="submit">Generate Plan</button>
      </form>
      {planData && (
        <div>
          <h2>Workout Plan for {planData.client}</h2>
          {planData && (
            <div>
              {planData.plan.map((ses)=>(
                <div key={ses.session}>
                  <h3>Session {ses.session} - {ses.date}</h3>
                  {["warmup","main","cooldown"].map((sec)=>(
                    <div>
                      <h4>{sec.toUpperCase()} EXERCISES</h4>
                      {ses.sections[sec].map((e)=>(
                        <p><strong>{e.name}</strong> - Duration: {e.duration} mins, Sets: {e.sets}, Reps: {e.reps || "N/A"}</p>
                      ))}
                    </div>
                  ))}
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <br /><br />
    </div>
  )
}
