// Run with: npm run seed
// Seeds users, classes, and students from the frontend hardcoded data.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User    = require('../models/User');
const Class   = require('../models/Class');
const Student = require('../models/Student');

const CLASSES = [
  { name: '6A',  gradeLevel: 6,  section: '9vjecare' },
  { name: '6B',  gradeLevel: 6,  section: '9vjecare' },
  { name: '7A',  gradeLevel: 7,  section: '9vjecare' },
  { name: '7B',  gradeLevel: 7,  section: '9vjecare' },
  { name: '8A',  gradeLevel: 8,  section: '9vjecare' },
  { name: '8B',  gradeLevel: 8,  section: '9vjecare' },
  { name: '9A',  gradeLevel: 9,  section: '9vjecare' },
  { name: '9B',  gradeLevel: 9,  section: '9vjecare' },
  { name: '10A', gradeLevel: 10, section: 'gjimnaz' },
  { name: '10B', gradeLevel: 10, section: 'gjimnaz' },
  { name: '11A', gradeLevel: 11, section: 'gjimnaz' },
  { name: '11B', gradeLevel: 11, section: 'gjimnaz' },
  { name: '12A', gradeLevel: 12, section: 'gjimnaz' },
  { name: '12B', gradeLevel: 12, section: 'gjimnaz' },
];

