import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { pipe } from 'fp-ts/lib/pipeable';
import { left } from 'fp-ts/lib/Either';

export function logErrors(err: t.Errors) {
	pipe(left(err), PathReporter.report, console.error);
}
