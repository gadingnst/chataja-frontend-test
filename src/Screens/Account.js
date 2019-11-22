import React, { useState, useEffect } from 'react'
import { StyleSheet, AsyncStorage } from 'react-native'
import {
    Container,
    Card,
    CardItem,
    Text,
    Thumbnail,
    Button,
    Spinner,
    Icon,
    Toast
} from 'native-base'
import Header from '../Components/Header'
import Firebase from '../Configs/Firebase'

export default ({ navigation }) => {
    const [loading, showLoading] = useState(false)
    const [user, setUser] = useState({})

    const logout = () => {
        showLoading(true)
        Firebase.auth()
            .signOut()
            .then(() => AsyncStorage.removeItem('user:data'))
            .then(() => {
                Toast.show({
                    text: 'Berhasil Logout',
                    duration: 800
                })
                navigation.navigate('AppLoadingIndicator')
            })
            .catch(err => {
                Toast.show({
                    text: err.message,
                    type: 'danger',
                    duration: 800
                })
            })
            .finally(() => showLoading(false))
    }

    useEffect(() => {
        showLoading(true)
        AsyncStorage.getItem('user:data')
            .then(data => setUser(JSON.parse(data)))
            .catch(err => {
                Toast.show({
                    text: err.message,
                    type: 'warning',
                    duration: 800
                })
            })
            .finally(() => showLoading(false))
    }, [])

    return (
        <>
            <Header title="My Profile" />
            <Container style={styles.container}>
                <Thumbnail
                    style={styles.avatar}
                    source={
                        user.avatar
                            ? { uri: user.avatar }
                            : require('../Assets/logo.png')
                    }
                />
                <Card>
                    <CardItem>
                        <Icon name="ios-person" />
                        <Text>{user.name}</Text>
                    </CardItem>
                    <CardItem>
                        <Icon name="ios-mail" />
                        <Text>{user.email}</Text>
                    </CardItem>
                </Card>
                <Button
                    block
                    warning
                    iconLeft
                    onPress={logout}
                    style={{ marginVertical: 15 }}
                >
                    {loading ? (
                        <Spinner color="#fff" />
                    ) : (
                        <>
                            <Icon type="Ionicons" name="ios-exit" />
                            <Text>Logout</Text>
                        </>
                    )}
                </Button>
            </Container>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    avatar: {
        width: 125,
        height: 125,
        alignSelf: 'center',
        marginVertical: 25
    }
})
