const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  closeTicket
} = require('../controllers/ticketController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/rbacMiddleware');

router.use(protect); // Sabhi ticket routes ke liye authentication zaroori hai

router.route('/')
  .post(authorize('user'), createTicket)
  .get(getTickets);

router.route('/:id')
  .get(getTicketById)
  .put(updateTicket);

router.put('/:id/status', authorize('support_agent', 'admin'), updateTicketStatus);
router.put('/:id/close', closeTicket);

module.exports = router;