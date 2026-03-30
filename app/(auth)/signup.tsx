import { Link } from 'expo-router'
import { Text, View } from 'react-native'

const signup = () => {
    return (
        <View>
            <Text>sign up</Text>
            <Link href="/(auth)/signup">sign in</Link>
        </View>
    )
}

export default signup