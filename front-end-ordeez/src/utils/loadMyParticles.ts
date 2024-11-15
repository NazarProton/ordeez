import { Engine } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';

export async function loadMyParticles(engine: Engine) {
  await loadFull(engine);
}
