const { required } = require("joi");

const LoanSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' ,required:true},
    amount: {type:Number},
    purpose:{type:String},
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed',] },
    appliedDate: { type: Date, default: Date.now },
    approvedDate: {type:Date},
    disburseDate: {type:Date},
    closeDate: {type:Date},
    tenure: {type:Number}, 
 
  });
  
  const Loan = mongoose.model('Loan', LoanSchema);







 















 

 










  






