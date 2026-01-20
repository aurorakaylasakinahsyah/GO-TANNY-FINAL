
// Diabetes checker removed. This controller is deprecated and disabled.
module.exports = {
  getAllChecks: async (req, res) => res.status(410).json({ message: 'Diabetes checker removed' }),
  addCheck: async (req, res) => res.status(410).json({ message: 'Diabetes checker removed' }),
  deleteAllChecks: async (req, res) => res.status(410).json({ message: 'Diabetes checker removed' }),
  deleteCheckById: async (req, res) => res.status(410).json({ message: 'Diabetes checker removed' }),
};