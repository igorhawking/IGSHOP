import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Animated,
} from "react-native";
import { colors } from "../theme/colors";
import { fontSize, fontWeight } from "../theme/typography";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  helper?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
};

export default function Input({
  label,
  error,
  helper,
  rightIcon,
  leftIcon,
  onRightIconPress,
  onLeftIconPress,
  value,
  onChangeText,
  secureTextEntry,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const handleFocus = () => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(null as any);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(null as any);
    }
  };

  const handleChangeText = (text: string) => {
    setInputValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const hasValue = inputValue !== "";
  const showError = !!error;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          showError && styles.inputContainerError,
          leftIcon && { paddingLeft: 12 },
          rightIcon && { paddingRight: 12 },
        ]}
      >
        {leftIcon && (
          <TouchableOpacity
            style={styles.leftIcon}
            onPress={onLeftIconPress}
            disabled={!onLeftIconPress}
          >
            {leftIcon}
          </TouchableOpacity>
        )}

        <View style={styles.inputWrapper}>
          <Text
            style={[
              styles.label,
              (isFocused || hasValue) && styles.labelFloating,
              isFocused && styles.labelFocused,
              showError && styles.labelError,
            ]}
          >
            {label}
          </Text>

          <TextInput
            style={[
              styles.input,
              (isFocused || hasValue) && styles.inputWithValue,
            ]}
            value={inputValue}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={colors.textSecondary}
            {...rest}
          />
        </View>

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {(showError || helper) && (
        <Text style={[styles.helperText, showError && styles.errorText]}>
          {showError ? error : helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.support,
    borderRadius: 8,
    backgroundColor: "white",
    minHeight: 56,
    position: "relative",
  },
  inputContainerFocused: {
    borderColor: colors.primary,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    left: 0,
    top: 18,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  labelFloating: {
    top: 4,
    fontSize: fontSize.xs,
  },
  labelFocused: {
    color: colors.primary,
  },
  labelError: {
    color: colors.error,
  },
  input: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    paddingTop: 16,
    paddingBottom: 4,
    paddingHorizontal: 0,
    height: 56,
  },
  inputWithValue: {
    paddingTop: 24,
  },
  leftIcon: {
    paddingLeft: 4,
  },
  rightIcon: {
    paddingRight: 4,
  },
  helperText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: colors.error,
  },
});