// Extracted from frontend src/lib/data.ts
const STUDENTS_RAW = [
  { firstName: 'Arben',     lastName: 'Hoxha',   class: '6A',  phone: '+355691234501' },
  { firstName: 'Besa',      lastName: 'Rama',    class: '6A',  phone: '+355691234502' },
  { firstName: 'Clirim',    lastName: 'Duka',    class: '6A',  phone: '+355691234503' },
  { firstName: 'Diona',     lastName: 'Gjoka',   class: '6A',  phone: '+355691234504' },
  { firstName: 'Erion',     lastName: 'Basha',   class: '6A',  phone: '+355691234505' },
  { firstName: 'Fatmira',   lastName: 'Leka',    class: '6B',  phone: '+355691234506' },
  { firstName: 'Genti',     lastName: 'Muka',    class: '6B',  phone: '+355691234507' },
  { firstName: 'Hana',      lastName: 'Kola',    class: '6B',  phone: '+355691234508' },
  { firstName: 'Ilir',      lastName: 'Prifti',  class: '7A',  phone: '+355691234509' },
  { firstName: 'Jeta',      lastName: 'Abazi',   class: '7A',  phone: '+355691234510' },
  { firstName: 'Klea',      lastName: 'Deda',    class: '7A',  phone: '+355691234511' },
  { firstName: 'Luan',      lastName: 'Spahiu',  class: '7A',  phone: '+355691234512' },
  { firstName: 'Mirela',    lastName: 'Cela',    class: '7B',  phone: '+355691234513' },
  { firstName: 'Niko',      lastName: 'Gjini',   class: '7B',  phone: '+355691234514' },
  { firstName: 'Ornela',    lastName: 'Hasa',    class: '7B',  phone: '+355691234515' },
  { firstName: 'Pajtim',    lastName: 'Koci',    class: '8A',  phone: '+355691234516' },
  { firstName: 'Qendresa',  lastName: 'Mema',    class: '8A',  phone: '+355691234517' },
  { firstName: 'Rezart',    lastName: 'Tafa',    class: '8A',  phone: '+355691234518' },
  { firstName: 'Sara',      lastName: 'Bejko',   class: '8A',  phone: '+355691234519' },
  { firstName: 'Taulant',   lastName: 'Xhafa',   class: '8B',  phone: '+355691234520' },
  { firstName: 'Ura',       lastName: 'Shehu',   class: '8B',  phone: '+355691234521' },
  { firstName: 'Valbona',   lastName: 'Nushi',   class: '8B',  phone: '+355691234522' },
  { firstName: 'Xheni',     lastName: 'Domi',    class: '9A',  phone: '+355691234523' },
  { firstName: 'Yllka',     lastName: 'Hoxhaj',  class: '9A',  phone: '+355691234524' },
  { firstName: 'Zana',      lastName: 'Kraja',   class: '9A',  phone: '+355691234525' },
  { firstName: 'Alban',     lastName: 'Muça',    class: '9A',  phone: '+355691234526' },
  { firstName: 'Blerina',   lastName: 'Çela',    class: '9B',  phone: '+355691234527' },
  { firstName: 'Çlirim',    lastName: 'Hoti',    class: '9B',  phone: '+355691234528' },
  { firstName: 'Dorina',    lastName: 'Laci',    class: '9B',  phone: '+355691234529' },
  { firstName: 'Endrit',    lastName: 'Vora',    class: '9B',  phone: '+355691234530' },
  { firstName: 'Florian',   lastName: 'Deda',    class: '10A', phone: '+355691234531' },
  { firstName: 'Gresa',     lastName: 'Kola',    class: '10A', phone: '+355691234532' },
  { firstName: 'Hektor',    lastName: 'Balla',   class: '10A', phone: '+355691234533' },
  { firstName: 'Ina',       lastName: 'Meshi',   class: '10A', phone: '+355691234534' },
  { firstName: 'Jetmir',    lastName: 'Çoku',    class: '10B', phone: '+355691234535' },
  { firstName: 'Kaltrina',  lastName: 'Popa',    class: '10B', phone: '+355691234536' },
  { firstName: 'Ledion',    lastName: 'Rama',    class: '10B', phone: '+355691234537' },
  { firstName: 'Mirjeta',   lastName: 'Suli',    class: '10B', phone: '+355691234538' },
  { firstName: 'Nertil',    lastName: 'Gjoka',   class: '11A', phone: '+355691234539' },
  { firstName: 'Ornela',    lastName: 'Haxhi',   class: '11A', phone: '+355691234540' },
  { firstName: 'Petrit',    lastName: 'Leka',    class: '11A', phone: '+355691234541' },
  { firstName: 'Qirjako',   lastName: 'Muka',    class: '11A', phone: '+355691234542' },
  { firstName: 'Rudina',    lastName: 'Toci',    class: '11B', phone: '+355691234543' },
  { firstName: 'Sokol',     lastName: 'Duka',    class: '11B', phone: '+355691234544' },
  { firstName: 'Teuta',     lastName: 'Bushi',   class: '11B', phone: '+355691234545' },
  { firstName: 'Urim',      lastName: 'Çela',    class: '12A', phone: '+355691234546' },
  { firstName: 'Valentina', lastName: 'Hasa',    class: '12A', phone: '+355691234547' },
  { firstName: 'Willy',     lastName: 'Gjini',   class: '12A', phone: '+355691234548' },
  { firstName: 'Xhesika',   lastName: 'Nela',    class: '12B', phone: '+355691234549' },
  { firstName: 'Yllson',    lastName: 'Koci',    class: '12B', phone: '+355691234550' },
  { firstName: 'Zamira',    lastName: 'Bejko',   class: '12B', phone: '+355691234551' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing
  await Promise.all([User.deleteMany(), Class.deleteMany(), Student.deleteMany()]);
  console.log('🗑️  Cleared existing data');

  // Users
  const users = await User.insertMany([
    { username: 'sec_9vjecare', passwordHash: await bcrypt.hash('12345678', 10), role: 'sec_9vjecare' },
    { username: 'sec_gjimnaz',  passwordHash: await bcrypt.hash('87654321', 10), role: 'sec_gjimnaz' },
    { username: 'superadmin',   passwordHash: await bcrypt.hash('P@55w0rd', 12), role: 'admin' },
  ]);
  console.log('👤 Users seeded:', users.map(u => u.username));

  // Classes
  const classes = await Class.insertMany(CLASSES);
  const classMap = {};
  classes.forEach(c => { classMap[c.name] = c._id; });
  console.log('🏫 Classes seeded:', classes.length);

  // Students
  const students = STUDENTS_RAW.map(s => ({
    firstName:   s.firstName,
    lastName:    s.lastName,
    classId:     classMap[s.class],
    parentPhone: s.phone,
  }));
  await Student.insertMany(students);
  console.log('🎒 Students seeded:', students.length);

  console.log('\n✅ Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
