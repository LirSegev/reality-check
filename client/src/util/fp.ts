import * as t from 'io-ts';
import { PathReporter } from 'io-ts/es6/PathReporter';
import { pipe } from 'fp-ts/es6/pipeable';
import { left } from 'fp-ts/es6/Either';

export function logErrors(err: t.Errors) {
	pipe(left(err), PathReporter.report, console.error);
}
