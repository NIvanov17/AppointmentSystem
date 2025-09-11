const STORAGE = sessionStorage;

const KEYS = {
    token: "token",
    email: "email",
    role: "role",
};

export const auth = {

    get: () => STORAGE.getItem(KEYS.token),
    isLoggedIn: () => !!STORAGE.getItem(KEYS.token),
    getRole: () => sessionStorage.getItem("role"),

    set: (token, { email, role } = {}) => {
        STORAGE.setItem(KEYS.token, token);
        if (email) STORAGE.setItem(KEYS.email, email);
        if (role) STORAGE.setItem(KEYS.role, role);
        window.dispatchEvent(new Event("auth:change"));
    },

    clear: () => {
        STORAGE.removeItem(KEYS.token);
        STORAGE.removeItem(KEYS.email);
        STORAGE.removeItem(KEYS.role);
        window.dispatchEvent(new Event("auth:change"));
    },


    profile: () => ({
        email: STORAGE.getItem(KEYS.email),
        role: STORAGE.getItem(KEYS.role),
    }),
};
