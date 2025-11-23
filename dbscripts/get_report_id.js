const path = require('path');
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const ReportSchema = new mongoose.Schema({
    title: { type: String, required: true },
});

const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);

async function getReportId() {
    await mongoose.connect(MONGODB_URI);
    const report = await Report.findOne({});
    if (report) {
        console.log(report._id.toString());
    } else {
        console.log("No reports found");
    }
    await mongoose.disconnect();
}

getReportId().catch(console.error);
