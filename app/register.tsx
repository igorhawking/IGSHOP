import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import {
  User,
  Mail,
  Lock,
  Phone,
  ChevronLeft,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { colors } from "../components/theme/colors";
import { fontSize, fontWeight } from "../components/theme/typography";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateName = (text: string) => {
    setIsNameValid(text.length >= 3 || text === "");
    setName(text);
  };

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(text) || text === "");
    setEmail(text);
  };

  const validatePhone = (text: string) => {
    const phoneRegex = /^\d{10,11}$/;
    setIsPhoneValid(phoneRegex.test(text.replace(/\D/g, "")) || text === "");
    setPhone(text);
  };

  const validatePassword = (text: string) => {
    setIsPasswordValid(text.length >= 6 || text === "");
    setPassword(text);

    if (confirmPassword) {
      setIsConfirmPasswordValid(
        confirmPassword === text || confirmPassword === "",
      );
    }
  };

  const validateConfirmPassword = (text: string) => {
    setIsConfirmPasswordValid(text === password || text === "");
    setConfirmPassword(text);
  };

  const formatPhone = (text: string) => {
    // Remove non-digits
    const digits = text.replace(/\D/g, "");

    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formattedPhone = formatPhone(text);
    validatePhone(text);
    setPhone(formattedPhone);
  };

  const handleRegister = () => {
    // Validate all fields
    const nameValid = name !== "" && isNameValid;
    const emailValid = email !== "" && isEmailValid;
    const phoneValid = phone !== "" && isPhoneValid;
    const passwordValid = password !== "" && isPasswordValid;
    const confirmPasswordValid =
      confirmPassword !== "" && isConfirmPasswordValid;

    setIsNameValid(nameValid);
    setIsEmailValid(emailValid);
    setIsPhoneValid(phoneValid);
    setIsPasswordValid(passwordValid);
    setIsConfirmPasswordValid(confirmPasswordValid);

    if (
      nameValid &&
      emailValid &&
      phoneValid &&
      passwordValid &&
      confirmPasswordValid
    ) {
      // Navigate to home screen
      router.replace("/home");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha seus dados para se cadastrar
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome completo</Text>
            <View
              style={[styles.inputWrapper, !isNameValid && styles.inputError]}
            >
              <User
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                value={name}
                onChangeText={validateName}
              />
            </View>
            {!isNameValid && (
              <Text style={styles.errorText}>
                Nome deve ter pelo menos 3 caracteres
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <View
              style={[styles.inputWrapper, !isEmailValid && styles.inputError]}
            >
              <Mail
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={validateEmail}
              />
            </View>
            {!isEmailValid && (
              <Text style={styles.errorText}>E-mail inválido</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone</Text>
            <View
              style={[styles.inputWrapper, !isPhoneValid && styles.inputError]}
            >
              <Phone
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={handlePhoneChange}
              />
            </View>
            {!isPhoneValid && (
              <Text style={styles.errorText}>Telefone inválido</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <View
              style={[
                styles.inputWrapper,
                !isPasswordValid && styles.inputError,
              ]}
            >
              <Lock
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={validatePassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {!isPasswordValid && (
              <Text style={styles.errorText}>
                A senha deve ter pelo menos 6 caracteres
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar senha</Text>
            <View
              style={[
                styles.inputWrapper,
                !isConfirmPasswordValid && styles.inputError,
              ]}
            >
              <Lock
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirme sua senha"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={validateConfirmPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {!isConfirmPasswordValid && (
              <Text style={styles.errorText}>As senhas não coincidem</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.loginText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    padding: 24,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 1,
    borderColor: colors.support,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  passwordToggle: {
    padding: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  registerButtonText: {
    color: "white",
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginRight: 4,
  },
  loginText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
