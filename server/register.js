import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { setUncaughtExceptionCaptureCallback } from "node:process";

setUncaughtExceptionCaptureCallback(console.log);

register('ts-node/esm', pathToFileURL('./'));
