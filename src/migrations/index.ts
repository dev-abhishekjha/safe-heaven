import * as migration_20260921_121416 from './20260921_121416';
import * as migration_20260921_190119_icon_options from './20260921_190119_icon_options';

export const migrations = [
  {
    up: migration_20260921_121416.up,
    down: migration_20260921_121416.down,
    name: '20260921_121416',
  },
  {
    up: migration_20260921_190119_icon_options.up,
    down: migration_20260921_190119_icon_options.down,
    name: '20260921_190119_icon_options'
  },
];
