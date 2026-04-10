export type Role = 'Sec_9_vjecare' | 'Sec_Gjimnazi'; // kept for backward compat

export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  parentPhone: string;
}

export const MOCK_STUDENTS: Student[] = [
  // Grade 6
  { id: 's1', name: 'Arben Hoxha', grade: '6', class: '6A', parentPhone: '+355691234501' },
  { id: 's2', name: 'Besa Rama', grade: '6', class: '6A', parentPhone: '+355691234502' },
  { id: 's3', name: 'Clirim Duka', grade: '6', class: '6A', parentPhone: '+355691234503' },
  { id: 's4', name: 'Diona Gjoka', grade: '6', class: '6A', parentPhone: '+355691234504' },
  { id: 's5', name: 'Erion Basha', grade: '6', class: '6A', parentPhone: '+355691234505' },
  { id: 's6', name: 'Fatmira Leka', grade: '6', class: '6B', parentPhone: '+355691234506' },
  { id: 's7', name: 'Genti Muka', grade: '6', class: '6B', parentPhone: '+355691234507' },
  { id: 's8', name: 'Hana Kola', grade: '6', class: '6B', parentPhone: '+355691234508' },

  // Grade 7
  { id: 's9',  name: 'Ilir Prifti', grade: '7', class: '7A', parentPhone: '+355691234509' },
  { id: 's10', name: 'Jeta Abazi', grade: '7', class: '7A', parentPhone: '+355691234510' },
  { id: 's11', name: 'Klea Deda', grade: '7', class: '7A', parentPhone: '+355691234511' },
  { id: 's12', name: 'Luan Spahiu', grade: '7', class: '7A', parentPhone: '+355691234512' },
  { id: 's13', name: 'Mirela Cela', grade: '7', class: '7B', parentPhone: '+355691234513' },
  { id: 's14', name: 'Niko Gjini', grade: '7', class: '7B', parentPhone: '+355691234514' },
  { id: 's15', name: 'Ornela Hasa', grade: '7', class: '7B', parentPhone: '+355691234515' },

  // Grade 8
  { id: 's16', name: 'Pajtim Koci', grade: '8', class: '8A', parentPhone: '+355691234516' },
  { id: 's17', name: 'Qendresa Mema', grade: '8', class: '8A', parentPhone: '+355691234517' },
  { id: 's18', name: 'Rezart Tafa', grade: '8', class: '8A', parentPhone: '+355691234518' },
  { id: 's19', name: 'Sara Bejko', grade: '8', class: '8A', parentPhone: '+355691234519' },
  { id: 's20', name: 'Taulant Xhafa', grade: '8', class: '8B', parentPhone: '+355691234520' },
  { id: 's21', name: 'Ura Shehu', grade: '8', class: '8B', parentPhone: '+355691234521' },
  { id: 's22', name: 'Valbona Nushi', grade: '8', class: '8B', parentPhone: '+355691234522' },

  // Grade 9
  { id: 's23', name: 'Xheni Domi', grade: '9', class: '9A', parentPhone: '+355691234523' },
  { id: 's24', name: 'Yllka Hoxhaj', grade: '9', class: '9A', parentPhone: '+355691234524' },
  { id: 's25', name: 'Zana Kraja', grade: '9', class: '9A', parentPhone: '+355691234525' },
  { id: 's26', name: 'Alban Muça', grade: '9', class: '9A', parentPhone: '+355691234526' },
  { id: 's27', name: 'Blerina Çela', grade: '9', class: '9B', parentPhone: '+355691234527' },
  { id: 's28', name: 'Çlirim Hoti', grade: '9', class: '9B', parentPhone: '+355691234528' },
  { id: 's29', name: 'Dorina Laci', grade: '9', class: '9B', parentPhone: '+355691234529' },
  { id: 's30', name: 'Endrit Vora', grade: '9', class: '9B', parentPhone: '+355691234530' },

  // Grade 10
  { id: 's31', name: 'Florian Deda', grade: '10', class: '10A', parentPhone: '+355691234531' },
  { id: 's32', name: 'Gresa Kola', grade: '10', class: '10A', parentPhone: '+355691234532' },
  { id: 's33', name: 'Hektor Balla', grade: '10', class: '10A', parentPhone: '+355691234533' },
  { id: 's34', name: 'Ina Meshi', grade: '10', class: '10A', parentPhone: '+355691234534' },
  { id: 's35', name: 'Jetmir Çoku', grade: '10', class: '10B', parentPhone: '+355691234535' },
  { id: 's36', name: 'Kaltrina Popa', grade: '10', class: '10B', parentPhone: '+355691234536' },
  { id: 's37', name: 'Ledion Rama', grade: '10', class: '10B', parentPhone: '+355691234537' },
  { id: 's38', name: 'Mirjeta Suli', grade: '10', class: '10B', parentPhone: '+355691234538' },

  // Grade 11
  { id: 's39', name: 'Nertil Gjoka', grade: '11', class: '11A', parentPhone: '+355691234539' },
  { id: 's40', name: 'Ornela Haxhi', grade: '11', class: '11A', parentPhone: '+355691234540' },
  { id: 's41', name: 'Petrit Leka', grade: '11', class: '11A', parentPhone: '+355691234541' },
  { id: 's42', name: 'Qirjako Muka', grade: '11', class: '11A', parentPhone: '+355691234542' },
  { id: 's43', name: 'Rudina Toci', grade: '11', class: '11B', parentPhone: '+355691234543' },
  { id: 's44', name: 'Sokol Duka', grade: '11', class: '11B', parentPhone: '+355691234544' },
  { id: 's45', name: 'Teuta Bushi', grade: '11', class: '11B', parentPhone: '+355691234545' },

  // Grade 12
  { id: 's46', name: 'Urim Çela', grade: '12', class: '12A', parentPhone: '+355691234546' },
  { id: 's47', name: 'Valentina Hasa', grade: '12', class: '12A', parentPhone: '+355691234547' },
  { id: 's48', name: 'Willy Gjini', grade: '12', class: '12A', parentPhone: '+355691234548' },
  { id: 's49', name: 'Xhesika Nela', grade: '12', class: '12B', parentPhone: '+355691234549' },
  { id: 's50', name: 'Yllson Koci', grade: '12', class: '12B', parentPhone: '+355691234550' },
  { id: 's51', name: 'Zamira Bejko', grade: '12', class: '12B', parentPhone: '+355691234551' },
];

export function getClassesByRole(role: Role): string[] {
  if (role === 'Sec_9_vjecare') {
    return Array.from(new Set(MOCK_STUDENTS.filter(s => parseInt(s.grade) <= 9).map(s => s.class))).sort();
  } else {
    return Array.from(new Set(MOCK_STUDENTS.filter(s => parseInt(s.grade) >= 10).map(s => s.class))).sort();
  }
}

export function getStudentsByClass(className: string): Student[] {
  return MOCK_STUDENTS.filter(s => s.class === className).sort((a, b) => a.name.localeCompare(b.name));
}
