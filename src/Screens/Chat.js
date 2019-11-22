import React, { useState, useEffect } from 'react'
import { AsyncStorage } from 'react-native'
import { Button, View, Thumbnail, Text } from 'native-base'
import { GiftedChat } from 'react-native-gifted-chat'
import Header from '../Components/Header'
import Loader from '../Components/Loader'
import Firebase from '../Configs/Firebase'

const Chat = ({ loading, messages, user, onSend = () => false }) => {
    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Loader text="Loading chats..." />
            </View>
        )
    }
    return (
        <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
                _id: user.uid,
                name: user.name,
                avatar: user.avatar
            }}
        />
    )
}

export default ({ navigation }) => {
    const [user, setUser] = useState({})
    const [chats, setChats] = useState([])
    const [loading, showLoading] = useState(false)
    const opponent = navigation.getParam('user')
    const db = Firebase.database()

    const sender = user =>
        db.ref(`/ChatAja/users/${user.uid}/chats/${opponent.uid}`)

    const receiver = user =>
        db.ref(`/ChatAja/users/${opponent.uid}/chats/${user.uid}`)

    useEffect(() => {
        showLoading(true)

        AsyncStorage.getItem('user:data')
            .then(data => {
                data = JSON.parse(data)
                setUser(data)
                return data
            })
            .then(user => {
                sender(user).once('value', showLoading(false))
                sender(user).on('child_added', snapshot => {
                    const chat = snapshot.val()
                    setChats(prev => GiftedChat.append(prev, chat))
                })
            })
        return () => {
            sender(user).off('child_added')
        }
    }, [])

    const onSendChat = (chat = []) => {
        chat = chat[0]
        chat = {
            _id: chat._id,
            text: chat.text,
            createdAt: new Date(chat.createdAt).toISOString(),
            user: {
                _id: chat.user._id,
                name: chat.user.name,
                avatar: chat.user.avatar
            }
        }
        sender(user).push(chat)
        receiver(user).push(chat)
    }

    return (
        <>
            <Header
                title={opponent.name}
                leftComponent={
                    <Thumbnail
                        source={{ uri: opponent.avatar }}
                        style={{
                            width: 45,
                            height: 45
                        }}
                    />
                }
                rightComponent={
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Text>Back</Text>
                    </Button>
                }
            />
            <Chat
                loading={loading}
                messages={chats}
                user={user}
                onSend={onSendChat}
            />
        </>
    )
}
