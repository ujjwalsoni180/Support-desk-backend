const Ticket = require('../models/Ticket');

// 1. Create a new ticket (User role)
const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      user: req.user.id
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. View tickets (with Pagination & Filtering by status/priority)[span_5](start_span)[span_5](end_span)
const getTickets = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    let query = {};

    // Role-based filtering[span_6](start_span)[span_6](end_span)
    if (req.user.role === 'user') {
      query.user = req.user.id;
    } else if (req.user.role === 'support_agent') {
      query.assignedAgent = req.user.id;
    }
    // Admin can see all tickets, so no extra filter required[span_7](start_span)[span_7](end_span)

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const skip = (page - 1) * limit;

    const tickets = await Ticket.find(query)
      .populate('user', 'name email')
      .populate('assignedAgent', 'name email')
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Ticket.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      tickets
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. View a single ticket[span_8](start_span)[span_8](end_span)
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedAgent', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Authorization check[span_9](start_span)[span_9](end_span)
    if (
      req.user.role === 'user' && ticket.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update ticket details[span_10](start_span)[span_10](end_span)
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Update ticket status (Support Agent / Admin)[span_11](start_span)[span_11](end_span)
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid ticket status' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = status;
    await ticket.save();

    res.json({ message: 'Ticket status updated successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Close a ticket[span_12](start_span)[span_12](end_span)
const closeTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = 'CLOSED';
    await ticket.save();

    res.json({ message: 'Ticket closed successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  closeTicket
};