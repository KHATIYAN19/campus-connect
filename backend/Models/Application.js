const applicationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    status: { type: String, enum: ['pending', 'selected', 'rejected'], default: 'pending' }
});
const Application = mongoose.model('Application', applicationSchema);