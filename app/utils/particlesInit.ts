import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { loadBackgroundMaskPlugin } from "@tsparticles/plugin-background-mask";

export async function registerParticles(engine: Engine): Promise<void> {
  await loadSlim(engine);
  await loadBackgroundMaskPlugin(engine);
}
