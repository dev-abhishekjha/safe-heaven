/* THIS FILE IS PART OF THE PAYLOAD ADMIN PANEL — do not add site markup here.
 * The public site lives under src/app/(frontend).
 */
import type { ServerFunctionClient } from 'payload';

import config from '@payload-config';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type React from 'react';

import { importMap } from './admin/importMap.js';

/* Payload's admin stylesheet. Without this the panel renders as unstyled HTML —
 * serif text, full-bleed inputs — which looks like a broken app rather than a
 * missing import. It is not optional and it is not part of the site's CSS. */
import '@payloadcms/next/css';
/* Our own small branding layer, loaded after so it can override. */
import './custom.scss';

type Args = {
	children: React.ReactNode;
};

/**
 * The admin panel's server-function bridge.
 *
 * MUST be a block body with the `'use server'` directive inside it. Payload
 * passes this function down to a Client Component, and React only allows that
 * for a function explicitly marked as a server action — otherwise every
 * `/admin` request fails with "Functions cannot be passed directly to Client
 * Components".
 *
 * A concise arrow body (`async (args) => handleServerFunctions(...)`) has
 * nowhere to put a directive prologue, so it cannot be marked, and the failure
 * only appears at runtime once the database connects far enough to render the
 * panel. Do not "simplify" this back into an expression body.
 */
// biome-ignore lint/complexity/useArrowFunction: the autofix deletes the 'use server' directive below, which breaks every /admin request
const serverFunction: ServerFunctionClient = async function (args) {
	'use server';
	return handleServerFunctions({
		...args,
		config,
		importMap,
	});
};

const Layout = ({ children }: Args) => (
	<RootLayout
		config={config}
		importMap={importMap}
		serverFunction={serverFunction}
	>
		{children}
	</RootLayout>
);

export default Layout;
