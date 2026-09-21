import * as migration_20260921_121416 from './20260921_121416';

export const migrations = [
  {
    up: migration_20260921_121416.up,
    down: migration_20260921_121416.down,
    name: '20260921_121416'
  },
];
