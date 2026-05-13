import { PaperProvider } from 'react-native-paper';
import Calculadora from './src/Calculadora';

export default function App() {
  return (
    <PaperProvider>
      <Calculadora />
    </PaperProvider>
  );
}