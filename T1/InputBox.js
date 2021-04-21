import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

/**
* @author
* @function InputBox

**/
const InputBox = ({formState, itemName, title, onItemChanged}) => {
  const [touched, setTouched] = useState(false);

  return (
    <View style={styles.inputBox}>
      <Text>{title}</Text>
      <TextInput
        style={styles.baseInput}
        placeholder={itemName}
        value={formState.inputValues[itemName]}
        onChangeText={text => {
          console.log('Item changed ' + itemName);
          onItemChanged(itemName, text);
        }}
        onBlur={() => {
          setTouched(true);
        }}
      />
      {!formState.inputValidities[itemName].isValid && touched && (
        <Text style={styles.errorMessage}>
          {formState.inputValidities[itemName].message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {marginTop: 10, marginBottom: 10, backgroundColor: 'yellow'},
  baseInput: {width: '80%', padding: 5, backgroundColor: 'white'},
  errorMessage: {padding: 2, paddingLeft: 5, color: 'red'},
});
export default InputBox;
