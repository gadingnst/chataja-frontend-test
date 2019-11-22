import React from 'react'
import { Icon } from 'native-base'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { fromRight, zoomIn } from 'react-navigation-transitions'

import Home from './Screens/Home'
import Chat from './Screens/Chat'
import Login from './Screens/Login'
import Register from './Screens/Register'
import Account from './Screens/Account'
import AppLoadingIndicator from './Screens/AppLoadingIndicator'
import Color from './Configs/Color'

const RootNavigator = createStackNavigator(
    {
        AppLoadingIndicator,
        Guest: {
            screen: createStackNavigator(
                { Login, Register },
                {
                    initialRouteName: 'Login',
                    headerMode: 'none',
                    transitionConfig: () => zoomIn()
                }
            )
        },
        Auth: {
            screen: createStackNavigator(
                {
                    Chat,
                    App: createBottomTabNavigator(
                        {
                            Home: {
                                screen: Home,
                                navigationOptions: {
                                    tabBarIcon: props => (
                                        <Icon
                                            style={iconStyles(props)}
                                            type="Ionicons"
                                            name="ios-chatboxes"
                                        />
                                    )
                                }
                            },
                            Account: {
                                screen: Account,
                                navigationOptions: {
                                    tabBarLabel: 'My Profile',
                                    tabBarIcon: props => (
                                        <Icon
                                            style={iconStyles(props)}
                                            type="Ionicons"
                                            name="ios-person"
                                        />
                                    )
                                }
                            }
                        },
                        {
                            initialRouteName: 'Home',
                            tabBarPosition: 'bottom',
                            tabBarOptions: {
                                activeTintColor: Color.Primary,
                                inactiveTintColor: '#999',
                                style: {
                                    padding: 5
                                }
                            }
                        }
                    )
                },
                {
                    headerMode: 'none',
                    initialRouteName: 'App',
                    transitionConfig: () => fromRight()
                }
            )
        }
    },
    {
        headerMode: 'none',
        initialRouteName: 'AppLoadingIndicator',
        transitionConfig: () => fromRight()
    }
)

const iconStyles = ({ tintColor, focused }) => ({
    color: tintColor,
    fontSize: focused ? 24 : 20,
})

export default createAppContainer(RootNavigator)
