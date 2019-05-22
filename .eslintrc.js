module.exports = {
    "extends": "airbnb-standard",
    "parserOptions": {
        "ecmaVersion": 6,
        "parser": "babel-eslint"
    },
    "env": {
        "node": true,
        "browser": true,
        "es6": true,
        "mocha": true
    },
    "rules": {
        "prefer-arrow-callback": "off",
        "func-names": "off",
        "radix": "off",
        "no-plusplus": "off",
        "object-shorthand": "off",
        "prefer-template": "off",
        "max-len": "off",
        "no-lonely-if": "off",
        "class-methods-use-this": "off",
        "no-empty": "off",
        "no-else-return":0
    }
};
