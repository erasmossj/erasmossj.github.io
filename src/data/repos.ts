import type { ReposSnapshot } from '../lib/github/types';
import data from './repos.json';

// Gerado por scripts/fetch-github.ts no `prebuild`; não editar o JSON à mão.
export const reposSnapshot = data as ReposSnapshot;
