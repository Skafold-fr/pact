import {Verifier} from '@pact-foundation/pact';
import {afterAll, beforeAll, describe, it} from "vitest";
import {app} from "../../src/http/server.js";

describe("Pact Verification", () => {
    const port = 4_000;
    let server: any

    beforeAll(async () => {
        server = app.listen(port, () => {
            console.log(`PROVIDER starting on http://localhost:${port}`)
        })
    });

    afterAll(() => server.close());

    it("validates the expectations of UserService", async () => {
        const opts = {
            logLevel: "INFO",
            providerBaseUrl: `http://localhost:${port}`,

            provider: "ProviderService",
            providerVersion: "0.0.1",
            providerVersionBranch: "main",
            consumerVersionSelectors: [{
                latest: true
            }],

            pactBrokerUrl: "http://localhost:9292",
            pactBrokerUsername: "pact",
            pactBrokerPassword: "pact",

            publishVerificationResult: true,
        };

      await new Verifier(opts).verifyProvider();
    })
});