let consts = {};

consts.menu = [{
        "id": "M0001",
        "name": "Margerita",
        "price": "200",
        "Category": "Vegetarian",
        "Description": "A hugely popular margherita, with a deliciously tangy single cheese topping",
        "PizzaMania": false
    },
    {
        "id": "M0002",
        "name": "Farm House",
        "price": "255",
        "Category": "Vegetarian",
        "Description": "A pizza that goes ballistic on veggies! Check out this mouth watering overload of crunchy, crisp capsicum, succulent mushrooms and fresh tomatoes",
        "PizzaMania": false
    },
    {
        "id": "M0003",
        "name": "Peppy Paneer",
        "price": "310",
        "Category": "Vegetarian",
        "Description": "Chunky paneer with crisp capsicum and spicy red pepper - quite a mouthful!",
        "PizzaMania": false
    },
    {
        "id": "M0004",
        "name": "VEG LOADED",
        "price": "120",
        "Category": "Vegetarian",
        "Description": "Tomato | Grilled Mushroom |Jalapeno |Golden Corn | Beans in a fresh pan crust",
        "PizzaMania": true
    },
    {
        "id": "M0005",
        "name": "PANEER & ONION",
        "price": "130",
        "Category": "Vegetarian",
        "Description": "Creamy Paneer I Onion",
        "PizzaMania": true
    },
    {
        "id": "M0006",
        "name": "NON VEG LOADED",
        "price": "140",
        "Category": "Non-Vegetarian",
        "Description": "Peri - Peri chicken | Pepper Barbecue | Chicken Sausage in a fresh pan crust",
        "PizzaMania": true
    },
    {
        "id": "M0007",
        "name": "PEPPER BARBECUE CHICKEN",
        "price": "140",
        "Category": "Non-Vegetarian",
        "Description": "Pepper Barbecue Chicken in a fresh pan crust",
        "PizzaMania": true
    },
    {
        "id": "M0008",
        "name": "Non Veg Supreme",
        "price": "300",
        "Category": "Non-Vegetarian",
        "Description": "Bite into supreme delight of Black Olives, Onions, Grilled Mushrooms, Pepper BBQ Chicken, Peri-Peri Chicken, Grilled Chicken Rashers",
        "PizzaMania": false
    },
    {
        "id": "M0009",
        "name": "Chicken Dominator",
        "price": "305",
        "Category": "Non-Vegetarian",
        "Description": "Treat your taste buds with Double Pepper Barbecue Chicken, Peri-Peri Chicken, Chicken Tikka & Grilled Chicken Rashers",
        "PizzaMania": false
    },
    {
        "id": "M0010",
        "name": "CHICKEN FIESTA",
        "price": "250",
        "Category": "Non-Vegetarian",
        "Description": "Grilled Chicken Rashers I Peri-Peri Chicken I Onion I Capsicum",
        "PizzaMania": false
    }
]

consts.errorCodes = {
    "invalidMethod": "Request is not allowed",
    "invalidToken": "Token given is invalid/expired",
    "passwordHashError":"Password hashing failed",
    "missingRequiredFields": "Invalid/Missing on or more required fields",
    "internalServerError": "Something went wrong while processing request, please retry",
    "handlerNotFound": "Resources you are looking for not available any more",
    "cartUpdateError":"Couldn't update cart please retry",
    "tokenUpdateError":"Couldn't update token please retry",
    "tokenDeletionError":"Couldn't delete token",
    "tokenCreationError":"Error occured while creating token , please retry",
    "userUpdateError":"Couldn't update user data please retry",
    "userDeletionError":"Couldn't delete user",
    "userNotFound":"Couldn't find user id in the system",
    "userCreationError":"Couldn't create user",
    "userExistsError":"User Aleady exists please login to continue"
}

consts.successCodes={
    "userDeletionSuccess":"Successfully deleted User",
    "userUpdateSuccess":"Successfully updated user data",
    "userCreationSuccess":"Successfully created user",
    "tokenDeletionSuccess":"Sucessfully deleted token",
    "tokenUpdateSuccess":"Successfully updated token",
    "tokenCreationSuccess":"Successfully created token",
    "cartUpdateSuccess":"Successfully updated cart",
    "orderSuccess":"Successfully placed order"
}

module.exports = consts ;