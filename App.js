import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { List, TextInput, Button, Modal, Portal, Text, Provider, DefaultTheme } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
  },
};

export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handlePress = () => setExpanded(!expanded);

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);

  useEffect(() => {
    const buscarCep = async () => {
      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          if (data.erro) {
            showModal('CEP não encontrado');
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
          showModal('Erro ao buscar o CEP');
          setEndereco({ logradouro: '', bairro: '', localidade: '', uf: '' });
        }
      } else {
        setEndereco({ logradouro: '', bairro: '', localidade: '', uf: '' });
      }
    };

    buscarCep();
  }, [cep]);

  return (
    <Provider theme={theme}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            label="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            requered={true}
          />
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
         <TextInputMask
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            value={dataNascimento}
            onChangeText={setDataNascimento}
            style={styles.input}
            placeholder="DD/MM/AAAA"
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
              {[
                'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
                'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
                'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
              ].map((estado) => (
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
          <Button
            mode="contained"
            onPress={() => showModal('Cadastro realizado!')}
            style={styles.button}
          >
            Cadastrar
          </Button>
        </ScrollView>
        <StatusBar style="auto" />
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}
          >
            <Text>{modalMessage}</Text>
            <Button onPress={hideModal} style={styles.modalButton}>
              Fechar
            </Button>
          </Modal>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
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
  button: {
    marginTop: 20,
    marginHorizontal: 15,
    paddingVertical: 10,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalButton: {
    marginTop: 10,
  },
});