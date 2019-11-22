import React, { useEffect, useState } from 'react'
import { AsyncStorage } from 'react-native'
import {
    Container,
    View,
    Text,
    List,
    ListItem,
    Thumbnail,
    Left,
    Body,
    Right,
    Toast
} from 'native-base'
import Header from '../Components/Header'
import Loader from '../Components/Loader'
import Firebase from '../Configs/Firebase'

const UserList = ({ data, onPress = () => false }) => (
    <ListItem avatar onPress={onPress}>
        <Left>
            <Thumbnail source={{ uri: data.avatar }} />
        </Left>
        <Body>
            <Text>{data.name}</Text>
            <Text note>{data.email}</Text>
        </Body>
        <Right>
            <Text note>{data.status}</Text>
        </Right>
    </ListItem>
)

export default ({ navigation }) => {
    const [loading, showLoading] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(() => {
        showLoading(true)
        AsyncStorage.getItem('user:data')
            .then(data => JSON.parse(data))
            .then(currentUser => {
                Firebase.database()
                    .ref('/ChatAja/users/')
                    .once('value')
                    .then(snapshot => {
                        const data = snapshot.val()
                        setUsers(
                            Object.keys(data)
                                .filter(uid => uid !== currentUser.uid)
                                .map(uid => ({
                                    uid,
                                    name: data[uid].name,
                                    email: data[uid].email,
                                    avatar: data[uid].avatar
                                }))
                        )
                    })
                    .catch(err => {
                        Toast.show({
                            text: err.message,
                            type: 'warning',
                            duration: 5000
                        })
                    })
                    .finally(() => showLoading(false))
            })
    }, [])

    return (
        <>
            <Header title="Home" />
            <Container>
                {loading ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Loader text="Loading users..." />
                    </View>
                ) : (
                    <List>
                        {users.map(user => (
                            <UserList
                                key={user.uid}
                                data={user}
                                onPress={() => {
                                    navigation.navigate('Chat', { user })
                                }}
                            />
                        ))}
                    </List>
                )}
            </Container>
        </>
    )
}
