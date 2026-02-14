const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');

const bigquery = new BigQuery({
  projectId: 'gupymesa-487420',
  keyFilename: './credentials.json',
  location: 'southamerica-east1'
});

async function criarSuperAdmin() {
  const superAdmin = {
    id: "1", 
    senha: "Admin123",
    nome: "Pedro Gabriel",
    cargo: "Gestora" 
  };

  const arquivoTemp = './super_admin.json';
  fs.writeFileSync(arquivoTemp, JSON.stringify(superAdmin));

  try {
    await bigquery.dataset('sistema_mesa').table('usuarios').load(arquivoTemp, {
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
      writeDisposition: 'WRITE_APPEND' 
    });
    console.log('✅ Super Admin ID: 1 criado!');
  } catch (e) {
    console.error('❌ Erro:', e.message);
  }
  if (fs.existsSync(arquivoTemp)) fs.unlinkSync(arquivoTemp);
}
criarSuperAdmin();