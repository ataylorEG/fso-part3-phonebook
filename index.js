const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())
app.use(express.json());

// Create a new token for request body
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
  });
  
  // Define a custom format string for Morgan
  const customFormat = ':method :url :status :res[content-length] - :response-time ms :body';
  
  // Add Morgan as a middleware with the custom format
  app.use(morgan(customFormat));

// Sample data for phonebook entries
let people = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// Home route
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

// Route to get all people in the phonebook
app.get('/api/persons', (request, response) => {
  response.json(people);
});

// Route to get a specific person by their ID
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = people.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Route to delete a person by their ID
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const initialLength = people.length;
    people = people.filter((person) => person.id !== id);
  
    if (initialLength > people.length) {
      response.status(204).end(); // Person was found and deleted, return 204 No Content
    } else {
      response.status(404).json({ error: 'Person not found' }); // Person not found, return 404 Not Found
    }
  });

// Function to generate a new ID for a person
const generateId = () => {
    const minId = 1;
    const maxId = 100000;
    return Math.floor(Math.random() * (maxId - minId + 1)) + minId;
  };

// Route to create a new person
app.post('/api/persons', (request, response) => {
    const body = request.body;
  
    // Check if the name or number is missing
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'Name or number is missing',
      });
    }
  
    // Check if the name already exists in the phonebook
    const nameExists = people.some((person) => person.name === body.name);
    if (nameExists) {
      return response.status(400).json({
        error: 'Name must be unique',
      });
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    };
  
    people = people.concat(person);
  
    response.json(person);
  });

// Route to display phonebook info
app.get('/info', (request, response) => {
  const currentTime = new Date().toString(); // Get the current date and time as a string
  const numberOfEntries = people.length; // Calculate the number of entries in the phonebook

  response.send(`
    <p>Phonebook has entries for ${numberOfEntries} people</p>
    ${currentTime}
  `);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});