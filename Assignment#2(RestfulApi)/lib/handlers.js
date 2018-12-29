/**
 * importing the modules required
 */

const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');
const constants = require('./constants');

//declaring object for holding handlers

let handlers = {};

handlers.notFound = function (data, callback) {
    callback(404, {
        'Error': constants.errorCodes.handlerNotFound
    });
}

handlers.users = function (data, callback) {
    let acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405, {
            "Error": constants.errorCodes.invalidMethod
        });
    }
}

handlers._users = {};
handlers._users.post = function (data, callback) {
    console.log(`${JSON.stringify(data.payload)}`);
    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (firstName && lastName && phone && password) {
        _data.read('users', phone, function (err, data) {
            if (err) {
                let hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    let userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'password': hashedPassword
                    };

                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                'Error': constants.errorCodes.userCreationError
                            });
                        }
                    });
                } else {
                    callback(500, {
                        'Error': constants.errorCodes.passwordHashError
                    });
                }
            } else {
                callback(400, {
                    'Error': constants.errorCodes.userExistsError
                });
            }
        });
    } else {
        callback(400, {
            "Error": constants.errorCodes.missingRequiredFields
        });
    }
}

handlers._users.get = function (data, callback) {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    if (phone) {
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404, {
                    "Error": constants.errorCodes.userNotFound
                });
            }
        });
    } else {
        callback(400, {
            'Error': constants.errorCodes.missingRequiredFields
        });
    }
}


handlers._users.put = function (data, callback) {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    // Check for optional fields
    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (phone && (firstName || lastName || password)) {
        _data.read('users', phone, function (err, userData) {
            if (!err && userData) {
                if (firstName) {
                    userData.firstName = firstName;
                }

                if (lastName) {
                    userData.lastName = lastName;
                }

                if (password) {
                    userData.password = helpers.hash(password);
                    if(!userData.password){
                        callback(500,{"Error":constants.errorCodes.passwordHashError});
                    }
                }

                _data.update('users', phone, userData, function (err) {
                    if (!err) {
                        callback(200,{"Result":constants.successCodes.userUpdateSuccess});
                    } else {
                        callback(500, {
                            'Error': constants.errorCodes.userUpdateError
                        });
                    }
                });
            } else {
                callback(404, {
                    'Error': constants.errorCodes.userNotFound
                });
            }
        });
    } else {
        callback(400, {
            'Error': constants.errorCodes.missingRequiredFields
        });
    }
}

handlers._users.delete = function (data, callback) {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    if (phone) {
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                _data.delete('users', phone, function (err) {
                    if (!err) {
                        callback(200, {
                            "Response": constants.successCodes.userDeletionSuccess
                        });
                    }
                })
            } else {
                callback(404, {
                    "Error": constants.errorCodes.userNotFound
                });
            }
        });
    } else {
        callback(400, {
            'Error': constants.errorCodes.missingRequiredFields
        });
    }
}

//handlers for generating and destroying tokens.
handlers.tokens = function (data, callback) {
    let validMethods = ['post', 'put', 'get', 'delete'];
    if (validMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405, {
            "Error": constants.errorCodes.invalidMethod
        });
    }
}

handlers._tokens.post = function (data, callback) {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let userData = handlers._users.get(data, callback);
    let hashedPassword = helpers.hash(password);
    if (hashedPassword && hashedPassword == userData.password) {
        let tokenString = helpers.createRandomString(20);
        let tokenFunction = function (err, data) {
            return data;
        }
        let tempTokenObject = _data.read('tokens', tokenString, tokenFunction);
        //check whether token already exists
        while (typeof (tempTokenObject) !== 'undefined') {
            tokenString = helpers.createRandomString(20);
            tempTokenObject = _data.read('tokens', tokenString, tokenFunction);
        }
        if (tokenString.trim().length == 20) {
            let tokenObject = {
                "phone": phone,
                "token": tokenString,
                //token is valid till 12hrs of login
                "validTill": Date.now() + 12 * 60 * 60 * 1000
            }
            _data.create('tokens', tokenString, tokenObject, function (err, data) {
                if (!err) {
                    callback(200, {
                        "Result": constants.successCodes.tokenCreationSuccess
                    });
                } else {
                    callback(500, {
                        "Error": constants.errorCodes.tokenCreationError
                    });
                }
            });
        } else {
            callback(500, {
                "Error": constants.errorCodes.tokenCreationError
            });
        }
        _data.read()

    } else {
        callback(400, {
            "Error": constants.errorCodes.missingRequiredFields
        });
    }
}

