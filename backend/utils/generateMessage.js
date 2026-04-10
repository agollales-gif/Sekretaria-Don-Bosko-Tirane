const Template = require('../models/Template');

const DEFAULT_TEMPLATES = {
  vone_ora1:       'Të nderuar prindër, ju njoftojmë se nxënësi/ja [Emri] është paraqitur me vonesë në shkollë sot më datë [Data], në orën [Ora]. (Ora e 1-rë). Qendra Don Bosko.',
  vone_ora2:       'Të nderuar prindër, ju njoftojmë se nxënësi/ja [Emri] është paraqitur me vonesë në shkollë sot më datë [Data], në orën [Ora]. (Në pritje të orës së 2-të). Qendra Don Bosko.',
  takim_mesues:    'Të nderuar prindër, ju ftojmë për një takim me mësuesin kujdestar të nxënësit/es [Emri]. Ju lutem na kontaktoni për të caktuar orarin. Qendra Don Bosko.',
  takim_drejtori:  'Të nderuar prindër, kërkohet prania juaj për një takim me Drejtorinë e shkollës lidhur me nxënësin/en [Emri]. Ju lutem paraqituni sa më parë. Qendra Don Bosko.',
  semurje:         'Të nderuar prindër, ju njoftojmë se nxënësi/ja [Emri] nuk ndihet mirë (arsye shëndetësore) dhe është larguar nga ambientet e shkollës në orën [Ora]. Qendra Don Bosko.',
  korrigjim:       'Të nderuar prindër, ju dërgojmë këtë mesazh për t\'ju njoftuar se mesazhi i mëparshëm lidhur me nxënësin/en [Emri] u dërgua gabimisht. Ju kërkojmë ndjesë për shqetësimin. Qendra Don Bosko.',
};

async function generateMessage(secretaryId, actionType, studentName, time, date) {
  let template = DEFAULT_TEMPLATES[actionType] || '';

  // Check for custom template saved by this secretary
  if (actionType !== 'korrigjim') {
    const custom = await Template.findOne({ secretaryId, actionType });
    if (custom) template = custom.templateText;
  }

  return template
    .replace(/\[Emri\]/g, studentName)
    .replace(/\[Ora\]/g, time)
    .replace(/\[Data\]/g, date);
}

module.exports = { generateMessage, DEFAULT_TEMPLATES };
