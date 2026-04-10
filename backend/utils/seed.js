// Run with: npm run seed
// Seeds users, classes, and students into Supabase.
require('dotenv').config();
const bcrypt = require('bcrypt');
const db     = require('./supabase');

const CLASSES = [
  { name: '6A',  grade_level: 6,  section: '9vjecare' },
  { name: '6B',  grade_level: 6,  section: '9vjecare' },
  { name: '7A',  grade_level: 7,  section: '9vjecare' },
  { name: '7B',  grade_level: 7,  section: '9vjecare' },
  { name: '8A',  grade_level: 8,  section: '9vjecare' },
  { name: '8B',  grade_level: 8,  section: '9vjecare' },
  { name: '9A',  grade_level: 9,  section: '9vjecare' },
  { name: '9B',  grade_level: 9,  section: '9vjecare' },
  { name: '10A', grade_level: 10, section: 'gjimnaz' },
  { name: '10B', grade_level: 10, section: 'gjimnaz' },
  { name: '11A', grade_level: 11, section: 'gjimnaz' },
  { name: '11B', grade_level: 11, section: 'gjimnaz' },
  { name: '12A', grade_level: 12, section: 'gjimnaz' },
  { name: '12B', grade_level: 12, section: 'gjimnaz' },
];

const STUDENTS_RAW = [
  { first_name: 'Arben',     last_name: 'Hoxha',   class: '6A',  phone: '+355691234501' },
  { first_name: 'Besa',      last_name: 'Rama',    class: '6A',  phone: '+355691234502' },
  { first_name: 'Clirim',    last_name: 'Duka',    class: '6A',  phone: '+355691234503' },
  { first_name: 'Diona',     last_name: 'Gjoka',   class: '6A',  phone: '+355691234504' },
  { first_name: 'Erion',     last_name: 'Basha',   class: '6A',  phone: '+355691234505' },
  { first_name: 'Fatmira',   last_name: 'Leka',    class: '6B',  phone: '+355691234506' },
  { first_name: 'Genti',     last_name: 'Muka',    class: '6B',  phone: '+355691234507' },
  { first_name: 'Hana',      last_name: 'Kola',    class: '6B',  phone: '+355691234508' },
  { first_name: 'Ilir',      last_name: 'Prifti',  class: '7A',  phone: '+355691234509' },
  { first_name: 'Jeta',      last_name: 'Abazi',   class: '7A',  phone: '+355691234510' },
  { first_name: 'Klea',      last_name: 'Deda',    class: '7A',  phone: '+355691234511' },
  { first_name: 'Luan',      last_name: 'Spahiu',  class: '7A',  phone: '+355691234512' },
  { first_name: 'Mirela',    last_name: 'Cela',    class: '7B',  phone: '+355691234513' },
  { first_name: 'Niko',      last_name: 'Gjini',   class: '7B',  phone: '+355691234514' },
  { first_name: 'Ornela',    last_name: 'Hasa',    class: '7B',  phone: '+355691234515' },
  { first_name: 'Pajtim',    last_name: 'Koci',    class: '8A',  phone: '+355691234516' },
  { first_name: 'Qendresa',  last_name: 'Mema',    class: '8A',  phone: '+355691234517' },
  { first_name: 'Rezart',    last_name: 'Tafa',    class: '8A',  phone: '+355691234518' },
  { first_name: 'Sara',      last_name: 'Bejko',   class: '8A',  phone: '+355691234519' },
  { first_name: 'Taulant',   last_name: 'Xhafa',   class: '8B',  phone: '+355691234520' },
  { first_name: 'Ura',       last_name: 'Shehu',   class: '8B',  phone: '+355691234521' },
  { first_name: 'Valbona',   last_name: 'Nushi',   class: '8B',  phone: '+355691234522' },
  { first_name: 'Xheni',     last_name: 'Domi',    class: '9A',  phone: '+355691234523' },
  { first_name: 'Yllka',     last_name: 'Hoxhaj',  class: '9A',  phone: '+355691234524' },
  { first_name: 'Zana',      last_name: 'Kraja',   class: '9A',  phone: '+355691234525' },
  { first_name: 'Alban',     last_name: 'Muça',    class: '9A',  phone: '+355691234526' },
  { first_name: 'Blerina',   last_name: 'Çela',    class: '9B',  phone: '+355691234527' },
  { first_name: 'Çlirim',    last_name: 'Hoti',    class: '9B',  phone: '+355691234528' },
  { first_name: 'Dorina',    last_name: 'Laci',    class: '9B',  phone: '+355691234529' },
  { first_name: 'Endrit',    last_name: 'Vora',    class: '9B',  phone: '+355691234530' },
  { first_name: 'Florian',   last_name: 'Deda',    class: '10A', phone: '+355691234531' },
  { first_name: 'Gresa',     last_name: 'Kola',    class: '10A', phone: '+355691234532' },
  { first_name: 'Hektor',    last_name: 'Balla',   class: '10A', phone: '+355691234533' },
  { first_name: 'Ina',       last_name: 'Meshi',   class: '10A', phone: '+355691234534' },
  { first_name: 'Jetmir',    last_name: 'Çoku',    class: '10B', phone: '+355691234535' },
  { first_name: 'Kaltrina',  last_name: 'Popa',    class: '10B', phone: '+355691234536' },
  { first_name: 'Ledion',    last_name: 'Rama',    class: '10B', phone: '+355691234537' },
  { first_name: 'Mirjeta',   last_name: 'Suli',    class: '10B', phone: '+355691234538' },
  { first_name: 'Nertil',    last_name: 'Gjoka',   class: '11A', phone: '+355691234539' },
  { first_name: 'Ornela',    last_name: 'Haxhi',   class: '11A', phone: '+355691234540' },
  { first_name: 'Petrit',    last_name: 'Leka',    class: '11A', phone: '+355691234541' },
  { first_name: 'Qirjako',   last_name: 'Muka',    class: '11A', phone: '+355691234542' },
  { first_name: 'Rudina',    last_name: 'Toci',    class: '11B', phone: '+355691234543' },
  { first_name: 'Sokol',     last_name: 'Duka',    class: '11B', phone: '+355691234544' },
  { first_name: 'Teuta',     last_name: 'Bushi',   class: '11B', phone: '+355691234545' },
  { first_name: 'Urim',      last_name: 'Çela',    class: '12A', phone: '+355691234546' },
  { first_name: 'Valentina', last_name: 'Hasa',    class: '12A', phone: '+355691234547' },
  { first_name: 'Willy',     last_name: 'Gjini',   class: '12A', phone: '+355691234548' },
  { first_name: 'Xhesika',   last_name: 'Nela',    class: '12B', phone: '+355691234549' },
  { first_name: 'Yllson',    last_name: 'Koci',    class: '12B', phone: '+355691234550' },
  { first_name: 'Zamira',    last_name: 'Bejko',   class: '12B', phone: '+355691234551' },
];

