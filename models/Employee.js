const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true},
  firstName: { type: String,  },
  lastName: { type: String, },
  dateOfBirth: { type: Date, },
  department: { type: String,  },
  position: { type: String,  },
  salary: { type: Number,  },
  joinDate: { type: Date,  },
  documents: [{ type: String,}],
  employeeId: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  interestRate: { type: Number, default: 8 },
});

module.exports = mongoose.model('Employee', employeeSchema);
