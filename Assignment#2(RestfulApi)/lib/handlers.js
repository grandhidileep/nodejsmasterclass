/**
 * importing the modules required
 */

const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');

//declaring object for holding handlers

let handlers = {};

handlers.notFound = function (data, callback) {
    callback(404, {
        'Error': 'You are not looking in the right place'
    });
}

handlers.users = function (data, callback) {
    let acceptedMethods = ['get', 'post', 'put'];
    if (acceptedMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
}

handlers._users = {};
handlers._users.post = function (data, callback) {
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
                                'Error': 'Could not create new user'
                            });
                        }
                    });
                } else {
                    callback(500, {
                        'Error': 'Could not hash the password'
                    });
                }
            } else {
                callback(400, {
                    'Error': 'User Already exists with same phone number'
                });
            }
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
                callback(404);
            }
        });
    } else {
        callback(400, {
            'Error': 'Phone number is required'
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
                }

                _data.update('users', phone, userData, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            'Error': 'Could not update user data'
                        });
                    }
                });
            } else {
                callback(404, {
                    'Error': 'Specified user does not exist'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required fields'
        });
    }
}