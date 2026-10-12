const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'], 
    default: 'MEDIUM' 
  },
  status: { 
    type: String, 
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], 
    default: 'OPEN' 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);