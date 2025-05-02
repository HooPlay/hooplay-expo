import { Text, View } from 'react-native';
import { Button } from '~/components/ui/button';
import '../global.css';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button variant={'destructive'}>Test Button</Button>
      <Text className="text-2xl">Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
