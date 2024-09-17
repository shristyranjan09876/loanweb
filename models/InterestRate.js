const mongoose = require('mongoose');





const InterestSchema = new mongoose.Schema({
    interestRate: { type: Number, default: 8},
  });
  

module.exports = mongoose.model('interestRate', InterestSchema);