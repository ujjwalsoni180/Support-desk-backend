const Ticket = require('../models/Ticket');
const User = require('../models/User');

// 1. View all tickets (Admin)[span_14](start_span)[span_14](end_span)
const getAllTicketsAdmin = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate('user', 'name email')
      .populate('assignedAgent', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Assign ticket to a support agent (Admin)[span_15](start_span)[span_15](end_span)
const assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;
    const ticketId = req.params.id;

    const agent = await User.findOne({ _id: agentId, role: 'support_agent' });
    if (!agent) {
      return res.status(404).json({ message: 'Support agent not found' });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.assignedAgent = agentId;
    ticket.status = 'IN_PROGRESS';
    await ticket.save();

    res.json({ message: 'Ticket assigned successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Manage users / Get all users (Admin)[span_16](start_span)[span_16](end_span)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTicketsAdmin,
  assignTicket,
  getAllUsers
};