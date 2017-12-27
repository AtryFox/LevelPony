class PonyUtils {
    static randomInt(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
}

module.exports = PonyUtils;