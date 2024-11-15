const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/Task'); // Ensure the path is correct

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Replace <username>, <password>, and <cluster-url> with your MongoDB credentials
mongoose.connect('mongodb+srv://<username>:<password>@<cluster-url>/mydatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

app.get('/', (req, res) => {
  res.send('Hello from Node.js!');
});

// Endpoint to get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to create a new task
app.post('/tasks', async (req, res) => {
  const task = new Task({
    text: req.body.text,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint to delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
