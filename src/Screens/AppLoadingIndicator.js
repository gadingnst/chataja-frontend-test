import React, { useEffect } from 'react'
import { AsyncStorage } from 'react-native'
import { View, Toast } from 'native-base'
import { NavigationActions, StackActions } from 'react-navigation'
import Loader from '../Components/Loader'

export default ({ navigation }) => {
    const reset = routeName =>
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName })]
        })

    useEffect(() => {
        setTimeout(() => {
            AsyncStorage.getItem('user:data')
                .then(data =>
                    data
                        ? navigation.dispatch(reset('Auth'))
                        : navigation.dispatch(reset('Guest'))
                )
                .catch(err => {
                    Toast.show({
                        text: err.message,
                        type: 'danger',
                        duration: 800
                    })
                    navigation.dispatch(reset('Guest'))
                })
        }, 800)
    }, [])

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <Loader text="Please Wait..." />
        </View>
    )
}
