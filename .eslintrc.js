module.exports = {
    "extends": "airbnb",
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
        "no-console": "off",
        "radix": "off",
        "no-plusplus": "off",
        "object-shorthand": "off",
        "prefer-template": "off",
        "max-len": "off",
        "eqeqeq": "off",
        "no-lonely-if": "off",
        "class-methods-use-this": "off",
        "import/no-extraneous-dependencies": "off",
        "no-empty": "off"
    }
};