handlers._tokens.put = function (data, callback) {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false;
    let token = typeof (data.payload.token) == 'string' && data.payload.token.trim().length == 20 ? data.payload.token.trim() : false;
    if (token && phone) {
        _data.read('tokens', token, function (err, tokenData) {
            if (!err && tokenData) {
                if (Date.now() < tokenObject.validTill) {
                    tokenObject.validTill = Date.now() + 12 * 60 * 60 * 1000;
                    _data.update('tokens', token, tokenObject, function (err, data) {
                        if (!err) {
                            callback(200, {
                                "Result": constants.successCodes.tokenUpdateSuccess
                            });
                        } else {
                            callback(500, {
                                "Error": constants.errorCodes.tokenUpdateError
                            });
                        }
                    })
                } else {
                    callback(400, {
                        "Error": constants.errorCodes.invalidToken
                    });
                }
            } else {
                callback(400, {
                    'Error': constants.errorCodes.missingRequiredFields
                });
            }
        });
    } else {
        callback(405, {
            "Error": constants.errorCodes.missingRequiredFields
        });
    }
}

handlers._tokens.delete = function (data, callback) {
    let token = typeof (data.payload.token) == 'string' && data.payload.token.trim().length == 20 ? data.payload.token.trim() : false;
    if (token) {
        _data.read('tokens', token, function (err, data) {
            if (!err && data) {
                _data.delete('tokens', token, function (err) {
                    if (!err) {
                        callback(200, {
                            "Result": constants.successCodes.tokenDeletionSuccess
                        });
                    } else {
                        callback(500, {
                            "Error": constants.errorCodes.tokenDeletionError
                        });
                    }
                });
            } else {
                callback(404, {
                    "Error": constants.errorCodes.invalidToken
                });
            }
        });
    } else {
        callback(400, {
            "Error": constants.errorCodes.missingRequiredFields
        });
    }
}

handlers.menu = function (data, callback) {
    let validMethods = ['get'];
    if (validMethods.indexOf(data.method) > -1) {
        let menuObject = {
            menuItems : constants.menu
        }
        callback(200, menuObject);
    } else {
        callback(405, {
            "Error": constants.errorCodes.invalidMethod
        });
    }
}

handlers.cart = function (data, callback) {
    let validMethods = ['get', 'put', 'delete'];
    if (validMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, callback);
    } else {
        callback(405, {
            "Error": constants.errorCodes.invalidMethod
        });
    }
}

handlers._cart.put = function (data, callback) {
    let cartItem = typeof (data.payload.cartItem) == 'object' && Object.keys(data.payload.cartItem).length > 0 ? data.payload.cartItem : false;
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone : false;
    if (phone && cartItem) {
        _data.read('carts', phone, function (err, cartData) {
            if (!err && cartData) {
                cartData.cartItems.push(cartItem);
                _data.update('carts', phone, cartData, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            "Error": constants.errorCodes.cartUpdateError
                        });
                    }
                });
            } else {
                cartObject = {
                    cartItems: [cartItem]
                };
                _data.create('carts', phone, cartObject, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            "Error": constants.errorCodes.cartUpdateError
                        });
                    }
                });
            }
        });

    } else {
        callback(400, {
            "Error": constants.errorCodes.missingRequiredFields
        });
    }

}

handlers._cart.delete = function (data, callback) {
    let cartItem = typeof (data.payload.cartItem) == 'object' && Object.keys(data.payload.cartItem).length > 0 ? data.payload.cartItem : false;
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone : false;
    if (phone && cartItem) {
        _data.read('carts', phone, function (err, cartData) {
            if (!err && cartData) {
                let cartItems = cartData.cartItems;
                for (i = 0; i < cartItems.length; i++) {
                    if (cartItems[i].id == cartItem.id) {
                        cartItems.remove(i);
                    }
                }
                _data.update('carts', phone, cartData, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            "Error": constants.errorCodes.cartUpdateError
                        });
                    }
                });
            }
        });
    } else {
        callback(400, {
            "Error": constants.errorCodes.missingRequiredFields
        });
    }
}

handlers._cart.get = function (data, callback) {
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone : false;
    if (phone) {
        _data.read('carts', phone, function (err, cartData) {
            if (!err && cartData) {
                callback(200, cartData);
            }
        });
    } else {
        callback(400, {
            "Error": constants.errorCodes.missingRequiredFields
        });
    }
}

handlers.orders = function (data, callback) {
    let validMethods = [post, get];
    if (validMethods.indexOf(data.method) > -1) {
        handlers._orders[data.method](data, callback);
    } else {
        callback(405, {
            "Error": constants.errorCodes.invalidMethod
        });
    }
}

handlers._orders.get = function (data, callback) {
    let orderId = typeof (data.payload.orderId) == 'string' && data.payload.orderId.length == 20 ? data.payload.orderId : false;
    _data.read('orders', orderId, function (err, data) {
        if (!err && data) {
            callback(200, data);
        } else {
            callback(404, {
                "Error": "Could Not find the order"
            });
        }
    });
}

handlers._orders.post = function (data, callback) {
    let orderId = helpers.createRandomString(20);

}

module.exports = handlers;