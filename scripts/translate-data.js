import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';

const DATA_DIR = './src/data';
const LOCALES_DIR = './src/locales';

// Campos que não devem ser traduzidos
const SKIP_FIELDS = ['link', 'companyUrl', 'extractedAt', 'credentialCode', 'logoUrl', 'issuedDate', 'dates'];

function shouldTranslate(key, value) {
  if (SKIP_FIELDS.includes(key)) return false;
  if (typeof value !== 'string') return false;
  if (value.match(/^https?:\/\//)) return false; // URLs
  if (value.match(/^\d{4}-\d{2}-\d{2}T/)) return false; // ISO dates
  if (value.match(/^[A-Z0-9]{8}-[A-Z0-9]{4}-/)) return false; // UUIDs
  if (value.trim().length === 0) return false;
  return true;
}

async function translateValue(value, key = '') {
  if (typeof value === 'string' && shouldTranslate(key, value)) {
    try {
      const result = await translate(value, { from: 'pt', to: 'en' });
      return result.text;
    } catch (error) {
      console.warn(`⚠️  Erro ao traduzir "${key}": ${value.substring(0, 50)}`);
      return value;
    }
  } else if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return Promise.all(value.map((item, idx) => translateValue(item, `[${idx}]`)));
    } else {
      const translated = {};
      for (const [objKey, val] of Object.entries(value)) {
        translated[objKey] = await translateValue(val, objKey);
      }
      return translated;
    }
  }
  return value;
}

async function processDataFiles() {
  try {
    const files = ['certificates.json', 'education.json', 'projects.json'];
    const dataEn = {};
    const dataPt = {};

    console.log('🔄 Iniciando tradução dos arquivos de dados...\n');

    for (const file of files) {
      const filePath = path.join(DATA_DIR, file);
      const key = file.replace('.json', '');
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      console.log(`📄 Traduzindo ${file}...`);
      const translated = await translateValue(data);

      dataEn[key] = translated;
      dataPt[key] = data;

      console.log(`✅ ${file} traduzido com sucesso\n`);
    }

    // Ler locales existentes
    const enPath = path.join(LOCALES_DIR, 'en_US.json');
    const ptPath = path.join(LOCALES_DIR, 'pt_BR.json');

    const enLocale = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    const ptLocale = JSON.parse(fs.readFileSync(ptPath, 'utf-8'));

    // Mesclar dados traduzidos
    enLocale.data = dataEn;
    ptLocale.data = dataPt;

    // Salvar arquivos atualizados
    fs.writeFileSync(enPath, JSON.stringify(enLocale, null, 2));
    fs.writeFileSync(ptPath, JSON.stringify(ptLocale, null, 2));

    console.log('✨ Tradução concluída com sucesso!');
    console.log(`📍 en_US.json atualizado com dados traduzidos`);
    console.log(`📍 pt_BR.json atualizado com dados originais`);
  } catch (error) {
    console.error('❌ Erro durante a tradução:', error.message);
    process.exit(1);
  }
}

processDataFiles();
