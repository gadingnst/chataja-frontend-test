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
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, showLoading] = useState(false)

    const validate = () => {
        if (name.trim().length) {
            register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password
            })
        } else {
            Toast.show({
                text: 'Name must not be empty.',
                position: 'bottom',
                type: 'danger',
                duration: 1500
            })
        }
    }

    const register = ({ name, email, password }) => {
        showLoading(true)
        Firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                const user = Firebase.auth().currentUser
                const dbUser = Firebase.database().ref(
                    `/ChatAja/users/${user.uid}`
                )

                return dbUser
                    .set({
                        name,
                        email,
                        avatar: `https://api.adorable.io/avatars/160/${email}.png`
                    })
                    .then(() => dbUser.once('value'))
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
                    text: 'Berhasil Register',
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
                        paddingHorizontal: 20,
                        marginVertical: 20,
                        alignItems: 'center'
                    }}
                >
                    <Text style={styles.title}>Daftar Akun!</Text>
                    <Text style={{ textAlign: 'center' }}>
                        Jika anda belum punya akun, silahkan buat akun terlebih
                        dahulu.
                    </Text>
                </View>
                <View style={styles.form}>
                    <Item regular style={styles.inputWrapper}>
                        <Input placeholder="Nama" onChangeText={setName} />
                    </Item>
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
                        style={{ ...styles.btnRegister }}
                        onPress={validate}
                    >
                        {loading ? (
                            <Spinner color="#fff" />
                        ) : (
                            <Text>Register</Text>
                        )}
                    </Button>
                    <Text style={{ textAlign: 'center', marginBottom: 5 }}>
                        Sudah punya akun?
                    </Text>
                    <Button
                        block
                        style={{ backgroundColor: Color.Secondary }}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text>Login</Text>
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
    btnRegister: {
        marginVertical: 10,
        backgroundColor: Color.Primary
    }
})
