const path = require('path');
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });

const mongoose = require('mongoose');


const MONGODB_URI = process.env.MONGODB_URI
// console.log(MONGODB_URI)
// throw new Error("Hiya")
if (!MONGODB_URI) {
    throw new Error('Silahkan masukkan link mongodb di file .env');
}

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['pusat', 'daerah', 'sekolah', 'murid', 'mitra'],
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    schoolId: { type: String },
    district: { type: String },
    class: { type: String },
    gender: { type: String, enum: ['L', 'P'] },
    status: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const ReportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'escalated', 'resolved', 'open'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    category: { type: String, required: true },
    reporterId: { type: String, required: true },
    reporterRole: { type: String, required: true },
    schoolId: { type: String },
    schoolName: { type: String },
    district: { type: String },
    assignedMitra: [{ type: String }],
    comments: [
        {
            author: String,
            role: String,
            message: String,
            time: { type: Date, default: Date.now },
        },
    ],
    studentReports: [
        {
            studentName: String,
            summary: String,
            time: String,
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);

async function seed() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to ' + MONGODB_URI);


    await User.deleteMany({});
    await Report.deleteMany({});

    console.log('Cleared database');


    const users = [
        {
            _id: '507f1f77bcf86cd799439011',
            username: 'mbgpusat',
            password: 'admin',
            role: 'pusat',
            fullName: 'Admin Pusat MBG',
            email: 'admin.pusat@mbg.go.id',
        },
        {
            _id: '507f1f77bcf86cd799439012',
            username: 'mbgdaerah',
            password: 'admin',
            role: 'daerah',
            fullName: 'Admin Daerah Jawa Timur',
            email: 'admin.jatim@mbg.go.id',
            district: 'Jawa Timur',
        },
        {
            _id: '507f1f77bcf86cd799439013',
            username: 'sekolah',
            password: 'admin',
            role: 'sekolah',
            fullName: 'SDN 1 Malang',
            email: 'admin@sdn1malang.sch.id',
            schoolId: '20534000', // NPSN SDN 1 Malang
            district: 'Malang',
        },
        {
            _id: '507f1f77bcf86cd799439014',
            username: 'sman5surabaya',
            password: 'admin',
            role: 'sekolah',
            fullName: 'SMAN 5 Surabaya',
            email: 'admin@sman5surabaya.sch.id',
            schoolId: '20532249', // NPSN SMAN 5 Surabaya
            district: 'Surabaya',
        },
        {
            _id: '507f1f77bcf86cd799439015',
            username: 'murid',
            password: 'admin',
            role: 'murid',
            fullName: 'Budi Santoso',
            email: 'budi.s@student.mbg.go.id',
            schoolId: '20532249',
            class: 'X-1',
            gender: 'L',
            status: 'Hadir'
        },
        {
            username: 'mitrasejahtera',
            password: 'admin',
            role: 'mitra',
            fullName: 'CV Mitra Sejahtera',
            email: 'contact@mitrasejahtera.co.id',
            district: 'Surabaya',
        },
        // --- STUDENTS FOR SDN 1 MALANG (20534000) ---
        {
            username: 'ani.s',
            password: 'admin',
            role: 'murid',
            fullName: 'Ani Suryani',
            email: 'ani.s@student.mbg.go.id',
            schoolId: '20534000',
            class: '6A',
            gender: 'P',
            status: 'Hadir'
        },
        {
            username: 'don.w',
            password: 'admin',
            role: 'murid',
            fullName: 'Doni Wijaya',
            email: 'don.w@student.mbg.go.id',
            schoolId: '20534000',
            class: '6B',
            gender: 'L',
            status: 'Sakit'
        },
        {
            username: 'siti.a',
            password: 'admin',
            role: 'murid',
            fullName: 'Siti Aminah',
            email: 'siti.a@student.mbg.go.id',
            schoolId: '20534000',
            class: '5A',
            gender: 'P',
            status: 'Hadir'
        },
        // --- STUDENTS FOR SMAN 5 SURABAYA (20532249) ---
        {
            username: 'rizky.p',
            password: 'admin',
            role: 'murid',
            fullName: 'Rizky Pratama',
            email: 'rizky.p@student.mbg.go.id',
            schoolId: '20532249',
            class: 'X-1',
            gender: 'L',
            status: 'Hadir'
        },
        {
            username: 'dewi.k',
            password: 'admin',
            role: 'murid',
            fullName: 'Dewi Kartika',
            email: 'dewi.k@student.mbg.go.id',
            schoolId: '20532249',
            class: 'XI-IPA-2',
            gender: 'P',
            status: 'Izin'
        },
        {
            username: 'ahmad.f',
            password: 'admin',
            role: 'murid',
            fullName: 'Ahmad Fauzi',
            email: 'ahmad.f@student.mbg.go.id',
            schoolId: '20532249',
            class: 'XII-IPS-1',
            gender: 'L',
            status: 'Alpha'
        },

    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created users:', createdUsers.length);

    const getUserId = (username) => createdUsers.find(u => u.username === username)?._id;

    const reports = [
        {
            title: "Keterlambatan Distribusi",
            schoolName: "SMAN 5 Surabaya",
            category: "Logistik",
            status: "escalated",
            priority: "high",
            createdAt: new Date(),
            description: "Makanan belum tiba hingga jam 12:00.",
            assignedMitra: ["CV Mitra Sejahtera"],
            reporterId: getUserId('sman5surabaya'),
            reporterRole: 'sekolah',
            schoolId: '20532249',
            district: 'Surabaya',
            comments: [],
            studentReports: [],
        },
        {
            title: "Menu Ayam Kurang Matang",
            schoolName: "SMAN 5 Surabaya",
            category: "Kualitas Makanan",
            status: "approved",
            priority: "high",
            createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
            description: "Beberapa potong ayam bagian dalam masih merah.",
            assignedMitra: ["CV Mitra Sejahtera"],
            reporterId: getUserId('sman5surabaya'),
            reporterRole: 'sekolah',
            schoolId: '20532249',
            district: 'Surabaya',
            comments: [
                {
                    author: "Sekolah",
                    role: "sekolah",
                    message: "Mohon diperhatikan tingkat kematangan, berbahaya bagi kesehatan.",
                    time: new Date(new Date().setDate(new Date().getDate() - 2)),
                },
                {
                    author: "Admin Daerah",
                    role: "daerah",
                    message: "Laporan diterima. Mitra sudah ditegur dan akan mengganti batch besok dengan quality control lebih ketat.",
                    time: new Date(new Date().setDate(new Date().getDate() - 2)),
                }
            ],
            studentReports: [],
        },
        {
            title: "Permintaan Tambahan Sendok",
            schoolName: "SMAN 5 Surabaya",
            category: "Operasional",
            status: "pending",
            priority: "low",
            createdAt: new Date(),
            description: "Stok sendok plastik menipis, mohon dikirim tambahan.",
            assignedMitra: ["CV Mitra Sejahtera"],
            reporterId: getUserId('sman5surabaya'),
            reporterRole: 'sekolah',
            schoolId: '20532249',
            district: 'Surabaya',
            comments: [],
            studentReports: [],
        },
    ];

    await Report.insertMany(reports);
    console.log('Created reports:', reports.length);

    // --- STATISTICS ---
    const StatisticSchema = new mongoose.Schema({
        type: { type: String, required: true, enum: ['pusat', 'daerah', 'sekolah', 'mitra'] },
        identifier: { type: String, required: true },
        data: { type: mongoose.Schema.Types.Mixed, required: true },
        lastUpdated: { type: Date, default: Date.now }
    });
    const Statistic = mongoose.models.Statistic || mongoose.model('Statistic', StatisticSchema);

    await Statistic.deleteMany({});
    console.log('Cleared statistics');

    const statistics = [
        {
            type: 'pusat',
            identifier: 'national',
            data: {
                totalReports: 12450,
                pendingReports: 312,
                resolvedReports: 12138,
                participationRate: 87,
                distributionData: [
                    { name: "Malang", value: 250000 },
                    { name: "Surabaya", value: 220000 },
                    { name: "Jember", value: 180000 },
                    { name: "Kediri", value: 150000 },
                    { name: "Jombang", value: 100000 },
                    { name: "Banyuwangi", value: 120000 },
                    { name: "Nusantara", value: 500000 },
                    { name: "Bandung", value: 300000 },
                    { name: "Genret", value: 90000 },
                    { name: "Merdeka", value: 110000 },
                    { name: "Glagah", value: 95000 },
                ],
                nutritionData: [
                    { name: "Jan", protein: 80, karbo: 70, lemak: 60 },
                    { name: "Feb", protein: 82, karbo: 68, lemak: 58 },
                    { name: "Mar", protein: 84, karbo: 69, lemak: 57 },
                ]
            }
        },
        {
            type: 'daerah',
            identifier: 'Jawa Timur',
            data: {
                totalReports: 845,
                pendingReports: 37,
                distributionRate: 85,
                activeSchools: 142,
                totalStudents: 52800,
                reportedIssues: 18,
                distributionData: [
                    { name: "Malang", value: 250000 },
                    { name: "Surabaya", value: 220000 },
                    { name: "Jember", value: 180000 },
                    { name: "Kediri", value: 150000 },
                    { name: "Jombang", value: 100000 },
                ],
                nutritionData: [
                    { name: "Jan", value: 85 },
                    { name: "Feb", value: 87 },
                    { name: "Mar", value: 90 },
                    { name: "Apr", value: 88 },
                    { name: "Mei", value: 82 },
                    { name: "Jun", value: 79 },
                ]
            }
        },
        {
            type: 'sekolah',
            identifier: '20534000',
            data: {
                mealsDistributed: 245,
                totalStudents: 450,
                attendanceRate: 98,
                studentFeedbackScore: 4.5
            }
        },
        {
            type: 'sekolah',
            identifier: '20532249',
            data: {
                mealsDistributed: 1120,
                totalStudents: 1200,
                attendanceRate: 95,
                studentFeedbackScore: 4.7
            }
        },
        {
            type: 'mitra',
            identifier: 'CV Mitra Sejahtera',
            data: {
                onTimeDelivery: 92,
                averageRating: 4.6,
                totalDeliveries: 120,
                pendingIssues: 4,
                activeComplaints: 2
            }
        }
    ];

    await Statistic.insertMany(statistics);
    console.log('Created statistics:', statistics.length);

    console.log('Seeding completed successfully');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
