import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

const DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10;
const DEFAULT_PARAMETER_LIMIT = 10000;

const bodyParserJsonConfig = {
  limit: DEFAULT_BODY_SIZE_LIMIT
};

const bodyParserUrlencodedConfig = {
  extended: true,
  parameterLimit: DEFAULT_PARAMETER_LIMIT
};

app.use(cors());
// Client must send "Content-Type: application/json" header
app.use(bodyParser.json(bodyParserJsonConfig));
app.use(bodyParser.urlencoded(bodyParserUrlencodedConfig));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Define Todo schema and model
const todoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isDone: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes

// Get all todos
// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json({ todos });
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
app.post('/todos', async (req, res) => {
  try {
    const { name } = req.body;
    const newTodo = new Todo({ name, isDone: false });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error.message);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Get a single todo
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error.message);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { name, isDone } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { name, isDone },
      { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error.message);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
