
const BASE_URL = 'http://10.137.11.6/api/sensor/status';

async function requisicao(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  });

  const texto = await response.text();

  if (!response.ok) {
    throw new Error(
      `Erro HTTP ${response.status}: ${texto || response.statusText}`
    );
  }

  if (!texto) return null;

  try {
    return JSON.parse(texto);
  } catch {
    throw new Error('A API não retornou um JSON válido.');
  }
}

export async function getSensores() {
  const json = await requisicao(`${BASE_URL}/listar`);
  const dados = Array.isArray(json) ? json : json?.data;

  if (!Array.isArray(dados)) {
    throw new Error('A API não retornou uma lista válida de sensores.');
  }

  return dados;
}

export async function atualizarStatus(codigo, status) {
  return requisicao(`${BASE_URL}/atualizar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      codigo,
      status,
    }),
  });
}

export async function visualizarStatus(codigo) {
  const codigoSeguro = encodeURIComponent(String(codigo));

  return requisicao(
    `${BASE_URL}/visualizar/${codigoSeguro}`
  );
}
