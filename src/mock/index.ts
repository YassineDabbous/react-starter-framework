import { setupWorker } from "msw/browser";

export function initMock(handlers: any[]) {
    const worker = setupWorker(...handlers);
    return worker;
}
