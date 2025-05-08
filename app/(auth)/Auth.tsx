import React, { useState } from 'react';
import {
  Alert,
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { supabase } from '~/lib/supabase';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithPhone() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithPhone() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ phone: phone });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="w-full p-16 h-full justify-center"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex flex-col w-full">
          <View>
            <Text>Phone Number</Text>
            <Input
              onChangeText={(text) => setPhone(text)}
              value={phone}
              autoComplete="tel-national"
              placeholder="010-1234-5678"
              keyboardType="phone-pad"
              autoCapitalize={'none'}
            />
          </View>
          <View className="w-full py-4">
            <Button disabled={loading} onPress={() => signInWithPhone()}>
              <Text>Sign In</Text>
            </Button>
          </View>
          <View className="w-full py-4">
            <Button disabled={loading} onPress={() => signUpWithPhone()}>
              <Text>Sign Up</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
