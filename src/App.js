import React, { useEffect } from 'react'
import { Root } from 'native-base'
import SplashScreen from 'react-native-splash-screen'
import Navigator from './Navigator'

export default () => {
    useEffect(() => {
        SplashScreen.hide()
    })

    return (
        <Root>
            <Navigator />
        </Root>
    )
}
