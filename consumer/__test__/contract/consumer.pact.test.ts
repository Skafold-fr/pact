// consumer.pact.test.js
import {Pact} from '@pact-foundation/pact';
import {describe, expect, it} from "vitest"
import {UserRepository} from "../../api/api.js";
import path from "node:path";

const provider = new Pact({
    consumer: 'ConsumerService',
    provider: 'ProviderService',
    dir: path.resolve(process.cwd(), 'consumer/pacts'),

});

describe('User Service Consumer Tests', () => {
    it('gets user by ID', async () => {
        await provider
            .addInteraction()
            .given('user 1 exists') // Provider state
            .uponReceiving('a request for user 1')
            .withRequest("GET", '/users/1', (builder) => {
                builder.headers({Accept: 'application/json'});
            })
            .willRespondWith(200, (builder) => {
                builder.jsonBody({
                    id: '1',
                    firstName: 'John Doe',
                });
            })
            .executeTest(async (mockServer) => {
                const userRepository = new UserRepository(mockServer.url);
                const user = await userRepository.getUser('1');

                expect(user.id).toBe('1');
                expect(user.firstName).toBe('John Doe');
            });
    });
});