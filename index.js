const express = require('express')
const app = express()

app.use(express.json())

let people = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/people', (request, response) => {
    response.json(people)
  })
  
  app.get('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    people = people.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    const maxId = people.length > 0
      ? Math.max(...people.map(p => p.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/people', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    const person = { 
        name: body.name,
        number: body.number,
        id: generateId()
      },
  
    people = people.concat(person)
  
    response.json(person)
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })