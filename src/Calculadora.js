import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Surface, Text, Button, PaperProvider } from 'react-native-paper';

export default function Calculadora() {
  // ─── Estado ───────────────────────────────────────────────────────────────
  const [display, setDisplay] = useState('0');       // valor exibido na tela
  const [operando, setOperando] = useState(null);    // primeiro número guardado
  const [operacao, setOperacao] = useState(null);    // operador selecionado (+, -, *, /)
  const [novoNumero, setNovoNumero] = useState(false); // flag: próximo dígito começa número novo

  // ─── Funções ──────────────────────────────────────────────────────────────

  // Chamada quando o usuário aperta um número (0-9) ou ponto
  const pressionarNumero = (num) => {
    if (novoNumero) {
      // começa um número novo depois de escolher um operador
      setDisplay(String(num));
      setNovoNumero(false);
    } else {
      // evita múltiplos zeros no início e múltiplos pontos
      if (num === '.' && display.includes('.')) return;
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  // Chamada quando o usuário aperta +, -, * ou /
  const pressionarOperador = (op) => {
    setOperando(parseFloat(display)); // guarda o número atual
    setOperacao(op);                  // guarda o operador escolhido
    setNovoNumero(true);              // próximo dígito começa número novo
  };

  // Chamada quando o usuário aperta =
  const calcular = () => {
    if (operando === null || operacao === null) return;

    const atual = parseFloat(display);
    let resultado;

    switch (operacao) {
      case '+': resultado = operando + atual; break;
      case '-': resultado = operando - atual; break;
      case '*': resultado = operando * atual; break;
      case '/':
        if (atual === 0) {
          setDisplay('Erro');
          setOperando(null);
          setOperacao(null);
          return;
        }
        resultado = operando / atual;
        break;
      default: return;
    }

    // Evita casas decimais desnecessárias (ex: 0.1 + 0.2 = 0.3 e não 0.30000...4)
    const resultadoFormatado = parseFloat(resultado.toFixed(10)).toString();

    setDisplay(resultadoFormatado);
    setOperando(null);
    setOperacao(null);
    setNovoNumero(true);
  };

  // Limpa tudo e volta ao estado inicial
  const limpar = () => {
    setDisplay('0');
    setOperando(null);
    setOperacao(null);
    setNovoNumero(false);
  };

  // Inverte o sinal do número atual
  const inverterSinal = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  // ─── Layout dos botões ────────────────────────────────────────────────────
  // Cada linha é um array de objetos com: label, ação, e tipo visual
  const linhas = [
    [
      { label: 'C',   acao: limpar,                  tipo: 'funcao' },
      { label: '+/-', acao: inverterSinal,            tipo: 'funcao' },
      { label: '%',   acao: () => setDisplay(String(parseFloat(display) / 100)), tipo: 'funcao' },
      { label: '/',   acao: () => pressionarOperador('/'), tipo: 'operador' },
    ],
    [
      { label: '7', acao: () => pressionarNumero('7'), tipo: 'numero' },
      { label: '8', acao: () => pressionarNumero('8'), tipo: 'numero' },
      { label: '9', acao: () => pressionarNumero('9'), tipo: 'numero' },
      { label: '*', acao: () => pressionarOperador('*'), tipo: 'operador' },
    ],
    [
      { label: '4', acao: () => pressionarNumero('4'), tipo: 'numero' },
      { label: '5', acao: () => pressionarNumero('5'), tipo: 'numero' },
      { label: '6', acao: () => pressionarNumero('6'), tipo: 'numero' },
      { label: '-', acao: () => pressionarOperador('-'), tipo: 'operador' },
    ],
    [
      { label: '1', acao: () => pressionarNumero('1'), tipo: 'numero' },
      { label: '2', acao: () => pressionarNumero('2'), tipo: 'numero' },
      { label: '3', acao: () => pressionarNumero('3'), tipo: 'numero' },
      { label: '+', acao: () => pressionarOperador('+'), tipo: 'operador' },
    ],
    [
      { label: '0', acao: () => pressionarNumero('0'), tipo: 'numero', largo: true },
      { label: '.', acao: () => pressionarNumero('.'), tipo: 'numero' },
      { label: '=', acao: calcular,                    tipo: 'igual' },
    ],
  ];

  // Define a cor de cada tipo de botão
  const corBotao = {
    funcao:   '#A5A5A5',
    operador: '#FF9F0A',
    numero:   '#333333',
    igual:    '#FF9F0A',
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" />

      {/* Display */}
      <Surface style={estilos.display} elevation={0}>
        <Text
          style={[
            estilos.displayTexto,
            display.length > 9 && estilos.displayTextoMenor, // reduz fonte se número grande
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {display}
        </Text>
      </Surface>

      {/* Grade de botões */}
      <View style={estilos.grade}>
        {linhas.map((linha, i) => (
          <View key={i} style={estilos.linha}>
            {linha.map((btn) => (
              <Button
                key={btn.label}
                mode="contained"
                onPress={btn.acao}
                buttonColor={corBotao[btn.tipo]}
                textColor="#FFFFFF"
                style={[estilos.botao, btn.largo && estilos.botaoLargo]}
                contentStyle={estilos.botaoConteudo}
                labelStyle={estilos.botaoTexto}
              >
                {btn.label}
              </Button>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'flex-end',
    padding: 16,
  },
  display: {
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 24,
    paddingTop: 40,
  },
  displayTexto: {
    fontSize: 80,
    color: '#FFFFFF',
    fontWeight: '200',
  },
  displayTextoMenor: {
    fontSize: 48,
  },
  grade: {
    gap: 12,
  },
  linha: {
    flexDirection: 'row',
    gap: 12,
  },
  botao: {
    flex: 1,
    borderRadius: 50,
  },
  botaoLargo: {
    flex: 2, // botão "0" ocupa o dobro do espaço
  },
  botaoConteudo: {
    height: 72,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  botaoTexto: {
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 32,
  },
});
