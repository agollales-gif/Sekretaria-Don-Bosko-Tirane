export type MessageTemplate = 
  | 'late_1st_hour'
  | 'late_2nd_hour'
  | 'teacher_meeting'
  | 'principal_meeting'
  | 'sickness'
  | 'mistake';

interface MessageData {
  studentName: string;
  time: string;
  date: string;
}

export function generateMessage(template: MessageTemplate, data: MessageData): string {
  const { studentName, time, date } = data;

  // Check for user-customized template in localStorage
  const customKeys: Partial<Record<MessageTemplate, string>> = {
    late_1st_hour:     'tpl_late1',
    late_2nd_hour:     'tpl_late2',
    teacher_meeting:   'tpl_teacher',
    principal_meeting: 'tpl_principal',
    sickness:          'tpl_sickness',
  };
  const storageKey = customKeys[template];
  if (storageKey) {
    const custom = localStorage.getItem(storageKey);
    if (custom) {
      return custom
        .replace(/\[Emri\]/g, studentName)
        .replace(/\[Ora\]/g, time)
        .replace(/\[Data\]/g, date);
    }
  }

  switch (template) {
    case 'late_1st_hour':
      return `Të nderuar prindër, ju njoftojmë se nxënësi/ja ${studentName} është paraqitur me vonesë në shkollë sot më datë ${date}, në orën ${time}. (Ora e 1-rë). Qendra Don Bosko.`;
      
    case 'late_2nd_hour':
      return `Të nderuar prindër, ju njoftojmë se nxënësi/ja ${studentName} është paraqitur me vonesë në shkollë sot më datë ${date}, në orën ${time}. (Në pritje të orës së 2-të). Qendra Don Bosko.`;
      
    case 'teacher_meeting':
      return `Të nderuar prindër, ju ftojmë për një takim me mësuesin kujdestar të nxënësit/es ${studentName}. Ju lutem na kontaktoni për të caktuar orarin. Qendra Don Bosko.`;
      
    case 'principal_meeting':
      return `Të nderuar prindër, kërkohet prania juaj për një takim me Drejtorinë e shkollës lidhur me nxënësin/en ${studentName}. Ju lutem paraqituni sa më parë. Qendra Don Bosko.`;
      
    case 'sickness':
      return `Të nderuar prindër, ju njoftojmë se nxënësi/ja ${studentName} nuk ndihet mirë (arsye shëndetësore) dhe është larguar nga ambientet e shkollës në orën ${time}. Qendra Don Bosko.`;
      
    case 'mistake':
      return `Të nderuar prindër, ju dërgojmë këtë mesazh për t'ju njoftuar se mesazhi i mëparshëm lidhur me nxënësin/en ${studentName} u dërgua gabimisht. Ju kërkojmë ndjesë për shqetësimin. Qendra Don Bosko.`;
      
    default:
      return '';
  }
}
