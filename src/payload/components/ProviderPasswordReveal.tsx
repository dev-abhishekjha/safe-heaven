'use client';

import { type ReactNode, useEffect } from 'react';

/**
 * A show/hide toggle on every password field in the admin panel.
 *
 * Payload renders `<input type="password">` with no way to check what you
 * typed, which on a phone keyboard or with a generated password is how people
 * end up locked out of their own CMS — the failure is silent until login is
 * rejected, and on the "create a user" screen it is worse, because the typo is
 * saved.
 *
 * It is done from a provider rather than a replacement field because the
 * password input is not a config field: Payload builds it into the login view,
 * the account view and the user forms, and none of the three can be overridden
 * individually. Wrapping the panel and attaching to whatever password inputs
 * appear covers all of them, and keeps working when Payload moves them.
 *
 * The toggle only flips the input's `type`. Nothing is read, stored or logged,
 * and the field stays exactly the controlled input React thinks it is.
 */

const EYE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;

const EYE_OFF_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M10.6 6.2A9.3 9.3 0 0 1 12 6c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4"/><path d="M6.3 7.5A17.4 17.4 0 0 0 2 13s3.6 7 10 7a9.6 9.6 0 0 0 4.4-1"/><path d="m3 3 18 18"/><path d="M9.9 10.1a3 3 0 0 0 4.1 4.2"/></svg>`;

const SHELL_CLASS = 'password-reveal__shell';
const BUTTON_CLASS = 'password-reveal';

function attachToggle(input: HTMLInputElement): () => void {
	const shell = input.parentElement;

	if (!shell) {
		return () => undefined;
	}

	shell.classList.add(SHELL_CLASS);

	let visible = false;

	const button = document.createElement('button');
	button.type = 'button';
	button.className = BUTTON_CLASS;
	// Not a tab stop: someone filling the form should move field to field, and
	// the toggle is still reachable with Shift+Tab from the input itself.
	button.tabIndex = -1;

	const syncType = () => {
		const wanted = visible ? 'text' : 'password';

		if (input.type !== wanted) {
			input.type = wanted;
		}
	};

	const render = () => {
		const label = visible ? 'Hide password' : 'Show password';

		syncType();
		button.innerHTML = visible ? EYE_OFF_ICON : EYE_ICON;
		button.setAttribute('aria-pressed', String(visible));
		button.setAttribute('aria-label', label);
		button.title = label;
	};

	const onClick = () => {
		visible = !visible;
		render();
	};

	render();
	button.addEventListener('click', onClick);
	shell.append(button);

	/**
	 * React owns `type` and re-applies it whenever the field re-renders, which
	 * for a controlled input is every keystroke — a revealed password would
	 * silently re-mask itself mid-word. Watching the attribute puts it back;
	 * the equality check in `syncType` is what stops that from looping on our
	 * own write.
	 */
	const typeWatcher = new MutationObserver(syncType);
	typeWatcher.observe(input, { attributes: true, attributeFilter: ['type'] });

	return () => {
		typeWatcher.disconnect();
		button.removeEventListener('click', onClick);
		button.remove();
		shell.classList.remove(SHELL_CLASS);
		visible = false;
		syncType();
	};
}

export function ProviderPasswordReveal({ children }: { children?: ReactNode }) {
	useEffect(() => {
		const attached = new Map<HTMLInputElement, () => void>();

		const scan = () => {
			// Fields the panel has navigated away from, so a long session does
			// not accumulate observers on inputs that no longer exist.
			for (const [input, detach] of attached) {
				if (!input.isConnected) {
					detach();
					attached.delete(input);
				}
			}

			for (const input of document.querySelectorAll<HTMLInputElement>(
				'input[type="password"]',
			)) {
				if (!attached.has(input)) {
					attached.set(input, attachToggle(input));
				}
			}
		};

		scan();

		// The admin is a single-page app: the login view, the account view and
		// every user form mount long after this provider does.
		const observer = new MutationObserver(scan);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			observer.disconnect();

			for (const detach of attached.values()) {
				detach();
			}

			attached.clear();
		};
	}, []);

	return <>{children}</>;
}
