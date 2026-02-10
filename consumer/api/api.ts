export class UserRepository {
    constructor(private readonly url: string) {
    }

    getUser = async (id: string) => {
        const usersResponse = await fetch(`${this.url}/users/${id}`, {
            headers: { Accept: 'application/json' }
        })
        return await usersResponse.json()
    }
}