async function seed() {
  console.log('🌱 Starting seed...');

  // Users
  const users = [
    { username: 'sec_9vjecare', password_hash: await bcrypt.hash('12345678', 10), role: 'sec_9vjecare' },
    { username: 'sec_gjimnaz',  password_hash: await bcrypt.hash('87654321', 10), role: 'sec_gjimnaz' },
    { username: 'superadmin',   password_hash: await bcrypt.hash('P@55w0rd', 12), role: 'admin' },
  ];
  const { error: uErr } = await db.from('users').upsert(users, { onConflict: 'username' });
  if (uErr) { console.error('❌ Users error:', uErr.message); process.exit(1); }
  console.log('👤 Users seeded');

  // Classes
  const { error: cErr } = await db.from('classes').upsert(CLASSES, { onConflict: 'name' });
  if (cErr) { console.error('❌ Classes error:', cErr.message); process.exit(1); }
  console.log('🏫 Classes seeded');

  // Fetch class IDs
  const { data: classRows } = await db.from('classes').select('id, name');
  const classMap = {};
  classRows.forEach(c => { classMap[c.name] = c.id; });

  // Students
  const students = STUDENTS_RAW.map(s => ({
    first_name:   s.first_name,
    last_name:    s.last_name,
    class_id:     classMap[s.class],
    parent_phone: s.phone,
  }));

  // Insert in batches of 20
  for (let i = 0; i < students.length; i += 20) {
    const { error: sErr } = await db.from('students').insert(students.slice(i, i + 20));
    if (sErr) { console.error('❌ Students error:', sErr.message); process.exit(1); }
  }
  console.log('🎒 Students seeded:', students.length);
  console.log('\n✅ Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
