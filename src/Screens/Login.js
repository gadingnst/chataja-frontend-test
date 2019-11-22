import React, { useState } from 'react'
import { StyleSheet, AsyncStorage } from 'react-native'
import {
    Container,
    View,
    Item,
    Input,
    Text,
    Thumbnail,
    Button,
    Toast,
    Spinner
} from 'native-base'
import Color from '../Configs/Color'
import Firebase from '../Configs/Firebase'

export default ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, showLoading] = useState(false)

    const login = () => {
        showLoading(true)
        Firebase.auth()
            .signInWithEmailAndPassword(email.trim().toLowerCase(), password)
            .then(() => {
                const user = Firebase.auth().currentUser
                const db = Firebase.database()
                return db
                    .ref(`/ChatAja/users/${user.uid}`)
                    .once('value')
                    .then(snapshot => ({ auth: user, snapshot }))
            })
            .then(({ auth, snapshot }) => {
                const data = snapshot.val()
                return AsyncStorage.setItem(
                    'user:data',
                    JSON.stringify({ uid: auth.uid, ...data })
                )
            })
            .then(() => {
                Toast.show({
                    text: 'Berhasil Login',
                    position: 'bottom',
                    duration: 800
                })
                navigation.navigate('AppLoadingIndicator')
            })
            .catch(err => {
                Toast.show({
                    text: err.message,
                    position: 'bottom',
                    type: 'danger',
                    duration: 1500
                })
            })
            .finally(() => showLoading(false))
    }

    return (
        <>
            <Container style={styles.container}>
                <Thumbnail
                    square
                    style={styles.logo}
                    source={require('../Assets/logo.png')}
                />
                <View
                    style={{
                        paddingHorizontal: 10,
                        marginVertical: 20,
                        alignItems: 'center'
                    }}
                >
                    <Text style={styles.title}>Ayo Mulai!</Text>
                    <Text style={{ textAlign: 'center' }}>
                        Silahkan Login terlebih dahulu.
                    </Text>
                </View>
                <View style={styles.form}>
                    <Item regular style={styles.inputWrapper}>
                        <Input placeholder="Email" onChangeText={setEmail} />
                    </Item>
                    <Item regular style={styles.inputWrapper}>
                        <Input
                            secureTextEntry
                            placeholder="Password"
                            onChangeText={setPassword}
                        />
                    </Item>
                    <Button
                        block
                        disabled={loading}
                        style={{ ...styles.btnLogin }}
                        onPress={login}
                    >
                        {loading ? (
                            <Spinner color="#fff" />
                        ) : (
                            <Text>Login</Text>
                        )}
                    </Button>
                    <Text style={{ textAlign: 'center', marginBottom: 5 }}>
                        Belum punya akun?
                    </Text>
                    <Button
                        block
                        style={{ backgroundColor: Color.Secondary }}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text>Register</Text>
                    </Button>
                </View>
            </Container>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 100,
        height: 100
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    form: {
        width: '85%'
    },
    inputWrapper: {
        marginVertical: 5
    },
    btnLogin: {
        marginVertical: 10,
        backgroundColor: Color.Primary
    }
})
