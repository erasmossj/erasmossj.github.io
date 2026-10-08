// Busca os repositórios na API GraphQL do GitHub e salva em src/data/repos.json (roda no `prebuild`).
// Se a API falhar, o build segue com o último snapshot commitado (SCRUM-18).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { toRepos } from '../src/lib/github/transform.ts';
import type { ApiResponse, ReposSnapshot } from '../src/lib/github/types.ts';

export const GITHUB_USER = 'erasmossj';
const ENDPOINT = 'https://api.github.com/graphql';
const TIMEOUT_MS = 15_000;
const SNAPSHOT_PATH = fileURLToPath(new URL('../src/data/repos.json', import.meta.url));

// Até 100 repositórios (sem paginação): suficiente para um perfil pessoal.
const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes { ... on Repository { name } }
      }
      repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: { field: PUSHED_AT, direction: DESC }) {
        nodes {
          name
          description
          url
          homepageUrl
          isFork
          isArchived
          stargazerCount
          forkCount
          pushedAt
          repositoryTopics(first: 20) { nodes { topic { name } } }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            totalSize
            edges { size node { name color } }
          }
        }
      }
    }
  }
`;

async function fetchSnapshot(token: string, fetchImpl: typeof fetch): Promise<ReposSnapshot> {
  let response: Response;
  try {
    response = await fetchImpl(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': `${GITHUB_USER}.github.io`,
      },
      body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USER } }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new Error(`tempo limite de ${TIMEOUT_MS / 1000}s excedido`, { cause: error });
    }
    throw error;
  }

  if (!response.ok) {
    const hint = response.status === 401 ? ' (token inválido?)' : '';
    throw new Error(`GitHub respondeu HTTP ${response.status}${hint}`);
  }

  const repos = toRepos((await response.json()) as ApiResponse);
  return { generatedAt: new Date().toISOString(), user: GITHUB_USER, repos };
}

function readSnapshot(path: string): ReposSnapshot {
  const snapshot = JSON.parse(readFileSync(path, 'utf8')) as ReposSnapshot;
  if (!Array.isArray(snapshot.repos)) throw new Error(`snapshot inválido em ${path}`);
  return snapshot;
}

function defaultWarn(message: string) {
  // No GitHub Actions, vira uma anotação de warning visível no resumo do workflow.
  console.warn(
    process.env.GITHUB_ACTIONS ? `::warning title=Dados do GitHub::${message}` : `⚠ ${message}`,
  );
}

export interface UpdateOptions {
  token: string | undefined;
  snapshotPath?: string;
  fetchImpl?: typeof fetch;
  warn?: (message: string) => void;
}

/** Atualiza o snapshot com dados da API; em caso de falha, mantém o anterior. */
export async function updateSnapshot({
  token,
  snapshotPath = SNAPSHOT_PATH,
  fetchImpl = fetch,
  warn = defaultWarn,
}: UpdateOptions): Promise<'api' | 'snapshot'> {
  try {
    if (!token) throw new Error('variável GITHUB_TOKEN não definida');
    const snapshot = await fetchSnapshot(token, fetchImpl);
    writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
    return 'api';
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (!existsSync(snapshotPath)) {
      throw new Error(
        `Falha ao buscar os repositórios no GitHub (${reason}) e não há snapshot em ${snapshotPath}. ` +
          'Defina GITHUB_TOKEN com um token válido e rode o build de novo.',
        { cause: error },
      );
    }
    const previous = readSnapshot(snapshotPath);
    warn(
      `Falha ao buscar os repositórios no GitHub (${reason}). ` +
        `Usando o snapshot de ${previous.generatedAt} (${previous.repos.length} repositórios).`,
    );
    return 'snapshot';
  }
}

// Executado direto pelo Node (e não importado pelos testes).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const source = await updateSnapshot({ token: process.env.GITHUB_TOKEN });
    if (source === 'api')
      console.log(`✔ Repositórios de ${GITHUB_USER} salvos em src/data/repos.json`);
  } catch (error) {
    console.error(`✖ ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  }
}
