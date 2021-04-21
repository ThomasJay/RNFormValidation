/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useReducer} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import {validate} from 'validate.js';

import InputBox from './InputBox';

const FORM_UPDATE = 'FORM_UPDATE';

const email = 'thomas.jay@me.com';

const validateEmail = email => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    return false;
  } else {
    return true;
  }
};

console.log('Email Errors: ' + validateEmail(email));

const constraints = {
  emailAddress: {
    presence: {
      allowEmpty: false,
      message: '^Please enter an email address',
    },
    length: {
      minimum: 10,
    },
    email: {
      message: '^Please enter a valid email address',
    },
  },
  username: {
    presence: {
      allowEmpty: false,
      message: '^Please enter a username',
    },
    length: {
      minimum: 3,
      maximum: 20,
    },
    format: {
      // We don't allow anything that a-z and 0-9
      pattern: '[a-z0-9]+',
      // but we don't care if the username is uppercase or lowercase
      flags: 'i',
      message: 'can only contain a-z and 0-9',
    },
  },
  password: {
    // Password is also required
    presence: true,
    // And must be at least 5 characters long
    length: {
      minimum: 5,
    },
  },
  confirmPassword: {
    // You need to confirm your password
    presence: true,
    // and it needs to be equal to the other password
    equality: {
      attribute: 'password',
      message: '^The passwords does not match',
    },
  },
  zip: {
    presence: true,
    // Zip specified it must be a 5 digit long number
    length: {
      minimum: 5,
    },
    format: {
      pattern: '\\d{5}',
    },
  },
  numberOfChildren: {
    presence: true,
    // Number of children has to be an integer >= 0
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 0,
    },
  },
};

validate.validators.email.PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

const data = {
  emailAddress: email,
  username: 'Fred',
  password: '222222',
  confirmPassword: '222222',
  zip: '11111',
  numberOfChildren: '10',
};
const validationResult = validate(data, constraints);

if (validationResult) {
  if (validationResult.emailAddress) {
    console.log(
      'Email Validation issues: ' + validationResult.emailAddress.join(', '),
    );
  }
}

if (!validationResult) {
  console.log('No Validations Errors');
} else {
  console.log('Validations');
  console.log(validationResult);
}

const formReducer = (state, action) => {
  console.log('formReducer type: ' + action.type);
  console.log(state);
  switch (action.type) {
    case FORM_UPDATE:
      console.log('processing ' + action.type);
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };

      const inputValidity = {isValid: action.isValid, message: action.message};

      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: inputValidity,
      };
      let formIsValid = true;
      for (const key in updatedValidities) {
        formIsValid = formIsValid && updatedValidities[key].isValid;
      }

      console.log('updated-');

      const updatedState = {
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: formIsValid,
      };

      console.log(updatedState);

      return updatedState;

    default:
      return state;
  }
};

const App = () => {
  const initialState = {
    inputValues: {title: '', name: '', description: ''},
    inputValidities: {
      title: {value: false, message: ''},
      name: {value: false, message: ''},
      description: {value: false, message: ''},
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(formReducer, initialState);

  const validateForm = () => {
    Alert.alert('Validated', 'oops');
  };

  const validateItem = (inputField, text) => {
    switch (inputField) {
      case 'title':
        if (text.length === 0) {
          return [false, 'Title is too Short'];
        }
        return [true, ''];
      case 'name':
        if (text.length < 5) {
          return [false, 'Name is too Short'];
        }
        return [true, ''];
      case 'description':
        if (text.length < 10) {
          return [false, 'Description is too Short'];
        }
        return [true, ''];
      default:
        return [true, ''];
    }
  };

  const itemChange = (inputField, text) => {
    const [isValid, message] = validateItem(inputField, text);

    dispatchFormState({
      type: FORM_UPDATE,
      value: text,
      isValid: isValid,
      input: inputField,
      message: message,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{flexGrow: 1}}
      behavior="padding"
      keyboardVerticalOffset={4}>
      <ScrollView>
        <View style={styles.fullContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Input Processing Form</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text>New Product</Text>

            <InputBox
              itemName="title"
              title="Title"
              formState={formState}
              onItemChanged={itemChange}
            />
            <InputBox
              itemName="name"
              title="Name"
              formState={formState}
              onItemChanged={itemChange}
            />
            <InputBox
              itemName="description"
              title="Description"
              formState={formState}
              onItemChanged={itemChange}
            />

            <View style={styles.inputBox}>
              <Text>Color</Text>
              <TextInput
                style={styles.baseInput}
                placeholder="color"
                value={formState.inputValues.color}
                onChangeText={text => {
                  itemChange('color', text);
                }}
              />
              <Text>Error</Text>
            </View>
            <View style={styles.inputBox}>
              <Text>Size</Text>
              <TextInput
                style={styles.baseInput}
                placeholder="size"
                value={formState.inputValues.size}
                onChangeText={text => {
                  itemChange('size', text);
                }}
              />
              <Text>Error</Text>
            </View>
            <View style={styles.inputBox}>
              <Text>Style</Text>
              <TextInput
                style={styles.baseInput}
                placeholder="style"
                value={formState.inputValues.style}
                onChangeText={text => {
                  itemChange('style', text);
                }}
              />
              <Text>Error</Text>
            </View>
            <View style={styles.inputBox}>
              <Text>Genre</Text>
              <TextInput
                style={styles.baseInput}
                placeholder="genre"
                value={formState.inputValues.genre}
                onChangeText={text => {
                  itemChange('genre', text);
                }}
              />
              <Text>Error</Text>
            </View>
            <Button
              title="Validate"
              onPress={() => {
                validateForm();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fullContainer: {flex: 1, backgroundColor: 'gray'},
  headerContainer: {
    width: '100%',
    height: 90,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {marginTop: 50, color: 'white', fontSize: 20, fontWeight: 'bold'},
  inputContainer: {
    marginTop: 10,
    padding: 20,
  },
  inputBox: {marginTop: 10, marginBottom: 10, backgroundColor: 'yellow'},
  baseInput: {width: '80%', padding: 5, backgroundColor: 'white'},
  errorMessage: {padding: 2, paddingLeft: 5, color: 'red'},
});

export default App;
