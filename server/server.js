const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Groq = require('groq-sdk')
require("dotenv").config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function generatePlan(profile){
  const prompt = `Generate only a raw JSON array with 12 workout sessions for the following client:
  - Name: ${profile.name}
  - Age: ${profile.age}
  - Gender: ${profile.gender}
  - Goal: ${profile.goal}
  - Experience: ${profile.experience}
  - Equipment: ${profile.equipment.join(', ')}
  - Days per week: ${profile.days_per_week}

  Each session must include:
  - session number
  - date (in YYYY-MM-DD format)
  - sections: warmup, main, cooldown (arrays of exercises)

  Each exercise should include:
  - name
  - duration (in minutes)
  - sets
  - reps (if applicable)

  Do NOT include any explanations or headings. Return only valid JSON.`

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
    })

    const t = completion.choices[0].message.content
    const plan = JSON.parse(t)
    return{client:profile.name,plan}
  } catch(e){
    console.error('Failed to generate plan:',e)
  }
}

app.post('/api/workout/generate',async(req,res)=>{
  const profile = req.body
  try{
    const plan = await generatePlan(profile)
    res.json(plan)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate plan using AI.' })
  }
})

const PORT = process.env.PORT
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
