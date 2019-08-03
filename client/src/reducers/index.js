import { combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';

const initializeEnigmaReducer = (enigma = null, action) => {
    if (action.type === 'ENIGMA_INITIALIZED') {
        return action.payload;
    }

    return enigma;
};

const initializeAccountsReducer = (accounts = [], action) => {
    if (action.type === 'ACCOUNTS_INITIALIZED') {
        return action.payload;
    }

    return accounts;
};

const deployedDataValidationReducer = (deployedDataValidation = null, action) => {
    if (action.type === 'DATA_VALIDATION_DEPLOYED') {
        return action.payload;
    }

    return deployedDataValidation;
};

const notifyMessageReducer = (notification = {open: false, message: ''}, action) => {
    if (action.type === 'MESSAGE_NOTIFIED') {
        return action.payload;
    }

    return notification;
};

export default combineReducers({
    enigma: initializeEnigmaReducer,
    accounts: initializeAccountsReducer,
    deployedDataValidation: deployedDataValidationReducer,
    notification: notifyMessageReducer,
    form: formReducer
});
