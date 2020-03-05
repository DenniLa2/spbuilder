import jwt from "jsonwebtoken";

/**
 * Проверка существования и актуальности токена
 * @param token
 * @returns {boolean}
 */
export function isActiveToken(token) {
    if(!token || token === ''){
        return false;
    }
    const date = new Date().getTime() / 1000;
    const data = jwt.decode(token);
    return date < data.exp;
}

export const AuthMixin = {
    methods: {
        isActiveToken
    }
};
