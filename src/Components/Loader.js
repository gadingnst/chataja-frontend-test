import React from 'react'
import { View, Text, Spinner } from 'native-base'
import Color from '../Configs/Color'

export default ({ size, color, text }) => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={size} color={color || Color.Primary} />
        <Text style={{ color: color || Color.Primary }}>
            {text || 'Loading...'}
        </Text>
    </View>
)
