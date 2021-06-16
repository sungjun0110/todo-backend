import mongoose from 'mongoose';


const todosSchema = mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  todos: [
    {
      checked: Boolean,
      text: String,
      id: String,
    }
  ],
});

export default mongoose.model('Todos', todosSchema);