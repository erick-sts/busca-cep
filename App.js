import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { List, TextInput, ListAccordion } from 'react-native-paper';

export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [endereco, setEndereco] = useState({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
  });
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  useEffect(() => {
    const buscarCep = async () => {
      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          if (data.erro) {
            Alert.alert('CEP não encontrado');
            setEndereco({ logradouro: '', bairro: '', localidade: '', uf: '' });
          } else {
            setEndereco({
              logradouro: data.logradouro || '',
              bairro: data.bairro || '',
              localidade: data.localidade || '',
              uf: data.uf || '',
            });
          }
        } catch (error) {
          Alert.alert('Erro ao buscar o CEP');
          setEndereco({ logradouro: '', bairro: '', localidade: '', uf: '' });
        }
      } else {
        setEndereco({ logradouro: '', bairro: '', localidade: '', uf: '' });
      }
    };

    buscarCep();
  }, [cep]);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        label="Digite o CEP"
        value={cep}
        onChangeText={setCep}
        style={styles.input}
        keyboardType="numeric"
        maxLength={8}
      />
      <TextInput
        label="Logradouro"
        mode="outlined"
        value={endereco.logradouro}
        style={styles.input}
        editable={false}
      />
      <TextInput
        label="Bairro"
        mode="outlined"
        value={endereco.bairro}
        style={styles.input}
        editable={false}
      />
      <TextInput
        label="Cidade"
        mode="outlined"
        value={endereco.localidade}
        style={styles.input}
        editable={false}
      />
       <TextInput
        label="Número"
        value={numero}
        onChangeText={setNumero}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        label="Complemento"
        value={complemento}
        onChangeText={setComplemento}
        style={styles.input}
      />
      <List.Section style={styles.listSection}>
        <List.Accordion
          title={`Estado: ${endereco.uf || 'Selecione'}`}
          expanded={expanded}
          onPress={handlePress}
          style={styles.accordion}
          titleStyle={styles.accordionTitle}
        >
          {['AC', 'SP', 'RJ', 'BR'].map((estado) => (
            <List.Item
              key={estado}
              title={estado}
              onPress={() => {
                setEndereco((prev) => ({ ...prev, uf: estado }));
                setExpanded(false);
              }}
              style={styles.listItem}
              titleStyle={styles.listItemTitle}
            />
          ))}
        </List.Accordion>
      </List.Section>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 20,
    marginHorizontal: 15,
  },
  listSection: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  accordion: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listItemTitle: {
    fontSize: 14,
  },
});