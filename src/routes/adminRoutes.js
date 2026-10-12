const express = require('express');
const router = express.Router();
const {
  getAllTicketsAdmin,
  assignTicket,
  getAllUsers
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/rbacMiddleware');

// Sabhi admin routes par sirf 'admin' role allow hoga[span_18](start_span)[span_18](end_span)
router.use(protect, authorize('admin'));

router.get('/tickets', getAllTicketsAdmin);
router.put('/tickets/:id/assign', assignTicket);
router.get('/users', getAllUsers);

module.exports = router;