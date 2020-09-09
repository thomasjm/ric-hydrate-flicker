
export const inMemoryCacheArgs = {
  typePolicies: {
    ProfileUserInfo: {
      keyFields: ["username"],
      fields: {
        privateInfo: {
          merge: true
        },
      },
    },
    ProfileSandboxInfo: {
      keyFields: ["username", "name"],
    }
  }
}
