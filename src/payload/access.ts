import type { Access, FieldAccess } from 'payload';

/**
 * Access rules, in one place so a new collection cannot quietly ship with
 * Payload's defaults.
 *
 * The site is public marketing content, so reads are open. Everything that
 * changes data requires a logged-in admin. Leads are the exception and are
 * handled in that collection: anyone may create one, only admins may read.
 */

/** Public — used for content the website renders. */
export const anyone: Access = () => true;

/** Any authenticated CMS user. Single role for now — see docs/PLAN.md. */
export const admins: Access = ({ req }) => Boolean(req.user);

/** Field-level equivalent, for values that must never leave the admin panel. */
export const adminsFieldLevel: FieldAccess = ({ req }) => Boolean(req.user);

/** Nobody, ever — for fields the system owns. */
export const noone: Access = () => false;
