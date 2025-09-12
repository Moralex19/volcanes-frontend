import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const ping_get = defineEventHandler(() => {
  return { ok: true, msg: "pong" };
});

export { ping_get as default };
//# sourceMappingURL=ping.get.mjs.map
